import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Search, UserCheck, CheckCircle2, QrCode, PhoneCall, Scale, ShieldCheck, Check, X } from "lucide-react";

export const FarmerCheckIn = () => {
  const { bookings, activeCentre, updateBookingStatus } = useKisanSetu();
  const [searchTokenId, setSearchTokenId] = useState("");
  const [searchedToken, setSearchedToken] = useState(() => {
    // Default to the first active waiting/booked booking for convenience if available
    const initial = bookings.find(t => t.centreId === activeCentre.id && ["BOOKED", "WAITING"].includes(t.status));
    return initial || null;
  });

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = searchTokenId.trim().toLowerCase();
    if (!query) return;

    const found = bookings.find(
      (t) =>
        t.centreId === activeCentre.id &&
        (t.token.toLowerCase() === query ||
          (t.farmerId && t.farmerId.toLowerCase() === query) ||
          (t.bookingId && t.bookingId.toLowerCase() === query))
    );
    setSearchedToken(found || null);
  };

  const handleAction = (newStatus, extra = {}) => {
    if (searchedToken) {
      updateBookingStatus(searchedToken.bookingId || searchedToken.token, newStatus, extra);
      setSearchedToken(prev => ({ ...prev, status: newStatus, ...extra }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <span>Farmer Gate Check-In & Token Lookup</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Scan QR Code or enter Token Number / Farmer ID at the centre entry gate to process arrival.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search Token (e.g. A126) or Farmer ID (e.g. FAR-1002)..."
            value={searchTokenId}
            onChange={(e) => setSearchTokenId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Lookup Token
          </button>
        </form>

        {searchedToken ? (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  TOKEN DETAILS
                </span>
                <h4 className="text-3xl font-extrabold text-slate-900 font-mono">
                  {searchedToken.token}
                </h4>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {searchedToken.farmerName} {searchedToken.phone ? `(${searchedToken.phone})` : ""}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  ID: {searchedToken.farmerId || "N/A"} • Ref: {searchedToken.bookingId}
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full">
                {searchedToken.status.replace(/_/g, " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Commodity</span>
                <strong className="text-slate-800">{searchedToken.crop} ({searchedToken.quantity} Qtl)</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Scheduled Slot</span>
                <strong className="text-slate-800">{searchedToken.slot}</strong>
              </div>
            </div>

            {/* Context-Appropriate Operational Action */}
            <div className="pt-2">
              {searchedToken.status === "CANCELLED" && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold text-center">
                  ⚠️ This booking was cancelled by the farmer. Slot has been released and queue position removed.
                </div>
              )}

              {(searchedToken.status === "BOOKED" || searchedToken.status === "WAITING") && (
                <button
                  onClick={() => handleAction("ARRIVED")}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Gate Check-In (Mark ARRIVED)</span>
                </button>
              )}

              {searchedToken.status === "ARRIVED" && (
                <button
                  onClick={() => handleAction("CALLED")}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Farmer to Weighbridge</span>
                </button>
              )}

              {searchedToken.status === "CALLED" && (
                <button
                  onClick={() => handleAction("WEIGHING", { actualWeightQtl: Number(searchedToken.quantity) + 0.3 })}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  <span>Start Weighbridge Weighing</span>
                </button>
              )}

              {searchedToken.status === "WEIGHING" && (
                <button
                  onClick={() => handleAction("QUALITY_CHECK", { moisturePercent: 11.8, grade: "FAQ" })}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceed to Quality Check</span>
                </button>
              )}

              {searchedToken.status === "QUALITY_CHECK" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction("APPROVED")}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Inspection</span>
                  </button>
                  <button
                    onClick={() => handleAction("REJECTED", { remarks: "High moisture content" })}
                    className="py-3.5 px-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-extrabold text-xs transition-all flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {searchedToken.status === "APPROVED" && (
                <button
                  onClick={() => handleAction("PROCUREMENT_COMPLETED")}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Procurement & Generate Receipt</span>
                </button>
              )}

              {["PROCUREMENT_COMPLETED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(searchedToken.status) && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-emerald-800 font-bold text-xs">
                  ✓ Procurement Completed ({searchedToken.status})
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            {searchTokenId ? `No token found for "${searchTokenId}".` : "Enter a Token Number or Farmer ID above to lookup."}
          </p>
        )}
      </div>
    </div>
  );
};
