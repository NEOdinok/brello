import { createHistoryRouter, createRouterControls } from "atomic-router";
import { pageNotFoundRoute, routesMap } from "./routes";
import { createBrowserHistory } from "history";
import { sample } from "effector";
import { appStarted } from "../init";
import { debug } from "patronum";

export { routes } from "./routes";

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: routesMap,
  notFoundRoute: pageNotFoundRoute,
  controls,
});

sample({
  clock: appStarted,
  fn: () => createBrowserHistory,
  target: router.setHistory,
});

debug(router.$activeRoutes);
