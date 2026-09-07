import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { ProcurementReceipt } from "./ProcurementReceipt";
import {
  FileText,
  Clock,
  Building2,
  Scale,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Check,
  X,
  Eye,
  AlertCircle,
  Calendar,
  IndianRupee
} from "lucide-react";

export const ProcurementHistory = () => {
  const { t, bookings, authenticatedUser, centres, formatBookingDate } = useKisanSetu();
  const [filter, setFilter] = useState("ALL"); // ALL | ACTIVE | COMPLETED | REJECTED
  const [selectedBooking, setSelectedBooking] = useState(null);

  if (!authenticatedUser) return null;

  // Filter bookings belonging to currently authenticated farmer
  const farmerBookings = bookings.filter((b) => b.farmerId === authenticatedUser.id);

  const filteredBookings = farmerBookings.filter((b) => {
    const isCompleted = ["PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(b.status);
    const isCancelled = b.status === "CANCELLED";
    const isRejected = b.status === "REJECTED";
    const isActive = !isCompleted && !isCancelled && !isRejected;

    if (filter === "ACTIVE") return isActive;
    if (filter === "COMPLETED") return isCompleted;
    if (filter === "CANCELLED") return isCancelled;
    if (filter === "REJECTED") return isRejected;
    return true;
  });

  const STAGES = [
    { key: "BOOKED", label: t("statusBooked"), icon: Clock },
    { key: "ARRIVED", label: t("statusArrived"), icon: Building2 },
    { key: "CALLED", label: t("statusCalled"), icon: Clock },
    { key: "WEIGHING", label: t("statusWeighing"), icon: Scale },
    { key: "QUALITY_CHECK", label: t("statusQualityCheck"), icon: ShieldCheck },
    { key: "APPROVED", label: t("statusApproved"), icon: CheckCircle2 },
    { key: "PROCUREMENT_COMPLETED", label: t("statusProcurementComplete"), icon: FileText },
    { key: "PAYMENT_PROCESSING", label: t("statusPaymentProcessing"), icon: CreditCard },
    { key: "PAYMENT_COMPLETED", label: t("statusPaymentCompleted"), icon: CheckCircle2 }
  ];

  const getStatusLabel = (status) => {
    switch (status) {
      case "BOOKED": return t("statusBooked");
      case "CONFIRMED": return t("statusConfirmed");
      case "ARRIVED": return t("statusArrived");
      case "WAITING": return t("statusWaiting");
      case "CALLED": return t("statusCalled");
      case "WEIGHING": return t("statusWeighing");
      case "QUALITY_CHECK": return t("statusQualityCheck");
      case "APPROVED": return t("statusApproved");
      case "COMPLETED":
      case "PROCUREMENT_COMPLETE":
      case "PROCUREMENT_COMPLETED": return t("statusProcurementComplete");
      case "PAYMENT_PROCESSING": return t("statusPaymentProcessing");
      case "PAYMENT_COMPLETED": return t("statusPaymentCompleted");
      case "CANCELLED": return t("statusCancelled");
      case "REJECTED": return t("statusRejected");
      default: return status.replace(/_/g, " ");
    }
  };

  const getStageState = (stageKey, booking) => {
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
    let currentStatus = booking.status;
    if (currentStatus === "COMPLETED" || currentStatus === "PROCUREMENT_COMPLETE") {
      currentStatus = "PROCUREMENT_COMPLETED";
    }
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stageIndex = statusOrder.indexOf(stageKey);

    if (currentIndex >= 0 && stageIndex < currentIndex) return "COMPLETED";
    if (currentIndex >= 0 && stageIndex === currentIndex) return "IN_PROGRESS";
    return "PENDING";
  };

  const getCentreForBooking = (b) => {
    return centres.find((c) => c.id === b.centreId) || { name: b.centreName || "Procurement Centre" };
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>{t("procurementHistory")}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("procurementHistoryDesc")}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilter("ALL")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
              filter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("allFilter")} ({farmerBookings.length})
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
              filter === "ACTIVE" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("activeFilter")} ({farmerBookings.filter(b => !["PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED", "REJECTED", "CANCELLED"].includes(b.status)).length})
          </button>
          <button
            onClick={() => setFilter("COMPLETED")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
              filter === "COMPLETED" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("completedFilter")} ({farmerBookings.filter(b => ["PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(b.status)).length})
          </button>
          <button
            onClick={() => setFilter("CANCELLED")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
              filter === "CANCELLED" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("statusCancelled")} ({farmerBookings.filter(b => b.status === "CANCELLED").length})
          </button>
          <button
            onClick={() => setFilter("REJECTED")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
              filter === "REJECTED" ? "bg-white text-red-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("rejectedFilter")} ({farmerBookings.filter(b => b.status === "REJECTED").length})
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">{t("noRecords")}</p>
          <p className="text-xs text-slate-500 mt-1">No bookings match the selected filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-3 rounded-l-xl">{t("tokenAndId")}</th>
                <th className="p-3">{t("procurementCentre")}</th>
                <th className="p-3">{t("cropAndQty")}</th>
                <th className="p-3">{t("dateAndSlot")}</th>
                <th className="p-3">{t("viewProcurement")}</th>
                <th className="p-3">{t("paymentStatus")}</th>
                <th className="p-3 rounded-r-xl text-right">{t("action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBookings.map((b) => {
                const isDone = ["PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_COMPLETED"].includes(b.status);
                const isCancelled = b.status === "CANCELLED";
                const isRej = b.status === "REJECTED";
                const centre = getCentreForBooking(b);

                return (
                  <tr key={b.bookingId || b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <span className="font-mono font-extrabold text-sm text-slate-900 block">{b.token}</span>
                      <span className="text-[10px] font-mono text-slate-400">{b.bookingId || b.id}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-slate-800 block">{centre.name}</span>
                      <span className="text-[10px] text-slate-400">{b.centreId}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{b.crop || b.commodity}</span>
                      <span className="text-xs text-slate-500">
                        {b.actualWeightQtl ? `${b.actualWeightQtl} Qtl (Actual)` : `${b.quantity} Qtl (Booked)`}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="font-medium text-slate-800 block">{formatBookingDate ? formatBookingDate(b.date) : (b.date || "Today")}</span>
                      <span className="text-[10px] text-slate-400">{b.slot || b.slotTime}</span>
                    </td>

                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-block ${
                        isDone
                          ? "bg-emerald-100 text-emerald-800"
                          : isCancelled
                          ? "bg-slate-100 text-slate-700 border border-slate-300"
                          : isRej
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                        b.paymentStatus === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.paymentStatus === "PROCESSING"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {b.paymentStatus === "COMPLETED" ? t("statusPaymentCompleted") : b.paymentStatus === "PROCESSING" ? t("statusPaymentProcessing") : (b.paymentStatus || "NOT_INITIATED")}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t("viewDetails")}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-mono font-extrabold flex items-center justify-center text-sm">
                  {selectedBooking.token}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Procurement Details: {selectedBooking.token}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Booking ID: {selectedBooking.bookingId || selectedBooking.id} • {formatBookingDate ? formatBookingDate(selectedBooking.date) : (selectedBooking.date || "Today")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="cursor-pointer p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("commodity")}</span>
                <span className="text-sm font-extrabold text-slate-900">{selectedBooking.crop || selectedBooking.commodity}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("receiptAcceptedQty")}</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {selectedBooking.actualWeightQtl || selectedBooking.quantity} Qtl
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("receiptMoisture")} & {t("receiptQualityGrade")}</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {selectedBooking.moisturePercent ? `${selectedBooking.moisturePercent}%` : "12.0%"} • {selectedBooking.grade || "FAQ"}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("totalCalculatedPayable")}</span>
                <span className="text-sm font-extrabold text-emerald-600">
                  ₹{selectedBooking.totalAmount ? selectedBooking.totalAmount.toLocaleString() : "0"}
                </span>
              </div>
            </div>

            {/* Timeline View for this booking */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                {t("lifecycleTimeline")}
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {STAGES.map((st, idx) => {
                  const state = getStageState(st.key, selectedBooking);
                  const isDone = state === "COMPLETED";
                  const isCurrent = state === "IN_PROGRESS";

                  return (
                    <div key={st.key} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-amber-500 text-white ring-2 ring-amber-100"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>

                      <div className="pl-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isDone || isCurrent ? "text-slate-900" : "text-slate-400"}`}>
                            {st.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                              Current Status
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Digital Receipt Section */}
            {["APPROVED", "PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(selectedBooking.status) && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t("officialReceipt")}
                </h4>
                <ProcurementReceipt
                  token={selectedBooking}
                  centre={getCentreForBooking(selectedBooking)}
                />
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedBooking(null)}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                {t("closeDetails")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
