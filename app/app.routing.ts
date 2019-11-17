import { AuthGuard } from "./auth/auth-guard.service";

export const authProviders = [
  AuthGuard
];

export const appRoutes = [
  { path: "", redirectTo: "/matches", pathMatch: "full" }
];
