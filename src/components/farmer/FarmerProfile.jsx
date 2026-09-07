import React, { useState, useEffect, useRef } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { User, CreditCard, Save, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

export const FarmerProfile = () => {
  const { t, authenticatedUser, updateFarmerBankDetails } = useKisanSetu();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAccount, setShowAccount] = useState(false);
  const [showConfirmAccount, setShowConfirmAccount] = useState(false);

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

  useEffect(() => {
    if (authenticatedUser?.bankDetails) {
      setFormData({
        bankName: authenticatedUser.bankDetails.bankName || "",
        holderName: authenticatedUser.bankDetails.accountHolder || authenticatedUser.bankDetails.holderName || authenticatedUser.name || "",
        accountNumber: authenticatedUser.bankDetails.accountNumber || "",
        confirmAccountNumber: authenticatedUser.bankDetails.accountNumber || "",
        ifsc: authenticatedUser.bankDetails.ifsc || ""
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
  }, [authenticatedUser]);

  if (!authenticatedUser) return null;

  const handleSubmit = (e) => {
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
    updateFarmerBankDetails(authenticatedUser.id, {
      bankName: formData.bankName.trim(),
      accountHolder: formData.holderName.trim(),
      holderName: formData.holderName.trim(),
      accountNumber: formData.accountNumber.trim(),
      ifsc: ifscUpper
    });
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
              {t("profileTitle")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
              {authenticatedUser.name}
            </h2>
            <p className="text-emerald-300 font-mono text-sm mb-4">
              ID: {authenticatedUser.id}
            </p>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("mobileNumber")}</p>
                <p className="text-sm font-semibold font-mono">
                  {authenticatedUser.mobile ? `${authenticatedUser.mobile.slice(0, 2)}******${authenticatedUser.mobile.slice(-2)}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("aadhaarLinked")}</p>
                <p className="text-sm font-mono font-semibold">
                  XXXX XXXX {authenticatedUser.aadhaar?.slice(-4) || "****"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("village")}</p>
                <p className="text-sm font-semibold">{authenticatedUser.village || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("district")}</p>
                <p className="text-sm font-semibold">{authenticatedUser.district || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("preferredLanguage")}</p>
                <p className="text-sm font-semibold">English / हिन्दी</p>
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
            <span>{t("bankAccountDetails")}</span>
          </h3>
          {!isEditing && (
            <button
              onClick={() => { setIsEditing(true); setErrors({}); }}
              className="cursor-pointer text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl transition-colors"
            >
              {authenticatedUser.bankDetails ? t("editBankDetails") : `+ ${t("addBankAccount")}`}
            </button>
          )}
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold">{t("bankDetailsUpdated")}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">{t("bankName")} *</label>
                <input
                  ref={bankNameRef}
                  type="text"
                  value={formData.bankName}
                  onChange={e => { setFormData({ ...formData, bankName: e.target.value }); setErrors({ ...errors, bankName: null }); }}
                  placeholder="e.g. State Bank of India"
                  className={`w-full rounded-xl p-3 outline-none text-sm font-medium border transition-colors ${
                    errors.bankName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500'
                  }`}
                  required
                />
                {errors.bankName && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.bankName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">{t("accountHolder")} *</label>
                <input
                  ref={holderNameRef}
                  type="text"
                  value={formData.holderName}
                  onChange={e => { setFormData({ ...formData, holderName: e.target.value }); setErrors({ ...errors, holderName: null }); }}
                  placeholder={`e.g. ${authenticatedUser.name}`}
                  className={`w-full rounded-xl p-3 outline-none text-sm font-medium border transition-colors ${
                    errors.holderName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500'
                  }`}
                  required
                />
                {errors.holderName && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.holderName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">{t("accountNumber")} (9-18 digits) *</label>
                <div className="relative">
                  <input
                    ref={accountNumberRef}
                    type={showAccount ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={18}
                    value={formData.accountNumber}
                    onChange={e => { 
                      const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                      setFormData({ ...formData, accountNumber: val }); 
                      setErrors({ ...errors, accountNumber: null }); 
                    }}
                    className={`w-full rounded-xl p-3 pr-10 outline-none text-sm font-medium font-mono border transition-colors ${
                      errors.accountNumber ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccount(!showAccount)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
                    aria-label={showAccount ? "Hide account number" : "Show account number"}
                  >
                    {showAccount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.accountNumber && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.accountNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">{t("confirmAccountNumber")} *</label>
                <div className="relative">
                  <input
                    ref={confirmAccountNumberRef}
                    type={showConfirmAccount ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={18}
                    value={formData.confirmAccountNumber}
                    onChange={e => { 
                      const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                      setFormData({ ...formData, confirmAccountNumber: val }); 
                      setErrors({ ...errors, confirmAccountNumber: null }); 
                    }}
                    className={`w-full rounded-xl p-3 pr-10 outline-none text-sm font-medium font-mono border transition-colors ${
                      errors.confirmAccountNumber ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmAccount(!showConfirmAccount)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
                    aria-label={showConfirmAccount ? "Hide confirm account number" : "Show confirm account number"}
                  >
                    {showConfirmAccount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmAccountNumber && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.confirmAccountNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">{t("ifscCode")} (11 characters) *</label>
                <input
                  ref={ifscRef}
                  type="text"
                  maxLength={11}
                  value={formData.ifsc}
                  onChange={e => { 
                    const val = e.target.value.toUpperCase().slice(0, 11);
                    setFormData({ ...formData, ifsc: val }); 
                    setErrors({ ...errors, ifsc: null }); 
                  }}
                  placeholder="e.g. SBIN0001234"
                  className={`w-full rounded-xl p-3 outline-none text-sm font-medium font-mono uppercase border transition-colors ${
                    errors.ifsc ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500'
                  }`}
                  required
                />
                {errors.ifsc && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.ifsc}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setErrors({}); }}
                className="cursor-pointer px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-xs"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md text-xs"
              >
                <Save className="w-4 h-4" /> {t("saveDetails")}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {authenticatedUser.bankDetails ? (
              <>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t("bankName")}</p>
                  <p className="text-sm font-bold text-slate-900">{authenticatedUser.bankDetails.bankName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t("accountHolder")}</p>
                  <p className="text-sm font-bold text-slate-900">{authenticatedUser.bankDetails.accountHolder || authenticatedUser.bankDetails.holderName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t("accountNumber")}</p>
                  <p className="text-sm font-mono font-bold text-slate-900">
                    XXXX XXXX {authenticatedUser.bankDetails.accountNumber?.slice(-4) || "****"}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t("ifscCode")}</p>
                  <p className="text-sm font-mono font-bold text-slate-900">{authenticatedUser.bankDetails.ifsc}</p>
                </div>
              </>
            ) : (
              <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium text-sm mb-4">{t("noBankDetailsAdded")}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer text-emerald-600 font-bold text-sm hover:underline"
                >
                  + {t("addBankAccount")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
