import React, { useState } from "react";
import { useKisanSetu } from "../context/KisanSetuContext";
import {
  Wheat,
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

export const LandingPage = () => {
  const { t, login } = useKisanSetu();
  const [selectedRole, setSelectedRole] = useState(null); // 'farmer' | 'operator' | 'admin'

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate authentication
    if (selectedRole === "farmer") {
      login("farmer", { name: "Ramesh Singh", id: "XXXX XXXX 4821", type: "farmer" });
    } else if (selectedRole === "operator") {
      login("operator", { name: "Operator User", centre: "ABC Procurement Centre", type: "operator" });
    } else if (selectedRole === "admin") {
      login("admin", { name: "System Admin", type: "admin" });
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full space-y-8">
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg mb-4">
            <Wheat className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            KisanSetu
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Digital Procurement & Queue Management
          </p>
          {!selectedRole && (
            <p className="mt-4 text-xs text-slate-500 max-w-sm mx-auto">
              Book your procurement slot, receive a digital token, and track your queue without waiting at the mandi.
            </p>
          )}
        </div>

        {!selectedRole ? (
          <div className="space-y-4 mt-8">
            <div className="text-center mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Role</h3>
            </div>
            
            <button
              onClick={() => setSelectedRole("farmer")}
              className="w-full group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex items-center text-left gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">Farmer</h4>
                <p className="text-xs text-slate-500">Book & Track Procurement</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button
              onClick={() => setSelectedRole("operator")}
              className="w-full group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex items-center text-left gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">Procurement Centre Operator</h4>
                <p className="text-xs text-slate-500">Manage Queue & Procurement</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>

            <button
              onClick={() => setSelectedRole("admin")}
              className="w-full group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all flex items-center text-left gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">Department Administrator</h4>
                <p className="text-xs text-slate-500">Monitor Procurement Network</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <button 
              onClick={() => setSelectedRole(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to roles
            </button>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {selectedRole === "farmer" && <><User className="w-5 h-5 text-emerald-600"/> Farmer Login</>}
                {selectedRole === "operator" && <><Building2 className="w-5 h-5 text-blue-600"/> Operator Login</>}
                {selectedRole === "admin" && <><ShieldCheck className="w-5 h-5 text-indigo-600"/> Administrator Login</>}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Please authenticate to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {selectedRole === "farmer" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar / VID</label>
                    <input type="text" placeholder="XXXX XXXX XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required defaultValue="9876 5432 1098" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input type="tel" placeholder="+91" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required defaultValue="9876543210" />
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-emerald-800 font-medium">
                      Identity verification simulated for prototype.
                    </p>
                  </div>
                  <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
                    Verify & Continue
                  </button>
                </>
              )}

              {selectedRole === "operator" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID</label>
                    <input type="text" placeholder="OP-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required defaultValue="OP-1042" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Procurement Centre</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>ABC Procurement Centre</option>
                      <option>Rampur Mandi Hub</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password / OTP</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required defaultValue="password" />
                  </div>
                  <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors">
                    Login to Centre
                  </button>
                </>
              )}

              {selectedRole === "admin" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Administrator ID</label>
                    <input type="text" placeholder="ADMIN-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required defaultValue="ADMIN-001" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password / OTP</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required defaultValue="password" />
                  </div>
                  <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-colors">
                    Access Dashboard
                  </button>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
