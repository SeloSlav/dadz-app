"use client";

import Link from "next/link";
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
      className="scrollbar-styled"
      style={{
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "min(480px, 60vh)",
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--color-border)",
        background: "linear-gradient(180deg, rgba(21,29,46,0.95) 0%, rgba(17,24,39,0.98) 100%)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <th style={{ textAlign: "left", padding: "var(--s-3) var(--s-4)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Player
            </th>
            <th style={{ textAlign: "left", padding: "var(--s-3) var(--s-4)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Games / Match
            </th>
            <th style={{ textAlign: "center", padding: "var(--s-3) var(--s-4)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Status
            </th>
            <th style={{ textAlign: "center", padding: "var(--s-3) var(--s-4)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Match %
            </th>
            <th style={{ width: 52, padding: "var(--s-3) var(--s-4)" }} />
          </tr>
        </thead>
        <tbody>
          {dads.map((m) => {
            const { score, label } = compatibilityScore(m);
            return (
              <tr
                key={m.id}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  borderLeft: m.in_window ? "4px solid var(--color-green)" : "4px solid transparent",
                  transition: "background 0.15s ease",
                }}
                className="lobby-row"
              >
                <td style={{ padding: "var(--s-3) var(--s-4)", fontWeight: 600 }}>
                  <Link
                    href={`/profile/${m.id}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                    className="lobby-row-link"
                  >
                    {m.display_name}
                  </Link>
                </td>
                <td style={{ padding: "var(--s-3) var(--s-4)", fontSize: "0.875rem", color: "var(--color-fg-secondary)" }}>
                  {m.shared_games?.length
                    ? `${m.shared_games.slice(0, 3).join(", ")}${m.shared_games.length > 3 ? ` +${m.shared_games.length - 3}` : ""}`
                    : label}
                </td>
                <td style={{ padding: "var(--s-3) var(--s-4)", textAlign: "center" }}>
                  {m.in_window ? (
                    <span
                      className="badge"
                      style={{
                        fontSize: "0.7rem",
                        background: "var(--color-green-muted)",
                        color: "var(--color-green)",
                        border: "1px solid rgba(52,211,153,0.3)",
                      }}
                    >
                      Available
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.8125rem", color: "var(--color-fg-subtle)" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "var(--s-3) var(--s-4)", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: score >= 70 ? "var(--color-green)" : score >= 40 ? "var(--color-accent-light)" : "var(--color-fg-muted)",
                    }}
                  >
                    {score}%
                  </span>
                </td>
                <td style={{ padding: "var(--s-2) var(--s-4)" }}>
                  <MessageLink userId={m.id} className="btn btn-primary btn-icon btn-sm" iconOnly />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
