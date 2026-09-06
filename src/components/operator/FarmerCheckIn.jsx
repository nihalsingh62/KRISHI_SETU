import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Search, UserCheck, CheckCircle2, QrCode } from "lucide-react";

export const FarmerCheckIn = () => {
  const { bookings, activeCentre, updateTokenStatus } = useKisanSetu();
  const [searchTokenId, setSearchTokenId] = useState("A124");
  const [searchedToken, setSearchedToken] = useState(bookings.find((t) => t.token === "A124") || null);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = bookings.find(
      (t) => t.token.toLowerCase() === searchTokenId.toLowerCase() && t.centreId === activeCentre.id
    );
    setSearchedToken(found || null);
  };

  const handleConfirmArrival = () => {
    if (searchedToken) {
      updateTokenStatus(searchedToken.id, "ARRIVED");
      setSearchedToken({ ...searchedToken, status: "ARRIVED" });
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
          Scan QR Code or enter Token Number at the centre entry gate to mark arrival.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Token ID (e.g. A124)..."
            value={searchTokenId}
            onChange={(e) => setSearchTokenId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
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
                <h4 className="text-2xl font-extrabold text-slate-900 font-mono">
                  {searchedToken.id}
                </h4>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {searchedToken.farmerName} ({searchedToken.phone})
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full">
                {searchedToken.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Commodity</span>
                <strong className="text-slate-800">{searchedToken.crop} ({searchedToken.quantity} Qtl)</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Slot</span>
                <strong className="text-slate-800">{searchedToken.slot}</strong>
              </div>
            </div>

            <button
              onClick={handleConfirmArrival}
              disabled={searchedToken.status !== "BOOKED" && searchedToken.status !== "WAITING"}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{searchedToken.status === "ARRIVED" ? "Already Checked-In ✓" : "Confirm Gate Check-In & Move to Queue"}</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No token found for "{searchTokenId}".</p>
        )}
      </div>
    </div>
  );
};
