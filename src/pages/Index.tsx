import { UserProgress } from "@/components/dashboard/UserProgress";
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { MissionTracker } from "@/components/dashboard/MissionTracker";
import { Achievements } from "@/components/dashboard/Achievements";
import { RewardShop } from "@/components/dashboard/RewardShop";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ¡Bienvenido a tu Dashboard de Gamificación!
        </h1>
        
        <UserProgress />
        
        <div className="grid md:grid-cols-2 gap-8">
          <HabitTracker />
          <MissionTracker />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Achievements />
          <RewardShop />
        </div>
      </div>
    </div>
  );
};

export default Index;