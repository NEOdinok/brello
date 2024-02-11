import { AuthError } from "@supabase/supabase-js";
import { createEffect } from "effector";

import { client } from "@/shared/api/client";

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

export const signInWithEmailFx = createEffect<{ email: Email }, void, AuthError>(
  async ({ email }) => {
    const baseUrl = document.location.toString();
    const emailRedirectTo = new URL("/auth/finish", baseUrl).toString();
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });

    checkError(error);
  },
);

export const getMeFx = createEffect<void, { id: string; email: string } | null, AuthError>(
  async () => {
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
  },
);

export const signOutFx = createEffect<void, void, AuthError>(async () => {
  const { error } = await client.auth.signOut();

  checkError(error);
});

export const signInWithGoogleFx = createEffect<void, void, AuthError>(async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: "github",
  });

  checkError(error);
});
