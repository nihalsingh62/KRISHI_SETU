import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { User, CreditCard, Save, CheckCircle2 } from "lucide-react";

export const FarmerProfile = () => {
  const { authenticatedUser, updateFarmerBankDetails } = useKisanSetu();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    bankName: authenticatedUser?.bankDetails?.bankName || "",
    holderName: authenticatedUser?.bankDetails?.holderName || "",
    accountNumber: authenticatedUser?.bankDetails?.accountNumber || "",
    ifsc: authenticatedUser?.bankDetails?.ifsc || ""
  });

  if (!authenticatedUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFarmerBankDetails(authenticatedUser.id, formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Identity Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <User className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase mb-4 inline-block">
              Verified Farmer Profile
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
              {authenticatedUser.name}
            </h2>
            <p className="text-emerald-300 font-mono text-sm mb-4">
              ID: {authenticatedUser.id}
            </p>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Mobile Number</p>
                <p className="text-sm font-semibold">+91 {authenticatedUser.mobile}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Aadhaar Linked</p>
                <p className="text-sm font-mono font-semibold">
                  XXXX XXXX {authenticatedUser.aadhaar?.slice(-4) || "****"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Bank Account Details</span>
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl transition-colors"
            >
              Edit Details
            </button>
          )}
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold">Bank details successfully updated!</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. State Bank of India"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.holderName}
                  onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={e => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium font-mono uppercase"
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" /> Save Details
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {authenticatedUser.bankDetails ? (
              <>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Bank Name</p>
                  <p className="text-sm font-bold text-slate-900">{authenticatedUser.bankDetails.bankName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Account Holder</p>
                  <p className="text-sm font-bold text-slate-900">{authenticatedUser.bankDetails.holderName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Account Number</p>
                  <p className="text-sm font-mono font-bold text-slate-900">
                    XXXX XXXX {authenticatedUser.bankDetails.accountNumber?.slice(-4)}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">IFSC Code</p>
                  <p className="text-sm font-mono font-bold text-slate-900">{authenticatedUser.bankDetails.ifsc}</p>
                </div>
              </>
            ) : (
              <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium text-sm mb-4">No bank details added yet.</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-600 font-bold text-sm hover:underline"
                >
                  + Add Bank Details
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
