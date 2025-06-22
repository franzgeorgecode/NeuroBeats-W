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
    
    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      setGenerationProgress(((i + 1) / recommendations.length) * 80 + 20); // 20-100%
      setCurrentStep(`Finding "${rec.title}" by ${rec.artist}...`);

      try {
        // Search for the track on Deezer
        const searchQuery = `${rec.artist} ${rec.title}`;
        const searchResults = await deezerService.searchSongs(searchQuery, 5);
        
        if (searchResults.data && searchResults.data.length > 0) {
          // Find the best match
          const bestMatch = searchResults.data.find(track => 
            track.artist.name.toLowerCase().includes(rec.artist.toLowerCase()) ||
            track.title.toLowerCase().includes(rec.title.toLowerCase())
          ) || searchResults.data[0];

          const convertedTrack = deezerService.convertToTrack(bestMatch);
          
          matchedTracks.push({
            ...convertedTrack,
            energy: rec.energy,
            aiRecommended: true,
            reasoning: rec.reasoning,
          });
        } else {
          // If no match found, create a placeholder
          matchedTracks.push({
            id: `ai-${i}`,
            title: rec.title,
            artist: rec.artist,
            album: 'AI Recommendation',
            duration: 180, // 3 minutes default
            cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
            audio_url: '', // No preview available
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
      } catch (error) {
        console.error(`Error searching for ${rec.title}:`, error);
        // Add placeholder track
        matchedTracks.push({
          id: `ai-${i}`,
          title: rec.title,
          artist: rec.artist,
          album: 'AI Recommendation',
          duration: 180,
          cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
          audio_url: '',
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

      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

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