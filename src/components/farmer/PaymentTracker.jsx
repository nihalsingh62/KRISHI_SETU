import React, { useEffect, useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import confetti from "canvas-confetti";
import { CreditCard, CheckCircle2, Building, ShieldCheck, ArrowRight, Download, Plus, Edit2 } from "lucide-react";

export const PaymentTracker = () => {
  const { activeBooking, authenticatedUser, updateFarmerBankDetails } = useKisanSetu();
  const bankDetails = authenticatedUser?.bankDetails || null;
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [formData, setFormData] = useState({ bankName: "", holderName: "", accountNumber: "", ifsc: "" });

  if (!activeBooking) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 font-medium">No active booking to show payment for.</p>
      </div>
    );
  }

  const isCompleted = activeBooking.paymentStatus === "COMPLETED";
  const isProcessing = activeBooking.paymentStatus === "PROCESSING";

  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isCompleted]);

  useEffect(() => {
    if (bankDetails) {
      setFormData({
        bankName: bankDetails.bankName || "",
        holderName: bankDetails.accountHolder || bankDetails.holderName || authenticatedUser?.name || "",
        accountNumber: bankDetails.accountNumber || "",
        ifsc: bankDetails.ifsc || ""
      });
    }
  }, [bankDetails, authenticatedUser]);

  const handleSaveBank = (e) => {
    e.preventDefault();
    if (authenticatedUser?.id) {
      const updated = {
        bankName: formData.bankName,
        accountHolder: formData.holderName,
        holderName: formData.holderName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc.toUpperCase()
      };
      updateFarmerBankDetails(authenticatedUser.id, updated);
    }
    setIsAddingBank(false);
  };

  const maskAccount = (acc) => {
    if (!acc || acc.length < 4) return "****";
    return `XXXX XXXX ${acc.slice(-4)}`;
  };

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
            {activeBooking.paymentStatus}
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
                ₹{activeBooking.totalAmount ? activeBooking.totalAmount.toLocaleString() : '0'}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300">
              <span>Quantity Procured: <strong>{activeBooking.actualWeightQtl || activeBooking.quantity} Quintals</strong></span>
              <br />
              <span>Government MSP Rate: <strong>₹{activeBooking.mspPerQtl} / Qtl</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs text-slate-300">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 relative">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Beneficiary Account</span>
              
              {!bankDetails ? (
                <div className="mt-2">
                  <span className="text-slate-300 font-bold block mb-2 text-sm text-red-400">No bank account linked</span>
                  {!isAddingBank && (
                    <button
                      onClick={() => setIsAddingBank(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Bank Account
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-0.5">
                  <span className="font-bold text-white text-sm block">{bankDetails.bankName}</span>
                  <span className="text-slate-400 text-[11px]">A/C {maskAccount(bankDetails.accountNumber)}</span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">Account Holder: {bankDetails.accountHolder || bankDetails.holderName || authenticatedUser?.name} | IFSC: {bankDetails.ifsc}</span>
                  <span className="text-[10px] text-amber-400 block mt-1">✓ Verification: Demo / Simulated</span>
                  
                  {!isAddingBank && (
                    <button
                      onClick={() => setIsAddingBank(true)}
                      className="absolute top-4 right-4 flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Edit Bank Details</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Transaction Reference</span>
              <span className="font-bold font-mono text-amber-400 text-sm block mt-0.5">
                {activeBooking.paymentTxRef || "PENDING_VERIFICATION"}
              </span>
              <span className="text-slate-400 text-[11px]">PFMS Gateway Sync</span>
            </div>
          </div>
          
          {/* Add Bank Form */}
          {isAddingBank && (
            <div className="mt-4 bg-slate-800 rounded-2xl p-5 border border-emerald-500/30">
              <h4 className="text-sm font-bold text-white mb-4">{bankDetails ? "Change Bank Account" : "Link New Bank Account"}</h4>
              <form onSubmit={handleSaveBank} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Bank Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. State Bank of India"
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Account Holder Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder={`e.g. ${authenticatedUser?.name || "Farmer Name"}`}
                      value={formData.holderName}
                      onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Account Number</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Account Number"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">IFSC Code</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. SBIN0001234"
                      value={formData.ifsc}
                      onChange={(e) => setFormData({...formData, ifsc: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingBank(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    Save & Verify (Demo)
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
