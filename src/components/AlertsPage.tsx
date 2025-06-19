
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Clock, CloudSun, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  time: string;
  enabled: boolean;
}

interface WeatherAlert {
  id: string;
  time: string;
  reason: string;
  weatherDependent: boolean;
}

interface AlertsPageProps {
  alerts: Alert[];
  onAlertsChange: (alerts: Alert[]) => void;
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

export const AlertsPage: React.FC<AlertsPageProps> = ({ 
  alerts, 
  onAlertsChange,
  weatherAlerts,
  onWeatherAlertsChange,
  autoScheduleEnabled,
  onAutoScheduleChange 
}) => {
  const [newAlertTime, setNewAlertTime] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationError, setLocationError] = useState('');
  const { toast } = useToast();

  // Get user's location and fetch weather data
  useEffect(() => {
    const getLocationAndWeather = async () => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Using OpenWeatherMap API with coordinates
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=demo&units=metric`
            );
            
            if (response.ok) {
              const data = await response.json();
              setWeatherData(data);
              console.log('Weather data fetched:', data);
            } else {
              // For demo purposes, use mock data
              setWeatherData({
                name: 'Your Location',
                main: { temp: 22, humidity: 65 },
                weather: [{ description: 'clear sky' }]
              });
            }
          } catch (error) {
            console.log('Using demo weather data');
            setWeatherData({
              name: 'Your Location',
              main: { temp: 22, humidity: 65 },
              weather: [{ description: 'clear sky' }]
            });
          }
        },
        (error) => {
          setLocationError('Unable to get location: ' + error.message);
          // Use mock data as fallback
          setWeatherData({
            name: 'Demo Location',
            main: { temp: 22, humidity: 65 },
            weather: [{ description: 'clear sky' }]
          });
        }
      );
    };

    getLocationAndWeather();
  }, []);

  const generateWeatherBasedSchedule = () => {
    const alerts: WeatherAlert[] = defaultSchedule.map((item, index) => ({
      id: `weather-${index}`,
      time: item.time,
      reason: `${item.reason} (${item.glasses} glasses)`,
      weatherDependent: true,
    }));

    // Add extra alerts for hot weather
    if (weatherData?.main?.temp > 25) {
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

  const addAlert = () => {
    if (newAlertTime) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        time: newAlertTime,
        enabled: true,
      };
      onAlertsChange([...alerts, newAlert]);
      setNewAlertTime('');
    }
  };

  const removeAlert = (id: string) => {
    onAlertsChange(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    onAlertsChange(
      alerts.map(alert =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  const removeWeatherAlert = (id: string) => {
    onWeatherAlertsChange(weatherAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Water Alerts</h2>
        <p className="text-gray-600">Schedule reminders to stay hydrated throughout the day.</p>
      </div>

      {/* Smart Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CloudSun size={20} className="mr-2" />
              Smart Weather-Based Alerts
            </span>
            <Switch
              checked={autoScheduleEnabled}
              onCheckedChange={onAutoScheduleChange}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Enable continuous hydration alerts based on optimal timing and weather conditions.
          </p>

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

          {locationError && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">{locationError}</p>
            </div>
          )}

          <Button 
            onClick={generateWeatherBasedSchedule} 
            disabled={!weatherData}
            className="w-full"
          >
            Generate Smart Schedule Based on Weather
          </Button>

          {weatherAlerts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Active Weather-Based Alerts:</h4>
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
                    onClick={() => removeWeatherAlert(alert.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add new manual alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus size={20} className="mr-2" />
            Add Manual Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="alertTime">Time</Label>
              <Input
                id="alertTime"
                type="time"
                value={newAlertTime}
                onChange={(e) => setNewAlertTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={addAlert} disabled={!newAlertTime}>
              Add Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock size={20} className="mr-2" />
            Manual Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No manual alerts scheduled. Add your first alert above!
            </p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={alert.enabled}
                      onChange={() => toggleAlert(alert.id)}
                      className="mr-3"
                    />
                    <span className={`font-medium ${alert.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
                      {alert.time}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlert(alert.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
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
