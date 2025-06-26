import React from 'react';

interface BoltBadgeProps {
  variant?: 'white' | 'black';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BoltBadge: React.FC<BoltBadgeProps> = ({ 
  variant = 'white', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-6 sm:h-6',
    md: 'w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12',
    lg: 'w-16 h-16 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16'
  };

  const badgeSrc = variant === 'white' 
    ? '/assets/badges/bolt-white.svg' 
    : '/assets/badges/bolt-black.svg';

  return (
    <a 
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block transition-all duration-200 hover:opacity-80 hover:scale-105 ${className}`}
      aria-label="Powered by Bolt.new"
      title="Powered by Bolt.new"
    >
      <img
        src={badgeSrc}
        alt="Powered by Bolt.new"
        className={`${sizeClasses[size]} object-contain`}
        loading="lazy"
      />
    </a>
  );
};