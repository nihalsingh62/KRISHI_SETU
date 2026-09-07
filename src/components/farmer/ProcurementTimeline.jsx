import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { ProcurementHistory } from "./ProcurementHistory";
import {
  CheckCircle2,
  Clock,
  Truck,
  Scale,
  ShieldCheck,
  FileText,
  CreditCard,
  Building2,
  Check
} from "lucide-react";

export const ProcurementTimeline = () => {
  const { activeBooking, centres } = useKisanSetu();
  const bookingCentre = activeBooking ? (centres.find(c => c.id === activeBooking.centreId) || { name: activeBooking.centreName || "Procurement Centre" }) : null;

  const STAGES = [
    { key: "BOOKED", label: "Slot Booked", icon: Clock },
    { key: "ARRIVED", label: "Farmer Checked-In at Gate", icon: Building2 },
    { key: "CALLED", label: "Called for Weighing", icon: Clock },
    { key: "WEIGHING", label: "Weighbridge Weighing", icon: Scale },
    { key: "QUALITY_CHECK", label: "Quality & Moisture Inspection", icon: ShieldCheck },
    { key: "APPROVED", label: "Procurement Approved", icon: CheckCircle2 },
    { key: "PROCUREMENT_COMPLETED", label: "Procurement Completed", icon: FileText },
    { key: "PAYMENT_PROCESSING", label: "Payment Processing", icon: CreditCard },
    { key: "PAYMENT_COMPLETED", label: "Payment Transferred to Account", icon: CheckCircle2 }
  ];

  const getStageState = (stageKey) => {
    if (!activeBooking) return "PENDING";
    const statusOrder = [
      "BOOKED",
      "CONFIRMED",
      "WAITING",
      "ARRIVED",
      "CALLED",
      "WEIGHING",
      "QUALITY_CHECK",
      "APPROVED",
      "PROCUREMENT_COMPLETED",
      "PAYMENT_INITIATED",
      "PAYMENT_PROCESSING",
      "PAYMENT_COMPLETED"
    ];
    let currentStatus = activeBooking.status;
    if (currentStatus === "COMPLETED" || currentStatus === "PROCUREMENT_COMPLETE") {
      currentStatus = "PROCUREMENT_COMPLETED";
    }
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stageIndex = statusOrder.indexOf(stageKey);

    if (currentIndex >= 0 && stageIndex < currentIndex) return "COMPLETED";
    if (currentIndex >= 0 && stageIndex === currentIndex) return "IN_PROGRESS";
    return "PENDING";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Active Booking Timeline Card */}
      {activeBooking ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active Token: {activeBooking.token}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {bookingCentre.name}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Live Procurement Status
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time progress tracking for <strong>{activeBooking.crop || activeBooking.commodity}</strong> ({activeBooking.quantity} Qtl).
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full self-start sm:self-auto">
              {activeBooking.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* Timeline Sequence */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {STAGES.map((st, idx) => {
              const state = getStageState(st.key);
              const Icon = st.icon;

              const isDone = state === "COMPLETED";
              const isCurrent = state === "IN_PROGRESS";

              return (
                <div key={st.key} className="relative flex items-start gap-4">
                  {/* Dot / Icon badge */}
                  <div
                    className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div className="pl-4 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-extrabold ${isDone || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          IN PROGRESS
                        </span>
                      )}
                    </div>

                    {/* Recorded extra details */}
                    {st.key === "WEIGHING" && activeBooking.actualWeightQtl && (
                      <p className="text-xs text-blue-700 bg-blue-50 p-2.5 rounded-xl mt-1.5 font-medium border border-blue-100">
                        ⚖️ Recorded Weight: <strong>{activeBooking.actualWeightQtl} Quintals</strong> (Declared: {activeBooking.quantity} Qtl)
                      </p>
                    )}

                    {st.key === "QUALITY_CHECK" && activeBooking.moisturePercent && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mt-1.5 font-medium border border-emerald-100">
                        🔬 Quality Test Passed: Moisture <strong>{activeBooking.moisturePercent}%</strong> | Grade: <strong>{activeBooking.grade}</strong>
                      </p>
                    )}

                    {st.key === "PAYMENT_COMPLETED" && activeBooking.paymentTxRef && (
                      <p className="text-xs text-emerald-900 bg-emerald-100 p-2.5 rounded-xl mt-1.5 font-bold border border-emerald-300">
                        🎉 Direct Bank Transfer Reference: <strong>{activeBooking.paymentTxRef}</strong>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
          <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No Active Procurement</h3>
          <p className="text-xs text-slate-500 mt-0.5">You do not currently have a live procurement in progress. View your historical records below.</p>
        </div>
      )}

      {/* Procurement History Section */}
      <ProcurementHistory />
    </div>
  );
};
