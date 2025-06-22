import { QueryClient } from '@tanstack/react-query';

export interface AIPlaylistRequest {
  favoriteGenres: string[];
  recentTracks: Array<{
    title: string;
    artist: string;
    genre?: string;
    energy?: number;
  }>;
  mood?: 'energetic' | 'chill' | 'focus' | 'party' | 'workout' | 'sleep';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  playlistLength?: number;
  excludeArtists?: string[];
  includeNewDiscoveries?: boolean;
}

export interface AITrackRecommendation {
  artist: string;
  title: string;
  genre: string;
  energy: number; // 1-10 scale
  mood: string;
  reasoning?: string;
}

export interface AIPlaylistResponse {
  recommendations: AITrackRecommendation[];
  playlistName: string;
  description: string;
  totalEnergy: number;
  dominantMood: string;
}

export interface GeneratedPlaylist {
  id: string;
  name: string;
  description: string;
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    cover_url?: string;
    audio_url: string;
    genre?: string;
    energy?: number;
    aiRecommended: boolean;
    reasoning?: string;
  }>;
  aiGenerated: boolean;
  createdAt: string;
  totalDuration: number;
  averageEnergy: number;
  dominantMood: string;
}

class AIPlaylistService {
  private baseURL = 'https://openrouter.ai/api/v1';
  private apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  private queryClient: QueryClient;

