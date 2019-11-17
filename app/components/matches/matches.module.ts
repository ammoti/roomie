import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { matchesRouting } from "./matches.routing";
import { MatchesComponent } from "./matches.component";
import { MatchListComponent } from "./match-list/match-list.component";

@NgModule({
  imports: [NativeScriptFormsModule, NativeScriptCommonModule, matchesRouting],
  declarations: [MatchesComponent, MatchListComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MatchesModule {}
