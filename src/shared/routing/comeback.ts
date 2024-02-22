import { HistoryPushParams } from "atomic-router";
import { createEffect, createEvent, sample } from "effector";

import { routes } from ".";
import { router } from "./router";

const COMEBACK_KEY = "b:cb";

export const comebackSave = createEvent();
export const comebackRestore = createEvent();
const comebackRestoreFailed = createEvent();

const urlSaveFx = createEffect(() => {
  const url = new URL(document.location.toString());
  const pathWithQueryAndHash = `${url.pathname}${url.search}${url.hash}`;
  globalThis.localStorage.setItem(COMEBACK_KEY, pathWithQueryAndHash);
});

const urlReadFx = createEffect(() => {
  const pathWithQueryAndHash = globalThis.localStorage.getItem(COMEBACK_KEY);
  if (pathWithQueryAndHash === null) {
    throw new Error("No saved comeback path");
  }
  const url = new URL(pathWithQueryAndHash, globalThis.location.toString());
  return {
    path: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
  };
});

const urlCleanFx = createEffect(() => {
  globalThis.localStorage.removeItem(COMEBACK_KEY);
});

sample({
  clock: comebackSave,
  target: urlSaveFx,
});

sample({
  clock: comebackRestore,
  target: urlReadFx,
});

sample({
  clock: urlReadFx.doneData,
  fn: ({ path, query }) => {
    const params: Omit<HistoryPushParams, "history"> = {
      path,
      params: {},
      query,
      method: "push",
    };

    return params;
  },
  target: [router.push, urlCleanFx],
});

sample({
  clock: urlReadFx.failData,
  target: comebackRestoreFailed,
});

sample({
  clock: comebackRestoreFailed,
  target: routes.home.open,
});
