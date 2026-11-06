import type { ReactNode } from "react";

export const metadata = { title: "AI app with credits" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", maxWidth: 560, margin: "4rem auto", padding: "0 1rem" }}>
        {children}
      </body>
    </html>
  );
}
