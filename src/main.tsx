import ReactDOM from "react-dom/client";
import { App } from "@/app";
import { appStarted } from "./shared/init";
import { allSettled, fork } from "effector";
import { Provider } from "effector-react";

const root = document.getElementById("root") as HTMLElement;

const scope = fork();

allSettled(appStarted, { scope }).catch(() =>
  console.warn("Failed to start the app")
);

ReactDOM.createRoot(root).render(
  <Provider value={scope}>
    <App />
  </Provider>
);
