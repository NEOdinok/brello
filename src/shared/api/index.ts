import * as auth from "./rest/auth";
import * as profiles from "./rest/profiles";

export type { User } from "./rest/common";

export const api = {
  profiles,
  auth,
};
