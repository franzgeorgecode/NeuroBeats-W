import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Zap, 
  Smile, 
  Frown, 
  Meh, 
  Sun, 
  Cloud, 
  Moon,
  Activity,
  BarChart3,
  TrendingUp,
  Target,
  Waves
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

// Interfaces para análisis emocional
interface EmotionalState {
  valence: number; // Positivo/Negativo (-1 a 1)
  arousal: number; // Energía/Calma (0 a 1)
  dominance: number; // Fuerza/Suavidad (0 a 1)
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
    trust: number;
    anticipation: number;
  };
  mood: string;
  energy: number;
}

interface MusicAnalysis {
  tempo: number;
  key: string;
  mode: 'major' | 'minor';
  timeSignature: string;
  loudness: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
}

// Motor de análisis emocional avanzado
class EmotionalAI {
  // Análisis de características musicales
  static analyzeMusicFeatures(audioData: Uint8Array): MusicAnalysis {
    // Simulación de análisis de características musicales avanzadas
    const avgFrequency = Array.from(audioData).reduce((sum, val) => sum + val, 0) / audioData.length;
    const dynamicRange = Math.max(...audioData) - Math.min(...audioData);
    const spectralCentroid = this.calculateSpectralCentroid(audioData);
    
    return {
      tempo: this.estimateTempo(audioData),
      key: this.estimateKey(spectralCentroid),
      mode: spectralCentroid > 150 ? 'major' : 'minor',
      timeSignature: '4/4',
      loudness: avgFrequency / 255,
      danceability: this.calculateDanceability(audioData),
      acousticness: this.calculateAcousticness(audioData),
      instrumentalness: this.calculateInstrumentalness(audioData),
      liveness: Math.random() * 0.3 + 0.1,
      speechiness: this.calculateSpeechiness(audioData)
    };
  }

  // Análisis emocional basado en características musicales
  static analyzeEmotionalState(musicFeatures: MusicAnalysis, audioData: Uint8Array): EmotionalState {
    const { tempo, mode, loudness, danceability } = musicFeatures;
    
    // Calcular valencia (positivo/negativo)
    let valence = 0;
    if (mode === 'major') valence += 0.3;
    if (tempo > 120) valence += 0.2;
    if (danceability > 0.6) valence += 0.3;
    valence = Math.max(-1, Math.min(1, valence - 0.5));

    // Calcular arousal (energía)
    let arousal = 0;
    arousal += Math.min(1, tempo / 180);
    arousal += loudness;
    arousal += danceability;
    arousal = Math.max(0, Math.min(1, arousal / 3));

    // Calcular dominance (fuerza)
    let dominance = 0;
    dominance += loudness;
    dominance += Math.min(1, tempo / 160);
    dominance = Math.max(0, Math.min(1, dominance / 2));

    // Calcular emociones específicas usando el modelo de Plutchik
    const emotions = this.calculatePlutchikEmotions(valence, arousal, dominance);
    
    // Determinar mood principal
    const mood = this.determineMood(emotions, valence, arousal);
    
    // Calcular energía general
    const energy = (arousal + dominance) / 2;

    return {
      valence,
      arousal,
      dominance,
      emotions,
      mood,
      energy
    };
  }

  private static calculateSpectralCentroid(audioData: Uint8Array): number {
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < audioData.length; i++) {
      weightedSum += i * audioData[i];
      magnitudeSum += audioData[i];
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  }

  private static estimateTempo(audioData: Uint8Array): number {
    // Análisis básico de tempo basado en fluctuaciones de energía
    const energyVariations = [];
    for (let i = 1; i < audioData.length; i++) {
      energyVariations.push(Math.abs(audioData[i] - audioData[i - 1]));
    }
    
    const avgVariation = energyVariations.reduce((sum, val) => sum + val, 0) / energyVariations.length;
    return Math.max(60, Math.min(200, 80 + avgVariation * 2));
  }

  private static estimateKey(spectralCentroid: number): string {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyIndex = Math.floor((spectralCentroid / 20) % 12);
    return keys[keyIndex] || 'C';
  }

  private static calculateDanceability(audioData: Uint8Array): number {
    // Regularidad del ritmo y energía en frecuencias bajas
    const bassEnergy = audioData.slice(0, 8).reduce((sum, val) => sum + val, 0) / 8;
    const rhythmRegularity = this.calculateRhythmRegularity(audioData);
    return Math.max(0, Math.min(1, (bassEnergy / 255 + rhythmRegularity) / 2));
  }

