import * as auth from "./rest/auth";
import * as profiles from "./rest/profiles";
import * as workspaces from "./rest/workspaces";

export type { User } from "./rest/common";
export type { Workspace } from "./rest/workspaces";

export const api = {
  auth,
  profiles,
  workspaces,
};
