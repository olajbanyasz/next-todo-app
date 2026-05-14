import type { Meta, StoryObj } from '@storybook/react';
import TodoItem from './TodoItem';

const meta: Meta<typeof TodoItem> = {
  title: 'Components/TodoItem',
  component: TodoItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TodoItem>;

export const Active: Story = {
  args: {
    todo: {
      id: '1',
      title: 'Finish Storybook integration',
      completed: false,
    },
  },
};

export const Completed: Story = {
  args: {
    todo: {
      id: '2',
      title: 'Learn React 19 features',
      completed: true,
    },
  },
};