  private static calculateAcousticness(audioData: Uint8Array): number {
    // Menos energía en frecuencias altas indica más acústico
    const highFreqEnergy = audioData.slice(32).reduce((sum, val) => sum + val, 0) / (audioData.length - 32);
    return Math.max(0, Math.min(1, 1 - (highFreqEnergy / 255)));
  }

  private static calculateInstrumentalness(audioData: Uint8Array): number {
    // Análisis de frecuencias vocales vs instrumentales
    const vocalRange = audioData.slice(8, 24).reduce((sum, val) => sum + val, 0) / 16;
    const totalEnergy = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
    return Math.max(0, Math.min(1, 1 - (vocalRange / totalEnergy)));
  }

  private static calculateSpeechiness(audioData: Uint8Array): number {
    // Análisis de frecuencias típicas del habla
    const speechFreqs = audioData.slice(4, 20).reduce((sum, val) => sum + val, 0) / 16;
    return Math.max(0, Math.min(1, speechFreqs / 255));
  }

  private static calculateRhythmRegularity(audioData: Uint8Array): number {
    // Análisis de patrones repetitivos
    const patterns = [];
    for (let i = 0; i < audioData.length - 4; i++) {
      patterns.push(audioData.slice(i, i + 4));
    }
    // Simplificación: medir variabilidad
    const variance = this.calculateVariance(Array.from(audioData));
    return Math.max(0, Math.min(1, 1 - (variance / 10000)));
  }

  private static calculateVariance(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  }

  private static calculatePlutchikEmotions(valence: number, arousal: number, dominance: number) {
    return {
      joy: Math.max(0, valence * arousal),
      sadness: Math.max(0, -valence * (1 - arousal)),
      anger: Math.max(0, -valence * arousal * dominance),
      fear: Math.max(0, -valence * arousal * (1 - dominance)),
      surprise: Math.max(0, arousal * (1 - Math.abs(valence))),
      disgust: Math.max(0, -valence * (1 - arousal) * dominance),
      trust: Math.max(0, valence * (1 - arousal)),
      anticipation: Math.max(0, valence * arousal * (1 - dominance))
    };
  }

  private static determineMood(emotions: any, valence: number, arousal: number): string {
    const topEmotion = Object.entries(emotions).reduce((max, [emotion, value]) => 
      value > max.value ? { emotion, value } : max, { emotion: 'neutral', value: 0 });

    if (arousal > 0.7 && valence > 0.3) return 'euphoric';
    if (arousal > 0.6 && valence > 0) return 'energetic';
    if (arousal < 0.3 && valence > 0.2) return 'peaceful';
    if (arousal < 0.4 && valence < -0.2) return 'melancholic';
    if (arousal > 0.5 && valence < -0.3) return 'aggressive';
    if (Math.abs(valence) < 0.2 && arousal < 0.5) return 'contemplative';
    
    return topEmotion.emotion;
  }
}

