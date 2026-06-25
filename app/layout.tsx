import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "kboards",
    template: "%s · kboards",
  },
  description: "A kanban board for tracking work, rebuilt in Next.js.",
};

export const viewport: Viewport = {
  themeColor: "#0f1115",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
