import { createEffect, createEvent, createStore, sample } from "effector";

import { readFileAsDataURL } from "@/shared/lib/file-upload";
import { routes } from "@/shared/routing";

export const currentRoute = routes.workspaces.view.settings;

export const $workspaceName = createStore("Coding in action");
export const $file = createStore<File | null>(null);
export const $imageSrc = createStore<string | null>(null);

export const fileSelected = createEvent<File>();

const getImageSrcFx = createEffect(async (file: File) => {
  return (await readFileAsDataURL(file)) as string;
});

sample({
  clock: fileSelected,
  target: [getImageSrcFx, $file],
});

sample({
  clock: getImageSrcFx.doneData,
  target: $imageSrc,
});
