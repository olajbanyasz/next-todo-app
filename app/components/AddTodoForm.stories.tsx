import type { Meta, StoryObj } from '@storybook/react';
import AddTodoForm from './AddTodoForm';

const meta: Meta<typeof AddTodoForm> = {
  title: 'Components/AddTodoForm',
  component: AddTodoForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 max-w-xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AddTodoForm>;

export const Default: Story = {
  args: {},
};
