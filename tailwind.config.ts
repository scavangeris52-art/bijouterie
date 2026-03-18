import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50:  "#fff0f5",
          100: "#ffd6e5",
          200: "#ffadc9",
          300: "#ff80ab",
          400: "#f48fb1",
          500: "#e91e63",
          600: "#d81b60",
          700: "#c2185b",
          800: "#ad1457",
          900: "#880e4f",
        },
        coral: {
          50:  "#fff3f1",
          100: "#ffe0db",
          200: "#ffb5a8",
          300: "#ff8a75",
          400: "#ef6c57",
          500: "#e55a44",
          600: "#d4442d",
          700: "#b5381f",
        },
        salmon: {
          50:  "#fff8f6",
          100: "#ffeae5",
          200: "#ffcfc5",
          300: "#ffb0a0",
          400: "#ff8a80",
          500: "#ff6b6b",
          600: "#e55555",
        },
        cream: {
          50:  "#fff8f6",
          100: "#fff0ec",
          200: "#fde8e2",
        },
        // Admin dark palette
        admin: {
          bg:     "#0f0a1a",
          card:   "#1a1230",
          border: "#2d2250",
          text:   "#c4b8d4",
          muted:  "#8878a0",
        },
      },
      fontFamily: {
        serif:  ["Georgia", "Times New Roman", "serif"],
        sans:   ["Inter", "Helvetica Neue", "sans-serif"],
      },
      animation: {
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-out-right": "slideOutRight 0.3s ease-in",
        "fade-in":         "fadeIn 0.2s ease-out",
        "bounce-in":       "bounceIn 0.4s ease-out",
        "spin-slow":       "spin 2s linear infinite",
      },
      keyframes: {
        slideInRight: {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceIn: {
          "0%":   { opacity: "0", transform: "scale(0.8)" },
          "60%":  { transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "gradient-rose":   "linear-gradient(135deg, #e91e63, #ef6c57)",
        "gradient-salmon": "linear-gradient(135deg, #ef6c57, #ff8a80)",
        "gradient-luxury": "linear-gradient(135deg, #e91e63, #ff8a80, #ef6c57)",
        "gradient-dark":   "linear-gradient(135deg, #0f0a1a, #1a1230)",
      },
      boxShadow: {
        rose:    "0 6px 24px rgba(233,30,99,0.35)",
        "rose-sm": "0 3px 12px rgba(233,30,99,0.25)",
        coral:   "0 6px 24px rgba(239,108,87,0.35)",
        luxury:  "0 12px 40px rgba(233,30,99,0.2)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-rtl"),
  ],
};

export default config;
