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
          50: "#F1F3F4",
          100: "#DEEDE9",
          200: "#B4E4BB",
          300: "#ACE382",
          400: "#E9E649",
          500: "#FF6600",
          600: "#CCC919",
          700: "#5DA725",
          800: "#2E843B",
          900: "#366357",
          950: "#404A4F"
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
