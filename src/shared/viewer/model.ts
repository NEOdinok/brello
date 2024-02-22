import { attach, createStore } from "effector";

import { User, api } from "@/shared/api";

export enum ViewerStatus {
  Initial = 0,
  Pending,
  Authenticated,
  Anonymous,
}

export const viewerGetFx = attach({ effect: api.auth.getMeFx });

export const $viewer = createStore<User | null>(null);
export const $viewerStatus = createStore(ViewerStatus.Initial);

$viewerStatus.on(viewerGetFx, (status) => {
  if (status === ViewerStatus.Initial) return ViewerStatus.Pending;
  return status;
});

$viewer.on(viewerGetFx.doneData, (_, user) => user);
$viewerStatus.on(viewerGetFx.doneData, (_, user) => {
  if (user) return ViewerStatus.Authenticated;
  return ViewerStatus.Anonymous;
});

$viewerStatus.on(viewerGetFx.failData, (status, error) => {
  if (error.status === 401 || error.status === 403) {
    return ViewerStatus.Anonymous;
  }
  // If it is not the Authn or Authz error
  // we need to go to anonymous when its the first viewerGet call
  if (status === ViewerStatus.Pending) {
    return ViewerStatus.Anonymous;
  }
  // Otherwise don't change, to mitigate screen flicks and data loss
  return status;
});
