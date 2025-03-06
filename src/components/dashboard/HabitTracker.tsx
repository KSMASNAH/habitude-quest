import { Check, Clock, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Habit {
  id: number;
  name: string;
  frequency: "Diario" | "Semanal";
  difficulty: "Fácil" | "Medio" | "Difícil";
  completed: boolean;
  xp: number;
  lastCompletedDate?: string;
}

interface HabitTrackerProps {
  onXPGain: (xp: number) => void;
}

export const HabitTracker = ({ onXPGain }: HabitTrackerProps) => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Lavarme los dientes", frequency: "Diario", difficulty: "Fácil", completed: false, xp: 5 },
    { id: 2, name: "Limpiar mi cuarto", frequency: "Semanal", difficulty: "Medio", completed: false, xp: 10 },
    { id: 3, name: "Ser más aseado", frequency: "Diario", difficulty: "Fácil", completed: false, xp: 5 },
  ]);

  const [newHabitName, setNewHabitName] = useState("");

  // Try to load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage when they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Check for day change and reset daily habits
  const resetDailyHabits = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        // Only reset if it's a daily habit and it was completed on a different day
        if (habit.frequency === "Diario" && 
            habit.completed && 
            habit.lastCompletedDate !== today) {
          return { ...habit, completed: false };
        }
        return habit;
      })
    );
  };

  // Register this function to run on component mount and when date changes
  useEffect(() => {
    resetDailyHabits();
    
    // Check for changes in localStorage from day change handler in Index.tsx
    const checkForUpdates = () => {
      const savedHabits = localStorage.getItem('habits');
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    };
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkForUpdates);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', checkForUpdates);
    };
  }, []);

  const toggleHabitCompletion = (habitId: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newCompleted = !habit.completed;
          if (newCompleted) {
            onXPGain(habit.xp);
            toast(`¡Hábito completado! +${habit.xp} XP`, {
              description: habit.name,
            });
            return { ...habit, completed: true, lastCompletedDate: today };
          } else {
            onXPGain(-habit.xp);
            toast("Hábito desmarcado", {
              description: habit.name,
            });
            return { ...habit, completed: false };
          }
        }
        return habit;
      })
    );
  };

  const addHabit = () => {
    if (!newHabitName.trim()) {
      toast("El nombre del hábito no puede estar vacío");
      return;
    }

    const newHabit: Habit = {
      id: Date.now(),
      name: newHabitName,
      frequency: "Diario",
      difficulty: "Fácil",
      completed: false,
      xp: 5,
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitName("");
    toast("Nuevo hábito agregado", {
      description: newHabitName,
    });
  };

  const removeHabit = (habitId: number) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    toast("Hábito eliminado");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Hábitos Diarios/Semanales</h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nuevo hábito..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addHabit()}
        />
        <Button onClick={addHabit}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={`p-1 rounded-full ${habit.completed ? 'bg-primary/20' : 'bg-muted'}`}
                onClick={() => toggleHabitCompletion(habit.id)}
              >
                {habit.completed ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
              <div>
                <p className="font-medium">{habit.name}</p>
                <p className="text-sm text-muted-foreground">{habit.frequency} • {habit.difficulty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">+{habit.xp} XP</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeHabit(habit.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
