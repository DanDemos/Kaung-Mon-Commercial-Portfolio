import type { MetadataRoute } from "next";

/** Web app manifest — required for installable PWA. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kaung Mon",
    short_name: "Kaung Mon",
    description: "Commercial portfolio — websites and product UI.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#121212",
    theme_color: "#121212",
    lang: "en",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
