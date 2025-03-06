
import { Mission } from "@/types/mission";
import { toast } from "sonner";

export const defaultMissions: Mission[] = [
  { id: 1, name: "Programar 1 hora", priority: "Media", deadline: "Hoy", status: "En progreso", xp: 20 },
  { id: 2, name: "Subir contenido a redes", priority: "Media", deadline: "Hoy", status: "Completada", xp: 20 },
  { id: 3, name: "Leer 1 libro", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
  { id: 4, name: "Aprender sobre IA", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
];

export const toggleMissionStatus = (
  mission: Mission, 
  onXPGain: (xp: number) => void
): Mission => {
  const today = new Date().toISOString().split('T')[0];
  const prevStatus = mission.status;
  const newStatus = mission.status === "Completada" 
    ? "No completada" 
    : mission.status === "No completada"
    ? "En progreso"
    : "Completada";
  
  // Handle XP changes
  if (newStatus === "Completada" && prevStatus !== "Completada") {
    onXPGain(mission.xp);
    toast(`¡Misión completada! +${mission.xp} XP`, {
      description: mission.name,
    });
    return { ...mission, status: newStatus, completedDate: today };
  } else if (prevStatus === "Completada" && newStatus !== "Completada") {
    onXPGain(-mission.xp);
    toast(newStatus === "No completada" 
      ? "Misión marcada como no completada" 
      : "Misión en progreso", {
      description: mission.name,
    });
    return { ...mission, status: newStatus };
  }
  
  return { ...mission, status: newStatus };
};

export const resetDailyMissions = (missions: Mission[]): Mission[] => {
  const today = new Date().toISOString().split('T')[0];
  
  return missions.map(mission => {
    // Reset only daily missions that were completed on a different day
    if (mission.deadline === "Hoy" && 
        mission.status !== "En progreso" && 
        mission.completedDate !== today) {
      return { ...mission, status: "En progreso" };
    }
    return mission;
  });
};
