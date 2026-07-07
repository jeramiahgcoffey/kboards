import type { MetadataRoute } from "next";

// Web app manifest, so the app is installable and its standalone window / splash
// use the brand colors. Icons point at the file-convention routes Next serves.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kboards",
    short_name: "kboards",
    description: "A kanban board for tracking work.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1115",
    theme_color: "#0f1115",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
