
import { Link, useLocation } from "react-router-dom";
import { List, Target, Trophy, Gift } from "lucide-react";

export const BottomNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around z-50">
      <Link to="/habits" className={`flex flex-col items-center ${isActive('/habits') ? 'text-primary' : 'text-gray-500'}`}>
        <List className="h-6 w-6" />
        <span className="text-xs mt-1">Hábitos</span>
      </Link>
      
      <Link to="/missions" className={`flex flex-col items-center ${isActive('/missions') ? 'text-primary' : 'text-gray-500'}`}>
        <Target className="h-6 w-6" />
        <span className="text-xs mt-1">Misiones</span>
      </Link>
      
      <Link to="/achievements" className={`flex flex-col items-center ${isActive('/achievements') ? 'text-primary' : 'text-gray-500'}`}>
        <Trophy className="h-6 w-6" />
        <span className="text-xs mt-1">Logros</span>
      </Link>
      
      <Link to="/rewards" className={`flex flex-col items-center ${isActive('/rewards') ? 'text-primary' : 'text-gray-500'}`}>
        <Gift className="h-6 w-6" />
        <span className="text-xs mt-1">Tienda</span>
      </Link>
    </div>
  );
};
