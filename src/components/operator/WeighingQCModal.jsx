import React, { useState, useRef, useEffect } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Scale, ShieldCheck, X, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

export const WeighingQCModal = ({ token, modalType, onClose }) => {
  const { updateBookingStatus } = useKisanSetu();
  const [weight, setWeight] = useState(token.actualWeightQtl || (token.quantity + 0.5));
  const [moisture, setMoisture] = useState(token.moisturePercent || 12.0);
  const [grade, setGrade] = useState(token.grade || "Grade A");
  const [remarks, setRemarks] = useState(token.remarks || "");
  const [error, setError] = useState("");

  const weightInputRef = useRef(null);
  const moistureInputRef = useRef(null);

  // Automatically adjust Grade if moisture exceeds 14.0%
  useEffect(() => {
    if (modalType === "qc") {
      const m = Number(moisture);
      if (!isNaN(m) && m > 14.0) {
        setGrade("Failed / Rejected (Moisture > 14%)");
      } else if (grade === "Failed / Rejected (Moisture > 14%)") {
        setGrade("Grade A");
      }
    }
  }, [moisture, modalType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (modalType === "weighing") {
      const numWeight = Number(weight);
      if (weight === "" || isNaN(numWeight) || !isFinite(numWeight)) {
        setError("Weight is required and must be a valid number.");
        if (weightInputRef.current) weightInputRef.current.focus();
        return;
      }
      if (numWeight <= 0) {
        setError("Weight must be greater than zero. Negative or zero values are not allowed.");
        if (weightInputRef.current) weightInputRef.current.focus();
        return;
      }
      if (numWeight > 500) {
        setError("Weight exceeds sensible maximum limit of 500 Quintals per vehicle.");
        if (weightInputRef.current) weightInputRef.current.focus();
        return;
      }
      const declared = Number(token.quantity || 40);
      if (numWeight > declared * 2.5) {
        setError(`Weight (${numWeight} Qtl) exceeds declared quantity (${declared} Qtl) by more than 150%. Please re-verify weighbridge calibration.`);
        if (weightInputRef.current) weightInputRef.current.focus();
        return;
      }

      updateBookingStatus(token.bookingId || token.token, "WEIGHING", { actualWeightQtl: numWeight });
      onClose();
    } else if (modalType === "qc") {
      const numMoisture = Number(moisture);
      if (moisture === "" || isNaN(numMoisture) || !isFinite(numMoisture)) {
        setError("Moisture percentage is required and must be a valid number.");
        if (moistureInputRef.current) moistureInputRef.current.focus();
        return;
      }
      if (numMoisture < 0 || numMoisture > 100) {
        setError("Moisture content must be between 0% and 100%.");
        if (moistureInputRef.current) moistureInputRef.current.focus();
        return;
      }

      const assignedGrade = numMoisture > 14.0 ? "Failed / Rejected (Moisture > 14%)" : grade;
      updateBookingStatus(token.bookingId || token.token, "QUALITY_CHECK", {
        moisturePercent: numMoisture,
        grade: assignedGrade,
        remarks
      });
      onClose();
    }
  };

  const isHighMoisture = modalType === "qc" && Number(moisture) > 14.0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            {modalType === "weighing" ? (
              <>
                <Scale className="w-5 h-5 text-blue-600" /> Weighbridge Record Entry
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Quality & Moisture Test
              </>
            )}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs" noValidate>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium text-slate-700">
            <span>Token: <strong>{token.token}</strong> • {token.farmerName}</span>
            <br />
            <span className="text-slate-500">Declared Quantity: <strong>{token.quantity} Quintals ({token.crop})</strong></span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {modalType === "weighing" ? (
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Actual Weighbridge Weight (Quintals) *
              </label>
              <input
                ref={weightInputRef}
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setError("");
                }}
                className={`w-full rounded-xl p-3 text-base font-extrabold focus:outline-none border transition-colors ${
                  error ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20 text-red-900' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500'
                }`}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Weighbridge digital telemetry input (Must be &gt; 0 Qtl).
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Moisture Content Percentage (%) *
                </label>
                <input
                  ref={moistureInputRef}
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={moisture}
                  onChange={(e) => {
                    setMoisture(e.target.value);
                    setError("");
                  }}
                  className={`w-full rounded-xl p-3 text-base font-extrabold focus:outline-none border transition-colors ${
                    isHighMoisture || error
                      ? 'border-amber-500 ring-1 ring-amber-500 bg-amber-50/30 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                  required
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Permissible standard moisture limit: &le; 14.0%
                </span>

                {isHighMoisture && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-800 font-semibold text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>Moisture ({moisture}%) exceeds permissible limit (&le; 14.0%). Approval will be disabled.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Quality Grade
                </label>
                {isHighMoisture ? (
                  <input
                    type="text"
                    disabled
                    value="Failed / Rejected (Moisture > 14%)"
                    className="w-full bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-sm font-bold cursor-not-allowed"
                  />
                ) : (
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Grade A">Grade A (FAQ - Fair Average Quality)</option>
                    <option value="Grade B">Grade B (Minor Refraction)</option>
                    <option value="Grade C">Grade C (Refraction Approval Required)</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operator Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any visual observations, issues, etc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-20"
                ></textarea>
              </div>
            </>
          )}

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confirm & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
