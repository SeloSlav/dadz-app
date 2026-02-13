import Link from "next/link";

interface HeaderProps {
  user?: { email?: string } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between"
      style={{ padding: "var(--space-4) 0", borderBottom: "1px solid var(--color-border)" }}
    >
      <Link href="/" className="text-xl" style={{ fontWeight: 700 }}>
        Dadz
      </Link>
      <nav className="flex items-center gap-6">
        {user ? (
          <>
            <Link href="/app" className="btn-ghost btn btn-sm">
              App
            </Link>
            <Link href="/profile" className="btn-ghost btn btn-sm">
              Profile
            </Link>
          </>
        ) : (
          <Link href="/login" className="btn-primary btn btn-sm">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
