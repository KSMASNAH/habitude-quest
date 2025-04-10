import { Check, Clock, Plus, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
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

  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDifficulty, setNewHabitDifficulty] = useState<"Fácil" | "Medio" | "Difícil">("Fácil");
  const [newHabitXP, setNewHabitXP] = useState(5);
  const [newHabitFrequency, setNewHabitFrequency] = useState<"Diario" | "Semanal">("Diario");

  // Update the addHabit function
  const addHabit = () => {
    if (!newHabitName.trim()) {
      toast.error("El nombre del hábito no puede estar vacío");
      return;
    }

    const newHabit: Habit = {
      id: Date.now(),
      name: newHabitName,
      frequency: newHabitFrequency,
      difficulty: newHabitDifficulty,
      completed: false,
      xp: newHabitXP,
    };

    setHabits(prev => [...prev, newHabit]);
    resetForm();
    toast.success("Nuevo hábito agregado", {
      description: newHabitName,
    });
  };

  const resetForm = () => {
    setNewHabitName("");
    setNewHabitXP(5);
    setNewHabitDifficulty("Fácil");
    setNewHabitFrequency("Diario");
    setShowAddForm(false);
  };

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

  const toggleHabitCompletion = (habitId: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newCompleted = !habit.completed;
          if (newCompleted) {
            onXPGain(habit.xp);
            toast.success(`¡Hábito completado! +${habit.xp} XP`, {
              description: habit.name,
            });
            return { ...habit, completed: true, lastCompletedDate: today };
          } else {
            onXPGain(-habit.xp);
            toast.error("Hábito desmarcado", {
              description: habit.name,
            });
            return { ...habit, completed: false };
          }
        }
        return habit;
      })
    );
  };

  const [habitToDelete, setHabitToDelete] = useState<number | null>(null);
  const deleteButtonsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (habitToDelete !== null) {
        const buttonRef = deleteButtonsRef.current[habitToDelete];
        if (buttonRef && !buttonRef.contains(event.target as Node)) {
          setHabitToDelete(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [habitToDelete]);

  const removeHabit = (habitId: number) => {
    const habitToRemove = habits.find(h => h.id === habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setHabitToDelete(null);
    
    toast.success("Hábito eliminado", {
      description: habitToRemove?.name,
      action: {
        label: "Deshacer",
        onClick: () => {
          if (habitToRemove) {
            setHabits(prev => [...prev, habitToRemove]);
            toast.success("Hábito restaurado");
          }
        }
      }
    });
  };

  // Update the return JSX
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Hábitos Diarios/Semanales</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </Button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Agregar Nuevo Hábito</h3>
            <Button variant="ghost" size="sm" onClick={resetForm} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Nombre:</label>
              <Input 
                placeholder="Nombre del hábito..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Frecuencia:</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm mt-1"
                  value={newHabitFrequency}
                  onChange={(e) => setNewHabitFrequency(e.target.value as "Diario" | "Semanal")}
                >
                  <option value="Diario">Diario</option>
                  <option value="Semanal">Semanal</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Dificultad:</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm mt-1"
                  value={newHabitDifficulty}
                  onChange={(e) => {
                    setNewHabitDifficulty(e.target.value as "Fácil" | "Medio" | "Difícil");
                    setNewHabitXP(e.target.value === "Fácil" ? 5 : e.target.value === "Medio" ? 10 : 15);
                  }}
                >
                  <option value="Fácil">Fácil (5 XP)</option>
                  <option value="Medio">Medio (10 XP)</option>
                  <option value="Difícil">Difícil (15 XP)</option>
                </select>
              </div>
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={addHabit}
            >
              Agregar Hábito
            </Button>
          </div>
        </div>
      )}

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
            {/* Delete button container */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">+{habit.xp} XP</span>
              
              <div ref={el => deleteButtonsRef.current[habit.id] = el}>
                {habitToDelete === habit.id ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                    onClick={() => removeHabit(habit.id)}
                  >
                    Quitar
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setHabitToDelete(habit.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
