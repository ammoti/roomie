import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { questsRouting } from "./questions.routing";
import { QuestionsComponent } from "./questions.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";

@NgModule({
  imports: [NativeScriptFormsModule, NativeScriptCommonModule, questsRouting, NativeScriptUIListViewModule, TNSFontIconModule],
  declarations: [QuestionsComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class QuestionsModule {}