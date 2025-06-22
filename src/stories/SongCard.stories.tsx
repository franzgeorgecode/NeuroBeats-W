import type { Meta, StoryObj } from '@storybook/react';
import { SongCard } from '../components/ui/SongCard';

const meta: Meta<typeof SongCard> = {
  title: 'Components/SongCard',
  component: SongCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'list'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockSong = {
  id: '1',
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  duration: 200,
  cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
  audio_url: 'https://example.com/audio.mp3',
  plays_count: 1500000,
};

export const Default: Story = {
  args: {
    song: mockSong,
  },
};

export const Compact: Story = {
  args: {
    song: mockSong,
    variant: 'compact',
  },
};

export const List: Story = {
  args: {
    song: mockSong,
    variant: 'list',
    index: 0,
    showIndex: true,
  },
};

export const WithoutCover: Story = {
  args: {
    song: {
      ...mockSong,
      cover_url: undefined,
    },
  },
};

export const LongTitle: Story = {
  args: {
    song: {
      ...mockSong,
      title: 'This is a Very Long Song Title That Should Be Truncated',
      artist: 'Artist with a Very Long Name That Should Also Be Truncated',
    },
  },
};