import { RouteInstance, RouteParams } from "atomic-router";
import { Link } from "atomic-router-react";
import cn from "clsx";
import { FC, ReactElement, useEffect, useState } from "react";

import { IconLogout01 } from "@/shared/assets/icons";
import { Button, Logo, NavMenuButton } from "@/shared/ui";
import { Avatar } from "@/shared/ui/avatar";

import styles from "./styles.module.css";

interface NavItem {
  id: string;
  title: string;
  icon: ReactElement;
  to: RouteInstance<RouteParams>;
}

interface Profile {
  name: string;
  email: string;
  avatarSrc?: string;
}

interface Props {
  className?: string;
  primaryNavItems: NavItem[];
  secondaryNavItems: NavItem[];
  profile: Profile;
}

const NavMenu: FC<{ className?: string; items: NavItem[] }> = ({ className, items }) => {
  return (
    <nav className={cn(styles.nav, className)}>
      <ul className={styles.list}>
        {items.map(({ id, title, icon, to }) => (
          <li key={id} className={styles.item}>
            <Link to={to} className={styles.link} activeClassName={styles.current}>
              {icon}
              <p className={styles.text}>{title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export const SidebarNavigation: FC<Props> = ({
  className,
  primaryNavItems,
  secondaryNavItems,
  profile,
}: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const handleClick = () => {
    setIsOpened((isOpened) => !isOpened);
  };
  const { avatarSrc = null } = profile;

  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpened]);

  return (
    <>
      {isOpened ? (
        <section className={styles.section}>
          <div className={styles.wrapper}>
            <Logo className={styles.logo} />
            <NavMenu items={primaryNavItems} />
            <footer className={styles.footer}>
              <NavMenu items={secondaryNavItems} />
              <div className={styles.account}>
                <div className={styles.info}>
                  <Avatar size="md" src={avatarSrc} text={profile.name} />
                  <div className={styles.credentials}>
                    <p className={styles.name}>{profile.name}</p>
                    <p className={styles.email}>{profile.email}</p>
                  </div>
                </div>
                <Button className={styles.logout} variant="tertiary-gray" size="sm">
                  <IconLogout01 />
                </Button>
              </div>
            </footer>
          </div>
          <NavMenuButton
            className={cn(styles.navMenuButton, styles.isOpened)}
            isOpened={isOpened}
            onClick={handleClick}
          />
        </section>
      ) : (
        <div className={cn(styles.root, className)}>
          <Logo />
          <NavMenu className={styles.elementDesktop} items={primaryNavItems} />
          <Avatar className={styles.elementDesktop} size="md" src={avatarSrc} text={profile.name} />
          <NavMenuButton
            className={styles.navMenuButton}
            isOpened={isOpened}
            onClick={handleClick}
          />
        </div>
      )}
    </>
  );
};
