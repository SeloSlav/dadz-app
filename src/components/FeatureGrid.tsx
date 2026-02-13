interface Feature {
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div
      className="flex flex-col gap-8"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--space-8)",
      }}
    >
      {features.map((feature) => (
        <div key={feature.title} className="card">
          <h3 style={{ margin: "0 0 var(--space-2)", fontSize: "1.125rem", fontWeight: 600 }}>
            {feature.title}
          </h3>
          <p className="text-muted" style={{ margin: 0 }}>
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
