
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface BackgroundPageProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
}

const backgroundOptions = [
  { id: 'default', name: 'Clean White', gradient: 'bg-white' },
  { id: 'ocean', name: 'Ocean Breeze', gradient: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
  { id: 'forest', name: 'Forest Fresh', gradient: 'bg-gradient-to-br from-green-100 to-emerald-100' },
  { id: 'sunset', name: 'Sunset Glow', gradient: 'bg-gradient-to-br from-orange-100 to-pink-100' },
  { id: 'lavender', name: 'Lavender Dream', gradient: 'bg-gradient-to-br from-purple-100 to-indigo-100' },
  { id: 'mint', name: 'Mint Fresh', gradient: 'bg-gradient-to-br from-teal-100 to-green-100' },
];

export const BackgroundPage: React.FC<BackgroundPageProps> = ({ 
  currentBackground, 
  onBackgroundChange 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Customize Background</h2>
        <p className="text-gray-600">Choose a background theme that makes you feel refreshed.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette size={20} className="mr-2" />
            Background Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {backgroundOptions.map((option) => (
              <div
                key={option.id}
                className="relative cursor-pointer group"
                onClick={() => onBackgroundChange(option.id)}
              >
                <div
                  className={`
                    w-full h-24 rounded-lg border-2 transition-all duration-200
                    ${option.gradient}
                    ${currentBackground === option.id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                />
                <div className="mt-2 text-center">
                  <span className={`text-sm font-medium ${
                    currentBackground === option.id ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {option.name}
                  </span>
                </div>
                {currentBackground === option.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
