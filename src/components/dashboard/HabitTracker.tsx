import { Check, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const habits = [
  { id: 1, name: "Lavarme los dientes", frequency: "Diario", difficulty: "Fácil", completed: true, xp: 5 },
  { id: 2, name: "Limpiar mi cuarto", frequency: "Semanal", difficulty: "Medio", completed: true, xp: 10 },
  { id: 3, name: "Ser más aseado", frequency: "Diario", difficulty: "Fácil", completed: true, xp: 5 },
];

export const HabitTracker = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Hábitos Diarios/Semanales</h2>
      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-full ${habit.completed ? 'bg-primary/20' : 'bg-muted'}`}>
                {habit.completed ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{habit.name}</p>
                <p className="text-sm text-muted-foreground">{habit.frequency} • {habit.difficulty}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">+{habit.xp} XP</span>
          </div>
        ))}
      </div>
    </Card>
  );
};