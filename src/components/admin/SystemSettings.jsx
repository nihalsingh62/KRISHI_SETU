import React from "react";
import { Settings, ShieldCheck, CheckCircle2, Bell } from "lucide-react";

export const SystemSettings = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>KisanSetu Global System Parameters</span>
        </h3>

        <div className="space-y-4 text-xs font-medium">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
            <div>
              <strong className="text-slate-900 block font-extrabold text-sm">Critical Overload Threshold</strong>
              <span className="text-slate-500">Trigger automatic load balancing warnings above capacity load %</span>
            </div>
            <select className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900">
              <option value="90">90% Capacity</option>
              <option value="85">85% Capacity</option>
              <option value="95">95% Capacity</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
            <div>
              <strong className="text-slate-900 block font-extrabold text-sm">Automated SMS & WhatsApp Alerts</strong>
              <span className="text-slate-500">Send queue proximity reminders when farmer is 3rd in queue</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 rounded cursor-pointer" />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
            <div>
              <strong className="text-slate-900 block font-extrabold text-sm">Smart Recommendation Algorithm</strong>
              <span className="text-slate-500">Include distance + waiting time + processing speed weights</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
