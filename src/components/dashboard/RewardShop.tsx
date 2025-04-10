
import { ShoppingBag, Plus, Trash, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";

interface Reward {
  id: number;
  name: string;
  icon: string;
  cost: number;
  available: boolean;
}

interface RewardShopProps {
  totalXP: number;
}

export const RewardShop = ({ totalXP }: RewardShopProps) => {
  const [rewards, setRewards] = useState<Reward[]>([
    { id: 1, name: "Media hora de Tiburón", icon: "🦈", cost: 150, available: true },
    { id: 2, name: "Ver una película", icon: "🍿", cost: 200, available: true },
    { id: 3, name: "Comer pollo broster", icon: "🍗", cost: 250, available: true },
    { id: 4, name: "Comer algún dulce", icon: "🍬", cost: 100, available: true },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRewardName, setNewRewardName] = useState("");
  const [newRewardCost, setNewRewardCost] = useState(100);
  const [newRewardIcon, setNewRewardIcon] = useState("🎁");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showNotEnoughXP, setShowNotEnoughXP] = useState(false);

  // Load rewards from localStorage on mount
  useEffect(() => {
    const savedRewards = localStorage.getItem('rewards');
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards));
    }
  }, []);

  // Save rewards to localStorage when they change
  useEffect(() => {
    if (rewards.length > 0) {
      localStorage.setItem('rewards', JSON.stringify(rewards));
    }
  }, [rewards]);

  const addReward = () => {
    if (!newRewardName.trim()) {
      toast.error("El nombre de la recompensa no puede estar vacío");
      return;
    }

    const newReward: Reward = {
      id: Date.now(),
      name: newRewardName,
      icon: newRewardIcon || "🎁",
      cost: newRewardCost || 100,
      available: true,
    };

    setRewards(prev => [...prev, newReward]);
    resetForm();
    toast.success("Nueva recompensa agregada", {
      description: newRewardName,
    });
  };

  const resetForm = () => {
    setNewRewardName("");
    setNewRewardIcon("🎁");
    setNewRewardCost(100);
    setShowAddForm(false);
  };

  const [rewardToDelete, setRewardToDelete] = useState<number | null>(null);
  const deleteButtonsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rewardToDelete !== null) {
        const buttonRef = deleteButtonsRef.current[rewardToDelete];
        if (buttonRef && !buttonRef.contains(event.target as Node)) {
          setRewardToDelete(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [rewardToDelete]);

  const handleRewardClick = (reward: Reward) => {
    if (totalXP >= reward.cost) {
      setSelectedReward(reward);
      setShowDialog(true);
      
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setSelectedReward(reward);
      setShowNotEnoughXP(true);
      
      toast.warning("¡Vamos, falta poco!", {
        description: `Necesitas ${reward.cost - totalXP} XP más para esta recompensa`
      });
    }
  };

  // Move the deleteReward function inside the component
    // Add a state to track the last deleted reward
    const [lastDeletedReward, setLastDeletedReward] = useState<Reward | null>(null);
  
    // Update the deleteReward function to store the deleted reward
    const deleteReward = (id: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering the parent onClick
      const rewardToRemove = rewards.find(r => r.id === id);
      
      if (rewardToRemove) {
        setLastDeletedReward(rewardToRemove);
        setRewards(prev => prev.filter(reward => reward.id !== id));
        setRewardToDelete(null);
        
        toast.success("Recompensa eliminada", {
          description: rewardToRemove.name,
          action: {
            label: "Deshacer",
            onClick: () => {
              setRewards(prev => [...prev, rewardToRemove]);
              setLastDeletedReward(null);
              toast.success("Recompensa restaurada");
            }
          }
        });
      }
    };

    const commonIcons = ["🎮", "🎁", "🍕", "🍦", "📱", "🎧", "🎬", "📚", "🎨", "🏖️"];
  
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Tienda de Recompensas</h2>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            <span>Agregar Recompensa</span>
          </Button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Agregar Nueva Recompensa</h3>
              <Button variant="ghost" size="sm" onClick={resetForm} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre de la recompensa..."
                  value={newRewardName}
                  onChange={(e) => setNewRewardName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Costo XP"
                  value={newRewardCost}
                  onChange={(e) => setNewRewardCost(parseInt(e.target.value))}
                  className="w-24"
                  min={1}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Ícono:</label>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map(icon => (
                    <Button
                      key={icon}
                      variant={newRewardIcon === icon ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewRewardIcon(icon)}
                      className="w-8 h-8 p-0"
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full mt-2" 
                onClick={addReward}
              >
                Agregar Recompensa
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              onClick={() => handleRewardClick(reward)}
              className={`p-3 rounded-lg ${totalXP >= reward.cost ? "bg-muted/50 border border-muted hover:border-primary/50" : "bg-muted/30 border border-muted"} transition-colors cursor-pointer relative`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{reward.icon}</span>
                <div 
                  ref={el => deleteButtonsRef.current[reward.id] = el}
                  className="absolute top-1 right-1"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering reward click
                >
                  {rewardToDelete === reward.id ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => deleteReward(reward.id, e)}
                    >
                      Quitar
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRewardToDelete(reward.id);
                      }}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="font-medium text-sm">{reward.name}</p>
              <p className={`text-sm font-semibold ${totalXP >= reward.cost ? "text-primary" : "text-muted-foreground"}`}>
                {reward.cost} XP
                {totalXP < reward.cost && ` (Faltan ${reward.cost - totalXP})`}
              </p>
            </div>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>¡Felicidades! 🎉</DialogTitle>
              <DialogDescription>
                Has desbloqueado esta recompensa
              </DialogDescription>
            </DialogHeader>
            {selectedReward && (
              <div className="flex flex-col items-center py-6">
                <span className="text-6xl mb-4">{selectedReward.icon}</span>
                <h3 className="text-xl font-bold mb-2">{selectedReward.name}</h3>
                <p className="text-muted-foreground">¡Disfruta de tu recompensa!</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showNotEnoughXP} onOpenChange={setShowNotEnoughXP}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>¡Vamos, falta poco! 💪</DialogTitle>
              <DialogDescription>
                Necesitas más XP para desbloquear esta recompensa
              </DialogDescription>
            </DialogHeader>
            {selectedReward && (
              <div className="flex flex-col items-center py-6">
                <span className="text-5xl mb-4">{selectedReward.icon}</span>
                <h3 className="text-xl font-bold mb-2">{selectedReward.name}</h3>
                <p className="text-primary font-medium mb-1">Costo: {selectedReward.cost} XP</p>
                <p className="text-muted-foreground">Tu XP actual: {totalXP} XP</p>
                <p className="font-semibold mt-4">¡Te faltan {selectedReward.cost - totalXP} XP!</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    );
  };
