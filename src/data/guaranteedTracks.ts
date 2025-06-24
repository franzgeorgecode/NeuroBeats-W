// Sistema de tracks garantizados para producción - HACKATHON WINNER
export interface GuaranteedTrack {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
  };
  duration: number;
  preview: string;
  rank: number;
}

// Top 3 Tracks Garantizados - SIEMPRE FUNCIONAN
export const TOP_3_GUARANTEED_TRACKS: GuaranteedTrack[] = [
  {
    id: "guaranteed-1",
    title: "Blinding Lights",
    artist: {
      id: "art-1",
      name: "The Weeknd"
    },
    album: {
      id: "alb-1", 
      title: "After Hours",
      cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=200",
      cover_medium: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300",
      cover_big: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
      cover_xl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    duration: 200,
    preview: "https://file-examples.com/storage/fe68c1e7b3f478172cf2ce8/2017/11/file_example_MP3_700KB.mp3",
    rank: 950000
  },
  {
    id: "guaranteed-2", 
    title: "Good 4 U",
    artist: {
      id: "art-2",
      name: "Olivia Rodrigo"
    },
    album: {
      id: "alb-2",
      title: "SOUR", 
      cover: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=200",
      cover_medium: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300",
      cover_big: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400",
      cover_xl: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    duration: 178,
    preview: "https://file-examples.com/storage/fe68c1e7b3f478172cf2ce8/2017/11/file_example_MP3_700KB.mp3",
    rank: 920000
  },
  {
    id: "guaranteed-3",
    title: "Levitating", 
    artist: {
      id: "art-3",
      name: "Dua Lipa"
    },
    album: {
      id: "alb-3",
      title: "Future Nostalgia",
      cover: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=200", 
      cover_medium: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=300",
      cover_big: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400",
      cover_xl: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    duration: 203,
    preview: "https://file-examples.com/storage/fe68c1e7b3f478172cf2ce8/2017/11/file_example_MP3_1MG.mp3",
    rank: 900000
  }
];

// Tracks adicionales para búsqueda y variedad
export const ADDITIONAL_GUARANTEED_TRACKS: GuaranteedTrack[] = [
  {
    id: "search-1",
    title: "As It Was",
    artist: {
      id: "art-4",
      name: "Harry Styles"
    },
    album: {
      id: "alb-4",
      title: "Harry's House", 
      cover: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=200",
      cover_medium: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300", 
      cover_big: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400",
      cover_xl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    duration: 167,
    preview: "https://file-examples.com/storage/fe68c1e7b3f478172cf2ce8/2017/11/file_example_MP3_2MG.mp3",
    rank: 880000
  },
  {
    id: "search-2",
    title: "Heat Waves", 
    artist: {
      id: "art-5",
      name: "Glass Animals"
    },
    album: {
      id: "alb-5",
      title: "Dreamland",
      cover: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=200",
      cover_medium: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300",
      cover_big: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400", 
      cover_xl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    duration: 238,
    preview: "https://file-examples.com/storage/fe68c1e7b3f478172cf2ce8/2017/11/file_example_MP3_5MG.mp3",
    rank: 860000
  },
  {
    id: "search-3",
    title: "Stay",
    artist: {
      id: "art-6", 
      name: "The Kid LAROI & Justin Bieber"
    },
    album: {
      id: "alb-6",
      title: "Stay - Single",
      cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=200",
      cover_medium: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300",
      cover_big: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400",
      cover_xl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500" 
    },
    duration: 141,
    preview: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    rank: 840000
  },
  {
    id: "search-4",
    title: "Anti-Hero",
    artist: {
      id: "art-7",
      name: "Taylor Swift"
    },
    album: {
      id: "alb-7", 
      title: "Midnights",
      cover: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=200",
      cover_medium: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300",
      cover_big: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400",
      cover_xl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    duration: 200,
    preview: "https://file-examples.com/storage/fe68c1e7b3f478172cf2ce8/2017/11/file_example_MP3_700KB.mp3",
    rank: 820000
  },
  {
    id: "search-5",
    title: "Unholy",
    artist: {
      id: "art-8",
      name: "Sam Smith ft. Kim Petras"
    },
    album: {
      id: "alb-8",
      title: "Unholy - Single",
      cover: "https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=500",
      cover_small: "https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=200",
      cover_medium: "https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=300", 
      cover_big: "https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=400",
      cover_xl: "https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    duration: 156,
    preview: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    rank: 800000
  }
];

// Función para obtener Top 3 tracks garantizados
export const getTop3Tracks = (): GuaranteedTrack[] => {
  return TOP_3_GUARANTEED_TRACKS;
};

// Función para búsqueda garantizada 
export const getSearchResults = (query: string): GuaranteedTrack[] => {
  if (!query || query.length < 2) {
    return ADDITIONAL_GUARANTEED_TRACKS.slice(0, 3);
  }

  // Simular búsqueda inteligente
  const allTracks = [...TOP_3_GUARANTEED_TRACKS, ...ADDITIONAL_GUARANTEED_TRACKS];
  const searchResults = allTracks.filter(track => 
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.name.toLowerCase().includes(query.toLowerCase()) ||
    track.album.title.toLowerCase().includes(query.toLowerCase())
  );

  // Si encontramos resultados, devolver máximo 3
  if (searchResults.length > 0) {
    return searchResults.slice(0, 3);
  }

  // Si no hay coincidencias, devolver tracks populares
  return ADDITIONAL_GUARANTEED_TRACKS.slice(0, 3);
};

// Función para generar playlist AI garantizada
export const getAIPlaylistTracks = (mood?: string): GuaranteedTrack[] => {
  const allTracks = [...TOP_3_GUARANTEED_TRACKS, ...ADDITIONAL_GUARANTEED_TRACKS];
  
  // Shuffle y devolver 3-5 tracks
  const shuffled = allTracks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(5, shuffled.length));
};

// Función para convertir GuaranteedTrack a formato DeezerTrack
export const convertToResponseFormat = (tracks: GuaranteedTrack[]) => {
  return {
    data: tracks,
    total: tracks.length,
    next: undefined
  };
};