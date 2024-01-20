import cn from "clsx";

import styles from "./styles.module.css";

interface Props {
  className?: string;
}

export const Loading = ({ className }: Props): JSX.Element => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.part}></div>
      <div className={styles.part}></div>
      <div className={styles.part}></div>
      <div className={styles.part}></div>
    </div>
  );
};
