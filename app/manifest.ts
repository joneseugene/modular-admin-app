
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "OsusuBook",
    short_name: "OsusuBook",
    description:
      "Organise Osusu groups, track contributions, and build trust.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F8FAF5",
    theme_color: "#16834A",
    categories: ["finance", "business", "productivity"],
    icons: [
      {
        src: "/icons/osusubook.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
