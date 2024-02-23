import { UnmappedRouteObject, createRoute } from "atomic-router";

export const routes = {
  home: createRoute(),
  auth: {
    signIn: createRoute(),
    finish: createRoute(),
  },
  onboarding: {
    user: createRoute(),
    workspace: createRoute(),
  },
  workspaces: {
    view: {
      boards: createRoute<{ workspaceId: string }>(),
      settings: createRoute<{ workspaceId: string }>(),
    },
  },
};

export const pageNotFoundRoute = createRoute();

type RouteParams = object | { workspaceId?: string };

export const routesMap: UnmappedRouteObject<RouteParams>[] = [
  { path: "/", route: routes.home },
  { path: "/auth/sign-in", route: routes.auth.signIn },
  { path: "/auth/finish", route: routes.auth.finish },
  { path: "/onboarding/user", route: routes.onboarding.user },
  { path: "/onboarding/workspace", route: routes.onboarding.workspace },
  {
    path: "/workspaces/:workspaceId",
    route: routes.workspaces.view.boards,
  },
  {
    path: "/workspaces/:workspaceId/settings",
    route: routes.workspaces.view.settings,
  },
];