export const EmotionalAnalyzer: React.FC<{
  audioData: Uint8Array;
  isPlaying: boolean;
  trackInfo?: { title: string; artist: string };
}> = ({ audioData, isPlaying, trackInfo }) => {
  const [analysis, setAnalysis] = useState<EmotionalState | null>(null);
  const [musicFeatures, setMusicFeatures] = useState<MusicAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<EmotionalState[]>([]);

  // Realizar análisis cuando hay datos de audio
  useEffect(() => {
    if (isPlaying && audioData.some(val => val > 0)) {
      setIsAnalyzing(true);
      
      // Simular delay de procesamiento AI
      const timeout = setTimeout(() => {
        const features = EmotionalAI.analyzeMusicFeatures(audioData);
        const emotional = EmotionalAI.analyzeEmotionalState(features, audioData);
        
        setMusicFeatures(features);
        setAnalysis(emotional);
        setHistory(prev => [...prev.slice(-9), emotional]); // Mantener últimos 10
        setIsAnalyzing(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [audioData, isPlaying]);

  const getMoodIcon = (mood: string) => {
    const icons = {
      euphoric: Sun,
      energetic: Zap,
      peaceful: Cloud,
      melancholic: Moon,
      aggressive: Activity,
      contemplative: Brain,
      neutral: Meh
    };
    return icons[mood as keyof typeof icons] || Meh;
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      euphoric: 'from-yellow-400 to-orange-500',
      energetic: 'from-red-500 to-pink-500',
      peaceful: 'from-blue-400 to-cyan-500',
      melancholic: 'from-purple-600 to-blue-800',
      aggressive: 'from-red-600 to-red-800',
      contemplative: 'from-indigo-500 to-purple-600',
      neutral: 'from-gray-500 to-gray-600'
    };
    return colors[mood as keyof typeof colors] || colors.neutral;
  };

  const getEmotionIntensity = (value: number) => {
    if (value > 0.7) return 'Very High';
    if (value > 0.5) return 'High';
    if (value > 0.3) return 'Medium';
    if (value > 0.1) return 'Low';
    return 'Very Low';
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <GlassCard className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-space font-bold text-white">Emotional AI Analyzer</h2>
              <p className="text-gray-300">Real-time music emotion analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className={`w-5 h-5 ${isPlaying ? 'text-green-400' : 'text-gray-400'}`} />
            <span className="text-white text-sm">
              {isPlaying ? 'Analyzing' : 'Paused'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Current Track Analysis */}
      {trackInfo && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-space font-bold text-white mb-4">Current Track</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold">{trackInfo.title}</h4>
              <p className="text-gray-400">{trackInfo.artist}</p>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotional State */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-space font-bold text-white mb-6 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-400" />
            Emotional State
          </h3>

          {isAnalyzing ? (
            <motion.div
              className="flex items-center justify-center h-48"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <p className="text-white">Analyzing emotional patterns...</p>
              </div>
            </motion.div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Mood Display */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-20 h-20 bg-gradient-to-r ${getMoodColor(analysis.mood)} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  {React.createElement(getMoodIcon(analysis.mood), { className: "w-10 h-10 text-white" })}
                </motion.div>
                <h4 className="text-xl font-bold text-white capitalize">{analysis.mood}</h4>
                <p className="text-gray-400">Current emotional state</p>
              </div>

              {/* Emotional Dimensions */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>Valence (Positivity)</span>
                    <span>{((analysis.valence + 1) * 50).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
                      style={{ width: `${(analysis.valence + 1) * 50}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(analysis.valence + 1) * 50}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>Arousal (Energy)</span>
                    <span>{(analysis.arousal * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full"
                      style={{ width: `${analysis.arousal * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.arousal * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>Dominance (Power)</span>
                    <span>{(analysis.dominance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${analysis.dominance * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.dominance * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <Waves className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Play a track to analyze emotions</p>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Detailed Emotions */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-space font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Emotion Breakdown
          </h3>

          {analysis ? (
            <div className="space-y-3">
              {Object.entries(analysis.emotions).map(([emotion, value]) => (
                <motion.div
                  key={emotion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Object.keys(analysis.emotions).indexOf(emotion) * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white capitalize font-medium">{emotion}</span>
                    <span className="text-gray-400 text-sm">{getEmotionIntensity(value)}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        emotion === 'joy' ? 'from-yellow-400 to-orange-500' :
                        emotion === 'sadness' ? 'from-blue-600 to-purple-600' :
                        emotion === 'anger' ? 'from-red-500 to-red-700' :
                        emotion === 'fear' ? 'from-purple-700 to-gray-800' :
                        emotion === 'surprise' ? 'from-pink-400 to-purple-500' :
                        emotion === 'disgust' ? 'from-green-600 to-gray-700' :
                        emotion === 'trust' ? 'from-blue-400 to-cyan-500' :
                        'from-indigo-500 to-purple-600'
                      }`}
                      style={{ width: `${value * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${value * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Waiting for audio analysis</p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Music Features */}
      {musicFeatures && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-space font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Music Analysis
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{musicFeatures.tempo.toFixed(0)}</p>
              <p className="text-gray-400 text-sm">BPM</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{musicFeatures.key}</p>
              <p className="text-gray-400 text-sm">Key</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white capitalize">{musicFeatures.mode}</p>
              <p className="text-gray-400 text-sm">Mode</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{(musicFeatures.danceability * 100).toFixed(0)}%</p>
              <p className="text-gray-400 text-sm">Danceability</p>
            </div>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
};