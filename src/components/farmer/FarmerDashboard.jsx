import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import {
  Clock,
  MapPin,
  QrCode,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle,
  Truck,
  CreditCard,
  Building2,
  RefreshCw
} from "lucide-react";

export const FarmerDashboard = ({ onNavigateTab }) => {
  const { t, activeToken, activeCentre, lowNetworkMode, setLowNetworkMode } = useKisanSetu();

  if (!activeToken) return null;

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>🌾 {t("goodMorning")}, Ramesh Singh</span>
              <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded text-[10px]">
                Identity Verified
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t("activeBooking")}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Slot confirmed for <strong>{activeToken.commodity} ({activeToken.quantityQtl} Quintals)</strong> at {activeToken.slot}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab("queue")}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>{t("viewLiveQueue")}</span>
            </button>
            <button
              onClick={() => onNavigateTab("booking")}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              + Book New Slot
            </button>
          </div>
        </div>
      </div>

      {/* Main Active Token Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-500/30 text-emerald-800 flex flex-col items-center justify-center font-extrabold shadow-inner">
              <span className="text-[10px] text-emerald-600 uppercase font-semibold">TOKEN</span>
              <span className="text-xl font-mono text-emerald-900">{activeToken.id}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {activeToken.commodity} — {activeToken.quantityQtl} Quintals
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeToken.status === "PAYMENT_COMPLETED"
                    ? "bg-emerald-100 text-emerald-800"
                    : activeToken.status === "PROCUREMENT_COMPLETE"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {activeToken.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeCentre.name} ({activeCentre.location})</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Scheduled Time</span>
            <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1 justify-end">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {activeToken.slot}
            </span>
          </div>
        </div>

        {/* Real-time Queue & Estimate Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              {t("queuePosition")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {activeToken.queuePos}
              </span>
              <span className="text-xs text-slate-500 font-medium">farmers ahead</span>
            </div>
          </div>

          <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-100">
            <span className="text-xs font-medium text-emerald-800 block mb-1">
              {t("estimatedWait")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700">
                {activeToken.estimatedWaitMin}
              </span>
              <span className="text-xs text-emerald-800 font-bold">minutes</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Currently Serving
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-700 font-mono">
                A118
              </span>
              <span className="text-xs text-slate-500 font-medium">at Counter 1</span>
            </div>
          </div>
        </div>

        {/* Wait Time Calculation Breakdown */}
        <div className="mt-6 bg-slate-900 text-slate-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Wait Time Calculation
            </span>
            <span className="text-[10px] text-slate-400">Calculated in real-time</span>
          </div>
          <p className="text-slate-300 text-xs">
            Estimated <strong>35 min wait</strong> based on:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-1">
            <div className="bg-slate-800 p-2 rounded-lg">• 6 farmers ahead</div>
            <div className="bg-slate-800 p-2 rounded-lg">• 18 min avg processing</div>
            <div className="bg-slate-800 p-2 rounded-lg">• 4 active counters</div>
            <div className="bg-slate-800 p-2 rounded-lg">• 82% centre load</div>
          </div>
        </div>

        {/* Quick Actions Buttons */}
        <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => onNavigateTab("queue")}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Track Queue</span>
          </button>

          <button
            onClick={() => onNavigateTab("timeline")}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Procurement Progress</span>
          </button>

          <button
            onClick={() => onNavigateTab("payment")}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Payment Tracking</span>
          </button>
        </div>
      </div>
    </div>
  );
};
