import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from "@angular/core";
import { MatchService, BackendService } from "../../../services";
import { alert } from "../../../shared";
import { SwipeGestureEventData } from "tns-core-modules/ui/gestures";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { ListViewEventData } from "nativescript-ui-listview";
import { Color } from "tns-core-modules/color";
import { User } from "~/models";
import { RadListViewComponent } from "nativescript-ui-listview/angular";

declare var UIColor: any;

@Component({
  selector: "rm-quest-list",
  moduleId: module.id,
  templateUrl: "./quest-list.component.html",
  styleUrls: ["./quest-list.component.css"],
  animations: [
    trigger("from-bottom", [
      state(
        "in",
        style({
          opacity: 1,
          transform: "translateY(0)"
        })
      ),
      state(
        "void",
        style({
          opacity: 0,
          transform: "translateY(20%)"
        })
      ),
      transition("void => *", [animate("1600ms 700ms ease-out")])
    ]),
    trigger("fade-in", [
      state(
        "in",
        style({
          opacity: 1
        })
      ),
      state(
        "void",
        style({
          opacity: 0
        })
      ),
      transition("void => *", [animate("800ms 2000ms ease-out")])
    ]),
    trigger("scale-in", [
      state(
        "in",
        style({
          opacity: 1,
          transform: "scale(1)"
        })
      ),
      state(
        "void",
        style({
          opacity: 0,
          transform: "scale(0.9)"
        })
      ),
      transition("void => *", [animate("1100ms ease-out")])
    ]),
    trigger("from-right", [
      state(
        "in",
        style({
          opacity: 1,
          transform: "translate(0)"
        })
      ),
      state(
        "void",
        style({
          opacity: 0,
          transform: "translate(20%)"
        })
      ),
      transition("void => *", [animate("600ms 1500ms ease-out")])
    ])
  ]
})
export class QuestListComponent implements AfterViewInit {
  @Input() row;
  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();
  @ViewChild("citiesListView", { static: false })
  listViewComponent: RadListViewComponent;

  public matches: MatchService;
  listLoaded: boolean = false;
  public direction: number;
  constructor(matches: MatchService) {
    this.matches = matches;
  }
  onItemLoading(args: ListViewEventData) {
    args.view.backgroundColor = new Color(
      args.index % 2 === 0 ? "#ffa539" : "#f39c38"
    );
  }
  ngAfterViewInit(): void {
    this.load();
    console.log("afterViewInit");
  }
  load(): void {
    this.loading.next("");
    this.matches.load(BackendService.userId.toString()).subscribe(
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
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      cell.backgroundColor = UIColor.clearColor;
    }
  }
  onSwipe(args: SwipeGestureEventData) {
    console.log("Swipe");
    console.log("triggered event", args.object);
    console.log("view triggered event", args.view);
    console.log("event name", args.eventName);
    console.log("swipe direction", args.direction);
  }
}
