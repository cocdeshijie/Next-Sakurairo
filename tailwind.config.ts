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
          100: "#E6DEED",
          200: "#E4B4E4",
          300: "#E382B6",
          400: "#E94954",
          500: "#FF6600",
          600: "#C31824",
          700: "#972160",
          800: "#6D266D",
          900: "#392749",
          950: "#2C2C35"
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
