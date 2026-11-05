import type { Metadata, Viewport } from "next";
import logo from "../../assets/brand/logo-mark.png";
import geistSans from "../../shared/fonts/GeistSans.woff2";
import cormorantGaramond from "../../shared/fonts/CormorantGaramond-SemiBold.woff2";
import PwaRegister from "./components/pwa-register";
import { ThemeBootScript } from "./components/theme-boot-script";
import { getThemeBootScript } from "./lib/theme-boot";
import "./tailwind.css";

export const metadata: Metadata = {
  title: "Kaung Mon",
  description: "Commercial portfolio",
  applicationName: "Kaung Mon",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kaung Mon",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: logo.src, type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

/** Young Night dark canvas — matches `MODE_DARK_BASE` until the theme boot runs. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#f7f2ec" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Classic equivalent of next/font preload */}
        <link
          rel="preload"
          href={geistSans}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={cormorantGaramond}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* SSR stream injection — not in the React client tree (Next 16 / React 19) */}
        <ThemeBootScript script={getThemeBootScript()} />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
