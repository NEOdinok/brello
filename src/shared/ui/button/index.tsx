import cn from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

import styles from "./styles.module.css";

export type Ref = HTMLButtonElement;

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "primary" | "secondary-gray" | "link-gray" | "link-color";
  loading?: boolean;
  isDestructive?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<Ref, Props>(
  (
    {
      className,
      size = "lg",
      variant = "primary",
      isDestructive = false,
      onClick,
      children,
      loading = false,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const classList = cn(
      styles.root,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      {
        [styles.desctuctive]: isDestructive,
      },
      className,
    );

    return (
      <button
        ref={ref}
        disabled={loading ?? disabled}
        className={classList}
        onClick={loading ? undefined : onClick}
        aria-disabled={loading ?? disabled}
        {...rest}
      >
        {loading ? "Loading…" : children}
      </button>
    );
  },
);
