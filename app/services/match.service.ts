import { Injectable, NgZone } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { BehaviorSubject, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { BackendService } from "../services/backend.service";
import { Match } from "../models/match.model";

@Injectable()
export class MatchService {
  items: BehaviorSubject<Array<Match>> = new BehaviorSubject([]);
  private allItems: Array<Match> = [];
  baseUrl = BackendService.baseUrl + "appdata/" + BackendService.appKey + "/Groceries";

  constructor(private http: HttpClient, private zone: NgZone) { }

  load() {
    return this.http.get(this.baseUrl, {
      headers: this.getCommonHeaders()
    })
    .pipe(
      map((data: any[]) => {
        this.allItems = data
          .sort((a, b) => {
            return a._kmd.lmt > b._kmd.lmt ? -1 : 1;
          })
          .map(
            grocery => new Match(
              grocery._id,
              grocery.Name,
              grocery.Done || false,
              grocery.Deleted || false
          )
        );
        this.publishUpdates();
      }),
      catchError(this.handleErrors)
    );
  }

  add(name: string) {
    return this.http.post(
      this.baseUrl,
      JSON.stringify({ Name: name }),
      { headers: this.getCommonHeaders() }
    )
    .pipe(
      map((data: any) => {
        this.allItems.unshift(new Match(data._id, name, false, false));
        this.publishUpdates();
      }),
      catchError(this.handleErrors)
    );
  }

  setDeleteFlag(item: Match) {
    item.deleted = true;
    return this.put(item)
      .pipe(
        map(data => {
          item.done = false;
          this.publishUpdates();
        })
      );
  }

  unsetDeleteFlag(item: Match) {
    item.deleted = false;
    return this.put(item)
      .pipe(
        map(data => {
          item.done = false;
          this.publishUpdates();
        })
      );
  }


  toggleDoneFlag(item: Match) {
    item.done = !item.done;
    this.publishUpdates();
    return this.put(item);
  }

  permanentlyDelete(item: Match) {
    return this.http
      .delete(
        this.baseUrl + "/" + item.id,
        { headers: this.getCommonHeaders() }
      )
      .pipe(
        map(data => {
          let index = this.allItems.indexOf(item);
          this.allItems.splice(index, 1);
          this.publishUpdates();
        }),
        catchError(this.handleErrors)
      );
  }

  private put(grocery: Match) {
    return this.http.put(
      this.baseUrl + "/" + grocery.id,
      JSON.stringify({
        Name: grocery.name,
        Done: grocery.done,
        Deleted: grocery.deleted
      }),
      { headers: this.getCommonHeaders() }
    )
    .pipe(catchError(this.handleErrors));
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this.allItems]);
    });
  }

  private getCommonHeaders() {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Kinvey " + BackendService.token,
    });
  }

  private handleErrors(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}