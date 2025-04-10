import { Medal, Star, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import confetti from "canvas-confetti";

// Add XP thresholds for each achievement
const initialAchievements = [
  { id: 1, name: "Rey de la Programación", icon: "💻", badge: "🏅", xpBonus: 50, unlocked: false, xpRequired: 100 },
  { id: 2, name: "Influencer en Redes", icon: "📱", badge: "⭐", xpBonus: 50, unlocked: false, xpRequired: 200 },
  { id: 3, name: "Lector Ejemplar", icon: "📚", badge: "🏅", xpBonus: 50, unlocked: false, xpRequired: 300 },
  { id: 4, name: "Experto en IA", icon: "🤖", badge: "⭐", xpBonus: 100, unlocked: false, xpRequired: 500 },
  { id: 5, name: "Hogar Limpio", icon: "🧹", badge: "🏅", xpBonus: 30, unlocked: false, xpRequired: 150 },
];

interface AchievementsProps {
  totalXP: number;
  level: number;
  onXPGain?: (xp: number) => void;
}

export const Achievements = ({ totalXP, level, onXPGain = () => {} }: AchievementsProps) => {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    name: "",
    icon: "🏆",
    badge: "🏅",
    xpBonus: 50,
    xpRequired: 100,
  });
  const [unlockedAchievement, setUnlockedAchievement] = useState<typeof achievements[0] | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  const iconOptions = ["💻", "📱", "📚", "🤖", "🧹", "🎮", "🎨", "🏃", "🍳", "🏆"];
  const badgeOptions = ["🏅", "⭐", "🎖️", "🥇", "💎", "🎁"];

  // Load achievements from localStorage on mount
  useEffect(() => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save achievements to localStorage when they change
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Check for unlockable achievements and lock achievements when XP decreases
  useEffect(() => {
    let updated = false;
    
    setAchievements(prev => {
      const newAchievements = prev.map(achievement => {
        // Check if user has enough XP to unlock
        if (totalXP >= achievement.xpRequired) {
          // If not already unlocked, this is a new unlock
          if (!achievement.unlocked && !updated) {
            setUnlockedAchievement(achievement);
            setShowUnlockDialog(true);
            updated = true;
            
            // Trigger confetti effect
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            
            // Award the XP bonus
            onXPGain(achievement.xpBonus);
          }
          
          return { ...achievement, unlocked: true };
        } else {
          // If XP is now below the requirement and it was previously unlocked
          if (achievement.unlocked) {
            toast.warning(`Logro bloqueado: ${achievement.name}`, {
              description: "Has perdido XP y se ha bloqueado este logro."
            });
          }
          
          return { ...achievement, unlocked: false };
        }
      });
      
      return newAchievements;
    });
  }, [totalXP, onXPGain]);

  const addAchievement = () => {
    if (!newAchievement.name) {
      toast.error("El nombre del logro no puede estar vacío");
      return;
    }

    const newId = Math.max(0, ...achievements.map(a => a.id)) + 1;
    
    setAchievements(prev => [...prev, {
      ...newAchievement,
      id: newId,
      unlocked: false
    }]);
    
    setIsAddingNew(false);
    setNewAchievement({
      name: "",
      icon: "🏆",
      badge: "🏅",
      xpBonus: 50,
      xpRequired: 100,
    });
    
    toast.success("Nuevo logro agregado");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Logros</h2>
        </div>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-1 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </Button>
      </div>

      {isAddingNew && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Agregar Nuevo Logro</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsAddingNew(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Nombre:</label>
              <Input 
                value={newAchievement.name} 
                onChange={(e) => setNewAchievement({...newAchievement, name: e.target.value})}
                placeholder="Nombre del logro"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Ícono:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {iconOptions.map(icon => (
                    <Button
                      key={icon}
                      variant={newAchievement.icon === icon ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setNewAchievement({...newAchievement, icon})}
                      className="text-xl p-1 h-8 w-8"
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Medalla:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {badgeOptions.map(badge => (
                    <Button
                      key={badge}
                      variant={newAchievement.badge === badge ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setNewAchievement({...newAchievement, badge})}
                      className="text-xl p-1 h-8 w-8"
                    >
                      {badge}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">XP de Recompensa:</label>
              <Input 
                type="number"
                value={newAchievement.xpBonus} 
                onChange={(e) => setNewAchievement({...newAchievement, xpBonus: parseInt(e.target.value) || 0})}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">XP Requerido para Desbloquear:</label>
              <Input 
                type="number"
                value={newAchievement.xpRequired} 
                onChange={(e) => setNewAchievement({...newAchievement, xpRequired: parseInt(e.target.value) || 0})}
                className="mt-1"
              />
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={addAchievement}
            >
              Agregar Logro
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border ${
              achievement.unlocked
                ? "bg-primary/10 border-primary"
                : "bg-muted/50 border-muted"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{achievement.icon}</span>
              <span className="text-lg">{achievement.badge}</span>
            </div>
            <p className="font-medium text-sm">{achievement.name}</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">+{achievement.xpBonus} XP</p>
              {!achievement.unlocked && (
                <p className="text-xs text-muted-foreground">{achievement.xpRequired} XP requeridos</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Unlocked Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Lo has logrado! 🎉</DialogTitle>
          </DialogHeader>
          {unlockedAchievement && (
            <div className="flex flex-col items-center py-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{unlockedAchievement.icon}</span>
                <span className="text-4xl">{unlockedAchievement.badge}</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{unlockedAchievement.name}</h3>
              <p className="text-primary font-medium mb-4">+{unlockedAchievement.xpBonus} XP de bonificación</p>
              <p className="text-xl font-bold text-center">¡Eres un campeón!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
