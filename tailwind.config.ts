import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import tailwindBgPatterns from "tailwindcss-bg-patterns";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 35s linear infinite",
        marquee2: "marquee2 42s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "count-up": "countUp 2s ease-out forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        appTheme: {
          primary: "#0E63FF",
          secondary: "#EDEDFA",
          accent: "#F1570B",
          neutral: "#F8F8F8",
          "neutral-content": "#1C1C1CFF",
          "base-100": "#F7F7FA",
          "base-200": "#d7d7d9",
          "base-300": "#b7b7ba",
          "base-content": "#151515",
        },
      },
    ],
  },
  plugins: [daisyui, tailwindBgPatterns],
} satisfies Config;
