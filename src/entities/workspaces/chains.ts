import { RouteInstance, RouteParamsAndQuery, chainRoute } from "atomic-router";
import { EventCallable, attach, createEvent, sample } from "effector";
import { condition } from "patronum";

import { api } from "@/shared/api";

import { $workspacesCache, workspaceCache } from "./model";

type WorkspaceParams = { workspaceId: string };

interface WorkspaceChainParams<Params extends WorkspaceParams> {
  notFound?: EventCallable<Params>;
}

const workspaceGetFx = attach({ effect: api.workspaces.workspaceGetFx });

export function chainWorkspace<Params extends WorkspaceParams>(
  route: RouteInstance<Params>,
  params: WorkspaceChainParams<Params> = {},
): RouteInstance<Params> {
  const workspaceCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const workspaceInCacheFound = createEvent();
  const workspaceInCacheNotFound = createEvent();
  const workspaceExists = createEvent();
  const workspaceNotExists = createEvent();

  const doesWorkspaceExists = sample({
    clock: workspaceCheckStarted,
    source: $workspacesCache,
    fn: (cache, { params }) => Boolean(cache[params.workspaceId]),
  });

  condition({
    source: doesWorkspaceExists,
    if: Boolean,
    then: workspaceInCacheFound,
    else: workspaceInCacheNotFound,
  });

  sample({
    clock: workspaceInCacheFound,
    target: workspaceExists,
  });

  sample({
    clock: workspaceInCacheNotFound,
    source: route.$params,
    fn: ({ workspaceId }) => ({ workspaceId }),
    target: workspaceGetFx,
  });

  sample({
    clock: workspaceGetFx.doneData,
    filter: Boolean,
    target: [workspaceCache, workspaceExists],
  });

  sample({
    clock: workspaceGetFx.doneData,
    filter: (workspace) => !workspace,
    target: workspaceNotExists,
  });

  sample({
    clock: workspaceGetFx.fail,
    target: workspaceNotExists,
  });

  if (params.notFound) {
    sample({
      clock: workspaceNotExists,
      source: route.$params,
      filter: route.$isOpened,
      target: params.notFound,
    });
  }

  return chainRoute({
    route,
    beforeOpen: workspaceCheckStarted,
    openOn: workspaceExists,
    cancelOn: workspaceNotExists,
  });
}
