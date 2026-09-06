import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { CongestionMap } from "./CongestionMap";
import { CentreMonitoring } from "./CentreMonitoring";
import { ProcurementAnalytics } from "./ProcurementAnalytics";
import { SystemSettings } from "./SystemSettings";
import {
  ShieldCheck,
  Building2,
  Users,
  Clock,
  AlertTriangle,
  MapPin,
  TrendingUp,
  CreditCard,
  Settings,
  Sparkles
} from "lucide-react";

export const AdminDashboard = () => {
  const { t, centres, tokens } = useKisanSetu();
  const [activeTab, setActiveTab] = useState("map"); // map | monitoring | analytics | settings

  const totalBooked = tokens.length * 142; // Scaled demo total
  const totalWaiting = centres.reduce((acc, c) => acc + c.queueDepth, 0) * 105;
  const avgWait = Math.round(centres.reduce((acc, c) => acc + (c.queueDepth * 4 + 10), 0) / centres.length);
  const criticalCentres = centres.filter((c) => c.status === "CRITICAL" || c.status === "HIGH_LOAD").length;

  return (
    <div className="space-y-6">
      {/* Admin Central Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("adminDashboard")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              State Procurement Dashboard
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Monitoring 128 Procurement Centres
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-indigo-950/80 border border-indigo-500/40 px-3 py-2 rounded-xl text-indigo-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Load Balancing: <strong>ACTIVE</strong></span>
          </div>
        </div>

        {/* System KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("totalCentres")}</span>
            <span className="text-2xl font-extrabold text-white">128</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("totalFarmersBooked")}</span>
            <span className="text-2xl font-extrabold text-emerald-400">8,492</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("currentlyWaiting")}</span>
            <span className="text-2xl font-extrabold text-amber-300 font-mono">1,284</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("avgWaitTime")}</span>
            <span className="text-2xl font-extrabold text-indigo-400">{avgWait} min</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("overloadedCentres")}</span>
            <span className="text-2xl font-extrabold text-red-400">{criticalCentres + 5}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">Payments Pending</span>
            <span className="text-2xl font-extrabold text-teal-400">174</span>
          </div>
        </div>
      </div>

      {/* Actionable Alerts Section */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Centres Requiring Attention
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-extrabold text-slate-900">Main APMC City Yard</h4>
              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Critical</span>
            </div>
            <div className="text-xs text-slate-600 mb-4 space-y-1">
              <p><strong>96%</strong> capacity • <strong>52</strong> farmers waiting • <strong>81 min</strong> average wait</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Suggested Action</p>
              <p className="text-xs text-slate-800 font-medium">Redirect new bookings to Shivaji Grain Collection Centre.</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Potential queue reduction: approx 22%</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-extrabold text-slate-900">Rampur Mandi Hub</h4>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">High Load</span>
            </div>
            <div className="text-xs text-slate-600 mb-4 space-y-1">
              <p><strong>94%</strong> capacity • <strong>37</strong> farmers waiting • <strong>68 min</strong> average wait</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Suggested Action</p>
              <p className="text-xs text-slate-800 font-medium">Deploy 2 additional Quality Check operators.</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Estimated wait reduction: 15 mins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "map"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Regional Congestion Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab("monitoring")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "monitoring"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Centre Monitoring & Load Status</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "analytics"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Procurement & Commodity Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "settings"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>System Management</span>
        </button>
      </div>

      {/* Tab Render */}
      {activeTab === "map" && <CongestionMap />}
      {activeTab === "monitoring" && <CentreMonitoring />}
      {activeTab === "analytics" && <ProcurementAnalytics />}
      {activeTab === "settings" && <SystemSettings />}
    </div>
  );
};
