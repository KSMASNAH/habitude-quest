
import { Medal, Star, Edit2, Save, Plus, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Achievement {
  id: number;
  name: string;
  icon: string;
  badge: string;
  xpBonus: number;
  xpRequired: number;
  unlocked: boolean;
}

interface AchievementsProps {
  totalXP: number;
  level: number;
}

export const Achievements = ({ totalXP, level }: AchievementsProps) => {
  // Initial achievements
  const initialAchievements: Achievement[] = [
    { 
      id: 1, 
      name: "Rey de la Programación", 
      icon: "💻", 
      badge: "🏅", 
      xpBonus: 50, 
      xpRequired: 200,
      unlocked: false
    },
    { 
      id: 2, 
      name: "Influencer en Redes", 
      icon: "📱", 
      badge: "⭐", 
      xpBonus: 50, 
      xpRequired: 300,
      unlocked: false 
    },
    { 
      id: 3, 
      name: "Lector Ejemplar", 
      icon: "📚", 
      badge: "🏅", 
      xpBonus: 50, 
      xpRequired: 400,
      unlocked: false 
    },
    { 
      id: 4, 
      name: "Experto en IA", 
      icon: "🤖", 
      badge: "⭐", 
      xpBonus: 100, 
      xpRequired: 500,
      unlocked: false 
    },
    { 
      id: 5, 
      name: "Hogar Limpio", 
      icon: "🧹", 
      badge: "🏅", 
      xpBonus: 30, 
      xpRequired: 150,
      unlocked: false 
    },
  ];

  // Editable achievement state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Achievement>>({});

  // Icon options
  const iconOptions = ["💻", "📱", "📚", "🤖", "🧹", "🎮", "🎨", "🏃", "🍳", "🏆"];
  const badgeOptions = ["🏅", "⭐", "🎖️", "🥇", "💎", "🎁"];

  // New achievement form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({
    name: "",
    icon: "🏆",
    badge: "🏅",
    xpBonus: 50,
    xpRequired: 500
  });

  // Load achievements from localStorage or use defaults
  useEffect(() => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(initialAchievements);
    }
  }, []);

  // Save achievements to localStorage when they change
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(achievements));
    }
  }, [achievements]);

  // Check for unlocked achievements when XP changes
  useEffect(() => {
    let xpGained = 0;

    const updatedAchievements = achievements.map(achievement => {
      // Check if this achievement should be unlocked now
      if (!achievement.unlocked && totalXP >= achievement.xpRequired) {
        xpGained += achievement.xpBonus;
        
        // Show toast for newly unlocked achievement
        toast.success(`¡Logro desbloqueado: ${achievement.name}!`, {
          description: `+${achievement.xpBonus} XP`
        });
        
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });

    // Add to totalXP if any achievements were newly unlocked
    if (xpGained > 0) {
      // This will update the XP in the parent component through localStorage
      localStorage.setItem('achievementXP', xpGained.toString());
      setTimeout(() => localStorage.removeItem('achievementXP'), 100);
    }

    setAchievements(updatedAchievements);
  }, [totalXP, achievements]);

  // Start editing an achievement
  const startEditing = (achievement: Achievement) => {
    setEditingId(achievement.id);
    setEditValues({ ...achievement });
  };

  // Save edited achievement
  const saveAchievement = () => {
    if (!editingId) return;

    setAchievements(prevAchievements => 
      prevAchievements.map(a => 
        a.id === editingId ? { ...a, ...editValues } : a
      )
    );
    
    setEditingId(null);
    setEditValues({});
    toast.success("Logro actualizado");
  };

  // Add new achievement
  const addAchievement = () => {
    if (!newAchievement.name) {
      toast.error("El nombre del logro no puede estar vacío");
      return;
    }

    const newId = Math.max(0, ...achievements.map(a => a.id)) + 1;
    
    const achievementToAdd: Achievement = {
      id: newId,
      name: newAchievement.name || "Nuevo Logro",
      icon: newAchievement.icon || "🏆",
      badge: newAchievement.badge || "🏅",
      xpBonus: newAchievement.xpBonus || 50,
      xpRequired: newAchievement.xpRequired || 500,
      unlocked: totalXP >= (newAchievement.xpRequired || 500)
    };
    
    setAchievements(prev => [...prev, achievementToAdd]);
    setIsAddingNew(false);
    setNewAchievement({
      name: "",
      icon: "🏆",
      badge: "🏅",
      xpBonus: 50,
      xpRequired: 500
    });
    
    toast.success("Nuevo logro agregado");
  };

  // Delete an achievement
  const deleteAchievement = (id: number) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    toast.success("Logro eliminado");
  };

  // Sort achievements by unlocked status and then by XP required
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return a.xpRequired - b.xpRequired;
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Logros</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </Button>
      </div>

      {isAddingNew && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/30">
          <h3 className="font-medium mb-2">Agregar Nuevo Logro</h3>
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
                      type="button"
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
                      type="button"
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
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">XP Requerido:</label>
                <Input 
                  type="number"
                  value={newAchievement.xpRequired} 
                  onChange={(e) => setNewAchievement({...newAchievement, xpRequired: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
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
            </div>
            
            <div className="flex justify-end gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingNew(false)}
              >
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={addAchievement}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {sortedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border ${
              achievement.unlocked
                ? "bg-primary/10 border-primary"
                : "bg-muted/50 border-muted"
            }`}
          >
            {editingId === achievement.id ? (
              <div className="space-y-2">
                <Input 
                  value={editValues.name || ''} 
                  onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                  placeholder="Nombre del logro"
                  className="mb-2"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">Ícono:</label>
                    <div className="flex flex-wrap gap-1">
                      {iconOptions.slice(0, 5).map(icon => (
                        <Button
                          key={icon}
                          type="button"
                          variant={editValues.icon === icon ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setEditValues({...editValues, icon})}
                          className="text-sm p-0 h-6 w-6"
                        >
                          {icon}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs">Medalla:</label>
                    <div className="flex flex-wrap gap-1">
                      {badgeOptions.slice(0, 3).map(badge => (
                        <Button
                          key={badge}
                          type="button"
                          variant={editValues.badge === badge ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setEditValues({...editValues, badge})}
                          className="text-sm p-0 h-6 w-6"
                        >
                          {badge}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">XP Req:</label>
                    <Input 
                      type="number"
                      value={editValues.xpRequired || 0} 
                      onChange={(e) => setEditValues({...editValues, xpRequired: parseInt(e.target.value) || 0})}
                      className="h-6 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs">Bonus XP:</label>
                    <Input 
                      type="number"
                      value={editValues.xpBonus || 0} 
                      onChange={(e) => setEditValues({...editValues, xpBonus: parseInt(e.target.value) || 0})}
                      className="h-6 text-xs"
                    />
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={saveAchievement}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-lg">{achievement.badge}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => startEditing(achievement)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => deleteAchievement(achievement.id)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="font-medium text-sm">{achievement.name}</p>
                <p className="text-sm text-muted-foreground">
                  {achievement.unlocked 
                    ? `+${achievement.xpBonus} XP` 
                    : `${totalXP}/${achievement.xpRequired} XP`}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
