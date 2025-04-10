
export interface Mission {
  id: number;
  name: string;
  priority: "Alta" | "Media" | "Baja";
  deadline: string;
  status: "En progreso" | "Completada" | "No completada";
  xp: number;
  completedDate?: string;
}

export interface MissionHandlerProps {
  onXPGain: (xp: number) => void;
}
