import type { Meta, StoryObj } from '@storybook/react';
import { NavLink } from './NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Components/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {
  args: {
    href: '/todos',
    children: 'Todos',
  },
};

export const Active: Story = {
  args: {
    href: '/todos',
    children: 'Todos',
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/todos',
      },
    },
  },
};
