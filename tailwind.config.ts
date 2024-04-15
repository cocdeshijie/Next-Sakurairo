import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      "colors": {
        "theme": {
          50: "#F1F1F4",
          100: "#DBDEEB",
          200: "#B0C4E3",
          300: "#79B4E2",
          400: "#3CB9E7",
          500: "#FF6600",
          600: "#1688B1",
          700: "#1D5986",
          800: "#213A5E",
          900: "#1E2438",
          950: "#202127"
        }
      },
      clipPath: {
        articleImage: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)",
      }
    }
  },
  plugins: [require('tailwind-clip-path')],
};
export default config;
