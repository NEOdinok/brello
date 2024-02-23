import { attach, createEvent, createStore, sample } from "effector";
import { not } from "patronum";

import { api } from "@/shared/api";
import { routes } from "@/shared/routing";
import { chainAnonymous } from "@/shared/viewer";

export type SignInError = "UnknownError" | "InvalidEmail" | "RateLimit";

export const currentRoute = routes.auth.signIn;
export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise: routes.home.open,
});

const signInFx = attach({ effect: api.auth.signInWithEmailFx });

export const formSubmitted = createEvent();
export const emailChanged = createEvent<string>();
export const backToLoginClicked = createEvent();

export const $email = createStore("");
export const $error = createStore<SignInError | null>(null);
export const $pending = signInFx.pending;
export const $finished = createStore(false);

// TODO: add resetting when atomic-router is installed

const $emailValid = $email.map(
  (email) => email.length > 5 && email.indexOf("@") > 0 && email.includes("."),
);

$email.on(emailChanged, (_, email) => email);

sample({
  clock: formSubmitted,
  filter: not($emailValid),
  fn: (): SignInError => "InvalidEmail",
  target: $error,
});

sample({
  clock: formSubmitted,
  source: { email: $email },
  filter: $emailValid,
  target: [$error.reinit, signInFx],
});

$finished.on(signInFx.done, () => true);

$error.on(signInFx.failData, (_, error) => {
  if (error.status === 429) {
    return "RateLimit";
  }
  return "UnknownError";
});

// Login finished, let's handle this state

sample({
  clock: backToLoginClicked,
  target: [$email.reinit, $error.reinit, $finished.reinit],
});
