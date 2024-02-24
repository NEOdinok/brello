import cn from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

import styles from "./styles.module.css";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?:
    | "primary"
    | "secondary-gray"
    | "secondary-color"
    | "link-gray"
    | "link-color"
    | "tertiary-gray";
  loading?: boolean;
  isDestructive?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
}

export type Ref = HTMLButtonElement;

export const Button = forwardRef<Ref, Props>(
  (
    {
      className,
      size = "lg",
      variant = "primary",
      loading = false,
      disabled,
      isDestructive = false,
      iconOnly = false,
      onClick,
      children,
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
        [styles.iconOnly]: iconOnly,
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
