
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { DateHeader } from "@/components/dashboard/DateHeader";
import { UserProgress } from "@/components/dashboard/UserProgress";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const HabitsPage = () => {
  const [totalXP, setTotalXP] = useState(0);

  // Handle XP gains from completing habits
  const handleXPGain = (xp: number) => {
    setTotalXP(prev => prev + xp);
  };

  // Handle day change (reset habits)
  const handleDayChange = () => {
    // Reset habits
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    
    let xpToDeduct = 0;
    
    // Check for incomplete daily habits
    const updatedHabits = habits.map(habit => {
      if (habit.frequency === "Diario" && !habit.completed) {
        xpToDeduct += habit.xp; // Deduct XP for each uncompleted daily habit
        return { ...habit, completed: false };
      }
      if (habit.frequency === "Diario") {
        return { ...habit, completed: false }; // Reset completed status for daily habits
      }
      return habit;
    });
    
    // Update localStorage with the modified habits
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    
    // Deduct XP if needed
    if (xpToDeduct > 0) {
      handleXPGain(-xpToDeduct);
      toast.error(`Se han restado ${xpToDeduct} puntos por tareas incompletas`, {
        description: "Completa tus hábitos diarios para evitar perder puntos"
      });
    } else {
      toast("¡Nuevo día! Tus hábitos se han restablecido", {
        description: "Tus puntos se mantienen intactos"
      });
    }
  };

  // Try to get XP from localStorage on mount
  useEffect(() => {
    const savedXP = localStorage.getItem('totalXP');
    if (savedXP) {
      setTotalXP(parseInt(savedXP));
    }
  }, []);

  // Save XP to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('totalXP', totalXP.toString());
  }, [totalXP]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Hábitos
        </h1>
        
        <DateHeader onDayChange={handleDayChange} />
        
        <UserProgress totalXP={totalXP} />
        
        <div className="grid md:grid-cols-1 gap-8">
          <HabitTracker onXPGain={handleXPGain} />
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
