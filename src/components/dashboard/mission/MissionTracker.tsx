
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mission, MissionHandlerProps } from "@/types/mission";
import { MissionItem } from "./MissionItem";
import { defaultMissions, toggleMissionStatus, resetDailyMissions } from "@/utils/missionUtils";

export const MissionTracker = ({ onXPGain }: MissionHandlerProps) => {
  const [missions, setMissions] = useState<Mission[]>(defaultMissions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMissionName, setNewMissionName] = useState("");
  const [newMissionPriority, setNewMissionPriority] = useState<"Baja" | "Media" | "Alta">("Media");
  const [newMissionDeadline, setNewMissionDeadline] = useState<"Hoy" | "Esta semana" | "Este mes">("Hoy");
  const [newMissionXP, setNewMissionXP] = useState(20);

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

  // Register this function to run on component mount and when date changes
  useEffect(() => {
    setMissions(prevMissions => resetDailyMissions(prevMissions));
    
    // Check for changes in localStorage from day change handler in Index.tsx
    const checkForUpdates = () => {
      const savedMissions = localStorage.getItem('missions');
      if (savedMissions) {
        setMissions(JSON.parse(savedMissions));
      }
    };
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkForUpdates);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', checkForUpdates);
    };
  }, []);

  const handleToggleMissionStatus = (missionId: number) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          return toggleMissionStatus(mission, onXPGain);
        }
        return mission;
      })
    );
  };

  const addMission = () => {
    if (!newMissionName.trim()) {
      toast.error("El nombre de la misión no puede estar vacío");
      return;
    }

    const newMission: Mission = {
      id: Date.now(),
      name: newMissionName,
      priority: newMissionPriority,
      deadline: newMissionDeadline,
      status: "En progreso",
      xp: newMissionXP,
    };

    setMissions(prev => [...prev, newMission]);
    resetForm();
    toast.success("Nueva misión agregada", {
      description: newMissionName,
    });
  };

  const resetForm = () => {
    setNewMissionName("");
    setNewMissionPriority("Media");
    setNewMissionDeadline("Hoy");
    setNewMissionXP(20);
    setShowAddForm(false);
  };

  const removeMission = (missionId: number) => {
    setMissions(prev => prev.filter(mission => mission.id !== missionId));
    toast("Misión eliminada");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Misiones (Metas)</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </Button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Agregar Nueva Misión</h3>
            <Button variant="ghost" size="sm" onClick={resetForm} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Nombre:</label>
              <Input 
                placeholder="Nombre de la misión..."
                value={newMissionName}
                onChange={(e) => setNewMissionName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Prioridad:</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm mt-1"
                  value={newMissionPriority}
                  onChange={(e) => setNewMissionPriority(e.target.value as "Baja" | "Media" | "Alta")}
                >
                  <option value="Baja">Baja (10 XP)</option>
                  <option value="Media">Media (20 XP)</option>
                  <option value="Alta">Alta (30 XP)</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Plazo:</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm mt-1"
                  value={newMissionDeadline}
                  onChange={(e) => setNewMissionDeadline(e.target.value as "Hoy" | "Esta semana" | "Este mes")}
                >
                  <option value="Hoy">Hoy</option>
                  <option value="Esta semana">Esta semana</option>
                  <option value="Este mes">Este mes</option>
                </select>
              </div>
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={addMission}
            >
              Agregar Misión
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {missions.map((mission) => (
          <MissionItem 
            key={mission.id} 
            mission={mission} 
            onToggle={handleToggleMissionStatus} 
            onRemove={removeMission} 
          />
        ))}
      </div>
    </Card>
  );
};
