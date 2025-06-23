import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { 
  Volume2, 
  Settings, 
  Maximize2, 
  RotateCcw, 
  Palette,
  Zap,
  Music,
  Activity
} from 'lucide-react';

// 3D Audio Analyzer Component
function AudioVisualizer3D({ audioData, isPlaying, visualMode }: {
  audioData: Uint8Array;
  isPlaying: boolean;
  visualMode: string;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);
  const { camera } = useThree();

  useFrame((state) => {
    if (!meshRef.current || !isPlaying) return;

    const time = state.clock.getElapsedTime();
    
    // Rotar el grupo principal
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    // Animar esferas basado en datos de audio
    spheresRef.current.forEach((sphere, i) => {
      if (sphere && audioData[i]) {
        const amplitude = audioData[i] / 255;
        sphere.scale.setScalar(0.5 + amplitude * 2);
        
        // Cambiar colores basado en frecuencia
        const hue = (i / audioData.length) * 360 + time * 50;
        const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.5 + amplitude * 0.3);
        (sphere.material as THREE.MeshStandardMaterial).color = color;
        (sphere.material as THREE.MeshStandardMaterial).emissive = color.multiplyScalar(0.2);
        
        // Movimiento vertical
        sphere.position.y = Math.sin(time * 2 + i * 0.1) * amplitude * 2;
      }
    });

    // Efecto de cámara
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.position.z = 8 + Math.cos(time * 0.1) * 1;
    camera.lookAt(0, 0, 0);
  });

  const createVisualizationElements = () => {
    const elements = [];
    const radius = 4;
    const count = Math.min(audioData.length, 64);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const amplitude = audioData[i] / 255;

      switch (visualMode) {
        case 'spheres':
          elements.push(
            <Sphere
              key={i}
              ref={(el) => el && (spheresRef.current[i] = el)}
              position={[x, 0, z]}
              args={[0.2, 16, 16]}
            >
              <meshStandardMaterial
                color={new THREE.Color().setHSL(i / count, 0.8, 0.6)}
                emissive={new THREE.Color().setHSL(i / count, 0.8, 0.1)}
                roughness={0.2}
                metalness={0.8}
              />
            </Sphere>
          );
          break;

        case 'cubes':
          elements.push(
            <Box
              key={i}
              ref={(el) => el && (spheresRef.current[i] = el)}
              position={[x, 0, z]}
              args={[0.3, 0.3 + amplitude * 2, 0.3]}
            >
              <meshStandardMaterial
                color={new THREE.Color().setHSL(i / count, 0.9, 0.5)}
                emissive={new THREE.Color().setHSL(i / count, 0.9, 0.1)}
              />
            </Box>
          );
          break;

        case 'rings':
          elements.push(
            <Torus
              key={i}
              ref={(el) => el && (spheresRef.current[i] = el)}
              position={[x, 0, z]}
              args={[0.3 + amplitude, 0.1, 8, 16]}
            >
              <meshStandardMaterial
                color={new THREE.Color().setHSL(i / count, 0.7, 0.6)}
                emissive={new THREE.Color().setHSL(i / count, 0.7, 0.2)}
                wireframe={amplitude > 0.5}
              />
            </Torus>
          );
          break;
      }
    }

    return elements;
  };

  return (
    <group ref={meshRef}>
      {/* Luz ambiental */}
      <ambientLight intensity={0.3} />
      
      {/* Luces direccionales que cambian con el audio */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5 + (audioData[0] || 0) / 255 * 0.5}
        color={new THREE.Color().setHSL((audioData[0] || 0) / 255, 0.8, 0.6)}
      />
      
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.3 + (audioData[16] || 0) / 255 * 0.3}
        color={new THREE.Color().setHSL((audioData[16] || 0) / 255 + 0.5, 0.8, 0.6)}
      />

      {/* Elementos de visualización */}
      {createVisualizationElements()}

      {/* Texto central */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        NeuroBeats
      </Text>

      {/* Partículas de fondo */}
      {Array.from({ length: 50 }, (_, i) => (
        <Sphere
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ]}
          args={[0.02, 4, 4]}
        >
          <meshBasicMaterial
            color={new THREE.Color().setHSL(Math.random(), 0.5, 0.5)}
            transparent
            opacity={0.3}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Hook para análisis de audio
function useAudioAnalyzer(audioElement: HTMLAudioElement | null) {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(64));
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    try {
      // Crear contexto de audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      // Crear analizador
      analyzerRef.current = audioContext.createAnalyser();
      analyzerRef.current.fftSize = 128;
      analyzerRef.current.smoothingTimeConstant = 0.8;

      // Conectar fuente de audio
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContext.destination);

      // Función de análisis
      const updateAudioData = () => {
        if (analyzerRef.current) {
          const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
          analyzerRef.current.getByteFrequencyData(dataArray);
          setAudioData(dataArray);
        }
        requestAnimationFrame(updateAudioData);
      };

      updateAudioData();

    } catch (error) {
      console.warn('Audio analysis not supported:', error);
      // Simular datos de audio para demo
      const interval = setInterval(() => {
        const fakeData = new Uint8Array(64);
        for (let i = 0; i < 64; i++) {
          fakeData[i] = Math.random() * 255;
        }
        setAudioData(fakeData);
      }, 100);

      return () => clearInterval(interval);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioElement]);

  return audioData;
}

