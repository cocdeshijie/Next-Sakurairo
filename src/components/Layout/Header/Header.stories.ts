import type { Meta, StoryObj } from "@storybook/react";
import Home from "@/components/Layout/Home";
import { fn } from "@storybook/test";

const meta = {
    title: 'Home',
    component: Home,
    tags: ['autodocs'],
    args: {
    },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
