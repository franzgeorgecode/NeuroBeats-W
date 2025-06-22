import React, { useRef } from 'react';
import { useGesture } from 'react-use-gesture';
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

  const bind = useGesture({
    onDrag: ({ offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy], cancel }) => {
      x.set(ox);
      y.set(oy);
      
      // Detect swipe gestures
      if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > 0) {
            onSwipeRight?.() || previousTrack();
          } else {
            onSwipeLeft?.() || nextTrack();
          }
        } else {
          // Vertical swipe
          if (dy > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
        cancel();
      }
    },
    onDragEnd: () => {
      x.set(0);
      y.set(0);
    },
  }, {
    drag: {
      bounds: { left: -100, right: 100, top: -100, bottom: 100 },
      rubberband: true,
    },
  });

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