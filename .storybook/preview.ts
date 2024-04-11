import type { Preview } from "@storybook/react";
import "@/app/globals.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [withThemeByDataAttribute({
      themes: {
          // nameOfTheme: 'dataAttributeForTheme',
          light: 'light',
          dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-mode',
  })]
};

export default preview;
