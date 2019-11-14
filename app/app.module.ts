import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { setStatusBarColors } from "./shared";
import { BackendService, LoginService } from "./services";

import { LoginModule } from "./login/login.module";
import { GroceriesModule } from "./groceries/groceries.module";

import { NativeScriptFacebookModule } from "nativescript-facebook/angular";
import * as application from "application";

let nsFacebook = require("nativescript-facebook");
application.on(application.launchEvent, function(args: any) {
  nsFacebook.init("510997839630218");
});

setStatusBarColors();

@NgModule({
  providers: [BackendService, LoginService, authProviders],
  imports: [
    NativeScriptModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    LoginModule,
    GroceriesModule,
    NativeScriptFacebookModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
