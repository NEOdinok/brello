import { RouteInstance, RouteParams, RouteParamsAndQuery, chainRoute } from "atomic-router";
import { createEffect, createEvent, sample } from "effector";
import { not } from "patronum";

import { api } from "@/shared/api";
import { createFlag } from "@/shared/lib/localstorage-flags";
import { comebackSave, routes } from "@/shared/routing";
import { $viewer } from "@/shared/viewer";

/**
 * When user opens page with `chainOnboarded`
 * Chainer MUST check profile content
 *  If user should fill profile, it must open onboarding/user
 *  If user skipped, it should not open anymore (on this session?)
 * After profile check, chainer MUST check workspace availability
 *  If no workspace created, chainer MUST open onboarding/workspace
 *  User cannot skip workspace onboarding
 * When user finished creating workspace, chainer SHOULD open chainedRoute
 */

export function chainOnboarded<Params extends RouteParams>(route: RouteInstance<Params>) {
  const checksStarted = createEvent<RouteParamsAndQuery<Params>>();

  const profileChecks = createProfileChecks();
  const workspaceChecks = createWorkspaceChecks();

  sample({
    clock: checksStarted,
    target: profileChecks.start,
  });

  sample({
    clock: profileChecks.finished,
    target: workspaceChecks.start,
  });

  return chainRoute({
    route,
    beforeOpen: checksStarted,
    openOn: workspaceChecks.finished,
  });
}

const profileExistsFx = createEffect(async ({ userId }: { userId: string }) => {
  const exists = await api.profiles.profileExistsFx({ userId });
  if (!exists) {
    throw new Error("Profile does not exists");
  }
  return exists;
});

export const onboardingProfileSkip = createFlag({
  fieldName: "pr-on-sk",
  initial: false,
});

/**
 * Checks for profile, and redirect if not exists.
 * Can be skipped
 */
function createProfileChecks() {
  const start = createEvent();
  const finished = createEvent();

  const profileCheckStarted = createEvent();

  sample({
    clock: start,
    filter: onboardingProfileSkip.$isSet,
    target: finished,
  });

  sample({
    clock: start,
    filter: not(onboardingProfileSkip.$isSet),
    target: profileCheckStarted,
  });

  sample({
    clock: profileCheckStarted,
    source: $viewer,
    filter: Boolean,
    fn: ({ id }) => ({ userId: id }),
    target: profileExistsFx,
  });

  sample({
    clock: profileExistsFx.failData,
    target: [comebackSave, routes.onboarding.user.open],
  });

  sample({
    clock: profileExistsFx.doneData,
    target: finished,
  });

  return { start, finished };
}

const workspaceExistsFx = createEffect(async ({ userId }: { userId: string }) => {
  const exists = await api.workspaces.workspaceExistsFx({ userId });
  if (!exists) {
    throw new Error("Workspace does not exists");
  }
  return exists;
});

/**
 * Checks for workspace, redirect if not exists.
 */
function createWorkspaceChecks() {
  const start = createEvent();
  const finished = createEvent();

  sample({
    clock: start,
    source: $viewer,
    filter: Boolean,
    fn: ({ id }) => ({ userId: id }),
    target: workspaceExistsFx,
  });

  sample({
    clock: workspaceExistsFx.failData,
    target: [comebackSave, routes.onboarding.workspace.open],
  });

  sample({
    clock: workspaceExistsFx.done,
    target: finished,
  });

  return { start, finished };
}
