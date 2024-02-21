import { createRouteView } from "atomic-router-react";

import { authenticatedRoute, currentRoute, profileLoadRoute } from "./model";
import { OnboardingUserPage, PageLoader } from "./pages";

const ProfileLoadView = createRouteView({
  route: profileLoadRoute,
  view: OnboardingUserPage,
  otherwise: PageLoader,
});

const AuthenticationView = createRouteView({
  route: authenticatedRoute,
  view: ProfileLoadView as () => React.JSX.Element,
  otherwise: PageLoader,
});

export default {
  view: AuthenticationView,
  route: currentRoute,
};
