
import { Plus } from "lucide-react";
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
