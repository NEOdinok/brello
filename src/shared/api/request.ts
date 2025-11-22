import { createEffect } from "effector";

import { BACKEND_URL } from "@/shared/config";

interface RequestParams {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  headers?: Headers;
}

export const requestFx = createEffect(async ({ path, method, body, headers}: RequestParams) => {
  const url = new URL(path, BACKEND_URL);

  const finalHeaders = headers ?? new Headers();

  const response = await fetch(url, {
	  method,
	  body: body ? JSON.stringify(body) : undefined,
	  headers: finalHeaders,
  });
  
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
});