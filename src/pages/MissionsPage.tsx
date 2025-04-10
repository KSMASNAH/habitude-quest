
import { MissionTracker } from "@/components/dashboard/mission/MissionTracker";
import { DateHeader } from "@/components/dashboard/DateHeader";
import { UserProgress } from "@/components/dashboard/UserProgress";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const MissionsPage = () => {
  const [totalXP, setTotalXP] = useState(0);

  // Handle XP gains from completing missions
  const handleXPGain = (xp: number) => {
    setTotalXP(prev => prev + xp);
  };

  // Handle day change (reset missions)
  const handleDayChange = () => {
    // Reset missions
    const missions = JSON.parse(localStorage.getItem('missions') || '[]');
    
    let xpToDeduct = 0;
    
    // Check for incomplete daily missions
    const updatedMissions = missions.map(mission => {
      if (mission.deadline === "Hoy" && mission.status === "En progreso") {
        xpToDeduct += mission.xp; // Deduct XP for each uncompleted daily mission
        return { ...mission, status: "No completada" };
      }
      if (mission.deadline === "Hoy" && mission.status === "Completada") {
        return { ...mission, status: "En progreso" }; // Reset status for daily missions
      }
      return mission;
    });
    
    // Update localStorage with the modified missions
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    // Deduct XP if needed
    if (xpToDeduct > 0) {
      handleXPGain(-xpToDeduct);
      toast.error(`Se han restado ${xpToDeduct} puntos por tareas incompletas`, {
        description: "Completa tus misiones diarias para evitar perder puntos"
      });
    } else {
      toast("¡Nuevo día! Tus misiones se han restablecido", {
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
          Misiones
        </h1>
        
        <DateHeader onDayChange={handleDayChange} />
        
        <UserProgress totalXP={totalXP} />
        
        <div className="grid md:grid-cols-1 gap-8">
          <MissionTracker onXPGain={handleXPGain} />
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;
