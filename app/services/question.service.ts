import { Injectable, NgZone } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { BehaviorSubject, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { BackendService } from "../services/backend.service";
import { Match } from "../models/match.model";
import { Question } from "~/models/question.model";
import { UserQuestion } from "~/models";

@Injectable()
export class QuestionService {
  items: BehaviorSubject<Array<Question>> = new BehaviorSubject([]);
  private allItems: Array<Question> = [];
  baseUrl = BackendService.baseUrl + "api/getAllQuestions";

  constructor(private http: HttpClient, private zone: NgZone) {}

  load() {
    return this.http
      .get(this.baseUrl, {
        headers: this.getCommonHeaders()
      })
      .pipe(
        map((data: any[]) => {
          console.log(data);
          this.allItems = data
            // .sort((a, b) => {
            //   return a._kmd.lmt > b._kmd.lmt ? -1 : 1;
            // })
            .map(quest => new Question(quest.id, quest.question));
          this.publishUpdates();
        }),
        catchError(this.handleErrors)
      );
  }

  add(userquestion: UserQuestion ) {
    return this.http
      .post(
        BackendService.baseUrl + "/api/userinsertquestion",
        JSON.stringify({ userid: userquestion.userid, questionid: userquestion.questionid, answer: userquestion.answer }),
        { headers: this.getCommonHeaders() }
      )
      .pipe(
        map((data: any) => {
          console.log("Gönderildi");
          console.log(data);
          this.publishUpdates();
        }),
        catchError(this.handleErrors)
      );
  }
  updateIsComplete(userid: number ) {
    return this.http
      .put(
        BackendService.baseUrl + "/api/updateisComplete",
        JSON.stringify({ userid: userid }),
        { headers: this.getCommonHeaders() }
      )
      .pipe(
        map((data: any) => {
          console.log("Gönderildi");
          console.log(data);
          this.publishUpdates();
        }),
        catchError(this.handleErrors)
      );
  }

  setDeleteFlag(item: Match) {
    // item.deleted = true;
    // return this.put(item)
    //   .pipe(
    //     map(data => {
    //       item.done = false;
    //       this.publishUpdates();
    //     })
    //   );
  }

  unsetDeleteFlag(item: Match) {
    // item.deleted = false;
    // return this.put(item)
    //   .pipe(
    //     map(data => {
    //       item.done = false;
    //       this.publishUpdates();
    //     })
    //   );
  }

  toggleDoneFlag(item: Match) {
    // item.done = !item.done;
    // this.publishUpdates();
    // return this.put(item);
  }

  permanentlyDelete(item: Question) {
    return this.http
      .delete(this.baseUrl + "/" + item.id, {
        headers: this.getCommonHeaders()
      })
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
    // return this.http.put(
    //   this.baseUrl + "/" + grocery.id,
    //   JSON.stringify({
    //     Name: grocery.name,
    //     Done: grocery.done,
    //     Deleted: grocery.deleted
    //   }),
    //   { headers: this.getCommonHeaders() }
    // )
    // .pipe(catchError(this.handleErrors));
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
      Authorization: "Kinvey " + BackendService.token
    });
  }

  private handleErrors(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}
