
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddWaterButtonProps {
  onAddWater: () => void;
  className?: string;
  disabled?: boolean;
}

export const AddWaterButton: React.FC<AddWaterButtonProps> = ({ 
  onAddWater, 
  className,
  disabled = false
}) => {
  return (
    <Button
      onClick={onAddWater}
      disabled={disabled}
      className={cn(
        "w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
    >
      <Plus size={24} />
    </Button>
  );
};
