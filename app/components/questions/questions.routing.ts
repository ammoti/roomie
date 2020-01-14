import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { QuestionsComponent } from "./questions.component";
import { AuthGuard } from "../../auth/auth-guard.service";

const questsRoutes: Routes = [
  { path: "questions", component: QuestionsComponent}
];
export const questsRouting: ModuleWithProviders = RouterModule.forChild(
    questsRoutes
);
