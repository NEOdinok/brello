import { FC } from "react";
import { ImageLogomark } from "@/shared/assets/images";
import styles from "./styles.module.css";
import cn from "clsx";

interface Props {
  className?: string;
}

export const Logo: FC<Props> = ({ className }) => {
  return (
    <div className={cn(styles.root, className)}>
      <img className={styles.logomark} src={ImageLogomark} alt="Logo" />
      <span className={styles.text}>Brello</span>
    </div>
  );
};
