import type { Meta, StoryObj } from '@storybook/react';
import TodoFilter from './TodoFilter';

const meta: Meta<typeof TodoFilter> = {
  title: 'Components/TodoFilter',
  component: TodoFilter,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/todos',
        query: { filter: 'all' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoFilter>;

export const Default: Story = {};

export const Active: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { filter: 'active' },
      },
    },
  },
};

export const Completed: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { filter: 'completed' },
      },
    },
  },
};
