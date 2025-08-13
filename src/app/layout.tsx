import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hardware Playground",
  description: "A refactored, modular hardware playground platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
