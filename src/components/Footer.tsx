import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="section-sm text-muted"
      style={{ borderTop: "1px solid var(--color-border)", marginTop: "var(--space-16)" }}
    >
      <div className="container flex flex-col gap-4">
        <div className="flex flex-wrap gap-6">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <p style={{ fontSize: "0.875rem" }}>
          Dadz. Find another dad who is online now. No guilt, no pressure.
        </p>
      </div>
    </footer>
  );
}
