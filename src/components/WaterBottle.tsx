
import React from 'react';
import { cn } from '@/lib/utils';

interface WaterBottleProps {
  currentIntake: number;
  dailyGoal: number;
  className?: string;
}

export const WaterBottle: React.FC<WaterBottleProps> = ({ 
  currentIntake, 
  dailyGoal, 
  className 
}) => {
  const fillPercentage = Math.min((currentIntake / dailyGoal) * 100, 100);
  
  // Calculate hydration status and color
  const getHydrationColor = () => {
    const percentage = (currentIntake / dailyGoal) * 100;
    if (percentage < 30) return 'from-red-400 to-red-600'; // Dehydrated
    if (percentage < 60) return 'from-orange-400 to-orange-600'; // Low
    if (percentage <= 100) return 'from-blue-400 to-blue-600'; // Good
    return 'from-red-500 to-red-700'; // Over limit
  };

  return (
    <div className={cn("relative mx-auto", className)}>
      {/* Water Bottle SVG */}
      <div className="relative w-32 h-48">
        <svg
          viewBox="0 0 120 180"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottle outline */}
          <path
            d="M35 20 L35 15 C35 10 40 5 45 5 L75 5 C80 5 85 10 85 15 L85 20 L90 25 L90 165 C90 170 85 175 80 175 L40 175 C35 175 30 170 30 165 L30 25 Z"
            stroke="#e5e7eb"
            strokeWidth="2"
            fill="rgba(255,255,255,0.8)"
          />
          
          {/* Water fill */}
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`${getHydrationColor().split(' ')[0].replace('from-', 'stop-')}`} />
              <stop offset="100%" className={`${getHydrationColor().split(' ')[2].replace('to-', 'stop-')}`} />
            </linearGradient>
          </defs>
          
          <path
            d={`M32 ${175 - (fillPercentage * 1.4)} L88 ${175 - (fillPercentage * 1.4)} L88 165 C88 170 83 173 78 173 L42 173 C37 173 32 170 32 165 Z`}
            fill="url(#waterGradient)"
            className="transition-all duration-500 ease-in-out"
          />
          
          {/* Bottle cap */}
          <rect
            x="42"
            y="5"
            width="36"
            height="8"
            rx="4"
            fill="#94a3b8"
          />
        </svg>
        
        {/* Water level indicator */}
        <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
          <div className="text-sm font-semibold text-gray-600">
            {currentIntake}ml
          </div>
          <div className="text-xs text-gray-400">
            of {dailyGoal}ml
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div
          className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getHydrationColor()}`}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      
      {/* Percentage text */}
      <div className="text-center mt-2 text-sm font-medium text-gray-600">
        {Math.round(fillPercentage)}%
      </div>
    </div>
  );
};
