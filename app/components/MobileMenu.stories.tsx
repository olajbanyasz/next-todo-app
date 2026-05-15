import type { Meta, StoryObj } from '@storybook/react';
import { MobileMenu } from './MobileMenu';

const meta: Meta<typeof MobileMenu> = {
  title: 'Components/MobileMenu',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 h-[300px]">
        <div className="relative border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MobileMenu>;

export const Default: Story = {
  args: {
    userRole: 'user',
    userEmail: 'user@example.com',
  },
};

export const Admin: Story = {
  args: {
    userRole: 'admin',
    userEmail: 'admin@example.com',
  },
};

export const Guest: Story = {
  args: {
    userRole: undefined,
    userEmail: null,
  },
};
