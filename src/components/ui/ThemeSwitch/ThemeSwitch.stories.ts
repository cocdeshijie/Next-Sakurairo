import type { Meta, StoryObj } from "@storybook/react";
import ThemeSwitch from "@/components/ui/ThemeSwitch/index";
import { fn } from "@storybook/test";

const meta = {
    title: 'ThemeSwitch',
    component: ThemeSwitch,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered'
    },
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};