import cn from "clsx";
import { ChangeEvent, InputHTMLAttributes } from "react";

import styles from "./styles.module.css";

export interface Props<T extends string> extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onValue: ({ value, name }: { value: string; name: T }) => void;
  name: T;
  value: string;
  label?: string;
  type?: "text" | "email" | "search";
  hint?: string;
  variant?: "sm" | "md";
  error?: string;
}

export const Input = <T extends string>({
  className,
  onValue,
  name,
  value,
  label,
  hint,
  type = "text",
  variant = "sm",
  error,
  ...rest
}: Props<T>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;
    onValue({ value, name: name as T });
  };

  const hasError = Boolean(error);

  return label ? (
    <label className={cn(styles.labelOnly, className)}>
      <span className={styles.label}>{label}</span>
      <input
        type={type}
        name={name}
        className={cn(styles.root, styles[`variant-${variant}`], {
          [styles.hasError]: hasError,
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
      <input
        type={type}
        name={name}
        className={cn(
          styles.root,
          styles[`variant-${variant}`],
          {
            [styles.hasError]: hasError,
          },
          className,
        )}
        value={value}
        onChange={handleChange}
        {...rest}
      />
      {hasError ? (
        <span className={styles.error}>{error}</span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </>
  );
};
