import { Injectable } from "@angular/core";
import { getString, setString, getBoolean, setBoolean,getNumber,setNumber } from "tns-core-modules/application-settings";

const tokenKey = "token";
const completeKey = "complete";
const userIdKey = "userid";

export class BackendService {
  static baseUrl = "https://roomie-graduation.herokuapp.com/";
  static appKey = "appKey";
  static appUserHeader = "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ";
  static apiUrl = "";

  static isLoggedIn(): boolean {
    return !!getString(tokenKey);
  }
  static isComplete(): boolean {
    return !!getBoolean(completeKey);
  }

  static get token(): string {
    return getString(tokenKey);
  }

  static set token(theToken: string) {
    setString(tokenKey, theToken);
  }

  static get complete(): boolean {
    return getBoolean(completeKey);
  }

  static set complete(isComplete: boolean) {
    setBoolean(completeKey, isComplete);
  }

  static get userId(): number {
    return getNumber(userIdKey);
  }

  static set userId(userid: number) {
    setNumber(userIdKey, userid);
  }
}
