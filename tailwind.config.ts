import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {
      "colors": {
        "theme": {
          50: "#F8E5FF",
          100: "#FFCCFC",
          200: "#FF99D6",
          300: "#FF668F",
          400: "#FF4133",
          500: "#FF6600",
          600: "#CC0E00",
          700: "#990029",
          800: "#66003D",
          900: "#330030",
          950: "#130019"
        }
      }
    }
  },
  plugins: [],
};
export default config;
