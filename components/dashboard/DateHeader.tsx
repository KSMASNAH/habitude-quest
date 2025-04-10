
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

interface DateHeaderProps {
  onDayChange: () => void;
}

export const DateHeader = ({ onDayChange }: DateHeaderProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<string>("");
  const [lastCheckedDay, setLastCheckedDay] = useState<number>(new Date().getDate());

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(format(now, "HH:mm"));
      
      // Check if the day has changed
      const currentDay = now.getDate();
      if (currentDay !== lastCheckedDay) {
        setLastCheckedDay(currentDay);
        onDayChange();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [lastCheckedDay, onDayChange]);

  return (
    <Card className="p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
            <span className="font-semibold">
              {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Ver calendario
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{currentTime}</span>
        </div>
      </div>
    </Card>
  );
};
