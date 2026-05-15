import type { Meta, StoryObj } from '@storybook/react';
import UserItem from './UserItem';

const meta: Meta<typeof UserItem> = {
  title: 'Components/UserItem',
  component: UserItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <table className="w-full border-collapse">
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserItem>;

export const RegularUser: Story = {
  args: {
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'user',
      deleted: false,
      lastLoginAt: new Date(),
      todoCount: 5,
    },
  },
};

export const AdminUser: Story = {
  args: {
    user: {
      id: '2',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      deleted: false,
      lastLoginAt: new Date(),
      todoCount: 12,
    },
  },
};

export const DeletedUser: Story = {
  args: {
    user: {
      id: '3',
      email: 'deleted@example.com',
      name: 'Old User',
      role: 'user',
      deleted: true,
      lastLoginAt: null,
      todoCount: 0,
    },
  },
};
