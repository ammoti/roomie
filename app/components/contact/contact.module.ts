import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { contactRouting } from "./contact.routing";
import { ContactComponent } from "./contact.component";

@NgModule({
  imports: [
    NativeScriptFormsModule,
    NativeScriptCommonModule,
    contactRouting,
  ],
  declarations: [
    ContactComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ContactModule { }
