import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  currentStep: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600 transform -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-neon-gradient transform -translate-y-1/2"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-neon-gradient shadow-neon' 
                    : isCurrent 
                      ? 'bg-neon-gradient shadow-neon animate-pulse' 
                      : 'bg-gray-600'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <span className="text-white font-space font-bold">
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step Info */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <h3 className={`
                  font-space font-semibold text-sm
                  ${isCurrent ? 'text-neon-purple' : isCompleted ? 'text-white' : 'text-gray-400'}
                `}>
                  {step.title}
                </h3>
                <p className={`
                  text-xs mt-1 max-w-24
                  ${isCurrent ? 'text-gray-300' : 'text-gray-500'}
                `}>
                  {step.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};