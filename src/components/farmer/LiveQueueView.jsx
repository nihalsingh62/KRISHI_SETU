import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import {
  QrCode,
  Clock,
  User,
  Building2,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles
} from "lucide-react";

export const LiveQueueView = () => {
  const { t, activeBooking, centres, activeCentreId, bookings } = useKisanSetu();
  const bookingCentre = (activeBooking && centres.find(c => c.id === activeBooking.centreId)) || centres.find(c => c.id === activeCentreId) || centres[0];

  if (!activeBooking) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 font-medium">No active booking to show queue for.</p>
      </div>
    );
  }

  // Filter tokens at the active booking centre
  const centreBookings = bookings.filter((t) => t.centreId === bookingCentre.id);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Digital Queue Token Printable Ticket */}
      <div id="printable-token" className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-md">
              A
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                {t("digitalTokenTitle")}
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {bookingCentre.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> {t("printTicket")}
            </button>
          </div>
        </div>

        {/* Big Token Number */}
        <div className="py-8 text-center my-2 bg-slate-950/40 rounded-2xl border border-slate-800/80 backdrop-blur-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest block mb-1">
            {t("myToken")}
          </span>
          <div className="text-5xl sm:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white tracking-widest">
            {activeBooking.token}
          </div>
          <span className="text-xs text-slate-300 mt-2 block font-medium">
            {activeBooking.farmerName} • {activeBooking.crop} ({activeBooking.quantity} {t("quantity")?.includes("क्विंटल") ? "क्विंटल" : "Quintals"})
          </span>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">{t("slotTime")}</span>
            <strong className="text-slate-100 font-bold text-xs">{activeBooking.slot}</strong>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">{t("queuePosition")}</span>
            <strong className="text-amber-400 font-extrabold text-sm">{activeBooking.queuePosition}</strong>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">{t("estimatedWait")}</span>
            <strong className="text-emerald-400 font-extrabold text-sm">{activeBooking.estimatedWait} {t("minutes")}</strong>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">{t("servingToken")}</span>
            <strong className="text-indigo-300 font-bold text-xs font-mono">{centreBookings.find(b => ["WEIGHING", "CALLED", "QUALITY_CHECK"].includes(b.status))?.token || "Waiting"}</strong>
          </div>
        </div>
      </div>

      {/* Surrounding Live Queue Sequence */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>{t("surroundingQueueTitle")}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t("surroundingQueueDesc")}
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> {t("liveSync")}
          </span>
        </div>

        <div className="space-y-2.5">
          {centreBookings.map((tok) => {
            const isMe = tok.bookingId === activeBooking.bookingId || tok.token === activeBooking.token || (activeBooking.farmerId && tok.farmerId === activeBooking.farmerId);

            return (
              <div
                key={tok.token}
                className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                  isMe
                    ? "bg-emerald-50 border-emerald-500 shadow-sm font-bold ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                    isMe ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {tok.token}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        {tok.farmerName} {isMe && `(${t("you")})`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        • {tok.crop} ({tok.quantity} Qtl)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {t("slotTime")}: {tok.slot}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                    tok.status === "COMPLETED" || tok.status === "PAYMENT_COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : tok.status === "WEIGHING" || tok.status === "QUALITY_CHECK"
                      ? "bg-blue-100 text-blue-800"
                      : tok.status === "ARRIVED"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {getStatusLabel(tok.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
