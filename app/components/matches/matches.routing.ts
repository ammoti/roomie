import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MatchesComponent } from "./matches.component";
import { AuthGuard } from "~/auth/auth-guard.service";

const matchesRoutes: Routes = [
  { path: "matches", component: MatchesComponent, canActivate: [AuthGuard] }
];
export const matchesRouting: ModuleWithProviders = RouterModule.forChild(
  matchesRoutes
);
