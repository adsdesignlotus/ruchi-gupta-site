import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        /** Alternate section wash */
        section: "var(--color-background-alt)",
        surface: "var(--color-surface)",
        fill: "var(--color-fill)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        divider: "var(--color-divider)",
        accent: "var(--color-accent)",
        gold: "var(--color-gold)",
        highlight: "var(--color-highlight)",
        maroon: "var(--color-maroon)",
      },
      maxWidth: {
        /** Main column; fluid cap so wide viewports use more horizontal space */
        content: "min(80rem, 100%)",
        /** Long-form copy — wider than classic 65ch so lines do not break unnecessarily on large screens */
        reading: "min(52rem, 100%)",
      },
      spacing: {
        "page-mobile": "20px",
        "page-tablet": "40px",
        "page-desktop": "72px",
        /** Section vertical padding target 80–120px */
        "section-y": "clamp(5rem, 7vw, 7.5rem)",
        /** Between major stacked sections 64–80px */
        "section-gap": "clamp(4rem, 5vw, 5rem)",
        /** Card interior 24–32px */
        "card": "1.75rem",
        18: "4.5rem",
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
      fontFamily: {
        sans: ["var(--font-lato)", "system-ui", "sans-serif"],
        /** Headings — Playfair Display */
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        /** Poetic / Sanskrit accents — Cormorant Garamond */
        accent: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      fontSize: {
        /**
         * Heading scale (smaller at each step; use the right token for context):
         * display — lone document / event hero title
         * section-title — PageHeader + home “Performances”-style section labels
         * content-title — H2 inside a long page under display (programme blocks, etc.)
         * subsection-title — cards, list leads, about column heads
         */
        display: [
          "clamp(1.875rem, 2vw + 0.85rem, 2.25rem)",
          { lineHeight: "1.2" },
        ],
        "section-title": [
          "clamp(1.375rem, 1.5vw + 0.55rem, 1.625rem)",
          { lineHeight: "1.28" },
        ],
        "content-title": [
          "clamp(1.125rem, 0.85vw + 0.72rem, 1.3125rem)",
          { lineHeight: "1.32" },
        ],
        "subsection-title": [
          "clamp(1.0625rem, 0.5vw + 0.78rem, 1.1875rem)",
          { lineHeight: "1.35" },
        ],
      },
      letterSpacing: {
        heading: "0.5px",
      },
      lineHeight: {
        prose: "1.7",
      },
    },
  },
  plugins: [],
};
export default config;
