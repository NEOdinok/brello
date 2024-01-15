import styles from "./styles.module.css";

import cn from "clsx";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { forwardRef } from "react";

export type Ref = HTMLButtonElement;

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "primary" | "secondary-gray" | "link-gray" | "link-color";
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
      ...rest
    },
    ref
  ) => {
    const classList = cn(
      styles.root,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      {
        [styles.desctuctive]: isDestructive,
      },
      className
    );

    return (
      <button ref={ref} className={classList} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  }
);
