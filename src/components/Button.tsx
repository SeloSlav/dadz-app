import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantMap = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
} as const;

const sizeMap = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
} as const;

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ${variantMap[variant]} ${sizeMap[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
