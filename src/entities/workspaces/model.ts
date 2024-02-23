import { createStore } from "effector";

import { Workspace } from "@/shared/api";

export const $workspaces = createStore<Workspace[]>([]);
