import type { Meta, StoryObj } from "@storybook/react";
import Footer from "@/components/Layout/Footer/index";
import { fn } from "@storybook/test";

const meta = {
    title: 'Footer',
    component: Footer,
    tags: ['autodocs'],
    args: {
    },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
