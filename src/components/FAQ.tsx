"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="stack-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <button
            key={index}
            type="button"
            className="card card-hover"
            onClick={() => setOpenIndex(isOpen ? null : index)}
            aria-expanded={isOpen}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <div className="flex justify-between items-center gap-4">
              <h3 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 600, color: "var(--color-fg)" }}>
                {item.question}
              </h3>
              <span
                style={{
                  fontSize: "1.5rem",
                  lineHeight: 1,
                  color: "var(--color-fg-subtle)",
                  transform: isOpen ? "rotate(45deg)" : "none",
                  transition: "transform 0.25s var(--ease-out)",
                  flexShrink: 0,
                }}
              >
                +
              </span>
            </div>
            {isOpen && (
              <p className="text-secondary" style={{ margin: "var(--s-3) 0 0", lineHeight: 1.65, fontSize: "0.9375rem" }}>
                {item.answer}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
