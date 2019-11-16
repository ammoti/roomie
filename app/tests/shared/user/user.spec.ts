import "reflect-metadata";
import { User } from "../../../models/user.model";
import { LoginService, BackendService } from "../../../services/index";

declare var describe: any;
declare var expect: any;
declare var it: any;

describe("Email validation", function() {
  let user = new User();

  it("Should reject an empty email address", function() {
    user.email = "";
    expect(user.isValidEmail()).toBe(false);
  });

  it("Should reject a malformed email addresses", function() {
    user.email = "nativescript";
    expect(user.isValidEmail()).toBe(false);

    user.email = "nativescript@";
    expect(user.isValidEmail()).toBe(false);

    user.email = "nativescript@isawesome";
    expect(user.isValidEmail()).toBe(false);
  });

  it("Should accept valid email addresses", function() {
    user.email = "nativescript@isawesome.com";
    expect(user.isValidEmail()).toBe(true);
  });
});

describe("Login tests", function() {
  let user = new User();
  let userService: LoginService;

  it("Should return token", function() {
    user.email = "a@v.com";
    user.password = "1234";
    userService.login(user).subscribe();
    expect(BackendService.token.length).not.toEqual(0);
  });
});
