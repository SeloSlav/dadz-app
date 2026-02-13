import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  hoverable?: boolean;
  accent?: boolean;
  children: React.ReactNode;
}

export function Card({
  title,
  hoverable = false,
  accent = false,
  children,
  className = "",
  ...props
}: CardProps) {
  const classes = [
    "card",
    hoverable && "card-hover",
    accent && "card-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}
