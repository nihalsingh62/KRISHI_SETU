import React from "react";
import { KisanSetuProvider, useKisanSetu } from "./context/KisanSetuContext";
import { HeaderNav } from "./components/common/HeaderNav";
import { LandingPage } from "./components/LandingPage";
import { FarmerPortalView } from "./components/farmer/FarmerPortalView";
import { OperatorDashboard } from "./components/operator/OperatorDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";

const MainContent = () => {
  const { currentRole } = useKisanSetu();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36 min-h-[85vh]">
      {currentRole === "landing" && <LandingPage />}
      {currentRole === "farmer" && <FarmerPortalView />}
      {currentRole === "operator" && <OperatorDashboard />}
      {currentRole === "admin" && <AdminDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <KisanSetuProvider>
      <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
        <HeaderNav />
        <MainContent />
              </div>
    </KisanSetuProvider>
  );
}
