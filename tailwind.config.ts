import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F6EFE6",
        brown: "#5A3928",
        rose: "#B5886D",
        sage: "#7A8E72",
        gold: "#B8893A",
        charcoal: "#261812",
        grain: "#E8DDD3",
        borderline: "#CCBCAD",
        coffee: {
          DEFAULT: "#4A3227",
          deep: "#2C1C14",
          mist: "#6B5346",
          latte: "#EBE2D6",
          foam: "#F9F5EF",
          crema: "#D4B896",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        heading: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        "noto-tc": ["var(--font-noto)", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 28px rgba(44, 28, 20, 0.12)",
        film: "inset 0 0 0 4px #F6EFE6, 0 4px 14px rgba(38, 24, 18, 0.14)",
      },
      keyframes: {
        shutterFlash: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        sheetUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "shutter-flash": "shutterFlash 120ms ease-out forwards",
        "sheet-up": "sheetUp 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
