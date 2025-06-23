import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Play, 
  Pause, 
  Download, 
  Zap, 
  Brain, 
  Activity,
  Settings,
  RefreshCw,
  Volume2,
  Headphones,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

// AI Music Generation Engine (Simulated with Advanced Algorithms)
class AIComposerEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private currentComposition: AudioBuffer | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } catch (error) {
      console.warn('AudioContext not supported');
    }
  }

  // Generador de frecuencias musicales basado en escalas
  private generateMusicalFrequencies(scale: string, octave: number = 4): number[] {
    const scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      pentatonic: [0, 2, 4, 7, 9],
      blues: [0, 3, 5, 6, 7, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      mixolydian: [0, 2, 4, 5, 7, 9, 10]
    };

    const baseFreq = 440 * Math.pow(2, octave - 4); // A4 = 440Hz
    const scaleNotes = scales[scale as keyof typeof scales] || scales.major;
    
    return scaleNotes.map(note => baseFreq * Math.pow(2, note / 12));
  }

  // Generador de ritmos inteligente
  private generateRhythmPattern(genre: string, complexity: number): number[] {
    const patterns = {
      electronic: [1, 0, 0.5, 0, 1, 0, 0.7, 0, 1, 0, 0.3, 0, 0.8, 0, 0.5, 0],
      ambient: [0.3, 0, 0, 0, 0.5, 0, 0, 0, 0.4, 0, 0, 0, 0.6, 0, 0, 0],
      upbeat: [1, 0.5, 0.8, 0.3, 1, 0.7, 0.5, 0.4, 1, 0.6, 0.9, 0.2, 1, 0.8, 0.4, 0.6],
      minimal: [1, 0, 0, 0, 0.6, 0, 0, 0, 0.8, 0, 0, 0, 0.4, 0, 0, 0],
      experimental: [0.9, 0.3, 0.7, 0.1, 0.5, 0.8, 0.2, 0.6, 0.4, 0.9, 0.1, 0.7, 0.3, 0.5, 0.8, 0.2]
    };

    let pattern = patterns[genre as keyof typeof patterns] || patterns.electronic;
    
    // Ajustar complejidad
    if (complexity > 0.7) {
      pattern = pattern.map((beat, i) => beat + (Math.random() * 0.3 - 0.15));
    } else if (complexity < 0.3) {
      pattern = pattern.map((beat, i) => i % 4 === 0 ? beat : beat * 0.5);
    }

    return pattern.map(beat => Math.max(0, Math.min(1, beat)));
  }

  // Motor de síntesis avanzado
  async generateComposition(params: {
    genre: string;
    mood: string;
    duration: number;
    complexity: number;
    scale: string;
    tempo: number;
  }): Promise<string> {
    if (!this.audioContext) {
      throw new Error('Audio context not available');
    }

    const { genre, mood, duration, complexity, scale, tempo } = params;
    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    
    // Crear buffer de audio
    const audioBuffer = this.audioContext.createBuffer(2, frameCount, sampleRate);
    
    // Generar frecuencias musicales
    const frequencies = this.generateMusicalFrequencies(scale);
    const rhythmPattern = this.generateRhythmPattern(genre, complexity);
    
    // Síntesis de audio en tiempo real
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      
      for (let i = 0; i < frameCount; i++) {
        const time = i / sampleRate;
        const beatTime = (time * tempo / 60) % 1;
        const beatIndex = Math.floor((time * tempo / 60) * rhythmPattern.length) % rhythmPattern.length;
        const beatStrength = rhythmPattern[beatIndex];
        
        let sample = 0;
        
        // Generador de ondas múltiples
        frequencies.forEach((freq, index) => {
          const phase = 2 * Math.PI * freq * time;
          const envelope = Math.exp(-time * 2) * beatStrength;
          
          // Diferentes formas de onda según el género
          let wave = 0;
          switch (genre) {
            case 'electronic':
              wave = Math.sin(phase) + 0.3 * Math.sin(phase * 2);
              break;
            case 'ambient':
              wave = Math.sin(phase) * Math.sin(phase * 0.1);
              break;
            case 'experimental':
              wave = Math.sign(Math.sin(phase)) * Math.pow(Math.abs(Math.sin(phase)), 0.5);
              break;
            default:
              wave = Math.sin(phase);
          }
          
          sample += wave * envelope * (0.1 / frequencies.length);
        });
        
        // Filtros y efectos
        const lowPass = Math.sin(time * 0.5) * 0.1 + 0.9;
        sample *= lowPass;
        
        // Stereo effects
        if (channel === 1) {
          sample *= Math.sin(time * 0.3) * 0.1 + 0.9;
        }
        
        channelData[i] = sample;
      }
    }

    // Convertir a base64 para reproducción
    this.currentComposition = audioBuffer;
    return this.audioBufferToBase64(audioBuffer);
  }

  private audioBufferToBase64(buffer: AudioBuffer): string {
    // Simulación de conversión (en un caso real usarías Web Audio API completa)
    return `data:audio/wav;base64,${Math.random().toString(36).substring(2)}`;
  }

  async playComposition(): Promise<void> {
    if (!this.audioContext || !this.currentComposition) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.currentComposition;
    source.connect(this.gainNode!);
    source.start();
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }
}

