import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Color } from "tns-core-modules/color";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
import { Animation } from "tns-core-modules/ui/animation";
import { View } from "tns-core-modules/ui/core/view";
import { prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";

import * as Facebook from "nativescript-facebook";
import * as imagepicker from "nativescript-imagepicker";
import {
  ImageSource,
  fromNativeSource,
  fromAsset
} from "tns-core-modules/image-source";

import { alert } from "../../shared";

import { LoginService } from "../../services/login.service";
import { User } from "../../models/user.model";

@Component({
  selector: "rm-login",
  moduleId: module.id,
  templateUrl: "./login.component.html",
  styleUrls: ["./css/login-common.css", "./css/login.component.css"]
})
export class LoginComponent implements OnInit {
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;
  public items: Array<string> = ["İstanbul", "İzmir", "Ankara", "Malatya","Adana","Adıyaman","Afyon","Ağrı","Aksaray","Amasya","Antalya","Ardahan","Balıkesir","Bursa","Bilecik","Iğdır","Sakarya","Mersin","Van","Sivas","Trabzon","Yozgat","Rize","Zonguldak"];
  previewSize: number = 300;
  imageAssets = [];
  imageSrc: any;
  isSingleMode: boolean = true;
  thumbSize: number = 160;
  imagebase64: string = "";

  @ViewChild("initialContainer", { static: false })
  initialContainer: ElementRef;
  @ViewChild("mainContainer", { static: false }) mainContainer: ElementRef;
  @ViewChild("logoContainer", { static: false }) logoContainer: ElementRef;
  @ViewChild("formControls", { static: false }) formControls: ElementRef;
  @ViewChild("signUpStack", { static: false }) signUpStack: ElementRef;
  @ViewChild("password", { static: false }) password: ElementRef;
  @ViewChild("ScrollList", { static: false }) scrollList: ElementRef;

  constructor(
    private router: Router,
    private userService: LoginService,
    private page: Page
  ) {
    this.user = new User();
    // this.page.className = "login-page";
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

  focusPassword() {
    this.password.nativeElement.focus();
  }

  startBackgroundAnimation(background) {
    background.animate({
      scale: { x: 1.0, y: 1.0 },
      duration: 10000
    });
  }

  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
      return;
    }

    this.isAuthenticating = true;
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    if (getConnectionType() === connectionType.none) {
      alert("Groceries requires an internet connection to log in.");
      return;
    }

    this.userService.login(this.user).subscribe(
      () => {
        this.isAuthenticating = false;
        this.router.navigate(["/"]);
      },
      error => {
        alert("Unfortunately we could not find your account.");
        this.isAuthenticating = false;
      }
    );
  }

  signUp() {
    if (getConnectionType() === connectionType.none) {
      alert("Groceries requires an internet connection to register.");
      return;
    }
    this.user.image = this.imagebase64;
    console.log("image",this.user.image);
    this.userService.register(this.user).subscribe(
      () => {
        alert("Your account was successfully created.");
        this.isAuthenticating = false;
        this.toggleDisplay();
      },
      errorDetails => {
        if (
          errorDetails.error &&
          errorDetails.error.error === "UserAlreadyExists"
        ) {
          alert("This email address is already in use.");
        } else {
          alert("Unfortunately we were unable to create your account.");
        }
        this.isAuthenticating = false;
      }
    );
  }

  onLogin(eventData: Facebook.LoginEventData) {
    if (eventData.error) {
      console.error(eventData.error);
    } else {
      console.log("token is : ", eventData.loginResponse.token);
    }
  }

  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message:
        "Enter the email address you used to register for Groceries to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then(data => {
      if (data.result) {
        this.userService.resetPassword(data.text.trim()).subscribe(
          () => {
            alert(
              "Your password was successfully reset. Please check your email for instructions on choosing a new password."
            );
          },
          () => {
            alert("Unfortunately, an error occurred resetting your password.");
          }
        );
      }
    });
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    let mainContainer = <View>this.mainContainer.nativeElement;
    mainContainer.animate({
      backgroundColor: this.isLoggingIn
        ? new Color("white")
        : new Color("#301217"),
      duration: 200
    });
    this.scrollList.nativeElement.scrollToVerticalOffset(0);
    if (!this.isLoggingIn) {
      this.formControls.nativeElement.rows =
        "auto, auto, auto, auto, auto, auto";
    } else {
      this.formControls.nativeElement.rows = "50, 50";
    }
  }

  showMainContent() {
    let initialContainer = <View>this.initialContainer.nativeElement;
    let mainContainer = <View>this.mainContainer.nativeElement;
    let logoContainer = <View>this.logoContainer.nativeElement;
    let formControls = <View>this.formControls.nativeElement;
    let signUpStack = <View>this.signUpStack.nativeElement;
    let animations = [];

    // Fade out the initial content over one half second
    initialContainer
      .animate({
        opacity: 0,
        duration: 500
      })
      .then(function() {
        // After the animation completes, hide the initial container and
        // show the main container and logo. The main container and logo will
        // not immediately appear because their opacity is set to 0 in CSS.
        initialContainer.style.visibility = "collapse";
        mainContainer.style.visibility = "visible";
        logoContainer.style.visibility = "visible";

        // Fade in the main container and logo over one half second.
        animations.push({ target: mainContainer, opacity: 1, duration: 500 });
        animations.push({ target: logoContainer, opacity: 1, duration: 500 });

        // Slide up the form controls and sign up container.
        animations.push({
          target: signUpStack,
          translate: { x: 0, y: 0 },
          opacity: 1,
          delay: 500,
          duration: 150
        });
        animations.push({
          target: formControls,
          translate: { x: 0, y: 0 },
          opacity: 1,
          delay: 650,
          duration: 150
        });

        // Kick off the animation queue
        new Animation(animations, false).play();
      });
  }

  public onSelectSingleTap() {
    this.isSingleMode = true;

    let context = imagepicker.create({
      mode: "single"
    });
    this.startSelection(context);
  }

  private startSelection(context) {
    let that = this;

    context
      .authorize()
      .then(() => {
        that.imageAssets = [];
        that.imageSrc = null;
        return context.present();
      })
      .then(selection => {
        console.log("Selection done: " + JSON.stringify(selection[0]._android));
        that.imageSrc =
          that.isSingleMode && selection.length > 0 ? selection[0] : null;
        fromAsset(selection[0]).then(image => {
          var base64 = image.toBase64String("png");
          // thumbnail.src = "data:image/png;base64," + base64;
          this.imagebase64 = base64;
        });
        // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
        selection.forEach(function(element) {
          element.options.width = that.isSingleMode
            ? that.previewSize
            : that.thumbSize;
          element.options.height = that.isSingleMode
            ? that.previewSize
            : that.thumbSize;
        });

        that.imageAssets = selection;
      })
      .catch(function(e) {
        console.log(e);
      });
  }
  public getBase64(source) {
    let me = this;
    let file = source;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      console.log(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }
}
