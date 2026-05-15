import type { Meta, StoryObj } from '@storybook/react';
import UserFilter from './UserFilter';

const meta: Meta<typeof UserFilter> = {
  title: 'Components/UserFilter',
  component: UserFilter,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/user-management',
        query: { deleted: 'active', email: '' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserFilter>;

export const Default: Story = {};

export const WithEmail: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { email: 'test@example.com' },
      },
    },
  },
};

export const DeletedOnly: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { deleted: 'deleted' },
      },
    },
  },
};
