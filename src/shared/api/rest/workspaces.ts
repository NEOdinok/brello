import { PostgrestError } from "@supabase/supabase-js";
import { createEffect } from "effector";

import { client } from "../client.ts";
import { UserId } from "./common";
import { checkError } from "./common.ts";

export interface Workspace {
  id: string;
  userId: UserId;
  name: string;
  slug: string | null;
  description: string | null;
  avatarUrl: string | null;
}

export const workspaceExistsFx = createEffect<{ userId: UserId }, boolean, PostgrestError>(
  async ({ userId }) => {
    const { data: workspaces, error } = await client
      .from("workspaces")
      .select()
      .eq("user_id", userId);

    checkError(error);

    if (workspaces === null || workspaces.length === 0) {
      return false;
    }

    return true;
  },
);

export const workspaceCreateFx = createEffect<
  { workspace: Omit<Workspace, "id"> },
  void,
  PostgrestError
>(async ({ workspace }) => {
  const { userId, name, slug, description } = workspace;
  const { error } = await client.from("workspaces").insert({
    user_id: userId,
    name,
    slug,
    description,
  });

  checkError(error);

  return;
});

export const workspaceGetFx = createEffect<{ userId: UserId }, Workspace | null, PostgrestError>(
  async ({ userId }) => {
    const { data, error } = await client.from("workspaces").select().eq("user_id", userId);

    checkError(error);

    if (data === null) {
      return null;
    }

    const workspace = data[0];
    const { id, name, slug, description, avatar_url } = workspace;

    return {
      id,
      userId,
      name,
      slug,
      description,
      avatarUrl: avatar_url,
    };
  },
);

export const workspaceUpdateFx = createEffect<{ workspace: Workspace }, void, PostgrestError>(
  async ({ workspace }) => {
    const { id, userId, name, slug, description, avatarUrl } = workspace;
    const { error } = await client
      .from("workspaces")
      .update({
        user_id: userId,
        name,
        slug,
        description,
        avatar_url: avatarUrl,
      })
      .eq("id", id)
      .eq("user_id", userId);

    checkError(error);

    return;
  },
);
