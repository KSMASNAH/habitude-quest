
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BottomNavbar } from "./components/navigation/BottomNavbar";
import Index from "./pages/Index";
import HabitsPage from "./pages/HabitsPage";
import MissionsPage from "./pages/MissionsPage";
import AchievementsPage from "./pages/AchievementsPage";
import RewardsPage from "./pages/RewardsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/habits" replace />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Routes>
        <BottomNavbar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
