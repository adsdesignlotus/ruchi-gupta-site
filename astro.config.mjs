import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: vercel(),
  integrations: [
    // Default StaticHtml keeps `astro-slot` innerHTML intact. Event detail pages use
    // `omitClientShell` + static Astro markup so copy is never gated on a giant island.
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  redirects: {
    "/events/knn-annual-showcase-2023": "/events/nrityarchitum-15-2023",
    "/events/nrityarchitum-17-2025": "/events/nrityarchitum-18-2026",
  },
});
