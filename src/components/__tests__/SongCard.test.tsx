import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongCard } from '../ui/SongCard';
import { usePlayerStore } from '../../stores/playerStore';

// Mock the player store
jest.mock('../../stores/playerStore');
const mockUsePlayerStore = usePlayerStore as jest.MockedFunction<typeof usePlayerStore>;

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockSong = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180,
  cover_url: 'https://example.com/cover.jpg',
  audio_url: 'https://example.com/audio.mp3',
  plays_count: 1000,
};

const mockPlayerStore = {
  currentTrack: null,
  isPlaying: false,
  setCurrentTrack: jest.fn(),
  setIsPlaying: jest.fn(),
};

describe('SongCard', () => {
  beforeEach(() => {
    mockUsePlayerStore.mockReturnValue(mockPlayerStore as any);
    jest.clearAllMocks();
  });

  it('renders song information correctly', () => {
    render(<SongCard song={mockSong} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('calls onPlay when play button is clicked', () => {
    const onPlay = jest.fn();
    render(<SongCard song={mockSong} onPlay={onPlay} />);
    
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    expect(onPlay).toHaveBeenCalledWith(mockSong);
  });

  it('shows pause icon when song is currently playing', () => {
    mockUsePlayerStore.mockReturnValue({
      ...mockPlayerStore,
      currentTrack: { ...mockSong, genre: '', release_date: '', likes_count: 0, created_at: '' },
      isPlaying: true,
    } as any);

    render(<SongCard song={mockSong} />);
    
    // The pause icon should be visible when the song is playing
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    const songWithLongDuration = { ...mockSong, duration: 3661 }; // 1 hour, 1 minute, 1 second
    render(<SongCard song={songWithLongDuration} />);
    
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });

  it('handles missing cover image gracefully', () => {
    const songWithoutCover = { ...mockSong, cover_url: undefined };
    render(<SongCard song={songWithoutCover} />);
    
    // Should render a placeholder music icon
    expect(screen.getByTestId('music-placeholder')).toBeInTheDocument();
  });

  it('renders in compact variant correctly', () => {
    render(<SongCard song={mockSong} variant="compact" />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('shows index when specified', () => {
    render(<SongCard song={mockSong} variant="list" index={5} showIndex />);
    
    expect(screen.getByText('06')).toBeInTheDocument();
  });
});