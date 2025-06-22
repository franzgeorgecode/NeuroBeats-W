import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateVolume(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateVolume(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateVolume = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.max(0, Math.min(1, x / width));
    
    onVolumeChange(newVolume);
  };

  const toggleMute = () => {
    onVolumeChange(volume === 0 ? 0.8 : 0);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowSlider(true);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      timeoutRef.current = setTimeout(() => {
        setShowSlider(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging && !showSlider) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isDragging, showSlider]);

  return (
    <div 
      className={`relative flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        className="p-2 text-gray-400 hover:text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
      >
        <VolumeIcon className="w-5 h-5" />
      </motion.button>

      <motion.div
        className="ml-2"
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: showSlider ? 100 : 0, 
          opacity: showSlider ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          ref={sliderRef}
          className="relative h-1 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
          onMouseDown={handleMouseDown}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-full"
            style={{ width: `${volume * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${volume * 100}%` }}
            transition={{ duration: 0.1 }}
          />
          
          <motion.div
            className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 cursor-grab"
            style={{ left: `${volume * 100}%`, marginLeft: '-6px' }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            drag="x"
            dragConstraints={sliderRef}
            dragElastic={0}
            onDrag={(_, info) => {
              if (!sliderRef.current) return;
              const rect = sliderRef.current.getBoundingClientRect();
              const newVolume = Math.max(0, Math.min(1, info.point.x / rect.width));
              onVolumeChange(newVolume);
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};