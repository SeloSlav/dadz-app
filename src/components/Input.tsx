import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  error?: string;
}

export function Input({
  label,
  id,
  error,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name ?? `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="stack-2">
      {label && (
        <label htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-muted" style={{ fontSize: "0.875rem", color: "var(--color-error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
