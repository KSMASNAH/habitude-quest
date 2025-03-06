
import { ShoppingBag, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
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

export const RewardShop = () => {
  const [rewards, setRewards] = useState<Reward[]>([
    { id: 1, name: "Media hora de Tiburón", icon: "🦈", cost: 150, available: true },
    { id: 2, name: "Ver una película", icon: "🍿", cost: 200, available: true },
    { id: 3, name: "Comer pollo broster", icon: "🍗", cost: 250, available: true },
    { id: 4, name: "Comer algún dulce", icon: "🍬", cost: 100, available: true },
  ]);

  const [newRewardName, setNewRewardName] = useState("");
  const [newRewardCost, setNewRewardCost] = useState(100);
  const [newRewardIcon, setNewRewardIcon] = useState("🎁");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const addReward = () => {
    if (!newRewardName.trim()) {
      toast("El nombre de la recompensa no puede estar vacío");
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
    setNewRewardName("");
    setNewRewardIcon("🎁");
    setNewRewardCost(100);
    toast("Nueva recompensa agregada", {
      description: newRewardName,
    });
  };

  const handleRewardClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowDialog(true);
    
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const commonIcons = ["🎮", "🎁", "🍕", "🍦", "📱", "🎧", "🎬", "📚", "🎨", "🏖️"];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Tienda de Recompensas</h2>
      </div>

      <div className="space-y-4 mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nueva recompensa..."
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
        
        <div className="flex flex-wrap gap-2 mb-2">
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
        
        <Button onClick={addReward} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Agregar Recompensa
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            onClick={() => handleRewardClick(reward)}
            className="p-3 rounded-lg bg-muted/50 border border-muted hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{reward.icon}</span>
            </div>
            <p className="font-medium text-sm">{reward.name}</p>
            <p className="text-sm text-primary font-semibold">{reward.cost} XP</p>
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
    </Card>
  );
};