export const Audio3DVisualizer: React.FC<{
  audioElement?: HTMLAudioElement | null;
  isPlaying?: boolean;
}> = ({ audioElement, isPlaying = false }) => {
  const [visualMode, setVisualMode] = useState('spheres');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    sensitivity: 0.8,
    colorIntensity: 0.7,
    rotationSpeed: 0.5,
    particleCount: 50
  });

  const audioData = useAudioAnalyzer(audioElement);

  const visualModes = [
    { id: 'spheres', name: 'Spheres', icon: '●' },
    { id: 'cubes', name: 'Cubes', icon: '■' },
    { id: 'rings', name: 'Rings', icon: '◯' }
  ];

  return (
    <motion.div
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-black rounded-xl overflow-hidden`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        <GlassCard className="p-3">
          <div className="flex items-center space-x-3">
            <Activity className={`w-5 h-5 ${isPlaying ? 'text-green-400' : 'text-gray-400'}`} />
            <span className="text-white font-medium">
              {isPlaying ? 'Analyzing Audio' : 'Audio Paused'}
            </span>
          </div>
        </GlassCard>

        <div className="flex space-x-2">
          <GlassCard className="p-2">
            <div className="flex space-x-1">
              {visualModes.map(mode => (
                <motion.button
                  key={mode.id}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    visualMode === mode.id
                      ? 'bg-neon-purple text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setVisualMode(mode.id)}
                  title={mode.name}
                >
                  {mode.icon}
                </motion.button>
              ))}
            </div>
          </GlassCard>

          <NeonButton
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-4 h-4" />
          </NeonButton>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <GlassCard className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white text-xs font-medium mb-1">Sensitivity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.sensitivity}
                onChange={(e) => setSettings(prev => ({ ...prev, sensitivity: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none slider"
              />
            </div>
            
            <div>
              <label className="block text-white text-xs font-medium mb-1">Color Intensity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.colorIntensity}
                onChange={(e) => setSettings(prev => ({ ...prev, colorIntensity: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none slider"
              />
            </div>

            <div>
              <label className="block text-white text-xs font-medium mb-1">Rotation Speed</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.rotationSpeed}
                onChange={(e) => setSettings(prev => ({ ...prev, rotationSpeed: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none slider"
              />
            </div>

            <div className="flex items-end">
              <NeonButton
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={() => setSettings({
                  sensitivity: 0.8,
                  colorIntensity: 0.7,
                  rotationSpeed: 0.5,
                  particleCount: 50
                })}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 3D Canvas */}
      <div className={`${isFullscreen ? 'w-full h-full' : 'w-full h-96'}`}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 0);
          }}
        >
          <AudioVisualizer3D
            audioData={audioData}
            isPlaying={isPlaying}
            visualMode={visualMode}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={isPlaying}
            autoRotateSpeed={settings.rotationSpeed * 2}
          />
        </Canvas>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};