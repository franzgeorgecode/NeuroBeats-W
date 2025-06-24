import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AIPlaylistService, { 
  AIPlaylistRequest, 
  AIPlaylistResponse, 
  GeneratedPlaylist,
  AITrackRecommendation 
} from '../services/aiPlaylistService';
import { useDeezer } from './useDeezer';
import { useUser } from './useUser';
import { useToast } from './useToast';

export const useAIPlaylist = () => {
  const queryClient = useQueryClient();
  const aiService = new AIPlaylistService(queryClient);
  const { deezerService, useSearchSongs } = useDeezer();
  const { profile, preferences } = useUser();
  const { showToast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const createRequestFromUserData = (): AIPlaylistRequest => {
    const currentHour = new Date().getHours();
    let mood: AIPlaylistRequest['mood'] = 'chill';
    let timeOfDay: AIPlaylistRequest['timeOfDay'] = 'afternoon';

    // Determine time of day
    if (currentHour >= 6 && currentHour < 12) timeOfDay = 'morning';
    else if (currentHour >= 12 && currentHour < 17) timeOfDay = 'afternoon';
    else if (currentHour >= 17 && currentHour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Infer mood from time
    if (timeOfDay === 'morning') mood = 'energetic';
    else if (timeOfDay === 'afternoon') mood = 'focus';
    else mood = 'chill';

    return {
      favoriteGenres: preferences?.favorite_genres || ['Pop', 'Rock', 'Electronic'],
      recentTracks: (preferences?.selected_songs as any[])?.map(song => ({
        title: song.title || 'Unknown',
        artist: song.artist || 'Unknown',
        genre: song.genre || 'Unknown',
        energy: song.energy || 5,
      })) || [],
      mood,
      timeOfDay,
      playlistLength: 18,
      includeNewDiscoveries: true,
    };
  };

  const searchAndMatchTracks = async (
    recommendations: AITrackRecommendation[]
  ): Promise<GeneratedPlaylist['tracks']> => {
    const matchedTracks: GeneratedPlaylist['tracks'] = [];
    console.log('🎯 Starting AI playlist track matching with Deezer API...');
    
    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      setGenerationProgress(((i + 1) / recommendations.length) * 80 + 20); // 20-100%
      setCurrentStep(`Searching Deezer for "${rec.title}" by ${rec.artist}...`);

      try {
        // PRIORIZAR BÚSQUEDA EN DEEZER API REAL
        console.log(`🔍 Searching Deezer API for: "${rec.artist} - ${rec.title}"`);
        
        // Try different search queries for better matching
        const searchQueries = [
          `${rec.artist} ${rec.title}`,           // Exact match
          `${rec.title} ${rec.artist}`,           // Title first
          `${rec.artist}`,                        // Just artist
          `${rec.title}`                          // Just title
        ];
        
        let bestMatch = null;
        let searchResults = null;
        
        // Try each search query until we find a good match
        for (const query of searchQueries) {
          try {
            searchResults = await deezerService.searchSongs(query, 10);
            
            if (searchResults.data && searchResults.data.length > 0) {
              // Look for exact or close matches
              const exactMatch = searchResults.data.find(track => {
                const trackTitle = track.title.toLowerCase();
                const trackArtist = track.artist.name.toLowerCase();
                const recTitle = rec.title.toLowerCase();
                const recArtist = rec.artist.toLowerCase();
                
                const titleMatch = trackTitle.includes(recTitle) || recTitle.includes(trackTitle);
                const artistMatch = trackArtist.includes(recArtist) || recArtist.includes(trackArtist);
                
                return titleMatch && artistMatch;
              });
              
              if (exactMatch) {
                bestMatch = exactMatch;
                console.log(`✅ Exact match found: "${exactMatch.title}" by ${exactMatch.artist.name}`);
                break;
              }
              
              // If no exact match, find the first track with preview
              const trackWithPreview = searchResults.data.find(track => 
                track.preview && track.preview.length > 0
              );
              
              if (trackWithPreview && !bestMatch) {
                bestMatch = trackWithPreview;
                console.log(`🎵 Found track with preview: "${trackWithPreview.title}" by ${trackWithPreview.artist.name}`);
              }
            }
          } catch (queryError) {
            console.warn(`Search query "${query}" failed:`, queryError);
            continue;
          }
        }
        
        if (bestMatch && bestMatch.preview) {
          const convertedTrack = deezerService.convertToTrack(bestMatch);
          console.log(`🎉 Adding Deezer track: "${convertedTrack.title}" with preview: ${convertedTrack.audio_url}`);
          
          matchedTracks.push({
            ...convertedTrack,
            energy: rec.energy,
            aiRecommended: true,
            reasoning: rec.reasoning,
          });
        } else {
          // Try to get any similar track from the genre/style
          console.log(`🔄 No exact match, searching for similar ${rec.genre} tracks...`);
          
          try {
            const genreResults = await deezerService.getSongsByGenre(rec.genre, 5);
            if (genreResults.data && genreResults.data.length > 0) {
              const genreTrack = genreResults.data.find(track => track.preview) || genreResults.data[0];
              const convertedTrack = deezerService.convertToTrack(genreTrack);
              
              console.log(`🎨 Using ${rec.genre} alternative: "${convertedTrack.title}"`);
              
              matchedTracks.push({
                ...convertedTrack,
                energy: rec.energy,
                aiRecommended: true,
                reasoning: `Similar ${rec.genre} track to ${rec.title} by ${rec.artist}`,
              });
            } else {
              throw new Error('No genre alternatives found');
            }
          } catch (genreError) {
            console.warn('Genre search failed, using guaranteed fallback');
            
            // Usar fallback garantizado desde guaranteedTracks
            const guaranteedTrack = await import('../data/guaranteedTracks').then(module => {
              const tracks = module.getAIPlaylistTracks('energetic');
              return tracks[i % tracks.length] || tracks[0];
            });
            
            const convertedTrack = deezerService.convertToTrack(guaranteedTrack);
            console.log(`📦 Using guaranteed fallback: "${convertedTrack.title}"`);
            
            matchedTracks.push({
              ...convertedTrack,
              energy: rec.energy,
              aiRecommended: true,
              reasoning: rec.reasoning || 'AI recommended track',
            });
          }
        }
      } catch (error) {
        console.error(`❌ Error searching for ${rec.title}:`, error);
        
        // Fallback final: usar track garantizado
        try {
          const guaranteedTrack = await import('../data/guaranteedTracks').then(module => {
            const tracks = module.getAIPlaylistTracks('energetic');
            return tracks[i % tracks.length] || tracks[0];
          });
          
          const convertedTrack = deezerService.convertToTrack(guaranteedTrack);
          console.log(`🛡️ Error fallback: "${convertedTrack.title}"`);
          
          matchedTracks.push({
            ...convertedTrack,
            energy: rec.energy,
            aiRecommended: true,
            reasoning: rec.reasoning || 'AI recommended track (fallback)',
          });
        } catch (fallbackError) {
          console.error('Even fallback failed:', fallbackError);
          // Last resort placeholder
          matchedTracks.push({
            id: `ai-${i}`,
            title: rec.title,
            artist: rec.artist,
            album: 'AI Recommendation',
            duration: 180,
            cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
            audio_url: 'https://file-examples.com/storage/fe8c8c2d3c0b9c2d7a2c8a5/2017/11/file_example_MP3_700KB.mp3',
            genre: rec.genre,
            release_date: '',
            plays_count: 0,
            likes_count: 0,
            created_at: new Date().toISOString(),
            energy: rec.energy,
            aiRecommended: true,
            reasoning: rec.reasoning,
          });
        }
      }

      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    console.log(`🎯 AI Playlist matching complete: ${matchedTracks.length} tracks with ${matchedTracks.filter(t => t.audio_url && t.audio_url.length > 0).length} playable previews`);
    return matchedTracks;
  };

  const generatePlaylist = async (
    customRequest?: Partial<AIPlaylistRequest>
  ): Promise<GeneratedPlaylist> => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Analyzing your music taste...');

    try {
      const request = customRequest 
        ? { ...createRequestFromUserData(), ...customRequest }
        : createRequestFromUserData();

      setGenerationProgress(10);
      setCurrentStep('Generating AI recommendations...');

      // Generate recommendations from AI
      const aiResponse = await aiService.generatePlaylist(request);
      
      setGenerationProgress(20);
      setCurrentStep('Searching for tracks...');

      // Search and match tracks on Deezer
      const matchedTracks = await searchAndMatchTracks(aiResponse.recommendations);

      setGenerationProgress(100);
      setCurrentStep('Finalizing playlist...');

      const playlist: GeneratedPlaylist = {
        id: `ai-playlist-${Date.now()}`,
        name: aiResponse.playlistName,
        description: aiResponse.description,
        tracks: matchedTracks,
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        totalDuration: matchedTracks.reduce((sum, track) => sum + track.duration, 0),
        averageEnergy: aiResponse.totalEnergy,
        dominantMood: aiResponse.dominantMood,
      };

      showToast(`Generated "${playlist.name}" with ${playlist.tracks.length} tracks!`, 'success');
      return playlist;

    } catch (error) {
      console.error('Error generating playlist:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to generate playlist',
        'error'
      );
      throw error;
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep('');
    }
  };

  const regeneratePlaylist = async (
    originalRequest: AIPlaylistRequest,
    feedback?: {
      likedTracks?: string[];
      dislikedTracks?: string[];
      adjustEnergy?: 'higher' | 'lower';
      adjustMood?: string;
    }
  ): Promise<GeneratedPlaylist> => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Regenerating with your feedback...');

    try {
      const aiResponse = await aiService.regeneratePlaylist(originalRequest, feedback);
      const matchedTracks = await searchAndMatchTracks(aiResponse.recommendations);

      const playlist: GeneratedPlaylist = {
        id: `ai-playlist-${Date.now()}`,
        name: aiResponse.playlistName,
        description: aiResponse.description,
        tracks: matchedTracks,
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        totalDuration: matchedTracks.reduce((sum, track) => sum + track.duration, 0),
        averageEnergy: aiResponse.totalEnergy,
        dominantMood: aiResponse.dominantMood,
      };

      showToast('Playlist regenerated successfully!', 'success');
      return playlist;

    } catch (error) {
      console.error('Error regenerating playlist:', error);
      showToast('Failed to regenerate playlist', 'error');
      throw error;
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep('');
    }
  };

  const replaceSingleTrack = async (
    playlist: GeneratedPlaylist,
    trackIndex: number,
    originalRequest: AIPlaylistRequest
  ): Promise<GeneratedPlaylist> => {
    setIsGenerating(true);
    setCurrentStep('Finding a better track...');

    try {
      const aiResponse: AIPlaylistResponse = {
        recommendations: playlist.tracks.map(track => ({
          artist: track.artist,
          title: track.title,
          genre: track.genre || 'Unknown',
          energy: track.energy || 5,
          mood: playlist.dominantMood,
          reasoning: track.reasoning,
        })),
        playlistName: playlist.name,
        description: playlist.description,
        totalEnergy: playlist.averageEnergy,
        dominantMood: playlist.dominantMood,
      };

      const newRecommendation = await aiService.replaceSingleTrack(
        aiResponse,
        trackIndex,
        originalRequest
      );

      // Search for the new track
      const searchResults = await deezerService.searchSongs(
        `${newRecommendation.artist} ${newRecommendation.title}`,
        3
      );

      let newTrack: GeneratedPlaylist['tracks'][0];

      if (searchResults.data && searchResults.data.length > 0) {
        const bestMatch = searchResults.data[0];
        const convertedTrack = deezerService.convertToTrack(bestMatch);
        newTrack = {
          ...convertedTrack,
          energy: newRecommendation.energy,
          aiRecommended: true,
          reasoning: newRecommendation.reasoning,
        };
      } else {
        newTrack = {
          id: `ai-replacement-${Date.now()}`,
          title: newRecommendation.title,
          artist: newRecommendation.artist,
          album: 'AI Recommendation',
          duration: 180,
          cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
          audio_url: '',
          genre: newRecommendation.genre,
          release_date: '',
          plays_count: 0,
          likes_count: 0,
          created_at: new Date().toISOString(),
          energy: newRecommendation.energy,
          aiRecommended: true,
          reasoning: newRecommendation.reasoning,
        };
      }

      const updatedTracks = [...playlist.tracks];
      updatedTracks[trackIndex] = newTrack;

      const updatedPlaylist: GeneratedPlaylist = {
        ...playlist,
        tracks: updatedTracks,
        totalDuration: updatedTracks.reduce((sum, track) => sum + track.duration, 0),
      };

      showToast('Track replaced successfully!', 'success');
      return updatedPlaylist;

    } catch (error) {
      console.error('Error replacing track:', error);
      showToast('Failed to replace track', 'error');
      throw error;
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  return {
    generatePlaylist,
    regeneratePlaylist,
    replaceSingleTrack,
    isGenerating,
    generationProgress,
    currentStep,
    createRequestFromUserData,
  };
};