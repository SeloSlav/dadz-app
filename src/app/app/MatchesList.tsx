"use client";

import { MessageLink } from "@/components/MessageLink";

type Dad = {
  id: string;
  display_name: string;
  timezone: string;
  shared_games: string[] | null;
  in_window: boolean;
  match_type: string;
};

function compatibilityScore(d: Dad): { score: number; label: string } {
  const games = d.shared_games?.length ?? 0;
  const hasGames = d.match_type === "games" && games > 0;
  const hasAvailability = d.match_type === "availability";
  const available = d.in_window;

  if (hasGames && available) return { score: Math.min(95 + games * 2, 99), label: "Great match" };
  if (hasGames) return { score: Math.min(75 + games * 5, 94), label: "Shared games" };
  if (hasAvailability && available) return { score: 55, label: "Available now" };
  if (hasAvailability) return { score: 40, label: "Similar schedule" };
  if (available) return { score: 25, label: "Online" };
  return { score: 10, label: "New dad" };
}

export function MatchesList({ dads }: { dads: Dad[] }) {
  return (
    <div
      className="stack-3 scrollbar-styled"
      style={{
        maxHeight: "min(420px, 55vh)",
        overflowY: "auto",
        overflowX: "hidden",
        marginRight: "calc(-1 * var(--s-2))",
        paddingRight: "var(--s-2)",
      }}
    >
      {dads.map((m) => {
        const { score, label } = compatibilityScore(m);
        return (
          <div
            key={m.id}
            className="card"
            style={{
              padding: "var(--s-4) var(--s-5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--s-4)",
              flexWrap: "wrap",
              borderLeft: m.in_window ? "4px solid var(--color-green)" : undefined,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-1)", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600 }}>{m.display_name}</span>
                {m.in_window && (
                  <span
                    className="badge"
                    style={{
                      fontSize: "0.7rem",
                      background: "var(--color-green-muted)",
                      color: "var(--color-green)",
                      border: "1px solid rgba(52,211,153,0.3)",
                    }}
                  >
                    Available now
                  </span>
                )}
                <span
                  className="badge"
                  style={{
                    fontSize: "0.7rem",
                    background: "var(--color-bg-muted)",
                    color: "var(--color-fg-muted)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {score}%
                </span>
              </div>
              <p className="text-muted text-sm" style={{ margin: 0 }}>
                {m.shared_games?.length
                  ? `${m.shared_games.slice(0, 3).join(", ")}${m.shared_games.length > 3 ? ` +${m.shared_games.length - 3} more` : ""}`
                  : label}
              </p>
            </div>
            <MessageLink userId={m.id} className="btn btn-primary btn-icon btn-sm" iconOnly />
          </div>
        );
      })}
    </div>
  );
}
