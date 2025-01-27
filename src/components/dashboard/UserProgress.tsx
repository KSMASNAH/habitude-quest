import { Trophy, Star, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export const UserProgress = () => {
  const level = 1;
  const xp = 60;
  const maxXp = 100;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Nivel {level}</h2>
            <p className="text-sm text-muted-foreground">¡Sigue así!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          <span className="font-semibold">{xp} XP</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progreso</span>
          <span>{xp}/{maxXp} XP</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${(xp / maxXp) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
};