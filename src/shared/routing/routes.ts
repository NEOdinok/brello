import { UnmappedRouteObject, createRoute } from "atomic-router";

export const routes = {
  home: createRoute(),
  auth: {
    signIn: createRoute(),
    finish: createRoute(),
  },
  onboarding: {
    user: createRoute(),
  },
};

export const pageNotFoundRoute = createRoute();

export const routesMap: UnmappedRouteObject<object>[] = [
  { path: "/", route: routes.home },
  { path: "/auth/sign-in", route: routes.auth.signIn },
  { path: "/auth/finish", route: routes.auth.finish },
  { path: "onboarding/user", route: routes.onboarding.user },
];
