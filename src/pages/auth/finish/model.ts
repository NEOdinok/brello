import { attach, createEvent, createStore, sample } from "effector";
import { delay, not, reset } from "patronum";

import { api } from "@/shared/api";
import { routes } from "@/shared/routing";

export const currentRoute = routes.auth.finish;

export const tryAgainClicked = createEvent();
const authFinished = createEvent();
const authFailed = createEvent();

const getMeFx = attach({ effect: api.auth.getMeFx });

export const $pending = getMeFx.pending;
export const $successfully = createStore(false);

sample({
  clock: currentRoute.opened,
  filter: not(getMeFx.pending),
  target: getMeFx,
});

sample({
  clock: getMeFx.doneData,
  filter: Boolean,
  target: authFinished,
});

$successfully.on(authFinished, () => true);

const readyToRedirect = delay({
  source: authFinished,
  timeout: 800,
});

sample({
  clock: readyToRedirect,
  filter: currentRoute.$isOpened,
  target: routes.onboarding.user.open,
});

sample({
  clock: getMeFx.doneData,
  filter: (user) => !user,
  target: authFailed,
});

sample({
  clock: getMeFx.fail,
  target: authFailed,
});

$successfully.on(authFailed, () => false);

sample({
  clock: tryAgainClicked,
  target: routes.auth.signIn.open,
});

reset({
  clock: currentRoute.closed,
  target: $successfully,
});
