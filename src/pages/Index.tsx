
import { UserProgress } from "@/components/dashboard/UserProgress";
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { MissionTracker } from "@/components/dashboard/MissionTracker";
import { Achievements } from "@/components/dashboard/Achievements";
import { RewardShop } from "@/components/dashboard/RewardShop";
import { DateHeader } from "@/components/dashboard/DateHeader";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const [totalXP, setTotalXP] = useState(0);
  const xpPerLevel = 100;
  const currentLevel = Math.floor(totalXP / xpPerLevel) + 1;

  // Handle XP gains from completing habits and missions
  const handleXPGain = (xp: number) => {
    setTotalXP(prev => prev + xp);
  };

  // Handle day change (reset habits and missions)
  const handleDayChange = () => {
    // We'll implement this to reset habits/missions
    // without losing XP points
    toast("¡Nuevo día! Tus hábitos y misiones se han restablecido", {
      description: "Tus puntos se mantienen intactos"
    });
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

  // Check for achievement XP
  useEffect(() => {
    const achievementXP = localStorage.getItem('achievementXP');
    if (achievementXP) {
      const xp = parseInt(achievementXP);
      setTotalXP(prev => prev + xp);
      localStorage.removeItem('achievementXP');
      
      // Show toast for achievement XP gain
      toast.success(`¡Logro desbloqueado!`, {
        description: `Has ganado ${xp} XP extra`
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ¡Bienvenido a tu Dashboard de Gamificación!
        </h1>
        
        <DateHeader onDayChange={handleDayChange} />
        
        <UserProgress totalXP={totalXP} />
        
        <div className="grid md:grid-cols-2 gap-8">
          <HabitTracker onXPGain={handleXPGain} />
          <MissionTracker onXPGain={handleXPGain} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Achievements totalXP={totalXP} level={currentLevel} />
          <RewardShop totalXP={totalXP} />
        </div>
      </div>
    </div>
  );
};

export default Index;
