import type { Config } from "tailwindcss";
import { generateColorPalette } from "./src/utils/themeColor";
import site_config from "./.velite/site_config.json"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      "colors": {
        "theme": generateColorPalette(site_config.site_info.theme_color, site_config.site_info.theme_color_hue_shift)
      },
      clipPath: {
        articleImageRight: "polygon(5% 0, 100% 0, 100% 100%, 0 100%)",
        articleImageLeft: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
      }
    }
  },
  plugins: [
      require("tailwind-clip-path"),
      require("@tailwindcss/typography"),
  ],
};
export default config;
