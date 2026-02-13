import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        marginTop: "var(--s-24)",
        paddingBlock: "var(--s-12)",
      }}
    >
      <div className="container">
        <div
          className="flex flex-wrap justify-between items-start gap-8"
          style={{ marginBottom: "var(--s-8)" }}
        >
          <div>
            <p style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.04em", margin: 0 }}>
              dadz
            </p>
            <p className="text-muted text-sm" style={{ marginTop: "var(--s-2)", maxWidth: "24rem" }}>
              Find another dad who is online now. Schedule sessions. No bullshit.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="stack-3">
              <p className="text-xs text-subtle" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                Product
              </p>
              <Link href="/#how-it-works" className="text-sm text-secondary" style={{ display: "block" }}>How it works</Link>
              <Link href="/#faq" className="text-sm text-secondary" style={{ display: "block" }}>FAQ</Link>
            </div>
            <div className="stack-3">
              <p className="text-xs text-subtle" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                Account
              </p>
              <Link href="/login" className="text-sm text-secondary" style={{ display: "block" }}>Sign in</Link>
              <Link href="/login" className="text-sm text-secondary" style={{ display: "block" }}>Create account</Link>
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap justify-between items-center gap-4 text-xs text-subtle"
          style={{ paddingTop: "var(--s-6)", borderTop: "1px solid var(--color-border)" }}
        >
          <p style={{ margin: 0 }}>Dadz {new Date().getFullYear()}. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
