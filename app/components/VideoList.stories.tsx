import type { Meta, StoryObj } from '@storybook/react';
import VideoList from './VideoList';
import { LoadingProvider } from '@/app/contexts/LoadingProvider';

const meta: Meta<typeof VideoList> = {
  title: 'Components/VideoList',
  component: VideoList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LoadingProvider>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
          <Story />
        </div>
      </LoadingProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VideoList>;

export const Empty: Story = {
  args: {
    videos: [],
  },
};

export const WithVideos: Story = {
  args: {
    videos: [
      {
        id: '1',
        title: 'Nature Timelapse',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        title: 'Project Demo',
        url: 'https://www.w3schools.com/html/movie.mp4',
        createdAt: new Date('2024-02-15'),
      },
    ],
  },
};
