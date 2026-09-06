import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import {
  Wheat,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Building2,
  Check
} from "lucide-react";

export const SmartBooking = ({ onBookingSuccess }) => {
  const { t, centres, slots, bookSlot } = useKisanSetu();

  const [commodity, setCommodity] = useState("Wheat");
  const [quantity, setQuantity] = useState("42");
  const [selectedCentreId, setSelectedCentreId] = useState("c3"); // Default to recommended Shivaji Grain (c3) or ABC (c1)
  const [selectedSlot, setSelectedSlot] = useState("10:30 AM – 11:00 AM");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [createdToken, setCreatedToken] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = bookSlot({
      commodity,
      quantityQtl: quantity,
      centreId: selectedCentreId,
      date: "Today",
      slotTime: selectedSlot
    });
    setCreatedToken(token);
    setBookingConfirmed(true);
    if (onBookingSuccess) onBookingSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {t("bookSlotTitle")}
            </h2>
            <p className="text-xs text-slate-500">
              Select commodity, quantity, and smart recommended procurement centre.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Crop & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t("selectCommodity")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Wheat", "Paddy", "Maize"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCommodity(c)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      commodity === c
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Wheat className="w-5 h-5" />
                    <span>{c}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      {c === "Wheat" ? "MSP ₹2,275" : c === "Paddy" ? "MSP ₹2,300" : "MSP ₹2,090"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t("enterQuantity")}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  Quintals
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Estimated MSP Value: <strong className="text-emerald-700">₹{(Number(quantity || 0) * (commodity === "Wheat" ? 2275 : commodity === "Paddy" ? 2300 : 2090)).toLocaleString()}</strong>
              </p>
            </div>
          </div>

          {/* Step 2: Centre Recommendation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t("recommendedCentres")}
              </label>
              <span className="text-[11px] text-slate-400">
                Sorted by lowest wait time & capacity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {centres.map((centre) => {
                const isSelected = selectedCentreId === centre.id;
                const isRecommended = centre.id === "c3" || centre.id === "c1";

                return (
                  <div
                    key={centre.id}
                    onClick={() => setSelectedCentreId(centre.id)}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/50 border-emerald-600 shadow-md"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Recommended
                      </span>
                    )}

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {centre.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{centre.distanceKm} km away • {centre.location}</span>
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold mt-3 pt-3 border-t border-slate-100">
                      <div className="bg-slate-100/80 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-500 block font-normal">Est. Wait</span>
                        <span className="text-slate-900 font-extrabold">{centre.queueDepth * 4 + 10} min</span>
                      </div>
                      <div className="bg-slate-100/80 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-500 block font-normal">Centre Load</span>
                        <span className={`font-extrabold ${centre.loadPercent > 90 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {centre.loadPercent}%
                        </span>
                      </div>
                    </div>

                    {isRecommended && (
                      <p className="text-[11px] text-emerald-800 bg-emerald-100/60 p-2 rounded-xl mt-3 font-medium">
                        ⭐ {t("whyRecommended")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Available Time Slots Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              {t("availableSlots")}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {slots.map((s) => {
                const isFull = s.status === "FULL";
                const isSelected = selectedSlot === s.time;

                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlot(s.time)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col justify-between ${
                      isFull
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <span>{s.time}</span>
                    <span className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded ${
                      isFull
                        ? "bg-red-100 text-red-700"
                        : isSelected
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {isFull ? "FULL" : `${s.booked}/${s.capacity} booked`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t("confirmBooking")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
