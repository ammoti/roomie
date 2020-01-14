import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { setStatusBarColors } from "./shared";
import { BackendService, LoginService } from "./services";

import { LoginModule } from "./components/login/login.module";

import { NativeScriptFacebookModule } from "nativescript-facebook/angular";
import * as application from "application";
import { MatchesModule } from "./components/matches/matches.module";
import { QuestionsModule } from "./components/questions/questions.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { registerElement } from "nativescript-angular/element-registry";
import { ContactModule } from "./components/contact/contact.module";

let nsFacebook = require("nativescript-facebook");
application.on(application.launchEvent, function(args: any) {
  nsFacebook.init("510997839630218");
});
registerElement("FAB", () => require("nativescript-floatingactionbutton").Fab);

setStatusBarColors();

@NgModule({
  providers: [BackendService, LoginService, authProviders],
  imports: [
    NativeScriptModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    LoginModule,
    MatchesModule,
    QuestionsModule,
    ContactModule,
    NativeScriptFacebookModule,
    TNSFontIconModule.forRoot({
      "mdi": "fonts/materialdesignicons.css"
    }),
    NativeScriptAnimationsModule,
    NativeScriptUISideDrawerModule,
    NativeScriptUIListViewModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
