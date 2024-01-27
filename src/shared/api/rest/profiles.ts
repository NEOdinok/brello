import { PostgrestError } from "@supabase/supabase-js";
import { createEffect } from "effector";

import { client } from "@/shared/api/client";
import { UserId, checkError } from "@/shared/api/rest/common.ts";

export const profileExistsFx = createEffect<{ userId: UserId }, boolean, PostgrestError>(
  async ({ userId }) => {
    const { data: profiles, error } = await client.from("profiles").select().eq("user_id", userId);

    checkError(error);

    if (profiles === null || profiles.length === 0) {
      return false;
    }

    return true;
  },
);
