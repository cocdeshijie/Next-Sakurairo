import type { Preview } from "@storybook/react";
import "@/app/globals.css";
import { withNextThemes } from "./StorybookThemeProvider";


const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
      withNextThemes({
          themes: {
              light: "light",
              dark: "dark",
              system: "system",
          },
          defaultTheme: "system",
      }),
  ]
};

export default preview;
