import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'song' | 'playlist' | 'genre' | 'compact-song' | 'list-song';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'song',
  count = 1,
  className = '',
}) => {
  const skeletonAnimation = {
    animate: {
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  const renderSkeleton = () => {
    switch (variant) {
      case 'song':
        return (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <motion.div
              className="w-full aspect-square bg-gray-600 rounded-xl mb-4"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-4 bg-gray-600 rounded mb-2"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-3 bg-gray-700 rounded w-2/3 mb-2"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-3 bg-gray-700 rounded w-1/2"
              {...skeletonAnimation}
            />
          </div>
        );

      case 'playlist':
        return (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <motion.div
              className="w-full aspect-square bg-gray-600 rounded-xl mb-4"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-4 bg-gray-600 rounded mb-2"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-3 bg-gray-700 rounded w-3/4 mb-2"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-3 bg-gray-700 rounded w-1/2"
              {...skeletonAnimation}
            />
          </div>
        );

      case 'genre':
        return (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <motion.div
              className="w-full aspect-square bg-gray-600 rounded-xl mb-4"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-5 bg-gray-600 rounded mb-2"
              {...skeletonAnimation}
            />
            <motion.div
              className="h-3 bg-gray-700 rounded w-4/5"
              {...skeletonAnimation}
            />
          </div>
        );

      case 'compact-song':
        return (
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-12 h-12 bg-gray-600 rounded-lg"
                {...skeletonAnimation}
              />
              <div className="flex-1">
                <motion.div
                  className="h-4 bg-gray-600 rounded mb-2"
                  {...skeletonAnimation}
                />
                <motion.div
                  className="h-3 bg-gray-700 rounded w-2/3"
                  {...skeletonAnimation}
                />
              </div>
              <motion.div
                className="w-8 h-4 bg-gray-700 rounded"
                {...skeletonAnimation}
              />
            </div>
          </div>
        );

      case 'list-song':
        return (
          <div className="flex items-center space-x-4 p-3">
            <motion.div
              className="w-10 h-10 bg-gray-600 rounded-lg"
              {...skeletonAnimation}
            />
            <div className="flex-1">
              <motion.div
                className="h-4 bg-gray-600 rounded mb-1"
                {...skeletonAnimation}
              />
              <motion.div
                className="h-3 bg-gray-700 rounded w-2/3"
                {...skeletonAnimation}
              />
            </div>
            <motion.div
              className="w-12 h-3 bg-gray-700 rounded"
              {...skeletonAnimation}
            />
            <motion.div
              className="w-8 h-3 bg-gray-700 rounded"
              {...skeletonAnimation}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};