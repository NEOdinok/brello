import cn from "clsx";
import type { FC } from "react";

import styles from "./styles.module.css";

interface Props {
  className?: string;
  src?: string | null;
  text?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Avatar: FC<Props> = ({ className, src, text, size = "xs" }) => {
  let initials = "";
  if (!src && text) {
    const [firstName, lastName] = text.split(" ");
    const firstInitial = firstName?.[0] ?? "";
    const secondInitial = lastName?.[0] ?? "";

    initials = `${firstInitial}${secondInitial}`.toUpperCase();
  }

  return (
    <div className={cn(styles.root, styles[`size-${size}`], className)}>
      {src && <img className={styles.image} src={src} alt="avatar" />}
      {!src && <span className={styles.text}>{initials}</span>}
    </div>
  );
};
