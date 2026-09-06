import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { WeighingQCModal } from "./WeighingQCModal";
import {
  Users,
  CheckCircle2,
  Clock,
  Scale,
  ShieldCheck,
  Phone,
  AlertCircle,
  XCircle,
  Calendar,
  Sparkles,
  Search
} from "lucide-react";

export const LiveQueueManager = () => {
  const { bookings, activeCentre, updateTokenStatus, t } = useKisanSetu();
  const [activeModalToken, setActiveModalToken] = useState(null);
  const [modalType, setModalType] = useState(null); // 'weighing' | 'qc' | 'reschedule'
  const [searchTerm, setSearchTerm] = useState("");

  const centreBookings = tokens
    .filter((tok) => tok.centreId === activeCentre.id)
    .filter((tok) =>
      tok.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tok.token.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleOpenWeighingModal = (tok) => {
    setActiveModalToken(tok);
    setModalType("weighing");
  };

  const handleOpenQCModal = (tok) => {
    setActiveModalToken(tok);
    setModalType("qc");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Operational Live Queue & State Controller</span>
            </h3>
            <p className="text-xs text-slate-500">
              Click action buttons to advance farmer workflow states in real-time.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Token (e.g. A124) or Farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {/* Live Queue Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="p-3.5 rounded-l-xl">Token</th>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Commodity</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Slot</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-xl text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {centreBookings.map((tok) => {
                const isRamesh = tok.token === "A124";

                return (
                  <tr
                    key={tok.token}
                    className={`hover:bg-slate-50 transition-colors ${
                      isRamesh ? "bg-amber-50/60 font-semibold" : ""
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900 bg-slate-200 px-2 py-1 rounded-md">
                          {tok.token}
                        </span>
                        {isRamesh && (
                          <span className="bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            DEMO TARGET
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">{tok.farmerName}</div>
                      <span className="text-[10px] text-slate-400 font-medium">{tok.phone}</span>
                    </td>

                    <td className="p-3.5 font-bold text-slate-800">{tok.crop}</td>

                    <td className="p-3.5 font-mono text-slate-900">
                      {tok.actualWeightQtl ? (
                        <span className="text-blue-700 font-extrabold">{tok.actualWeightQtl} Qtl (Actual)</span>
                      ) : (
                        <span>{tok.quantity} Qtl (Decl)</span>
                      )}
                    </td>

                    <td className="p-3.5 text-slate-600">{tok.slot}</td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tok.status === "PAYMENT_COMPLETED" || tok.status === "PROCUREMENT_COMPLETE"
                          ? "bg-emerald-100 text-emerald-800"
                          : tok.status === "WEIGHING" || tok.status === "QUALITY_CHECK"
                          ? "bg-blue-100 text-blue-800"
                          : tok.status === "ARRIVED"
                          ? "bg-indigo-100 text-indigo-800"
                          : tok.status === "NO_SHOW"
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {tok.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-1.5">
                      {tok.status === "BOOKED" || tok.status === "CONFIRMED" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "ARRIVED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Check In
                        </button>
                      ) : tok.status === "ARRIVED" || tok.status === "WAITING" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "CALLED")}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                        >
                          Call Farmer
                        </button>
                      ) : tok.status === "CALLED" ? (
                        <button
                          onClick={() => handleOpenWeighingModal(tok)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                        >
                          <Scale className="w-3.5 h-3.5" /> Start Weighing
                        </button>
                      ) : tok.status === "WEIGHING" ? (
                        <button
                          onClick={() => handleOpenQCModal(tok)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Quality Check
                        </button>
                      ) : tok.status === "QUALITY_CHECK" ? (
                        <>
                          <button
                            onClick={() => updateBookingStatus(tok.token, "APPROVED")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBookingStatus(tok.token, "REJECTED")}
                            className="px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] ml-1"
                          >
                            Reject
                          </button>
                        </>
                      ) : tok.status === "APPROVED" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "COMPLETED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Complete
                        </button>
                      ) : tok.status === "COMPLETED" || tok.status === "PROCUREMENT_COMPLETE" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "PAYMENT_INITIATED")}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Initiate Payment
                        </button>
                      ) : tok.status === "PAYMENT_INITIATED" || tok.status === "PAYMENT_PROCESSING" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "PAYMENT_COMPLETED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Complete Payment
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">Completed</span>
                      )}
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Weighing / QC / Reschedule */}
      {modalType && activeModalToken && (
        <WeighingQCModal
          token={activeModalToken}
          modalType={modalType}
          onClose={() => {
            setActiveModalToken(null);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
};
