import { createEvent, createStore, attach, sample } from "effector";
import { api } from "@/shared/api";
import { routes } from "@/shared/routing";
import { not } from "patronum";

export type SignInError = "UnknownError" | "InvalidEmail" | "RateLimit";

const signInFx = attach({ effect: api.auth.signInWithEmailFx });

export const formSubmitted = createEvent();
export const emailChanged = createEvent<string>();
export const backToLoginClicked = createEvent();

export const $email = createStore("");
export const $error = createStore<SignInError | null>(null);
export const $pending = signInFx.pending;
export const $finished = createStore(false);

export const currentRoute = routes.auth.signIn;

$email.on(emailChanged, (_, email) => email);

const $emailValid = $email.map(
  (email) => email.length > 5 && email.indexOf("@") > 0 && email.includes(".")
);

sample({
  clock: formSubmitted,
  source: { email: $email },
  filter: $emailValid,
  target: [$error.reinit, signInFx],
});

$finished.on(signInFx.done, () => true);

// Handle errors

sample({
  clock: formSubmitted,
  filter: not($emailValid),
  fn: (): SignInError => "InvalidEmail",
  target: $error,
});

$error.on(signInFx.failData, (_, error) => {
  if (error.status === 429) {
    return "RateLimit";
  }
  return "UnknownError";
});

// Login finished

sample({
  clock: backToLoginClicked,
  target: [$email.reinit, $error.reinit, $finished.reinit],
});
