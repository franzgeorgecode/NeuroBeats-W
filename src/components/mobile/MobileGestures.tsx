import React, { useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { usePlayerStore } from '../../stores/playerStore';

interface MobileGesturesProps {
  children: React.ReactNode;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const MobileGestures: React.FC<MobileGesturesProps> = ({
  children,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  className = '',
}) => {
  const { nextTrack, previousTrack } = usePlayerStore();
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const bind = useDrag(
    ({ offset, velocity, direction, active }) => {
      const [ox, oy] = Array.isArray(offset) ? offset : [0, 0];
      const [vx, vy] = Array.isArray(velocity) ? velocity : [0, 0];
      const [dx, dy] = Array.isArray(direction) ? direction : [0, 0];
      
      if (active) {
        x.set(ox);
        y.set(oy);
      }
      
      // Detect swipe gestures when drag ends
      if (!active && (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5)) {
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > 0) {
            onSwipeRight ? onSwipeRight() : previousTrack();
          } else {
            onSwipeLeft ? onSwipeLeft() : nextTrack();
          }
        } else {
          // Vertical swipe
          if (dy > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }
      
      if (!active) {
        x.set(0);
        y.set(0);
      }
    },
    {
      bounds: { left: -100, right: 100, top: -100, bottom: 100 },
      rubberband: true,
    }
  );

  return (
    <motion.div
      ref={ref}
      {...bind()}
      className={`touch-pan-y ${className}`}
      style={{
        x,
        y,
        rotateX,
        rotateY,
      }}
    >
      {children}
    </motion.div>
  );
};