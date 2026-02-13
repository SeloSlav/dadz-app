interface Feature {
  step?: number;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid-3">
      {features.map((feature, i) => (
        <div
          key={feature.title}
          className={`card card-hover animate-fade-up animate-delay-${i + 1}`}
        >
          {feature.step != null && (
            <div className="step-number" style={{ marginBottom: "var(--s-4)" }}>
              {feature.step}
            </div>
          )}
          <h3 style={{ margin: "0 0 var(--s-2)", fontSize: "1.125rem", fontWeight: 600 }}>
            {feature.title}
          </h3>
          <p className="text-secondary" style={{ margin: 0, fontSize: "0.9375rem" }}>
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
