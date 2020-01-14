import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";
import { throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";

import { User } from "../models/user.model";
import { BackendService } from "./backend.service";
import { Chat } from "~/models";

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  register(user: User) {
    return this.http
      .post(
        BackendService.baseUrl + "api/register",
        JSON.stringify({
          email: user.email,
          password: user.password,
          name: user.name,
          surname: user.surname,
          isComplete: false,
          city: user.city,
          dateOfBirth: new Date(),
          image: user.image
        }),
        { headers: this.getCommonHeaders() }
      )
      .pipe(catchError(this.handleErrors));
  }
  sendChat(chat: Chat) {
    return this.http
      .post(
        BackendService.baseUrl + "api/chat/send",
        JSON.stringify({
          message: chat.message,
          ufrom: chat.ufrom,
          to: chat.to,
          date: new Date()
        }),
        {
          headers: this.getCommonHeaders()
        }
      )
      .pipe(catchError(this.handleErrors));
  }
  getChat(ufrom: string,to: string) {
    return this.http
      .post(
        BackendService.baseUrl + "api/chat/get",
        JSON.stringify({
          ufrom: ufrom,
          to: to
        }),
        {
          headers: this.getCommonHeaders()
        }
      )
      .pipe(
        tap((data: any) => {
          console.log("gelen", data);
        }),
        catchError(this.handleErrors)
      );
  }

  login(user: User) {
    return this.http
      .post(
        BackendService.baseUrl + "api/login",
        JSON.stringify({
          email: user.email,
          password: user.password
        }),
        { headers: this.getCommonHeaders() }
      )
      .pipe(
        tap((data: any) => {
          if (data.authToken === "0") {
            alert("Unfortunately we could not find your account.");
            data.authToken = "";
          }
          let userid: number = data.userid;
          BackendService.token = userid.toString();
          console.log("is Complete", data.isComplete);
          BackendService.complete = data.isComplete;
          console.log("id", userid);
          BackendService.userId = userid;
        }),
        catchError(this.handleErrors)
      );
  }

  logoff() {
    BackendService.token = "";
  }

  resetPassword(email) {
    return this.http
      .post(
        BackendService.baseUrl +
          "rpc/" +
          BackendService.appKey +
          "/" +
          email +
          "/user-password-reset-initiate",
        {},
        { headers: this.getCommonHeaders() }
      )
      .pipe(catchError(this.handleErrors));
  }

  private getCommonHeaders() {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: BackendService.appUserHeader
    });
  }

  private handleErrors(error: HttpErrorResponse) {
    console.log(JSON.stringify(error));
    return throwError(error);
  }
}
