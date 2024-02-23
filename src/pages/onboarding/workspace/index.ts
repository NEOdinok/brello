import { createRouteView } from "atomic-router-react";

import { currentRoute, workspaceLoadedRoute } from "./model";
import { OnboardingWorkspacePage, PageLoader } from "./page";

const WorkspaceView = createRouteView({
  route: workspaceLoadedRoute,
  view: OnboardingWorkspacePage,
  otherwise: PageLoader,
});

export default {
  view: WorkspaceView,
  route: currentRoute,
};
