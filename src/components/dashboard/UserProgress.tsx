
import { Trophy, Star, Zap, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserProgressProps {
  totalXP: number;
}

export const UserProgress = ({ totalXP }: UserProgressProps) => {
  const xpPerLevel = 100;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const currentLevelXP = totalXP % xpPerLevel;
  const maxLevel = 50;
  
  // Calculate coins (1 coin per 10 XP)
  const coins = Math.floor(totalXP / 10);

  const getCurrentLevel = () => {
    const calculatedLevel = Math.floor(totalXP / xpPerLevel) + 1;
    return Math.min(calculatedLevel, maxLevel);
  };

  const currentLevel = getCurrentLevel();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Nivel {currentLevel}</h2>
            <p className="text-sm text-muted-foreground">
              {currentLevel >= maxLevel ? "¡Nivel máximo alcanzado!" : "¡Sigue así!"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-semibold">{totalXP} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-yellow-600">
              {coins}
            </span>
            <img 
              src="/lovable-uploads/9fc5d33e-dce1-48bb-aae4-379898141e34.png" 
              alt="Bitcoin" 
              className="w-5 h-5 ml-1" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progreso</span>
          <span>{currentLevelXP}/{xpPerLevel} XP</span>
        </div>
        <Progress value={(currentLevelXP / xpPerLevel) * 100} />
      </div>
    </Card>
  );
};
