
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CloudRain, Sun, CloudSun, Thermometer, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherAlert {
  id: string;
  time: string;
  reason: string;
  weatherDependent: boolean;
}

interface WeatherAlertsPageProps {
  weatherAlerts: WeatherAlert[];
  onWeatherAlertsChange: (alerts: WeatherAlert[]) => void;
  autoScheduleEnabled: boolean;
  onAutoScheduleChange: (enabled: boolean) => void;
}

const defaultSchedule = [
  { time: '07:00', reason: 'Morning rehydration after sleep', glasses: '1-2' },
  { time: '09:00', reason: 'Morning energy & digestion support', glasses: '1' },
  { time: '11:00', reason: 'Maintain alertness before lunch', glasses: '1' },
  { time: '13:00', reason: 'Pre-lunch hydration for digestion', glasses: '1' },
  { time: '15:00', reason: 'Prevent afternoon energy dip', glasses: '1' },
  { time: '17:00', reason: 'Evening preparation', glasses: '1' },
  { time: '19:00', reason: 'Dinner time hydration', glasses: '1' },
  { time: '21:00', reason: 'Light evening hydration', glasses: 'Small sips' },
];

export const WeatherAlertsPage: React.FC<WeatherAlertsPageProps> = ({
  weatherAlerts,
  onWeatherAlertsChange,
  autoScheduleEnabled,
  onAutoScheduleChange,
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const generateWeatherBasedSchedule = () => {
    const alerts: WeatherAlert[] = defaultSchedule.map((item, index) => ({
      id: `weather-${index}`,
      time: item.time,
      reason: `${item.reason} (${item.glasses} glasses)`,
      weatherDependent: true,
    }));

    // Add extra alerts for hot weather
    if (weatherData?.main?.temp > 25) { // Hot weather (above 25°C)
      alerts.push(
        {
          id: 'hot-weather-1',
          time: '10:00',
          reason: 'Extra hydration - Hot weather detected',
          weatherDependent: true,
        },
        {
          id: 'hot-weather-2',
          time: '14:00',
          reason: 'Extra hydration - Hot weather detected',
          weatherDependent: true,
        },
        {
          id: 'hot-weather-3',
          time: '16:00',
          reason: 'Extra hydration - Hot weather detected',
          weatherDependent: true,
        }
      );
    }

    // Add extra alerts for dry weather
    if (weatherData?.main?.humidity < 40) {
      alerts.push({
        id: 'dry-weather',
        time: '12:00',
        reason: 'Extra hydration - Low humidity detected',
        weatherDependent: true,
      });
    }

    onWeatherAlertsChange(alerts);
    toast({
      title: "Weather-Based Schedule Created! 🌤️",
      description: `Generated ${alerts.length} hydration reminders based on current weather conditions.`,
    });
  };

  const fetchWeatherData = async () => {
    if (!apiKey || !location) {
      toast({
        title: "Missing Information",
        description: "Please enter both API key and location.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
        toast({
          title: "Weather Data Updated! 🌤️",
          description: `Current temperature: ${Math.round(data.main.temp)}°C, Humidity: ${data.main.humidity}%`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Weather Fetch Failed",
        description: "Please check your API key and location.",
        variant: "destructive",
      });
    }
  };

  const getWeatherIcon = () => {
    if (!weatherData) return <CloudSun size={24} />;
    
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    
    if (temp > 25) return <Sun size={24} className="text-orange-500" />;
    if (humidity > 80) return <CloudRain size={24} className="text-blue-500" />;
    return <CloudSun size={24} className="text-gray-500" />;
  };

  const removeAlert = (id: string) => {
    onWeatherAlertsChange(weatherAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Weather-Based Hydration Alerts</h2>
        <p className="text-gray-600">
          Smart hydration reminders that adapt to weather conditions and follow optimal timing.
        </p>
      </div>

      {/* Auto Schedule Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Droplets size={20} className="mr-2" />
              Auto-Schedule Alerts
            </span>
            <Switch
              checked={autoScheduleEnabled}
              onCheckedChange={onAutoScheduleChange}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Enable continuous hydration alerts based on optimal timing and weather conditions.
          </p>
        </CardContent>
      </Card>

      {/* Weather Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {getWeatherIcon()}
            <span className="ml-2">Weather Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">OpenWeatherMap API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get a free API key at openweathermap.org
            </p>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city name (e.g., London, UK)"
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={fetchWeatherData} className="flex-1">
              Update Weather Data
            </Button>
            <Button 
              onClick={generateWeatherBasedSchedule} 
              variant="outline"
              disabled={!weatherData}
              className="flex-1"
            >
              Generate Smart Schedule
            </Button>
          </div>

          {weatherData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{weatherData.name}</p>
                  <p className="text-sm text-gray-600">{weatherData.weather[0].description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                  <p className="text-sm text-gray-600">Humidity: {weatherData.main.humidity}%</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Default Schedule Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Optimal Hydration Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {defaultSchedule.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{item.time}</span>
                  <span className="text-sm text-gray-600 ml-2">({item.glasses} glasses)</span>
                </div>
                <span className="text-sm text-gray-500">{item.reason}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Weather-Based Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {weatherAlerts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No weather-based alerts scheduled. Generate a smart schedule above!
            </p>
          ) : (
            <div className="space-y-3">
              {weatherAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{alert.time}</span>
                    <p className="text-sm text-gray-600">{alert.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlert(alert.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
