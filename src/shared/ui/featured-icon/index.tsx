import cn from "clsx";
import type { FC, FunctionComponent, SVGProps } from "react";

import styles from "./styles.module.css";

interface Props {
  className?: string;
  color?: "primary" | "error";
  theme?: "light-circle-outline" | "modern";
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export const FeaturedIcon: FC<Props> = ({
  className,
  color = "primary",
  Icon,
  theme = "light-circle-outline",
}) => {
  const classList = cn(styles.root, styles[`color-${color}`], styles[`theme-${theme}`], className);

  return (
    <div className={classList}>
      <Icon className={styles.container} />
    </div>
  );
};
