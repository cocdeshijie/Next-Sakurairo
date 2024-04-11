import type { Meta, StoryObj } from "@storybook/react";
import Header  from "@/components/Header/index";
import { fn } from "@storybook/test";

const meta = {
    title: 'Header',
    component: Header,
    tags: ['autodocs'],
    args: {
    },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
