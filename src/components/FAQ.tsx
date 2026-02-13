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
    <div className="stack-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="card"
          style={{ cursor: "pointer" }}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        >
          <div className="flex justify-between items-center">
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
              {item.question}
            </h3>
            <span
              style={{
                fontSize: "1.25rem",
                transform: openIndex === index ? "rotate(45deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              +
            </span>
          </div>
          {openIndex === index && (
            <p className="text-muted stack-2" style={{ marginTop: "var(--space-4)", marginBottom: 0 }}>
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
