
import { Target, Clock, CheckCircle, XCircle, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
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
}

export const MissionTracker = () => {
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, name: "Programar 1 hora", priority: "Media", deadline: "Hoy", status: "En progreso", xp: 20 },
    { id: 2, name: "Subir contenido a redes", priority: "Media", deadline: "Hoy", status: "Completada", xp: 20 },
    { id: 3, name: "Leer 1 libro", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
    { id: 4, name: "Aprender sobre IA", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
  ]);

  const [newMissionName, setNewMissionName] = useState("");

  const toggleMissionStatus = (missionId: number) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          const newStatus = mission.status === "Completada" 
            ? "No completada" 
            : mission.status === "No completada"
            ? "En progreso"
            : "Completada";
          
          const message = newStatus === "Completada" 
            ? `¡Misión completada! +${mission.xp} XP` 
            : newStatus === "No completada"
            ? "Misión marcada como no completada"
            : "Misión en progreso";
          
          toast(message, {
            description: mission.name,
          });
          
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
