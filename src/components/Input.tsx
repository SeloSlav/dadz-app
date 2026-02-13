import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  error?: string;
  large?: boolean;
}

export function Input({
  label,
  id,
  error,
  large = false,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name ?? undefined;

  return (
    <div>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`input ${large ? "input-lg" : ""} ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          style={{ fontSize: "0.8125rem", color: "var(--color-red)", marginTop: "var(--s-1)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
