import { createRouteView } from "atomic-router-react";

import { anonymousRoute, currentRoute } from "./model";
import { PageLoader, SignInPage } from "./page";

const PageLoaderView = createRouteView({
  route: anonymousRoute,
  view: SignInPage,
  otherwise: PageLoader,
});

export default {
  view: PageLoaderView,
  route: currentRoute,
};
