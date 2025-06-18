
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Droplets } from 'lucide-react';

interface DailyLimitPageProps {
  dailyGoal: number;
  onDailyGoalChange: (goal: number) => void;
}

const presetGoals = [
  { label: '1.5L', value: 1500, description: 'Minimum recommended' },
  { label: '2L', value: 2000, description: 'Standard goal' },
  { label: '2.5L', value: 2500, description: 'Active lifestyle' },
  { label: '3L', value: 3000, description: 'High activity' },
];

export const DailyLimitPage: React.FC<DailyLimitPageProps> = ({ 
  dailyGoal, 
  onDailyGoalChange 
}) => {
  const [customGoal, setCustomGoal] = useState(dailyGoal.toString());

  const handleCustomGoalSubmit = () => {
    const goal = parseInt(customGoal);
    if (goal > 0 && goal <= 5000) {
      onDailyGoalChange(goal);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Water Limit</h2>
        <p className="text-gray-600">Set your daily hydration goal to stay healthy and energized.</p>
      </div>

      {/* Current Goal Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target size={20} className="mr-2" />
            Current Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {(dailyGoal / 1000).toFixed(1)}L
            </div>
            <div className="text-gray-600">
              {dailyGoal}ml per day
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplets size={20} className="mr-2" />
            Quick Select
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {presetGoals.map((preset) => (
              <Button
                key={preset.value}
                variant={dailyGoal === preset.value ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center"
                onClick={() => onDailyGoalChange(preset.value)}
              >
                <span className="text-lg font-bold">{preset.label}</span>
                <span className="text-xs text-gray-500 mt-1">
                  {preset.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="customGoal">Custom amount (ml)</Label>
              <Input
                id="customGoal"
                type="number"
                min="500"
                max="5000"
                step="100"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="mt-1"
                placeholder="Enter amount in ml"
              />
            </div>
            <Button onClick={handleCustomGoalSubmit}>
              Set Goal
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Recommended range: 1500ml - 3000ml per day
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
