
import { Achievements } from "@/components/dashboard/Achievements";
import { DateHeader } from "@/components/dashboard/DateHeader";
import { UserProgress } from "@/components/dashboard/UserProgress";
import { useState, useEffect } from "react";

const AchievementsPage = () => {
  const [totalXP, setTotalXP] = useState(0);
  const xpPerLevel = 100;
  const currentLevel = Math.floor(totalXP / xpPerLevel) + 1;

  // Handle XP gains from achievements
  const handleXPGain = (xp: number) => {
    setTotalXP(prev => prev + xp);
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
          Logros
        </h1>
        
        <DateHeader onDayChange={() => {}} />
        
        <UserProgress totalXP={totalXP} />
        
        <div className="grid md:grid-cols-1 gap-8">
          <Achievements totalXP={totalXP} level={currentLevel} onXPGain={handleXPGain} />
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
