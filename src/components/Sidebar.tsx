import React from 'react';
import { Bell, Target, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Water Tracker', icon: Menu },
  { id: 'alerts', label: 'Set Alerts', icon: Bell },
  { id: 'limit', label: 'Daily Water Limit', icon: Target },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  currentPage, 
  onPageChange 
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Hydration App</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left",
                    currentPage === item.id && "bg-blue-100 text-blue-700"
                  )}
                  onClick={() => {
                    onPageChange(item.id);
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
