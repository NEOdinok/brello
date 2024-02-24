import { chainRoute } from "atomic-router";
import { attach, combine, createEvent, createStore, sample } from "effector";
import { and, not, pending, reset } from "patronum";

import { api } from "@/shared/api";
import { noop } from "@/shared/lib/noop";
import { comebackRestore, routes } from "@/shared/routing";
import { $viewer, chainAuthenticated } from "@/shared/viewer";

export type OnboardingWorkspaceError = "NameInvalid" | "SlugInvalid" | "SlugTaken" | "UnknownError";

const workspaceCreateFx = attach({ effect: api.workspaces.workspaceCreateFx });
const workspaceExistsFx = attach({
  source: $viewer,
  async effect(viewer) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return api.workspaces.workspaceExistsFx({ userId: viewer!.id });
  },
});

export const currentRoute = routes.onboarding.workspace;
export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: routes.auth.signIn.open,
});
export const workspaceLoadedRoute = chainRoute({
  route: authenticatedRoute,
  beforeOpen: { effect: workspaceExistsFx, mapParams: noop },
});

export const formSubmitted = createEvent();
export const nameChanged = createEvent<string>();
export const slugChanged = createEvent<string>();
export const descriptionChanged = createEvent<string>();

const onboardingWorkspaceFinished = createEvent();

export const $name = createStore("");
export const $slug = createStore("");
export const $description = createStore("");
export const $error = createStore<OnboardingWorkspaceError | null>(null);

export const $pending = pending([workspaceCreateFx, workspaceExistsFx]);
const $nameValid = $name.map((name) => name.trim().length > 2);
const $slugValid = $slug.map(isValidSlug);

const $form = combine({
  userId: $viewer.map((viewer) => viewer?.id ?? "<anon>"),
  name: $name,
  slug: $slug,
  description: $description,
});
const $formValid = and($nameValid, $slugValid);

sample({
  clock: workspaceExistsFx.doneData,
  filter: (exists) => exists,
  target: onboardingWorkspaceFinished,
});

$name.on(nameChanged, (_, name) => name);
$slug.on(slugChanged, (_, slug) => slug);
$description.on(descriptionChanged, (_, description) => description);

sample({
  clock: formSubmitted,
  source: $form,
  filter: $formValid,
  fn: (workspace) => ({ workspace }),
  target: [workspaceCreateFx, $error.reinit],
});

sample({
  clock: workspaceCreateFx.done,
  target: onboardingWorkspaceFinished,
});

sample({
  clock: onboardingWorkspaceFinished,
  target: comebackRestore,
});

sample({
  clock: formSubmitted,
  filter: not($nameValid),
  fn: (): OnboardingWorkspaceError => "NameInvalid",
  target: $error,
});

sample({
  clock: formSubmitted,
  filter: not($slugValid),
  fn: (): OnboardingWorkspaceError => "SlugInvalid",
  target: $error,
});

sample({
  clock: workspaceExistsFx.fail,
  fn: (): OnboardingWorkspaceError => "UnknownError",
  target: $error,
});

sample({
  clock: workspaceCreateFx.failData,
  fn(error): OnboardingWorkspaceError {
    if (error.code === "23505") return "SlugTaken";
    return "UnknownError";
  },
  target: $error,
});

reset({
  clock: currentRoute.closed,
  target: [$name, $slug, $description, $error],
});

function isValidSlug(slug: string) {
  const regex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return regex.test(slug);
}
