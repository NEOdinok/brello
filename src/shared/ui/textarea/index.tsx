import cn from "clsx";
import type { ChangeEvent, TextareaHTMLAttributes } from "react";

import styles from "./styles.module.css";

export interface Props<T extends string> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  onValue: (value: string, { name }: { name: T }) => void;
  name: T;
  value: string;
  label?: string;
  hint?: string;
  variant?: "sm" | "md";
  error?: string;
}

export const Textarea = <T extends string>({
  className,
  onValue,
  name,
  value,
  label,
  hint,
  variant = "sm",
  error,
  ...rest
}: Props<T>) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = event.currentTarget;
    onValue(value, { name: name as T });
  };

  return label ? (
    <label className={cn(styles.labelOnly, className)}>
      <span className={styles.label}>{label}</span>
      <textarea
        name={name}
        className={cn(styles.root, styles[`variant-${variant}`], {
          [styles.hasError]: Boolean(error),
        })}
        value={value}
        onChange={handleChange}
        {...rest}
      />
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </label>
  ) : (
    <>
      <textarea
        name={name}
        className={cn(
          styles.root,
          styles[`variant-${variant}`],
          {
            [styles.hasError]: Boolean(error),
          },
          className,
        )}
        value={value}
        onChange={handleChange}
        {...rest}
      />
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </>
  );
};
