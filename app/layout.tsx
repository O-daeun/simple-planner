import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Planner",
  description: "Simple Planner is a simple planner for your daily life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
