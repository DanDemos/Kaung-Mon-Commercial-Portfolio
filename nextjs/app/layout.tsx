import type { Metadata } from "next";
import logo from "../../assets/brand/logo-mark.png";
import geistSans from "../../shared/fonts/GeistSans.woff2";
import cormorantGaramond from "../../shared/fonts/CormorantGaramond-SemiBold.woff2";
import { getThemeBootScript } from "./lib/theme-boot";
import "./tailwind.css";

export const metadata: Metadata = {
  title: "Kaung Mon",
  description: "Commercial portfolio",
  icons: {
    icon: [{ url: logo.src, type: "image/png" }],
  },
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
        {/* Sync before paint — resolve stored day/night + seed so we never flash default dark → light */}
        <script
          id="km-theme-boot"
          dangerouslySetInnerHTML={{ __html: getThemeBootScript() }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
