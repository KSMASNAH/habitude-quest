import { Target, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const missions = [
  { id: 1, name: "Programar 1 hora", priority: "Media", deadline: "Hoy", status: "En progreso", xp: 20 },
  { id: 2, name: "Subir contenido a redes", priority: "Media", deadline: "Hoy", status: "Completada", xp: 20 },
  { id: 3, name: "Leer 1 libro", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
  { id: 4, name: "Aprender sobre IA", priority: "Alta", deadline: "30 Oct", status: "En progreso", xp: 30 },
];

export const MissionTracker = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Misiones (Metas)</h2>
      <div className="space-y-3">
        {missions.map((mission) => (
          <div key={mission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-full ${
                mission.status === "Completada" ? 'bg-primary/20' : 'bg-accent/20'
              }`}>
                {mission.status === "Completada" ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <Target className="w-4 h-4 text-accent" />
                )}
              </div>
              <div>
                <p className="font-medium">{mission.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{mission.priority}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{mission.deadline}</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">+{mission.xp} XP</span>
          </div>
        ))}
      </div>
    </Card>
  );
};