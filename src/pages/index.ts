import { createRoutesView } from "atomic-router-react";
import { AuthSignInRoute } from "./auth/sign-in";
import { HomeRoute } from "./home";
import { OnboardingRoute } from "./onboarding";
import { Error404Route } from "./error404";

export const Pages = createRoutesView({
  routes: [HomeRoute, AuthSignInRoute, OnboardingRoute, Error404Route],
});
