import cn from "clsx";
import type { FC, ReactNode } from "react";
import { ButtonHTMLAttributes } from "react";

import styles from "./styles.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
}

export const GhostButton: FC<Props> = ({ className, children, ...rest }) => {
  return (
    <button className={cn(styles.root, className)} {...rest}>
      {children}
    </button>
  );
};
