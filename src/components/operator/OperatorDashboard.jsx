import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { LiveQueueManager } from "./LiveQueueManager";
import { FarmerCheckIn } from "./FarmerCheckIn";
import { SlotManager } from "./SlotManager";
import { CentreAnalytics } from "./CentreAnalytics";
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  ShieldCheck,
  TrendingUp,
  Settings,
  UserCheck,
  Layers,
  Sparkles
} from "lucide-react";

export const OperatorDashboard = () => {
  const { t, activeCentre, centres, setActiveCentreId } = useKisanSetu();
  const [activeTab, setActiveTab] = useState("queue"); // queue | checkin | slots | analytics

  return (
    <div className="space-y-6">
      {/* Control Room Header & Centre Selector */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>{t("opDashboard")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeCentre.name}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Code: {activeCentre.code} • Location: {activeCentre.location}
            </p>
          </div>

          {/* Switch Centre Dropdown for Operator */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 font-semibold">Centre:</label>
            <select
              value={activeCentre.id}
              onChange={(e) => setActiveCentreId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.loadPercent}% Load)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Operational KPIs Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("todayCapacity")}</span>
            <span className="text-2xl font-extrabold text-white">{activeCentre.capacity}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("bookedCount")}</span>
            <span className="text-2xl font-extrabold text-blue-400">{activeCentre.booked}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("arrivedCount")}</span>
            <span className="text-2xl font-extrabold text-indigo-400">{activeCentre.arrived}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("processingCount")}</span>
            <span className="text-2xl font-extrabold text-amber-400">{activeCentre.processing}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("completedCount")}</span>
            <span className="text-2xl font-extrabold text-emerald-400">{activeCentre.completed}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">{t("currentQueue")}</span>
            <span className="text-2xl font-extrabold text-amber-300 font-mono">{activeCentre.queueDepth}</span>
          </div>
        </div>

        {/* Overload Alert Warning */}
        {activeCentre.loadPercent >= 85 && (
          <div className="mt-6 bg-amber-950/80 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block font-bold">⚠ Centre Overload Warning ({activeCentre.loadPercent}% Capacity)</strong>
                <span>High farmer congestion detected. Recommended redirecting new farmer bookings to <strong>Shivaji Grain Hub (61% load)</strong>.</span>
              </div>
            </div>
            <button className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-extrabold text-[11px] hover:bg-amber-400 shrink-0">
              Apply Load Balancing
            </button>
          </div>
        )}
      </div>

      {/* Operator Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("queue")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "queue"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Interactive Live Operational Queue</span>
        </button>

        <button
          onClick={() => setActiveTab("checkin")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "checkin"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Farmer Gate Check-In</span>
        </button>

        <button
          onClick={() => setActiveTab("slots")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "slots"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Capacity & Slot Management</span>
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
          <span>Centre Operational Analytics</span>
        </button>
      </div>

      {/* Render Active Operator Tab View */}
      {activeTab === "queue" && <LiveQueueManager />}
      {activeTab === "checkin" && <FarmerCheckIn />}
      {activeTab === "slots" && <SlotManager />}
      {activeTab === "analytics" && <CentreAnalytics />}
    </div>
  );
};
