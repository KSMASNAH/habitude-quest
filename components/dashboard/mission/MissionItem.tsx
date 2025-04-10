
import { Target, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types/mission";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

interface MissionItemProps {
  mission: Mission;
  onToggle: (missionId: number) => void;
  onRemove: (missionId: number) => void;
}

export const MissionItem = ({ mission, onToggle, onRemove }: MissionItemProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteButtonRef.current && !deleteButtonRef.current.contains(event.target as Node)) {
        setShowDeleteConfirm(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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
          onClick={() => onToggle(mission.id)}
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
        
        <div ref={deleteButtonRef}>
          {showDeleteConfirm ? (
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              onClick={() => {
                onRemove(mission.id);
                setShowDeleteConfirm(false);
              }}
            >
              Quitar
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
