import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ContactComponent } from "./contact.component";

const contactRoutes: Routes = [
  { path: "contact/:id", component: ContactComponent },
];
export const contactRouting: ModuleWithProviders = RouterModule.forChild(contactRoutes);