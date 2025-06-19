import React, { useState, useEffect } from 'react';
import { WaterBottle } from '@/components/WaterBottle';
import { AddWaterButton } from '@/components/AddWaterButton';
import { Sidebar } from '@/components/Sidebar';
import { AlertsPage } from '@/components/AlertsPage';
import { DailyLimitPage } from '@/components/DailyLimitPage';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
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

const Index = () => {
  const [currentIntake, setCurrentIntake] = useState(() => {
    const saved = localStorage.getItem('waterIntake');
    return saved ? parseInt(saved) : 0;
  });
  
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? parseInt(saved) : 2000;
  });
  
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('alerts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>(() => {
    const saved = localStorage.getItem('weatherAlerts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(() => {
    const saved = localStorage.getItem('autoScheduleEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const { toast } = useToast();

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('waterIntake', currentIntake.toString());
  }, [currentIntake]);

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('weatherAlerts', JSON.stringify(weatherAlerts));
  }, [weatherAlerts]);

  useEffect(() => {
    localStorage.setItem('autoScheduleEnabled', JSON.stringify(autoScheduleEnabled));
  }, [autoScheduleEnabled]);

  // Reset intake at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('lastReset');
      const today = now.toDateString();
      
      if (lastReset !== today) {
        setCurrentIntake(0);
        localStorage.setItem('lastReset', today);
        toast({
          title: "New Day Started!",
          description: "Your water intake has been reset for today.",
        });
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [toast]);

  // Enhanced alert system that includes weather alerts
  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      
      // Check regular alerts
      alerts.forEach(alert => {
        if (alert.enabled && alert.time === currentTime) {
          toast({
            title: "Hydration Reminder! 💧",
            description: "Time to drink some water and stay hydrated!",
          });
        }
      });

      // Check weather-based alerts if auto-schedule is enabled
      if (autoScheduleEnabled) {
        weatherAlerts.forEach(alert => {
          if (alert.time === currentTime) {
            toast({
              title: "Smart Hydration Alert! 🌤️💧",
              description: alert.reason,
            });
          }
        });
      }
    };

    const interval = setInterval(checkAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [alerts, weatherAlerts, autoScheduleEnabled, toast]);

  const addWater = () => {
    const newIntake = currentIntake + 500;
    setCurrentIntake(newIntake);
    
    // Show motivational messages
    const percentage = (newIntake / dailyGoal) * 100;
    if (percentage >= 100) {
      toast({
        title: "🎉 Daily Goal Achieved!",
        description: "Congratulations! You've reached your hydration goal!",
      });
    } else if (percentage >= 75) {
      toast({
        title: "Almost There! 💪",
        description: "You're doing great! Keep up the good hydration!",
      });
    } else if (percentage >= 50) {
      toast({
        title: "Halfway There! 👍",
        description: "You're making good progress on your hydration goal!",
      });
    }
  };

  const getHydrationStatus = () => {
    const percentage = (currentIntake / dailyGoal) * 100;
    if (percentage < 30) return { status: 'dehydrated', color: 'text-red-600' };
    if (percentage < 60) return { status: 'low', color: 'text-orange-600' };
    if (percentage <= 100) return { status: 'good', color: 'text-blue-600' };
    return { status: 'over', color: 'text-red-600' };
  };

  const hydrationStatus = getHydrationStatus();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'alerts':
        return (
          <AlertsPage 
            alerts={alerts} 
            onAlertsChange={setAlerts}
            weatherAlerts={weatherAlerts}
            onWeatherAlertsChange={setWeatherAlerts}
            autoScheduleEnabled={autoScheduleEnabled}
            onAutoScheduleChange={setAutoScheduleEnabled}
          />
        );
      case 'limit':
        return <DailyLimitPage dailyGoal={dailyGoal} onDailyGoalChange={setDailyGoal} />;
      default:
        return (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Stay Hydrated! 💧
              </h1>
              <p className={`text-lg font-medium ${hydrationStatus.color}`}>
                {hydrationStatus.status === 'dehydrated' && "You need more water! Stay hydrated."}
                {hydrationStatus.status === 'low' && "You're getting there! Keep drinking."}
                {hydrationStatus.status === 'good' && "Great job! You're well hydrated."}
                {hydrationStatus.status === 'over' && "Careful! You might be drinking too much."}
              </p>
            </div>
            
            <WaterBottle 
              currentIntake={currentIntake} 
              dailyGoal={dailyGoal} 
              className="mb-8"
            />
            
            <div className="flex justify-center">
              <AddWaterButton onAddWater={addWater} />
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Click the + button to add 500ml of water
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b p-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
          </header>
          
          {/* Main Content */}
          <main className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
