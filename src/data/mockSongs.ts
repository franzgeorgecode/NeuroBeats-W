// Datos mockeados garantizados para el onboarding
export interface MockSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  cover_url: string;
  preview_url: string;
}

export const CURATED_SONGS: MockSong[] = [
  // Pop Songs
  {
    id: 'pop-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Pop',
    duration: 200,
    cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'pop-2',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    genre: 'Pop',
    duration: 174,
    cover_url: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'pop-3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    genre: 'Pop',
    duration: 203,
    cover_url: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'pop-4',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    genre: 'Pop',
    duration: 178,
    cover_url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'pop-5',
    title: 'As It Was',
    artist: 'Harry Styles',
    genre: 'Pop',
    duration: 167,
    cover_url: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },

  // Rock Songs
  {
    id: 'rock-1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'Rock',
    duration: 355,
    cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'rock-2',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    genre: 'Rock',
    duration: 356,
    cover_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'rock-3',
    title: 'Thunderstruck',
    artist: 'AC/DC',
    genre: 'Rock',
    duration: 292,
    cover_url: 'https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },

  // Hip Hop Songs
  {
    id: 'hiphop-1',
    title: 'God\'s Plan',
    artist: 'Drake',
    genre: 'Hip Hop',
    duration: 198,
    cover_url: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'hiphop-2',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    genre: 'Hip Hop',
    duration: 177,
    cover_url: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'hiphop-3',
    title: 'Sicko Mode',
    artist: 'Travis Scott',
    genre: 'Hip Hop',
    duration: 312,
    cover_url: 'https://images.pexels.com/photos/1374516/pexels-photo-1374516.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },

  // Electronic Songs
  {
    id: 'electronic-1',
    title: 'Midnight City',
    artist: 'M83',
    genre: 'Electronic',
    duration: 244,
    cover_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'electronic-2',
    title: 'One More Time',
    artist: 'Daft Punk',
    genre: 'Electronic',
    duration: 320,
    cover_url: 'https://images.pexels.com/photos/1389460/pexels-photo-1389460.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'electronic-3',
    title: 'Strobe',
    artist: 'Deadmau5',
    genre: 'Electronic',
    duration: 634,
    cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },

  // R&B Songs
  {
    id: 'rnb-1',
    title: 'Adorn',
    artist: 'Miguel',
    genre: 'R&B',
    duration: 221,
    cover_url: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'rnb-2',
    title: 'Best Part',
    artist: 'Daniel Caesar ft. H.E.R.',
    genre: 'R&B',
    duration: 207,
    cover_url: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },

  // Jazz Songs
  {
    id: 'jazz-1',
    title: 'Take Five',
    artist: 'Dave Brubeck',
    genre: 'Jazz',
    duration: 324,
    cover_url: 'https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'jazz-2',
    title: 'So What',
    artist: 'Miles Davis',
    genre: 'Jazz',
    duration: 562,
    cover_url: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },

  // Indie Songs
  {
    id: 'indie-1',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    genre: 'Indie',
    duration: 238,
    cover_url: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  },
  {
    id: 'indie-2',
    title: 'Mr. Brightside',
    artist: 'The Killers',
    genre: 'Indie',
    duration: 222,
    cover_url: 'https://images.pexels.com/photos/1374516/pexels-photo-1374516.jpeg?auto=compress&cs=tinysrgb&w=300',
    preview_url: 'https://www.soundjay.com/misc/sounds-765.mp3'
  }
];

export const getSongsByGenres = (genres: string[]): MockSong[] => {
  if (genres.length === 0) {
    // Return popular songs if no genres selected
    return CURATED_SONGS.slice(0, 15);
  }

  const matchingSongs: MockSong[] = [];
  
  genres.forEach(genre => {
    const genreSongs = CURATED_SONGS.filter(song => 
      song.genre === genre
    ).slice(0, 4); // Max 4 songs per genre
    matchingSongs.push(...genreSongs);
  });

  // If we don't have enough songs, fill with popular ones
  if (matchingSongs.length < 15) {
    const additionalSongs = CURATED_SONGS
      .filter(song => !matchingSongs.some(ms => ms.id === song.id))
      .slice(0, 15 - matchingSongs.length);
    matchingSongs.push(...additionalSongs);
  }

  return matchingSongs;
};

export const getAllSongs = (): MockSong[] => {
  return CURATED_SONGS;
};