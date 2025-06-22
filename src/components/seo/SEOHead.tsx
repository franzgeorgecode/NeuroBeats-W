import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'music.song' | 'music.album' | 'music.playlist';
  song?: {
    title: string;
    artist: string;
    album?: string;
    duration?: number;
    releaseDate?: string;
  };
  playlist?: {
    name: string;
    description: string;
    trackCount: number;
    creator: string;
  };
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'NeuroBeats - AI-Powered Music Streaming',
  description = 'Experience the future of music with AI-powered recommendations, immersive visualizations, and millions of high-quality tracks.',
  keywords = ['music', 'streaming', 'AI', 'playlist', 'songs', 'artists', 'albums'],
  image = '/og-image.png',
  url = window.location.href,
  type = 'website',
  song,
  playlist,
}) => {
  const siteName = 'NeuroBeats';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: siteName,
      description,
      url,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };

    if (song) {
      return {
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        name: song.title,
        byArtist: {
          '@type': 'MusicGroup',
          name: song.artist,
        },
        inAlbum: song.album ? {
          '@type': 'MusicAlbum',
          name: song.album,
        } : undefined,
        duration: song.duration ? `PT${song.duration}S` : undefined,
        datePublished: song.releaseDate,
      };
    }

    if (playlist) {
      return {
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        name: playlist.name,
        description: playlist.description,
        numTracks: playlist.trackCount,
        creator: {
          '@type': 'Person',
          name: playlist.creator,
        },
      };
    }

    return baseData;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="NeuroBeats" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@NeuroBeats" />
      <meta name="twitter:creator" content="@NeuroBeats" />

      {/* Music-specific Open Graph tags */}
      {song && (
        <>
          <meta property="music:musician\" content={song.artist} />
          <meta property="music:duration" content={song.duration?.toString()} />
          {song.album && <meta property="music:album\" content={song.album} />}
          {song.releaseDate && <meta property="music:release_date" content={song.releaseDate} />}
        </>
      )}

      {/* App-specific meta tags */}
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://deezerdevs-deezer.p.rapidapi.com" />
      <link rel="preconnect" href="https://openrouter.ai" />
      <link rel="preconnect" href="https://images.pexels.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </Helmet>
  );
};