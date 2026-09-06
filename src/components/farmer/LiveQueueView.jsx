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
  const { t, activeBooking, activeCentre, tokens } = useKisanSetu();

  if (!activeBooking) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 font-medium">No active booking to show queue for.</p>
      </div>
    );
  }

  // Filter tokens at the active centre
  const centreBookings = bookings.filter((t) => t.centreId === activeCentre.id);

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
                DIGITAL QUEUE TOKEN • KISANSETU
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {activeCentre.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save Ticket
            </button>
          </div>
        </div>

        {/* Big Token Number */}
        <div className="py-8 text-center my-2 bg-slate-950/40 rounded-2xl border border-slate-800/80 backdrop-blur-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest block mb-1">
            {t("myToken")}
          </span>
          <div className="text-5xl sm:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white tracking-widest">
            {activeBooking.id}
          </div>
          <span className="text-xs text-slate-300 mt-2 block font-medium">
            Ramesh Singh • {activeBooking.crop} ({activeBooking.quantity} Quintals)
          </span>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">Scheduled Slot</span>
            <strong className="text-slate-100 font-bold text-xs">{activeBooking.slot}</strong>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">Farmers Ahead</span>
            <strong className="text-amber-400 font-extrabold text-sm">{activeBooking.queuePosition}</strong>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">Est. Waiting</span>
            <strong className="text-emerald-400 font-extrabold text-sm">{activeBooking.estimatedWait} min</strong>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-medium">Serving Token</span>
            <strong className="text-indigo-300 font-bold text-xs font-mono">A118</strong>
          </div>
        </div>
      </div>

      {/* Surrounding Live Queue Sequence */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>Surrounding Live Queue Sequence</span>
            </h3>
            <p className="text-xs text-slate-500">
              Real-time synchronization with Procurement Centre Operator actions.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Sync
          </span>
        </div>

        <div className="space-y-2.5">
          {centreBookings.map((tok) => {
            const isMe = tok.token === activeBooking.id;

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
                        {tok.farmerName} {isMe && "(YOU)"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        • {tok.crop} ({tok.quantity} Qtl)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Slot: {tok.slot}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                    tok.status === "PROCUREMENT_COMPLETE" || tok.status === "PAYMENT_COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : tok.status === "WEIGHING" || tok.status === "QUALITY_CHECK"
                      ? "bg-blue-100 text-blue-800"
                      : tok.status === "ARRIVED"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {tok.status.replace(/_/g, " ")}
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
