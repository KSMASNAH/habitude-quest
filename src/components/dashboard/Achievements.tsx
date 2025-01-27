import { Medal, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const achievements = [
  { id: 1, name: "Rey de la Programación", icon: "💻", badge: "🏅", xpBonus: 50, unlocked: false },
  { id: 2, name: "Influencer en Redes", icon: "📱", badge: "⭐", xpBonus: 50, unlocked: false },
  { id: 3, name: "Lector Ejemplar", icon: "📚", badge: "🏅", xpBonus: 50, unlocked: false },
  { id: 4, name: "Experto en IA", icon: "🤖", badge: "⭐", xpBonus: 100, unlocked: false },
  { id: 5, name: "Hogar Limpio", icon: "🧹", badge: "🏅", xpBonus: 30, unlocked: false },
];

export const Achievements = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Medal className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Logros</h2>
      </div>
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
            <p className="text-sm text-muted-foreground">+{achievement.xpBonus} XP</p>
          </div>
        ))}
      </div>
    </Card>
  );
};