import Link from "next/link";

interface HeaderProps {
  user?: { email?: string } | null;
  variant?: "transparent" | "solid";
}

export function Header({ user, variant = "solid" }: HeaderProps) {
  const bg = variant === "transparent" ? "transparent" : "var(--color-bg)";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: variant === "transparent" ? "rgba(9,13,20,0.7)" : bg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        className="container flex items-center justify-between"
        style={{ height: 64 }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "var(--color-fg)",
          }}
        >
          dadz
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <Link href="/app" className="btn btn-primary btn-sm">
              Go play
            </Link>
          ) : (
            <>
              <Link href="/#how-it-works" className="btn btn-ghost btn-sm hide-mobile">
                How it works
              </Link>
              <Link href="/#faq" className="btn btn-ghost btn-sm hide-mobile">
                FAQ
              </Link>
              <Link href="/login" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