  // Free models available on OpenRouter
  private models = {
    primary: 'microsoft/wizardlm-2-8x22b', // Free tier model
    fallback: 'meta-llama/llama-3.1-8b-instruct:free', // Backup free model
  };

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  private async makeRequest<T>(
    messages: Array<{ role: string; content: string }>,
    model: string = this.models.primary
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'NeuroBeats AI Playlist Generator',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter configuration.');
      }
      throw new Error(`AI service error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from AI service');
    }

    return data.choices[0].message.content;
  }

  private createPlaylistPrompt(request: AIPlaylistRequest): string {
    const currentHour = new Date().getHours();
    const timeOfDay = request.timeOfDay || this.getTimeOfDay(currentHour);
    const mood = request.mood || this.inferMoodFromTime(timeOfDay);
    
    return `You are an expert music curator creating a personalized playlist. Based on the following user preferences, generate exactly ${request.playlistLength || 18} song recommendations.

USER PREFERENCES:
- Favorite Genres: ${request.favoriteGenres.join(', ')}
- Recent Listening History: ${request.recentTracks.map(t => `"${t.title}" by ${t.artist} (${t.genre || 'Unknown genre'})`).join(', ')}
- Current Mood: ${mood}
- Time of Day: ${timeOfDay}
- Include New Discoveries: ${request.includeNewDiscoveries ? 'Yes (30% new artists)' : 'No (stick to familiar styles)'}
${request.excludeArtists?.length ? `- Exclude Artists: ${request.excludeArtists.join(', ')}` : ''}

PLAYLIST REQUIREMENTS:
1. Create a cohesive playlist that flows well from start to finish
2. Include 70% songs similar to user's taste and 30% new discoveries
3. Maintain consistent energy levels appropriate for the mood and time
4. Avoid repeating artists unless specifically requested
5. Consider the natural progression of energy throughout the playlist

RESPONSE FORMAT (JSON only, no additional text):
{
  "playlistName": "Creative playlist name",
  "description": "Brief description of the playlist's vibe and purpose",
  "recommendations": [
    {
      "artist": "Artist Name",
      "title": "Song Title",
      "genre": "Primary Genre",
      "energy": 7,
      "mood": "energetic/chill/focus/etc",
      "reasoning": "Brief explanation why this song fits"
    }
  ],
  "totalEnergy": 6.5,
  "dominantMood": "energetic"
}

Generate the playlist now:`;
  }

  private getTimeOfDay(hour: number): string {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  private inferMoodFromTime(timeOfDay: string): string {
    const moodMap: { [key: string]: string } = {
      morning: 'energetic',
      afternoon: 'focus',
      evening: 'chill',
      night: 'chill',
    };
    return moodMap[timeOfDay] || 'chill';
  }

  async generatePlaylist(request: AIPlaylistRequest): Promise<AIPlaylistResponse> {
    const cacheKey = ['ai-playlist', JSON.stringify(request)];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        const prompt = this.createPlaylistPrompt(request);
        
        try {
          const response = await this.makeRequest<string>([
            {
              role: 'system',
              content: 'You are a professional music curator with deep knowledge of all genres, artists, and songs. You create perfectly balanced playlists that match user preferences while introducing tasteful new discoveries. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ]);

          // Parse the JSON response
          const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(cleanResponse);
          
          // Validate the response structure
          if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
            throw new Error('Invalid AI response format');
          }

          return parsed as AIPlaylistResponse;
        } catch (error) {
          // Fallback to secondary model if primary fails
          if (error instanceof Error && error.message.includes('rate limit')) {
            const response = await this.makeRequest<string>([
              {
                role: 'system',
                content: 'You are a music expert. Create a playlist based on user preferences. Respond with JSON only.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ], this.models.fallback);

            const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanResponse) as AIPlaylistResponse;
          }
          
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });
  }

  async regeneratePlaylist(
    originalRequest: AIPlaylistRequest,
    feedback?: {
      likedTracks?: string[];
      dislikedTracks?: string[];
      adjustEnergy?: 'higher' | 'lower';
      adjustMood?: string;
    }
  ): Promise<AIPlaylistResponse> {
    const enhancedRequest = { ...originalRequest };
    
    if (feedback) {
      // Adjust request based on feedback
      if (feedback.adjustEnergy === 'higher') {
        enhancedRequest.mood = 'energetic';
      } else if (feedback.adjustEnergy === 'lower') {
        enhancedRequest.mood = 'chill';
      }
      
      if (feedback.adjustMood) {
        enhancedRequest.mood = feedback.adjustMood as any;
      }
      
      if (feedback.dislikedTracks?.length) {
        const dislikedArtists = feedback.dislikedTracks.map(track => 
          track.split(' by ')[1] || track
        );
        enhancedRequest.excludeArtists = [
          ...(enhancedRequest.excludeArtists || []),
          ...dislikedArtists,
        ];
      }
    }

    // Clear cache for regeneration
    const cacheKey = ['ai-playlist', JSON.stringify(enhancedRequest)];
    this.queryClient.removeQueries({ queryKey: cacheKey });
    
    return this.generatePlaylist(enhancedRequest);
  }

  async replaceSingleTrack(
    originalPlaylist: AIPlaylistResponse,
    trackIndex: number,
    request: AIPlaylistRequest
  ): Promise<AITrackRecommendation> {
    const trackToReplace = originalPlaylist.recommendations[trackIndex];
    const surroundingTracks = [
      originalPlaylist.recommendations[trackIndex - 1],
      originalPlaylist.recommendations[trackIndex + 1],
    ].filter(Boolean);

    const prompt = `Replace this track in a playlist: "${trackToReplace.title}" by ${trackToReplace.artist}

CONTEXT:
- Original playlist mood: ${originalPlaylist.dominantMood}
- Surrounding tracks: ${surroundingTracks.map(t => `"${t.title}" by ${t.artist}`).join(', ')}
- User genres: ${request.favoriteGenres.join(', ')}
- Exclude artist: ${trackToReplace.artist}

Find a better replacement that flows well with surrounding tracks and matches the playlist's energy level (${trackToReplace.energy}/10).

RESPONSE FORMAT (JSON only):
{
  "artist": "Artist Name",
  "title": "Song Title", 
  "genre": "Genre",
  "energy": ${trackToReplace.energy},
  "mood": "${trackToReplace.mood}",
  "reasoning": "Why this replacement is better"
}`;

    const response = await this.makeRequest<string>([
      {
        role: 'system',
        content: 'You are a music expert specializing in playlist curation and track replacement. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanResponse) as AITrackRecommendation;
  }

  async explainRecommendation(track: AITrackRecommendation, context: AIPlaylistRequest): Promise<string> {
    const prompt = `Explain why "${track.title}" by ${track.artist} was recommended for a user who likes ${context.favoriteGenres.join(', ')} and recently listened to ${context.recentTracks.map(t => `"${t.title}" by ${t.artist}`).join(', ')}.

Keep the explanation concise (2-3 sentences) and focus on musical connections, style similarities, or discovery potential.`;

    const response = await this.makeRequest<string>([
      {
        role: 'system',
        content: 'You are a music expert who explains song recommendations in a friendly, knowledgeable way.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return response.replace(/"/g, '').trim();
  }
}

export default AIPlaylistService;