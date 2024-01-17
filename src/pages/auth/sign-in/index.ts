import { currentRoute } from "./model";
import { SignInPage } from "./page";

export const AuthSignInRoute = {
  view: SignInPage,
  route: currentRoute,
};
