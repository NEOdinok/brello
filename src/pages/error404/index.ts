import { currentRoute } from "./model";
import { Error404Page } from "./page";

export const Error404Route = {
  view: Error404Page,
  route: currentRoute,
};
