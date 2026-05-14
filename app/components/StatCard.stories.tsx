import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['blue', 'purple', 'zinc', 'green', 'emerald', 'amber', 'red'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Blue: Story = {
  args: {
    title: 'Total Todos',
    value: 12,
    icon: '📝',
    color: 'blue',
  },
};

export const Green: Story = {
  args: {
    title: 'Completed',
    value: 8,
    icon: '✅',
    color: 'green',
  },
};

export const Red: Story = {
  args: {
    title: 'Overdue',
    value: 3,
    icon: '⚠️',
    color: 'red',
  },
};
