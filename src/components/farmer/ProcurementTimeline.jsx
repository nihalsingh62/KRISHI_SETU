import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
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
  const { activeBooking, activeCentre } = useKisanSetu();

  if (!activeBooking) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 font-medium">No active booking to show timeline for.</p>
      </div>
    );
  }

  const STAGES = [
    { key: "BOOKED", label: "Slot Booked", icon: Clock },
    { key: "ARRIVED", label: "Farmer Checked-In at Gate", icon: Building2 },
    { key: "WEIGHING", label: "Weighbridge Weighing", icon: Scale },
    { key: "QUALITY_CHECK", label: "Quality & Moisture Inspection", icon: ShieldCheck },
    { key: "PROCUREMENT_COMPLETE", label: "Procurement Completed", icon: FileText },
    { key: "PAYMENT_PROCESSING", label: "Payment Processing (PFMS)", icon: CreditCard },
    { key: "PAYMENT_COMPLETED", label: "Payment Transferred to Account", icon: CheckCircle2 }
  ];

  const getStageState = (stageKey) => {
    const statusOrder = [
      "BOOKED",
      "ARRIVED",
      "WEIGHING",
      "QUALITY_CHECK",
      "PROCUREMENT_COMPLETE",
      "PAYMENT_PROCESSING",
      "PAYMENT_COMPLETED"
    ];
    const currentIndex = statusOrder.indexOf(activeBooking.status);
    const stageIndex = statusOrder.indexOf(stageKey);

    if (stageIndex < currentIndex) return "COMPLETED";
    if (stageIndex === currentIndex) return "IN_PROGRESS";
    return "PENDING";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Procurement Workflow Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live step-by-step progress tracking for Token <strong>{activeBooking.id}</strong>.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
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
    </div>
  );
};
