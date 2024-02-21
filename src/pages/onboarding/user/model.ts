import { chainRoute } from "atomic-router";
import { attach, createEvent, createStore, sample } from "effector";
import { not, pending, reset } from "patronum";

import { api } from "@/shared/api";
import { routes } from "@/shared/routing";
import { $viewer, ChainAuthenticated } from "@/shared/viewer";

export type OnboardingUserError = "FirstNameRequired" | "UnknownError";

const profileExistsFx = attach({
  source: $viewer,
  async effect(viewer) {
    return api.profiles.profileExistsFx({ userId: viewer!.id });
  },
});

const profileCreateFx = attach({ effect: api.profiles.profileCreateFx });

export const currentRoute = routes.onboarding.user;
export const authenticatedRoute = ChainAuthenticated(currentRoute, {
  otherwise: routes.auth.signIn.open,
});

export const profileLoadRoute = chainRoute({
  route: authenticatedRoute,
  beforeOpen: {
    effect: profileExistsFx,
    mapParams: () => ({}),
  },
});

export const formSubmitted = createEvent();
export const firstNameChanged = createEvent<string>();
export const lastNameChanged = createEvent<string>();
const onboardingUserFinished = createEvent();

export const $firstName = createStore("");
export const $lastName = createStore("");

export const $error = createStore<OnboardingUserError | null>(null);

const $firstNameIsValid = $firstName.map((firstName) => firstName.length > 2);

export const $pending = pending({
  effects: [profileExistsFx, profileCreateFx],
});

sample({
  clock: profileExistsFx.doneData,
  filter: (exists) => exists,
  target: onboardingUserFinished,
});

$firstName.on(firstNameChanged, (_, firstName) => firstName);
$error.reset(firstNameChanged);

$lastName.on(lastNameChanged, (_, lastName) => lastName);

sample({
  clock: formSubmitted,
  source: { firstName: $firstName, lastName: $lastName, viewer: $viewer },
  filter: $firstNameIsValid,
  fn: ({ firstName, lastName, viewer }) => ({
    profile: {
      userId: viewer!.id,
      firstName,
      lastName,
    },
  }),
  target: [profileCreateFx, $error.reinit],
});

sample({
  clock: formSubmitted,
  filter: not($firstNameIsValid),
  fn: (): OnboardingUserError => "FirstNameRequired",
  target: $error,
});

sample({
  clock: [profileExistsFx.fail, profileCreateFx.fail],
  fn: (): OnboardingUserError => "UnknownError",
  target: $error,
});

sample({
  clock: profileCreateFx.done,
  target: onboardingUserFinished,
});

sample({
  clock: onboardingUserFinished,
  target: routes.home.open,
});

reset({
  clock: currentRoute.closed,
  target: [$firstName, $lastName, $error],
});
