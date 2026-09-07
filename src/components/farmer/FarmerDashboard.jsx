import React, { useState } from "react";
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
  BellRing,
  CalendarClock,
  XCircle,
  AlertTriangle,
  Check
} from "lucide-react";

export const FarmerDashboard = ({ onNavigateTab }) => {
  const {
    t,
    activeBooking,
    centres,
    activeCentreId,
    slots,
    cancelBooking,
    rescheduleBooking,
    isBookingCancellable,
    getSlotAvailability,
    getAdvanceBookingDates,
    formatBookingDate
  } = useKisanSetu();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState("");
  const [selectedNewSlot, setSelectedNewSlot] = useState("");
  const [actionError, setActionError] = useState("");

  const advanceDates = getAdvanceBookingDates ? getAdvanceBookingDates(4) : [];

  const handleConfirmCancel = () => {
    if (!activeBooking) return;
    const res = cancelBooking(activeBooking.bookingId || activeBooking.id);
    if (res.success) {
      setShowCancelModal(false);
      setActionError("");
    } else {
      setActionError(res.message || "Failed to cancel booking");
    }
  };

  const handleOpenReschedule = () => {
    setActionError("");
    const initialDate = activeBooking.date || (advanceDates[0] ? advanceDates[0].isoDate : "Today");
    setSelectedRescheduleDate(initialDate);
    // Find first available slot on initialDate that is not current slot
    const available = slots.find((s) => {
      const avail = getSlotAvailability ? getSlotAvailability(activeBooking.centreId || activeCentreId, initialDate, s.time) : { isFull: false };
      const isCurrent = (activeBooking.date === initialDate || (!activeBooking.date && initialDate === advanceDates[0]?.isoDate)) && s.time === activeBooking.slot;
      return !avail.isFull && !isCurrent;
    });
    setSelectedNewSlot(available ? available.time : "");
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    if (!activeBooking || !selectedNewSlot || !selectedRescheduleDate) return;
    const res = rescheduleBooking(activeBooking.bookingId || activeBooking.id, selectedRescheduleDate, selectedNewSlot);
    if (res.success) {
      setShowRescheduleModal(false);
      setActionError("");
    } else {
      setActionError(res.message || "Failed to reschedule booking");
    }
  };
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
      case "REJECTED": return t("statusRejected");
      default: return status.replace(/_/g, " ");
    }
  };
  
  // Determine contextual instruction based on status
  let instructionMsg = "";
  let instructionColor = "bg-blue-50 border-blue-200 text-blue-800";
  let Icon = BellRing;

  if (activeBooking.status === "BOOKED") {
    instructionMsg = t("instructionBooked");
    instructionColor = "bg-slate-50 border-slate-200 text-slate-800";
  } else if (activeBooking.status === "WAITING" || activeBooking.status === "ARRIVED") {
    if (activeBooking.queuePosition <= 3) {
      instructionMsg = t("instructionWaitingNear");
      instructionColor = "bg-amber-50 border-amber-200 text-amber-800";
    } else {
      instructionMsg = t("instructionWaitingFar");
      instructionColor = "bg-blue-50 border-blue-200 text-blue-800";
    }
  } else if (activeBooking.status === "WEIGHING") {
    instructionMsg = t("instructionWeighing");
    instructionColor = "bg-indigo-50 border-indigo-200 text-indigo-800";
  } else if (activeBooking.status === "QUALITY_CHECK") {
    instructionMsg = t("instructionQC");
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
                {t("identityVerified")}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isCompleted ? t("procurementCompleted") : t("activeBooking")}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Slot for <strong>{activeBooking.crop} ({activeBooking.quantity} Quintals)</strong> on {formatBookingDate ? formatBookingDate(activeBooking.date) : (activeBooking.date || "Today")} at {activeBooking.slot}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted && (
              <button
                onClick={() => onNavigateTab("queue")}
                className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>{t("viewLiveQueue")}</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab("booking")}
              className="cursor-pointer px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              + {t("bookNewSlot")}
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
                <span className="text-[10px] text-emerald-600 uppercase font-semibold mb-1 tracking-wider text-center">{t("yourToken")}</span>
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
                    {getStatusLabel(activeBooking.status)}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{bookingCentre.name}</span>
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5 ml-5.5">
                  {t("scheduledDate") || "Date"}: {formatBookingDate ? formatBookingDate(activeBooking.date) : (activeBooking.date || "Today")} • {t("slotTime")}: {activeBooking.slot}
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Instruction */}
          {instructionMsg && (
            <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${instructionColor}`}>
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">{t("currentInstruction")}</p>
                <p className="text-xs mt-0.5 font-medium">{instructionMsg}</p>
              </div>
            </div>
          )}

          {/* Real-time Queue & Estimate Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {t("queuePosition")}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  #{activeBooking.queuePosition}
                </span>
                <span className="text-xs text-slate-500 font-bold">({activeBooking.queuePosition - 1} {t("farmersAhead")})</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                {t("estimatedWait")}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-emerald-700">
                  {activeBooking.estimatedWait}
                </span>
                <span className="text-xs text-emerald-800 font-bold">{t("minutes")}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {t("servingToken")}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-indigo-700 font-mono">
                  A118
                </span>
                <span className="text-xs text-slate-500 font-bold">• {t("counter")} 1</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab("queue")}
              className="cursor-pointer flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>{t("viewLiveQueue")}</span>
            </button>

            <button
              onClick={() => onNavigateTab("timeline")}
              className="cursor-pointer flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>{t("procurementProgress")}</span>
            </button>

            {isBookingCancellable(activeBooking) && (
              <>
                <button
                  type="button"
                  onClick={handleOpenReschedule}
                  className="cursor-pointer flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-colors"
                >
                  <CalendarClock className="w-4 h-4 text-amber-700" />
                  <span>{t("rescheduleBooking")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActionError("");
                    setShowCancelModal(true);
                  }}
                  className="cursor-pointer flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs transition-colors"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{t("cancelBooking")}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && activeBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {t("confirmCancelTitle")}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {t("token")}: {activeBooking.token} • {activeBooking.crop}
                </p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <p className="text-sm font-semibold text-rose-900">
                {t("confirmCancelPrompt")}
              </p>
              <p className="text-xs text-rose-700 mt-1.5">
                Your allocated slot ({activeBooking.slot}) at {bookingCentre.name} will be released immediately and made available for other farmers. You can book another slot anytime.
              </p>
            </div>

            {actionError && (
              <p className="text-xs text-rose-600 font-bold">{actionError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setActionError("");
                }}
                className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                {t("keepBookingBtn")}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                {t("confirmCancelBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Slot Modal */}
      {showRescheduleModal && activeBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {t("rescheduleTitle")}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {t("token")}: {activeBooking.token} • {activeBooking.crop} ({activeBooking.quantity} Qtl)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setActionError("");
                }}
                className="cursor-pointer p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                {t("currentSlot")}
              </span>
              <span className="font-extrabold text-slate-800 text-sm">{activeBooking.slot}</span>
              <span className="text-slate-500 ml-2">({formatBookingDate ? formatBookingDate(activeBooking.date) : (activeBooking.date || "Today")})</span>
            </div>

            {/* Advance Date Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t("selectDate") || "Select Date"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {advanceDates.map((d) => {
                  const isSelected = selectedRescheduleDate === d.isoDate;
                  return (
                    <button
                      key={d.isoDate}
                      type="button"
                      onClick={() => {
                        setSelectedRescheduleDate(d.isoDate);
                        setSelectedNewSlot("");
                      }}
                      className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase ${isSelected ? "text-amber-700" : "text-slate-500"}`}>
                          {d.relativeLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">{d.weekday}</span>
                      </div>
                      <p className={`text-xs font-bold mt-0.5 ${isSelected ? "text-amber-900" : "text-slate-800"}`}>
                        {d.displayDate}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t("selectNewSlot")}
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {slots.map((s) => {
                  const avail = getSlotAvailability
                    ? getSlotAvailability(activeBooking.centreId || activeCentreId, selectedRescheduleDate, s.time)
                    : { capacity: s.capacity, booked: s.booked, remaining: Math.max(0, s.capacity - s.booked), isFull: s.booked >= s.capacity };
                  const isCurrent = (activeBooking.date === selectedRescheduleDate || (!activeBooking.date && selectedRescheduleDate === advanceDates[0]?.isoDate)) && s.time === activeBooking.slot;
                  const isAvailable = !avail.isFull && !isCurrent;
                  const isSelected = selectedNewSlot === s.time;

                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedNewSlot(s.time)}
                      className={`cursor-pointer w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                          : isAvailable
                          ? "bg-white border-slate-200 hover:border-slate-300"
                          : "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${isSelected ? "text-amber-600" : "text-slate-400"}`} />
                        <div>
                          <p className={`text-xs font-bold ${isSelected ? "text-amber-900" : "text-slate-800"}`}>
                            {s.time} {isCurrent && <span className="text-[10px] text-slate-400 font-normal">({t("currentSlot")})</span>}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {avail.isFull
                              ? "0 slots left (Full)"
                              : `${avail.remaining} ${avail.remaining === 1 ? "slot" : "slots"} left (${avail.capacity - avail.remaining}/${avail.capacity} booked)`}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSelected
                          ? "bg-amber-600 text-white"
                          : isAvailable
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {isSelected ? "Selected" : isAvailable ? "Available" : "Full"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {actionError && (
              <p className="text-xs text-rose-600 font-bold">{actionError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowRescheduleModal(false);
                  setActionError("");
                }}
                className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedNewSlot}
                onClick={handleConfirmReschedule}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-colors"
              >
                {t("confirmRescheduleBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
