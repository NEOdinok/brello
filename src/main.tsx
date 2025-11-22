import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { api } from "@/shared/api";

import { MantineProvider } from "@mantine/core";

api.kanban.listsLoadFx();

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <App />
  </MantineProvider>
);
