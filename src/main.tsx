import { RouterProvider } from "atomic-router-react";
import { allSettled, fork } from "effector";
import { Provider } from "effector-react";
import ReactDOM from "react-dom/client";

import { Application } from "@/app";

import { router } from "@/shared/routing";

import { appStarted } from "./shared/init";

const root = document.getElementById("root") as HTMLElement;

const scope = fork();

allSettled(appStarted, { scope }).catch(() => console.warn("Failed to start the app"));

ReactDOM.createRoot(root).render(
  <Provider value={scope}>
    <RouterProvider router={router}>
      <Application />
    </RouterProvider>
  </Provider>,
);
