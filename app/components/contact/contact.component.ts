import {
  OnInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import { Router } from "@angular/router";
import { QuestionService, LoginService, BackendService } from "../../services";
import { Page } from "tns-core-modules/ui/page/page";
import { action } from "tns-core-modules/ui/dialogs";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { User, UserQuestion, Chat } from "~/models";
import { Color } from "tns-core-modules/color";
import { setInterval, clearInterval } from "tns-core-modules/timer";

import { ad, layout } from "tns-core-modules/utils/utils";
import { View } from "tns-core-modules/ui/core/view";
import { ListViewEventData } from "nativescript-ui-listview";
import { Question } from "~/models/question.model";
import { ListView } from "ui/list-view";
import { TextField } from "ui/text-field";
import { ScrollView } from "ui/scroll-view";
import { PageRoute } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { getFrameById, Frame, topmost } from "tns-core-modules/ui/frame";

@Component({
  selector: "rm-contact",
  moduleId: module.id,
  templateUrl: "./contact.component.html",
  styleUrls: ["./css/contact-common.css", "./css/contact.component.css"],
  providers: [LoginService]
})
export class ContactComponent implements OnInit {
  isLoading: Boolean = false;
  listLoaded: boolean = false;
  chatService: LoginService;
  public me: String;
  itemId: number;
  intervalId: number;
  private _allChats: Array<Chat> = [];
  public chats$: Chat[];
  @ViewChild("list", { static: false }) lv: ElementRef;
  @ViewChild("textfield", { static: false }) tf: ElementRef;
  list: ListView;
  textfield: TextField;
  chats: BehaviorSubject<Array<Chat>> = new BehaviorSubject([]);
  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();

  constructor(
    private pageRoute: PageRoute,
    private router: Router,
    chatService: LoginService,
    private page: Page,
    private _router: Router,
    private _ngZone: NgZone
  ) {
    this.chatService = chatService;
    this.pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.itemId = +params["id"];
      });
  }

  // refreshList(args) {
  //   var pullRefresh = args.object;
  //   setTimeout(function() {
  //     pullRefresh.refreshing = false;
  //   }, 1000);
  // }
  ngOnInit(): void {
    this.page.actionBarHidden = true;
    // this.load();
    this.chats$ = [];
    this.me = BackendService.token;
    console.log("ngOnInit Çalıştı");
    this.chats$ = this.getChats();
    console.log(this.chats$);
    if (this.intervalId !== null || this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.scroll(this.chats$.length);
    }
  }
  refreshChat(): void {
    this.intervalId = setInterval(() => {
      this.ngOnInit();
    }, 1000);
  }
  // load(): void {
  //   this.loading.next("");
  //   this.question.load().subscribe(
  //     () => {
  //       this.loaded.next("");
  //       this.listLoaded = true;
  //     },
  //     () => {
  //       alert("An error occured loading list");
  //     }
  //   );
  // }
  showActivityIndicator(): void {
    this.isLoading = true;
  }
  hideActivityIndicator(): void {
    this.isLoading = false;
  }
  ngAfterViewInit() {
    this.isLoading = false;
    this.list = this.lv.nativeElement;
    this.textfield = this.tf.nativeElement;
  }
  showMenu(): void {
    action({
      message: "What would you like to do?",
      actions: ["Share", "Log Off"],
      cancelButtonText: "Cancel"
    }).then(result => {
      if (result === "Share") {
      } else if (result === "Log Off") {
        this.logoff();
      }
    });
  }
  logoff(): void {
    this.chatService.logoff();
    this.router.navigate(["/login"]);
  }

  scroll(count: number) {
    console.log("scrolling to ", count);
    this.list.scrollToIndex(count - 1);
    this.list.refresh();
  }

  chat(message: string) {
    console.log("send to", this.itemId.toString());
    let chatModel = new Chat();
    chatModel.date = new Date();
    chatModel.ufrom = BackendService.userId.toString();
    chatModel.message = message;
    chatModel.to = this.itemId.toString();

    this.chatService.sendChat(chatModel).subscribe((data: any) => {
      this.scroll(5);
    });
    this.textfield.text = "";
    this.refreshChat();
  }
  getChats(): Chat[] {
    this._allChats = [];
    // empty array, then refill and filter
    this._ngZone.run(() => {
      //Do whatever you want here
      this.chatService
        .getChat(BackendService.userId.toString(), this.itemId.toString())
        .subscribe((data: any) => {
          if (data) {
            for (let id in data) {
              let result = (<any>Object).assign({ id: id }, data[id]);
              this._allChats.push(result);
            }
            // this.publishChatUpdates();
          }
        });
    });

    console.log("sonuç", this._allChats);
    // this.scroll(this._allChats.length);
    return this._allChats;
  }
  publishChatUpdates() {
    this._allChats.sort(function(a, b) {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });
    this.chats.next([...this._allChats]);
  }
  filter(sender) {
    if (sender === BackendService.token) {
      return "me";
    } else {
      return "them";
    }
  }
  updateChat() {
    this._router.navigate(["/contact", this.itemId]);
  }

  align(sender) {
    if (sender === BackendService.token) {
      return "right";
    } else {
      return "left";
    }
  }
  showImage(sender) {
    if (sender === BackendService.token) {
      return "collapsed";
    } else {
      return "visible";
    }
  }
}
