import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Alert {
  id: string;
  time: string;
  enabled: boolean;
}

interface AlertsPageProps {
  alerts: Alert[];
  onAlertsChange: (alerts: Alert[]) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onAlertsChange }) => {
  const [newAlertTime, setNewAlertTime] = useState('');

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Water Alerts</h2>
        <p className="text-gray-600">Schedule reminders to stay hydrated throughout the day.</p>
      </div>

      {/* Add new alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus size={20} className="mr-2" />
            Add New Alert
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
            Scheduled Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No alerts scheduled. Add your first alert above!
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
