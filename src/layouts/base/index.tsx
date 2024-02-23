import { FC, ReactNode } from "react";

import { IconLayersTwo01, IconUsers02 } from "@/shared/assets/icons";
import { routes } from "@/shared/routing";
import { SidebarNavigation } from "@/shared/ui";

import styles from "./styles.module.css";

interface LayoutBaseProps {
  children: ReactNode;
}

const primaryNavItems = [
  {
    id: "boards",
    title: "Boards",
    icon: <IconLayersTwo01 />,
    to: routes.home,
  },
  {
    id: "members",
    title: "Members",
    icon: <IconUsers02 />,
    to: routes.home,
  },
];

const secondaryNavItems = [
  {
    id: "profile",
    title: "View profile",
    icon: <IconLayersTwo01 />,
    to: routes.home,
  },
];

const profile = {
  name: "Siarhei Bautrukevich",
  email: "siarhei@brello.io",
};

export const LayoutBase: FC<LayoutBaseProps> = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <SidebarNavigation
          className={styles.navigation}
          primaryNavItems={primaryNavItems}
          secondaryNavItems={secondaryNavItems}
          profile={profile}
        />
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
};
