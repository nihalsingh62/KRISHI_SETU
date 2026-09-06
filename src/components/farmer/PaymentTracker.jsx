import React, { useEffect } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import confetti from "canvas-confetti";
import { CreditCard, CheckCircle2, Building, ShieldCheck, ArrowRight, Download } from "lucide-react";

export const PaymentTracker = () => {
  const { activeToken, activeCentre } = useKisanSetu();

  if (!activeToken) return null;

  const isCompleted = activeToken.paymentStatus === "COMPLETED";
  const isProcessing = activeToken.paymentStatus === "PROCESSING";

  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isCompleted]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              <span>Direct Bank Payment Status</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Government Direct Benefit Transfer (DBT) to Farmer Bank Account.
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isCompleted
              ? "bg-emerald-100 text-emerald-800"
              : isProcessing
              ? "bg-blue-100 text-blue-800"
              : "bg-slate-100 text-slate-700"
          }`}>
            {activeToken.paymentStatus}
          </span>
        </div>

        {/* Payment Summary Box */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Total Calculated Payable Amount
              </span>
              <div className="text-3xl sm:text-5xl font-extrabold text-emerald-400 mt-1">
                ₹{activeToken.totalAmount ? activeToken.totalAmount.toLocaleString() : '0'}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300">
              <span>Quantity Procured: <strong>{activeToken.actualWeightQtl || activeToken.quantityQtl} Quintals</strong></span>
              <br />
              <span>Government MSP Rate: <strong>₹{activeToken.mspPerQtl} / Qtl</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs text-slate-300">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Beneficiary Account</span>
              <span className="font-bold text-white text-sm block mt-0.5">Ramesh Singh</span>
              <span className="text-slate-400 text-[11px]">State Bank of India • A/C ****4821</span>
              <span className="text-[10px] text-emerald-400 block mt-1">✓ Aadhaar & Bank Linked</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Transaction Reference</span>
              <span className="font-bold font-mono text-amber-400 text-sm block mt-0.5">
                {activeToken.paymentTxRef || "PENDING_VERIFICATION"}
              </span>
              <span className="text-slate-400 text-[11px]">PFMS Gateway Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
