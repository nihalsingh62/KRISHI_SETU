import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Scale, ShieldCheck, X, CheckCircle2 } from "lucide-react";

export const WeighingQCModal = ({ token, modalType, onClose }) => {
  const { updateTokenStatus } = useKisanSetu();
  const [weight, setWeight] = useState(token.actualWeightQtl || (token.quantity + 0.5));
  const [moisture, setMoisture] = useState(token.moisturePercent || 12.0);
  const [grade, setGrade] = useState(token.grade || "Grade A");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === "weighing") {
      updateTokenStatus(token.token, "WEIGHING", { actualWeightQtl: Number(weight) });
    } else if (modalType === "qc") {
      updateTokenStatus(token.token, "QUALITY_CHECK", { moisturePercent: Number(moisture), grade });
    }
    onClose();
  };

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

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium text-slate-700">
            <span>Token: <strong>{token.token}</strong> • {token.farmerName}</span>
            <br />
            <span className="text-slate-500">Declared Quantity: <strong>{token.quantity} Quintals ({token.crop})</strong></span>
          </div>

          {modalType === "weighing" ? (
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Actual Weighbridge Weight (Quintals)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Weighbridge digital telemetry input (Prototype Override).
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Moisture Content Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500">Permissible standard moisture limit: &le; 14.0%</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Quality Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Grade A">Grade A (FAQ - Fair Average Quality)</option>
                  <option value="Grade B">Grade B (Minor Refraction)</option>
                  <option value="Grade C">Grade C (Refraction Approval Required)</option>
                </select>
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
