import { AuthError } from "@supabase/supabase-js";
import { createEffect } from "effector";

import { client } from "@/shared/client";
import { SITE_URL } from "@/shared/config";

export type Email = string;
export type UserId = Uuid;

export interface User {
  id: UserId;
  email: Email;
}

const checkError = (error: AuthError | null) => {
  if (error) {
    throw error;
  }
};

export const signInWithEmail = createEffect<{ email: Email }, void, AuthError>(
  async ({ email }) => {
    const { error } = await client.auth.signInWithOpt({
      email,
      options: {
        emailRedirectTo: SITE_URL,
      },
    });

    checkError(error);
  }
);

export const getMe = createEffect<
  void,
  { id: string; email: string } | null,
  AuthError
>(async () => {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  checkError(error);

  if (user) {
    return {
      id: user.id as string,
      email: user.email as string,
    };
  }

  return null;
});

export const signOut = createEffect<void, void, AuthError>(async () => {
  const { error } = await client.auth.signOut();

  checkError(error);
});
