import cn from "clsx";
import type { FC } from "react";

import { IconMenu02, IconXClose } from "@/shared/assets/icons";
import { Button } from "@/shared/ui";

import styles from "./styles.module.css";

interface Props {
  className?: string;
  isOpened: boolean;
  onClick?: () => void;
}

export const NavMenuButton: FC<Props> = ({ className, isOpened, onClick }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      iconOnly
      variant="tertiary-gray"
      className={cn(
        styles.root,
        {
          [styles.opened]: isOpened,
        },
        className,
      )}
    >
      {isOpened ? <IconXClose className={styles.icon} /> : <IconMenu02 className={styles.icon} />}
    </Button>
  );
};
