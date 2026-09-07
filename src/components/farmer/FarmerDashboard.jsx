import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { ProcurementReceipt } from "./ProcurementReceipt";
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
  RefreshCw,
  BellRing
} from "lucide-react";

export const FarmerDashboard = ({ onNavigateTab }) => {
  const { t, activeBooking, centres, activeCentreId } = useKisanSetu();
  const bookingCentre = (activeBooking && centres.find(c => c.id === activeBooking.centreId)) || centres.find(c => c.id === activeCentreId) || centres[0];

  if (!activeBooking) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Active Booking</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto mb-6">
          You don't have any upcoming slot booked. Book a new slot to get started with the procurement process.
        </p>
        <button
          onClick={() => onNavigateTab("booking")}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
        >
          Book New Slot
        </button>
      </div>
    );
  }

  const isCompleted = ["COMPLETED", "PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_INITIATED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(activeBooking.status);
  
  // Determine contextual instruction based on status
  let instructionMsg = "";
  let instructionColor = "bg-blue-50 border-blue-200 text-blue-800";
  let Icon = BellRing;

  if (activeBooking.status === "BOOKED") {
    instructionMsg = "You are not at the centre. Please arrive 15 minutes before your slot time.";
    instructionColor = "bg-slate-50 border-slate-200 text-slate-800";
  } else if (activeBooking.status === "WAITING" || activeBooking.status === "ARRIVED") {
    if (activeBooking.queuePosition <= 3) {
      instructionMsg = `You are #${activeBooking.queuePosition} in queue. Please be ready for your turn.`;
      instructionColor = "bg-amber-50 border-amber-200 text-amber-800";
    } else {
      instructionMsg = `You are #${activeBooking.queuePosition} in queue. Please wait in the designated parking area.`;
      instructionColor = "bg-blue-50 border-blue-200 text-blue-800";
    }
  } else if (activeBooking.status === "WEIGHING") {
    instructionMsg = "You have been called for weighing. Please proceed to the active Weighbridge.";
    instructionColor = "bg-indigo-50 border-indigo-200 text-indigo-800";
  } else if (activeBooking.status === "QUALITY_CHECK") {
    instructionMsg = "Quality inspection in progress. Please wait near the QC lab.";
    instructionColor = "bg-indigo-50 border-indigo-200 text-indigo-800";
  }

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>🌾 {t("goodMorning")}, {activeBooking.farmerName}</span>
              <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded text-[10px]">
                Identity Verified
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isCompleted ? "Procurement Completed" : t("activeBooking")}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Slot for <strong>{activeBooking.crop} ({activeBooking.quantity} Quintals)</strong> at {activeBooking.slot}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted && (
              <button
                onClick={() => onNavigateTab("queue")}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>{t("viewLiveQueue")}</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab("booking")}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              + Book New Slot
            </button>
          </div>
        </div>
      </div>

      {isCompleted ? (
        <ProcurementReceipt token={activeBooking} centre={bookingCentre} />
      ) : (
        /* Main Active Token Card */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-500/30 text-emerald-800 flex flex-col items-center justify-center font-extrabold shadow-inner">
                <span className="text-[10px] text-emerald-600 uppercase font-semibold mb-1 tracking-wider">YOUR TOKEN</span>
                <span className="text-2xl font-mono text-emerald-900 leading-none">{activeBooking.token}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {activeBooking.crop} — {activeBooking.quantity} Quintals
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeBooking.status === "WEIGHING" || activeBooking.status === "QUALITY_CHECK"
                      ? "bg-indigo-100 text-indigo-800"
                      : activeBooking.status === "ARRIVED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {activeBooking.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{bookingCentre.name}</span>
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5 ml-5.5">
                  Scheduled: {activeBooking.slot}
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Instruction */}
          {instructionMsg && (
            <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${instructionColor}`}>
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Current Instruction</p>
                <p className="text-xs mt-0.5 font-medium">{instructionMsg}</p>
              </div>
            </div>
          )}

          {/* Real-time Queue & Estimate Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                QUEUE POSITION
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  #{activeBooking.queuePosition}
                </span>
                <span className="text-xs text-slate-500 font-bold">({activeBooking.queuePosition - 1} farmers ahead)</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                ESTIMATED WAIT
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-emerald-700">
                  {activeBooking.estimatedWait}
                </span>
                <span className="text-xs text-emerald-800 font-bold">minutes</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                CURRENTLY SERVING
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-indigo-700 font-mono">
                  A118
                </span>
                <span className="text-xs text-slate-500 font-bold">• Counter 1</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab("queue")}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Track Live Queue</span>
            </button>

            <button
              onClick={() => onNavigateTab("timeline")}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Procurement Progress</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
