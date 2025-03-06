
import { Target, Clock, CheckCircle, XCircle, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Mission {
  id: number;
  name: string;
  priority: "Alta" | "Media" | "Baja";
  deadline: string;
  status: "En progreso" | "Completada" | "No completada";
  xp: number;
  completedDate?: string;
}

interface MissionTrackerProps {
  onXPGain: (xp: number) => void;
}

export const MissionTracker = ({ onXPGain }: MissionTrackerProps) => {
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, name: "Programar 1 hora", priority: "Media", deadline: "Hoy", status: "En progreso", xp: 20 },
    { id: 2, name: "Subir contenido a redes", priority: "Media", deadline: "Hoy", status: "Completada", xp: 20 },
    { id: 3, name: "Leer 1 libro", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
    { id: 4, name: "Aprender sobre IA", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
  ]);

  const [newMissionName, setNewMissionName] = useState("");

  // Try to load missions from localStorage on mount
  useEffect(() => {
    const savedMissions = localStorage.getItem('missions');
    if (savedMissions) {
      setMissions(JSON.parse(savedMissions));
    }
  }, []);

  // Save missions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
  }, [missions]);

  // Reset daily missions
  const resetDailyMissions = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setMissions(prevMissions =>
      prevMissions.map(mission => {
        // Reset only daily missions that were completed on a different day
        if (mission.deadline === "Hoy" && 
            mission.status !== "En progreso" && 
            mission.completedDate !== today) {
          return { ...mission, status: "En progreso" };
        }
        return mission;
      })
    );
  };

  // Register this function to run on component mount and when date changes
  useEffect(() => {
    resetDailyMissions();
  }, []);

  const toggleMissionStatus = (missionId: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
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
        }
        return mission;
      })
    );
  };

  const addMission = () => {
    if (!newMissionName.trim()) {
      toast("El nombre de la misión no puede estar vacío");
      return;
    }

    const newMission: Mission = {
      id: Date.now(),
      name: newMissionName,
      priority: "Media",
      deadline: "Hoy",
      status: "En progreso",
      xp: 20,
    };

    setMissions(prev => [...prev, newMission]);
    setNewMissionName("");
    toast("Nueva misión agregada", {
      description: newMissionName,
    });
  };

  const removeMission = (missionId: number) => {
    setMissions(prev => prev.filter(mission => mission.id !== missionId));
    toast("Misión eliminada");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Misiones (Metas)</h2>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nueva misión..."
          value={newMissionName}
          onChange={(e) => setNewMissionName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addMission()}
        />
        <Button onClick={addMission}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <div key={mission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={`p-1 rounded-full ${
                  mission.status === "Completada" 
                    ? 'bg-primary/20' 
                    : mission.status === "No completada"
                    ? 'bg-destructive/20'
                    : 'bg-accent/20'
                }`}
                onClick={() => toggleMissionStatus(mission.id)}
              >
                {mission.status === "Completada" ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : mission.status === "No completada" ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <Target className="w-4 h-4 text-accent" />
                )}
              </Button>
              <div>
                <p className="font-medium">{mission.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{mission.priority}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{mission.deadline}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">+{mission.xp} XP</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeMission(mission.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
