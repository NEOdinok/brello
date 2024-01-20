import { createHistoryRouter, createRouterControls } from "atomic-router";
import { sample } from "effector";
import { createBrowserHistory } from "history";
import { debug } from "patronum";

import { appStarted } from "../init";
import { pageNotFoundRoute, routesMap } from "./routes";

export { routes, pageNotFoundRoute } from "./routes";

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: routesMap,
  notFoundRoute: pageNotFoundRoute,
  controls,
});

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});

debug(router.$activeRoutes);
