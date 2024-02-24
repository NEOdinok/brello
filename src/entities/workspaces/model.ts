import { Store, combine, createEvent, createStore } from "effector";

import { Workspace } from "@/shared/api";

type WorkspaceId = Workspace["id"];

export const workspaceCache = createEvent<Workspace>();

export const $workspacesCache = createStore<Record<WorkspaceId, Workspace>>({});

$workspacesCache.on(workspaceCache, (cache, workspace) => ({
  ...cache,
  [workspace.id]: workspace,
}));

export function workspaceById($id: Store<WorkspaceId>): Store<null | Workspace> {
  return combine($workspacesCache, $id, (cache, id) => (cache[id] ?? null) as Workspace | null);
}
