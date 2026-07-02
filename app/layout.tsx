import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kboards.jeramiahcoffey.com";

export const metadata: Metadata = {
  // Resolves the file-convention icon / OG image routes to absolute URLs, which
  // social crawlers require.
  metadataBase: new URL(siteUrl),
  title: {
    default: "kboards",
    template: "%s · kboards",
  },
  description: "A kanban board for tracking work, rebuilt in Next.js.",
  applicationName: "kboards",
  openGraph: {
    type: "website",
    siteName: "kboards",
    url: siteUrl,
    title: "kboards",
    description: "A kanban board for tracking work, rebuilt in Next.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "kboards",
    description: "A kanban board for tracking work, rebuilt in Next.js.",
  },
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
