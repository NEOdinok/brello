import type { FC, FunctionComponent, SVGProps } from "react";
import cn from "clsx";

import styles from "./styles.module.css";

interface Props {
  className?: string;
  color?: "primary" | "error";
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export const FeaturedIcon: FC<Props> = ({
  className,
  color = "primary",
  Icon,
}) => {
  const classList = cn(styles.root, styles[`color-${color}`], className);

  return (
    <div className={classList}>
      <Icon className={styles.container} />
    </div>
  );
};
