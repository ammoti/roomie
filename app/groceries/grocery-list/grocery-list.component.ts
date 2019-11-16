import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, AfterViewInit } from "@angular/core";

import { MatchService } from "../../services/match.service";
import { Match } from "../../models/match.model";
import { alert } from "../../shared";

declare var UIColor: any;

@Component({
  selector: "rm-grocery-list",
  moduleId: module.id,
  templateUrl: "./grocery-list.component.html",
  styleUrls: ["./grocery-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceryListComponent implements AfterViewInit {
  @Input() showDeleted: boolean;
  @Input() row;
  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();

  public store: MatchService;
  listLoaded = false;

  constructor(store: MatchService) {
      this.store = store;
  }
  ngAfterViewInit() {
      this.load();
  }
  load() {
    this.loading.next("");
    this.store.load()
      .subscribe(
        () => {
          this.loaded.next("");
          this.listLoaded = true;
        },
        () => {
          alert("An error occurred loading your grocery list.");
        }
      );
  }

  // The following trick makes the background color of each cell
  // in the UITableView transparent as it’s created.
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      // support XCode 8
      cell.backgroundColor = UIColor.clearColor;
    }
  }

  imageSource(grocery) {
    if (grocery.deleted) {
      return "res://add";
    }
    return grocery.done ? "res://checked" : "res://unchecked";
  }

  toggleDone(grocery: Match) {
    if (grocery.deleted) {
      this.store.unsetDeleteFlag(grocery)
        .subscribe(
          () => { },
          () => {
            alert("An error occurred managing your grocery list.");
          }
        );
    } else {
      this.store.toggleDoneFlag(grocery)
        .subscribe(
          () => { },
          () => {
            alert("An error occurred managing your grocery list.");
          }
        );
    }
  }

  delete(grocery: Match) {
    this.loading.next("");
    let successHandler = () => this.loaded.next("");
    let errorHandler = () => {
      alert("An error occurred while deleting an item from your list.");
      this.loaded.next("");
    };

    if (grocery.deleted) {
      this.store.permanentlyDelete(grocery)
        .subscribe(successHandler, errorHandler);
    } else {
      this.store.setDeleteFlag(grocery)
        .subscribe(successHandler, errorHandler);
    }
  }
}

