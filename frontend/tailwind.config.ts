import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // UCReCENT brand palette (from supplied brand board)
        navy: {
          DEFAULT: "#07386C",
          dark: "#052a52",
          light: "#0e4d92",
        },
        lake: {
          DEFAULT: "#168CCB",
          dark: "#0f6fa3",
          light: "#4aa9d8",
        },
        forest: {
          DEFAULT: "#168044",
          dark: "#0f6134",
          light: "#2a9d5c",
        },
        leaf: {
          DEFAULT: "#8BD038",
          dark: "#6cab26",
          light: "#a5dd62",
        },
        sun: {
          DEFAULT: "#FFC107",
          dark: "#d9a406",
          light: "#ffd154",
        },
        cream: "#FDF8EE",
        earth: "#5C4A32",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "80rem",
      },
    },
  },
  plugins: [],
};
export default config;
