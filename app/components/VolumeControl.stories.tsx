import type { Meta, StoryObj } from '@storybook/react';
import VolumeControl from './VolumeControl';

const meta: Meta<typeof VolumeControl> = {
  title: 'Components/VolumeControl',
  component: VolumeControl,
  tags: ['autodocs'],
  argTypes: {
    onIncrease: { action: 'increased' },
    onDecrease: { action: 'decreased' },
  },
};

export default meta;
type Story = StoryObj<typeof VolumeControl>;

export const Low: Story = {
  args: {
    volume: 10,
  },
};

export const Medium: Story = {
  args: {
    volume: 50,
  },
};

export const High: Story = {
  args: {
    volume: 90,
  },
};
