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
          50: "#FFF0F6",
          100: "#FFD6E1",
          200: "#FF9EA8",
          300: "#FF756B",
          400: "#FF6333",
          500: "#FF6600",
          600: "#CC3000",
          700: "#940A00",
          800: "#61000A",
          900: "#29000B",
          950: "#0F0007"
        }
      }
    }
  },
  plugins: [],
};
export default config;
