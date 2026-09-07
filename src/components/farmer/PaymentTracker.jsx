import React, { useEffect, useState, useRef } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import confetti from "canvas-confetti";
import { CreditCard, CheckCircle2, Building, ShieldCheck, ArrowRight, Download, Plus, Edit2, AlertCircle } from "lucide-react";

export const PaymentTracker = () => {
  const { activeBooking, authenticatedUser, updateFarmerBankDetails } = useKisanSetu();
  const bankDetails = authenticatedUser?.bankDetails || null;
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    bankName: "",
    holderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: ""
  });

  const bankNameRef = useRef(null);
  const holderNameRef = useRef(null);
  const accountNumberRef = useRef(null);
  const confirmAccountNumberRef = useRef(null);
  const ifscRef = useRef(null);

  const isCompleted = activeBooking?.paymentStatus === "COMPLETED";
  const isProcessing = activeBooking?.paymentStatus === "PROCESSING";

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
        confirmAccountNumber: bankDetails.accountNumber || "",
        ifsc: bankDetails.ifsc || ""
      });
    } else if (authenticatedUser) {
      setFormData({
        bankName: "",
        holderName: authenticatedUser.name || "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifsc: ""
      });
    }
  }, [bankDetails, authenticatedUser]);

  const handleSaveBank = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.bankName.trim() || formData.bankName.trim().length < 2) {
      newErrors.bankName = "Bank name must be at least 2 characters.";
    }
    if (!formData.holderName.trim() || formData.holderName.trim().length < 3) {
      newErrors.holderName = "Account holder name must be at least 3 characters.";
    }
    if (!/^\d{9,18}$/.test(formData.accountNumber.trim())) {
      newErrors.accountNumber = "Account number must contain 9–18 digits.";
    }
    if (formData.confirmAccountNumber.trim() !== formData.accountNumber.trim()) {
      newErrors.confirmAccountNumber = "Account numbers do not match.";
    }
    const ifscUpper = formData.ifsc.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscUpper)) {
      newErrors.ifsc = "Enter a valid 11-character IFSC (5th character must be '0').";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.bankName && bankNameRef.current) bankNameRef.current.focus();
      else if (newErrors.holderName && holderNameRef.current) holderNameRef.current.focus();
      else if (newErrors.accountNumber && accountNumberRef.current) accountNumberRef.current.focus();
      else if (newErrors.confirmAccountNumber && confirmAccountNumberRef.current) confirmAccountNumberRef.current.focus();
      else if (newErrors.ifsc && ifscRef.current) ifscRef.current.focus();
      return;
    }

    setErrors({});
    if (authenticatedUser?.id) {
      const updated = {
        bankName: formData.bankName.trim(),
        accountHolder: formData.holderName.trim(),
        holderName: formData.holderName.trim(),
        accountNumber: formData.accountNumber.trim(),
        ifsc: ifscUpper
      };
      updateFarmerBankDetails(authenticatedUser.id, updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
    setIsAddingBank(false);
  };

  const maskAccount = (acc) => {
    if (!acc || acc.length < 4) return "****";
    return `••••${acc.slice(-4)}`;
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
              Direct Benefit Transfer (DBT) to Farmer Bank Account • Prototype payment flow
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isCompleted
              ? "bg-emerald-100 text-emerald-800"
              : isProcessing
              ? "bg-blue-100 text-blue-800"
              : "bg-slate-100 text-slate-700"
          }`}>
            {activeBooking?.paymentStatus || "NOT_INITIATED"}
          </span>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bank details successfully updated!</span>
          </div>
        )}

        {/* Payment Summary Box */}
        {activeBooking ? (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6">
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
              {/* Beneficiary Account Card */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 relative">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Beneficiary Account</span>
                
                {!bankDetails || !bankDetails.accountNumber ? (
                  <div className="mt-2">
                    <span className="text-red-400 font-bold block mb-2 text-xs">No bank account linked</span>
                    {!isAddingBank && (
                      <button
                        onClick={() => { setIsAddingBank(true); setErrors({}); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-[11px]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Bank Account
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="mt-1">
                    <span className="font-bold text-white text-sm block">{bankDetails.bankName}</span>
                    <span className="text-slate-300 text-xs font-mono">A/C {maskAccount(bankDetails.accountNumber)}</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Account Holder: {bankDetails.accountHolder || bankDetails.holderName || authenticatedUser?.name}
                    </span>
                    <span className="text-slate-400 text-[11px] block">IFSC: {bankDetails.ifsc}</span>
                    <span className="text-[10px] text-amber-400 block mt-1">✓ Prototype Verified Beneficiary</span>
                    
                    {!isAddingBank && (
                      <button
                        onClick={() => { setIsAddingBank(true); setErrors({}); }}
                        className="absolute top-4 right-4 flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Edit Bank Details</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Transaction Reference */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Transaction Reference</span>
                <span className="font-bold font-mono text-amber-400 text-sm block mt-0.5">
                  {activeBooking.paymentTxRef || "PENDING_VERIFICATION"}
                </span>
                <span className="text-slate-400 text-[11px] block mt-1">Prototype payment flow (Simulated DBT Transfer)</span>
                <span className="text-[10px] text-slate-500">Status: {activeBooking.paymentStatus}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 mb-6">
            <p className="text-slate-600 font-medium text-sm mb-4">
              No active procurement payment in progress. Once your grain is weighed and approved at the centre, DBT payment will be initiated here.
            </p>
            
            {/* Beneficiary Account Card when no active booking */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-lg relative">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Beneficiary Account</span>
              
              {!bankDetails || !bankDetails.accountNumber ? (
                <div className="mt-2">
                  <span className="text-red-500 font-bold block mb-2 text-xs">No bank account linked</span>
                  {!isAddingBank && (
                    <button
                      onClick={() => { setIsAddingBank(true); setErrors({}); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Bank Account
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  <span className="font-bold text-slate-900 text-base block">{bankDetails.bankName}</span>
                  <span className="text-slate-600 text-sm font-mono font-semibold">A/C {maskAccount(bankDetails.accountNumber)}</span>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Account Holder: <strong>{bankDetails.accountHolder || bankDetails.holderName || authenticatedUser?.name}</strong>
                  </p>
                  <p className="text-slate-500 text-xs font-mono">IFSC: {bankDetails.ifsc}</p>
                  
                  {!isAddingBank && (
                    <button
                      onClick={() => { setIsAddingBank(true); setErrors({}); }}
                      className="absolute top-4 right-4 flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Edit Bank Details</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Add/Edit Bank Form */}
        {isAddingBank && (
          <div className="bg-slate-50 rounded-2xl p-6 border-2 border-emerald-500/40">
            <h4 className="text-sm font-bold text-slate-900 mb-4">
              {bankDetails && bankDetails.accountNumber ? "Edit Beneficiary Account Details" : "Link Beneficiary Bank Account"}
            </h4>
            <form onSubmit={handleSaveBank} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Bank Name *</label>
                  <input 
                    ref={bankNameRef}
                    type="text"
                    maxLength={60}
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors ${
                      errors.bankName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-emerald-500'
                    }`}
                    placeholder="e.g. State Bank of India"
                    value={formData.bankName}
                    onChange={(e) => {
                      setFormData({...formData, bankName: e.target.value});
                      setErrors({...errors, bankName: null});
                    }}
                  />
                  {errors.bankName && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.bankName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Account Holder Name *</label>
                  <input 
                    ref={holderNameRef}
                    type="text"
                    maxLength={60}
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors ${
                      errors.holderName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-emerald-500'
                    }`}
                    placeholder={`e.g. ${authenticatedUser?.name || "Farmer Name"}`}
                    value={formData.holderName}
                    onChange={(e) => {
                      setFormData({...formData, holderName: e.target.value});
                      setErrors({...errors, holderName: null});
                    }}
                  />
                  {errors.holderName && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.holderName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Account Number (9–18 Digits) *</label>
                  <input 
                    ref={accountNumberRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={18}
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition-colors ${
                      errors.accountNumber ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-emerald-500'
                    }`}
                    placeholder="Enter 9–18 digit account number"
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                      setFormData({...formData, accountNumber: val});
                      setErrors({...errors, accountNumber: null});
                    }}
                  />
                  {errors.accountNumber && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Confirm Account Number *</label>
                  <input 
                    ref={confirmAccountNumberRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={18}
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-mono text-slate-900 focus:outline-none transition-colors ${
                      errors.confirmAccountNumber ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-emerald-500'
                    }`}
                    placeholder="Re-enter account number"
                    value={formData.confirmAccountNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                      setFormData({...formData, confirmAccountNumber: val});
                      setErrors({...errors, confirmAccountNumber: null});
                    }}
                  />
                  {errors.confirmAccountNumber && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.confirmAccountNumber}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">IFSC Code (11 characters) *</label>
                  <input 
                    ref={ifscRef}
                    type="text"
                    maxLength={11}
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-mono uppercase text-slate-900 focus:outline-none transition-colors ${
                      errors.ifsc ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20' : 'border-slate-300 focus:border-emerald-500'
                    }`}
                    placeholder="e.g. SBIN0001234"
                    value={formData.ifsc}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().slice(0, 11);
                      setFormData({...formData, ifsc: val});
                      setErrors({...errors, ifsc: null});
                    }}
                  />
                  {errors.ifsc && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.ifsc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsAddingBank(false); setErrors({}); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Save Bank Details
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
