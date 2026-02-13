import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Dadz | Find another dad who is online now",
  description:
    "Dads only. Find a session. Schedule when you can play. No bullshit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ position: "relative" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <ToastProvider>{children}</ToastProvider>
        </div>
      </body>
    </html>
  );
}
