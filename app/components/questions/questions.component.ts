import { OnInit, Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionService, LoginService, BackendService } from "../../services";
import { Page } from "tns-core-modules/ui/page/page";
import { action } from "tns-core-modules/ui/dialogs";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { User, UserQuestion } from "~/models";
import { Color } from "tns-core-modules/color";

import { ad, layout } from "tns-core-modules/utils/utils";
import { View } from "tns-core-modules/ui/core/view";
import { ListViewEventData } from "nativescript-ui-listview";
import { Question } from "~/models/question.model";
@Component({
  selector: "rm-questions",
  moduleId: module.id,
  templateUrl: "./questions.component.html",
  styleUrls: ["./css/questions-common.css", "./css/questions.component.css"],
  providers: [QuestionService]
})
export class QuestionsComponent implements OnInit {
  isLoading: Boolean = false;
  listLoaded: boolean = false;
  private leftItem: View;
  private rightItem: View;
  private mainView: View;
  private _dataItems: ObservableArray<User>;
  yesList: number[] = [];
  noList: number[] = [];
  userquestion: UserQuestion;
  question: QuestionService;

  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();

  constructor(
    private router: Router,
    question: QuestionService,
    private loginService: LoginService,
    private page: Page
  ) {
    this.question = question;
    this.userquestion = new UserQuestion();
  }
  ngOnInit(): void {
    this.page.actionBarHidden = true;
    this._dataItems = new ObservableArray();
    for (let i = 0; i < 15; i++) {
      this._dataItems.push(
        new User(i.toString(), "Ammo", "", "sads", "vasa", "", false, "sdadas")
      );
    }
    this.load();
  }
  load(): void {
    this.loading.next("");
    this.question.load().subscribe(
      () => {
        this.loaded.next("");
        this.listLoaded = true;
      },
      () => {
        alert("An error occured loading list");
      }
    );
    console.log("ateslendi");
  }
  showActivityIndicator(): void {
    this.isLoading = true;
  }
  hideActivityIndicator(): void {
    this.isLoading = false;
  }
  ngAfterViewInit() {
    this.isLoading = false;
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
    this.loginService.logoff();
    this.router.navigate(["/login"]);
  }

  get dataItems(): ObservableArray<User> {
    return this._dataItems;
  }
  onItemLoading(args: ListViewEventData) {
    args.view.backgroundColor = new Color(
      args.index % 2 === 0 ? "#ffa539" : "#f39c38"
    );
  }
  onSwipeCellFinished(args: ListViewEventData) {
    if (args.data.x > 200) {
      console.log("Perform left action");
    } else if (args.data.x < -200) {
      console.log("Perform right action");
    }
    // this.animationApplied = false;
  }
  onSwipeCellStarted(args: ListViewEventData) {
    const swipeLimits = args.data.swipeLimits;
    swipeLimits.threshold = args["mainView"].getMeasuredWidth() * 0.2; // 20% of whole width
    swipeLimits.left = args["mainView"].getMeasuredWidth() * 0.5; // 65% of whole width
    swipeLimits.right = args["mainView"].getMeasuredWidth() * 0.5; // 35% of whole width
  }

  onCellSwiping(args: ListViewEventData) {
    const swipeView = args["swipeView"];
    this.mainView = args["mainView"];
    this.leftItem = swipeView.getViewById("left-stack");
    this.rightItem = swipeView.getViewById("right-stack");
    if (args.data.x > 0) {
      const leftDimensions = View.measureChild(
        <View>this.leftItem.parent,
        this.leftItem,
        layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
        layout.makeMeasureSpec(
          this.mainView.getMeasuredHeight(),
          layout.EXACTLY
        )
      );
      View.layoutChild(
        <View>this.leftItem.parent,
        this.leftItem,
        0,
        0,
        leftDimensions.measuredWidth,
        leftDimensions.measuredHeight
      );
      this.hideOtherSwipeTemplateView("left");
      if (args.data.x >= 0) {
        this.mainView.backgroundColor = "greenyellow";
        let id = this.mainView.bindingContext.id;
        const index = this.yesList.indexOf(id, 0);
        if (index > -1) {
          this.yesList.splice(index, 1);
        }
        if (this.noList.indexOf(id) === -1) {
          this.noList.push(id);
        }
      }
    } else {
      const rightDimensions = View.measureChild(
        <View>this.rightItem.parent,
        this.rightItem,
        layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
        layout.makeMeasureSpec(
          this.mainView.getMeasuredHeight(),
          layout.EXACTLY
        )
      );

      View.layoutChild(
        <View>this.rightItem.parent,
        this.rightItem,
        this.mainView.getMeasuredWidth() - rightDimensions.measuredWidth,
        0,
        this.mainView.getMeasuredWidth(),
        rightDimensions.measuredHeight
      );
      this.hideOtherSwipeTemplateView("right");
      if (args.data.x < 0) {
        this.mainView.backgroundColor = "#436750";
        let id = this.mainView.bindingContext.id;
        const index = this.noList.indexOf(id, 0);
        if (index > -1) {
          this.noList.splice(index, 1);
        }
        if (this.yesList.indexOf(id) === -1) {
          this.yesList.push(id);
        }
      }
    }
  }
  hideOtherSwipeTemplateView(currentSwipeView: string) {
    switch (currentSwipeView) {
      case "left":
        if (this.rightItem.getActualSize().width !== 0) {
          View.layoutChild(
            <View>this.rightItem.parent,
            this.rightItem,
            this.mainView.getMeasuredWidth(),
            0,
            this.mainView.getMeasuredWidth(),
            0
          );
        }
        break;
      case "right":
        if (this.leftItem.getActualSize().width !== 0) {
          View.layoutChild(
            <View>this.leftItem.parent,
            this.leftItem,
            this.mainView.getMeasuredWidth(),
            0,
            this.mainView.getMeasuredWidth(),
            0
          );
        }
        break;
      default:
        break;
    }
  }
  submit(): void {
    console.log("tapped");
    console.log(this.yesList);
    this.yesList.forEach(item => {
      this.userquestion = new UserQuestion(BackendService.userId, item, true);
      this.question.add(this.userquestion).subscribe(
        () => {},
        error => {
          alert("Unfortunately we could not proccess your request.");
        }
      );
    });
    this.noList.forEach(item => {
      this.userquestion = new UserQuestion(BackendService.userId, item, false);
      this.question.add(this.userquestion).subscribe(
        () => {},
        error => {
          alert("Unfortunately we could not proccess your request.");
        }
      );
    });
    this.question.updateIsComplete(this.userquestion.userid).subscribe(
      () => {
        BackendService.complete = true;
        this.router.navigate(["/matches"]);
      },
      error => {
        alert("Unfortunately we could not proccess your request.");
      }
    );
    this.router.navigate(["/matches"]);
  }
}
