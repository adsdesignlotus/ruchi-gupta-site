import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: node({ mode: "standalone" }),
  integrations: [
    // `experimentalReactChildren` re-parses slot HTML as React nodes, which breaks
    // nested client islands (e.g. PastEventContent inside ClientShell): props get
    // double-encoded and JSON.parse fails → blank page. Default StaticHtml keeps
    // `astro-slot` innerHTML intact so nested islands hydrate correctly.
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  redirects: {
    "/events/knn-annual-showcase-2023": "/events/nrityarchitum-15-2023",
    "/events/nrityarchitum-17-2025": "/events/nrityarchitum-18-2026",
  },
});
