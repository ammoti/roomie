import { Component,ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter, Input } from "@angular/core";
import { MatchService } from "~/services";
import { alert } from "../../../shared";

declare var UIColor: any;

@Component({
  selector: "rm-match-list",
  moduleId: module.id,
  templateUrl: "./match-list.component.html",
  styleUrls: ["./match-list.component.css"]
})
export class MatchListComponent implements AfterViewInit {
  @Input() row;
  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();

  public matches: MatchService;
  listLoaded: boolean = false;
  constructor(matches: MatchService) {
    this.matches = matches;
  }
  ngAfterViewInit(): void {
    this.load();
  }
  load(): void {
    this.loading.next("");
    this.matches.load().subscribe(
      () => {
       this.loaded.next("");
        this.listLoaded = true;
      },
      () => {
        alert("An error occured loading list");
      }
    );
  }
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      cell.backgroundColor = UIColor.clearColor;
    }
  }
}