export const AIComposer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentComposition, setCurrentComposition] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const composerEngine = useRef(new AIComposerEngine());

  // Parámetros de composición
  const [params, setParams] = useState({
    genre: 'electronic',
    mood: 'energetic',
    duration: 30,
    complexity: 0.7,
    scale: 'major',
    tempo: 120
  });

  const genres = ['electronic', 'ambient', 'upbeat', 'minimal', 'experimental'];
  const moods = ['energetic', 'chill', 'mysterious', 'euphoric', 'contemplative'];
  const scales = ['major', 'minor', 'pentatonic', 'blues', 'dorian', 'mixolydian'];

  const generateComposition = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simular progreso de generación
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const composition = await composerEngine.current.generateComposition(params);
      setCurrentComposition(composition);
      
      setTimeout(() => {
        setGenerationProgress(100);
        clearInterval(progressInterval);
        setIsGenerating(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to generate composition:', error);
      setIsGenerating(false);
    }
  };

  const playComposition = async () => {
    try {
      setIsPlaying(true);
      await composerEngine.current.playComposition();
      
      // Simular duración de reproducción
      setTimeout(() => {
        setIsPlaying(false);
      }, params.duration * 1000);
    } catch (error) {
      console.error('Failed to play composition:', error);
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <GlassCard className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-space font-bold text-white">AI Music Composer</h2>
              <p className="text-gray-300">Generate unique compositions in real-time</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">BETA</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-space font-bold text-white mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Composition Parameters
          </h3>

          <div className="space-y-6">
            {/* Genre */}
            <div>
              <label className="block text-white font-medium mb-3">Genre</label>
              <div className="grid grid-cols-3 gap-2">
                {genres.map(genre => (
                  <motion.button
                    key={genre}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      params.genre === genre
                        ? 'bg-neon-purple text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setParams(prev => ({ ...prev, genre }))}
                  >
                    {genre}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-white font-medium mb-3">Mood</label>
              <div className="grid grid-cols-3 gap-2">
                {moods.map(mood => (
                  <motion.button
                    key={mood}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      params.mood === mood
                        ? 'bg-neon-pink text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setParams(prev => ({ ...prev, mood }))}
                  >
                    {mood}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div>
              <label className="block text-white font-medium mb-3">Musical Scale</label>
              <select
                value={params.scale}
                onChange={(e) => setParams(prev => ({ ...prev, scale: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                {scales.map(scale => (
                  <option key={scale} value={scale} className="bg-dark-600">
                    {scale.charAt(0).toUpperCase() + scale.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Complexity: {(params.complexity * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={params.complexity}
                  onChange={(e) => setParams(prev => ({ ...prev, complexity: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Tempo: {params.tempo} BPM
                </label>
                <input
                  type="range"
                  min="60"
                  max="180"
                  step="10"
                  value={params.tempo}
                  onChange={(e) => setParams(prev => ({ ...prev, tempo: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Duration: {params.duration}s
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={params.duration}
                  onChange={(e) => setParams(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Generation & Playback */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-space font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            AI Generation
          </h3>

          <div className="space-y-6">
            {/* Generation Status */}
            <div className="text-center">
              {isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-white font-medium">AI is composing...</p>
                    <p className="text-gray-400 text-sm">Generating neural harmonics</p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${generationProgress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-white text-sm">{generationProgress.toFixed(0)}% Complete</p>
                </motion.div>
              ) : currentComposition ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Composition Ready!</p>
                    <p className="text-gray-400 text-sm">AI-generated {params.genre} track</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Ready to Generate</p>
                    <p className="text-gray-400 text-sm">Click generate to create unique music</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <NeonButton
                variant="primary"
                className="w-full"
                onClick={generateComposition}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Generate AI Composition
                  </>
                )}
              </NeonButton>

              {currentComposition && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <NeonButton
                    variant="secondary"
                    className="w-full"
                    onClick={playComposition}
                    disabled={isPlaying}
                  >
                    {isPlaying ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="mr-2"
                        >
                          <Volume2 className="w-5 h-5" />
                        </motion.div>
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Play Composition
                      </>
                    )}
                  </NeonButton>

                  <NeonButton
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      // Simular descarga
                      const link = document.createElement('a');
                      link.href = currentComposition;
                      link.download = `neurobeats-ai-composition-${Date.now()}.wav`;
                      link.click();
                    }}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Track
                  </NeonButton>
                </motion.div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};