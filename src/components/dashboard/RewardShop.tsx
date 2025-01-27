import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";

const rewards = [
  { id: 1, name: "Media hora de Tiburón", icon: "🦈", cost: 150, available: true },
  { id: 2, name: "Ver una película", icon: "🍿", cost: 200, available: true },
  { id: 3, name: "Comer pollo broster", icon: "🍗", cost: 250, available: true },
  { id: 4, name: "Comer algún dulce", icon: "🍬", cost: 100, available: true },
];

export const RewardShop = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Tienda de Recompensas</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {rewards.map((reward) => (
          <div
            key={reward.id}
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
    </Card>
  );
};