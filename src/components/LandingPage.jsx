import React, { useState, useRef } from "react";
import { useKisanSetu } from "../context/KisanSetuContext";
import {
  Wheat,
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const LandingPage = () => {
  const { login, registerFarmer, loginFarmer, registeredFarmers, centres, setActiveCentreId } = useKisanSetu();
  const [selectedRole, setSelectedRole] = useState(null); // 'farmer' | 'operator' | 'admin'
  
  // Demo Authentication Constants
  const DEMO_OTP = "123456";
  const DEMO_OPERATOR_ID = "OP-1042";
  const DEMO_OPERATOR_PASS = "password";
  const DEMO_ADMIN_ID = "ADMIN-001";
  const DEMO_ADMIN_PASS = "password";

  // Farmer specific states
  const [farmerFlowStep, setFarmerFlowStep] = useState('choice'); // 'choice' | 'register_init' | 'register_otp' | 'register_success' | 'login_init' | 'login_otp'
  const [farmerId, setFarmerId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [otp, setOtp] = useState("");

  // Operator specific states
  const [operatorId, setOperatorId] = useState("OP-1042");
  const [operatorPassword, setOperatorPassword] = useState("password");
  const [operatorCentreId, setOperatorCentreId] = useState("c1");

  // Admin specific states
  const [adminId, setAdminId] = useState("ADMIN-001");
  const [adminPassword, setAdminPassword] = useState("password");
  
  // Validation errors map
  const [errors, setErrors] = useState({});

  // Field Refs for auto-focusing
  const farmerNameRef = useRef(null);
  const aadhaarRef = useRef(null);
  const mobileRef = useRef(null);
  const villageRef = useRef(null);
  const districtRef = useRef(null);
  const bankNameRef = useRef(null);
  const accountHolderRef = useRef(null);
  const accountNumberRef = useRef(null);
  const confirmAccountNumberRef = useRef(null);
  const ifscRef = useRef(null);
  const otpRef = useRef(null);
  const loginFarmerIdRef = useRef(null);
  const loginMobileRef = useRef(null);
  const loginOtpRef = useRef(null);
  const operatorIdRef = useRef(null);
  const adminIdRef = useRef(null);

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleFarmerRegisterInit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!farmerName.trim() || farmerName.trim().length < 3) {
      newErrors.farmerName = "Enter a valid full name (minimum 3 characters).";
    }

    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      newErrors.aadhaar = "Enter a valid 12-digit Aadhaar/VID number.";
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!village.trim() || village.trim().length < 2) {
      newErrors.village = "Enter a valid village name.";
    }

    if (!district.trim() || district.trim().length < 2) {
      newErrors.district = "Enter a valid district name.";
    }

    if (!bankName.trim() || bankName.trim().length < 2) {
      newErrors.bankName = "Enter a valid bank name.";
    }

    if (!accountHolder.trim() || accountHolder.trim().length < 3) {
      newErrors.accountHolder = "Enter a valid account holder name.";
    }

    if (!/^\d{9,18}$/.test(accountNumber)) {
      newErrors.accountNumber = "Account number must contain 9–18 digits.";
    }

    if (accountNumber !== confirmAccountNumber) {
      newErrors.confirmAccountNumber = "Account numbers do not match.";
    }

    const ifscUpper = ifsc.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscUpper)) {
      newErrors.ifsc = "Enter a valid 11-character IFSC (5th character must be '0').";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const fieldOrder = [
        { key: 'farmerName', ref: farmerNameRef },
        { key: 'aadhaar', ref: aadhaarRef },
        { key: 'mobile', ref: mobileRef },
        { key: 'village', ref: villageRef },
        { key: 'district', ref: districtRef },
        { key: 'bankName', ref: bankNameRef },
        { key: 'accountHolder', ref: accountHolderRef },
        { key: 'accountNumber', ref: accountNumberRef },
        { key: 'confirmAccountNumber', ref: confirmAccountNumberRef },
        { key: 'ifsc', ref: ifscRef }
      ];

      for (const field of fieldOrder) {
        if (newErrors[field.key] && field.ref.current) {
          field.ref.current.focus();
          field.ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
      return;
    }

    setErrors({});
    setOtp("");
    setFarmerFlowStep('register_otp');
  };

  const handleFarmerRegisterOTP = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "OTP must be exactly 6 digits." });
      if (otpRef.current) otpRef.current.focus();
      return;
    }
    if (otp !== DEMO_OTP) {
      setErrors({ otp: `Invalid OTP. Enter demo OTP: ${DEMO_OTP}` });
      if (otpRef.current) otpRef.current.focus();
      return;
    }
    setErrors({});

    // Success - create user
    const newFarmer = registerFarmer({
      name: farmerName.trim(),
      aadhaar: aadhaarNumber.replace(/\s/g, ''),
      mobile: mobileNumber.trim(),
      village: village.trim(),
      district: district.trim(),
      bankDetails: {
        bankName: bankName.trim(),
        accountHolder: accountHolder.trim(),
        holderName: accountHolder.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase()
      }
    });
    setFarmerId(newFarmer.id);
    setFarmerFlowStep('register_success');
  };

  const handleFarmerLoginInit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!farmerId.trim()) {
      newErrors.farmerId = "Farmer ID is required (e.g. FAR-1001).";
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (Object.keys(newErrors).length === 0) {
      const exists = registeredFarmers.some(
        f => f.id.toUpperCase() === farmerId.trim().toUpperCase() && f.mobile.trim() === mobileNumber.trim()
      );
      if (!exists) {
        newErrors.farmerId = "Invalid credentials. No registered farmer found with this ID and Mobile Number.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.farmerId && loginFarmerIdRef.current) loginFarmerIdRef.current.focus();
      else if (newErrors.mobile && loginMobileRef.current) loginMobileRef.current.focus();
      return;
    }

    setErrors({});
    setOtp("");
    setFarmerFlowStep('login_otp');
  };

  const handleFarmerLoginOTP = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "OTP must be exactly 6 digits." });
      if (loginOtpRef.current) loginOtpRef.current.focus();
      return;
    }
    if (otp !== DEMO_OTP) {
      setErrors({ otp: `Invalid OTP. Enter demo OTP: ${DEMO_OTP}` });
      if (loginOtpRef.current) loginOtpRef.current.focus();
      return;
    }

    const success = loginFarmer(farmerId.trim().toUpperCase(), mobileNumber.trim());
    if (!success) {
      setErrors({ otp: "Invalid Farmer ID or Mobile Number. User record not found." });
      if (loginOtpRef.current) loginOtpRef.current.focus();
    } else {
      setErrors({});
    }
  };

  const handleOperatorLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (operatorId.trim().toUpperCase() !== DEMO_OPERATOR_ID || (operatorPassword !== DEMO_OPERATOR_PASS && operatorPassword !== "operator123")) {
      newErrors.operator = "Invalid Operator credentials. Demo ID: OP-1042 / Password: password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (operatorIdRef.current) operatorIdRef.current.focus();
      return;
    }

    const chosenCentre = centres.find(c => c.id === operatorCentreId) || centres[0];
    setActiveCentreId(chosenCentre.id);
    login("operator", { 
      id: DEMO_OPERATOR_ID, 
      name: "Operator User", 
      centreId: chosenCentre.id, 
      centre: chosenCentre.name, 
      type: "operator" 
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (adminId.trim().toUpperCase() !== DEMO_ADMIN_ID || (adminPassword !== DEMO_ADMIN_PASS && adminPassword !== "admin123")) {
      newErrors.admin = "Invalid Administrator credentials. Demo ID: ADMIN-001 / Password: password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (adminIdRef.current) adminIdRef.current.focus();
      return;
    }

    login("admin", { 
      id: DEMO_ADMIN_ID, 
      name: "System Administrator", 
      type: "admin" 
    });
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full space-y-8">
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg mb-4">
            <Wheat className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            KisanSetu
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Digital Procurement & Queue Management
          </p>
        </div>

        {!selectedRole ? (
          <div className="space-y-4 mt-8">
            <div className="text-center mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Portal</h3>
            </div>
            
            <button
              onClick={() => { setSelectedRole("farmer"); setErrors({}); }}
              className="w-full group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex items-center text-left gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">Farmer</h4>
                <p className="text-xs text-slate-500">Book & Track Procurement</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button
              onClick={() => { setSelectedRole("operator"); setErrors({}); }}
              className="w-full group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex items-center text-left gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">Procurement Centre Operator</h4>
                <p className="text-xs text-slate-500">Manage Queue & Procurement</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>

            <button
              onClick={() => { setSelectedRole("admin"); setErrors({}); }}
              className="w-full group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all flex items-center text-left gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">Department Administrator</h4>
                <p className="text-xs text-slate-500">Monitor Procurement Network</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <button 
              onClick={() => {
                setSelectedRole(null);
                setFarmerFlowStep('choice');
                setErrors({});
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to roles
            </button>

            {/* FARMER FLOW */}
            {selectedRole === "farmer" && (
              <>
                {farmerFlowStep === 'choice' && (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-600"/> Farmer Portal
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Are you a new or returning user?</p>
                    </div>
                    <button 
                      onClick={() => { setFarmerFlowStep('register_init'); setErrors({}); }} 
                      className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold transition-colors"
                    >
                      New Farmer Registration
                    </button>
                    <button 
                      onClick={() => { setFarmerFlowStep('login_init'); setErrors({}); }} 
                      className="w-full py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold transition-colors"
                    >
                      Login with Farmer ID
                    </button>
                  </div>
                )}

                {farmerFlowStep === 'register_init' && (
                  <form onSubmit={handleFarmerRegisterInit} className="space-y-4 animate-in fade-in duration-300" noValidate>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Create Farmer Account</h3>
                      <p className="text-xs text-slate-500 mt-1">Link your Aadhaar to begin.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input 
                        ref={farmerNameRef}
                        type="text" 
                        placeholder="e.g. Amit Kumar" 
                        value={farmerName} 
                        onChange={e => { setFarmerName(e.target.value); clearError('farmerName'); }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors ${
                          errors.farmerName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.farmerName && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.farmerName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar / VID Number</label>
                      <input 
                        ref={aadhaarRef}
                        type="text" 
                        inputMode="numeric"
                        maxLength={12}
                        placeholder="12 Digit Aadhaar" 
                        value={aadhaarNumber} 
                        onChange={e => { 
                          const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                          setAadhaarNumber(val); 
                          clearError('aadhaar'); 
                        }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors font-mono ${
                          errors.aadhaar ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.aadhaar && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.aadhaar}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input 
                        ref={mobileRef}
                        type="tel" 
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10 Digit Mobile" 
                        value={mobileNumber} 
                        onChange={e => { 
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setMobileNumber(val); 
                          clearError('mobile'); 
                        }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors font-mono ${
                          errors.mobile ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.mobile && <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.mobile}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Village</label>
                        <input 
                          ref={villageRef}
                          type="text" 
                          placeholder="e.g. Rampur" 
                          value={village} 
                          onChange={e => { setVillage(e.target.value); clearError('village'); }} 
                          className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors ${
                            errors.village ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                          }`} 
                        />
                        {errors.village && <p className="text-xs text-red-600 font-semibold mt-1">{errors.village}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                        <input 
                          ref={districtRef}
                          type="text" 
                          placeholder="e.g. Patna" 
                          value={district} 
                          onChange={e => { setDistrict(e.target.value); clearError('district'); }} 
                          className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors ${
                            errors.district ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                          }`} 
                        />
                        {errors.district && <p className="text-xs text-red-600 font-semibold mt-1">{errors.district}</p>}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Bank Details</h4>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                      <input 
                        ref={bankNameRef}
                        type="text" 
                        placeholder="e.g. State Bank of India" 
                        value={bankName} 
                        onChange={e => { setBankName(e.target.value); clearError('bankName'); }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors ${
                          errors.bankName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.bankName && <p className="text-xs text-red-600 font-semibold mt-1">{errors.bankName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name</label>
                      <input 
                        ref={accountHolderRef}
                        type="text" 
                        placeholder="e.g. Amit Kumar" 
                        value={accountHolder} 
                        onChange={e => { setAccountHolder(e.target.value); clearError('accountHolder'); }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors ${
                          errors.accountHolder ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.accountHolder && <p className="text-xs text-red-600 font-semibold mt-1">{errors.accountHolder}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                      <input 
                        ref={accountNumberRef}
                        type="password" 
                        inputMode="numeric"
                        maxLength={18}
                        placeholder="9 to 18 digits" 
                        value={accountNumber} 
                        onChange={e => { 
                          const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                          setAccountNumber(val); 
                          clearError('accountNumber'); 
                        }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors font-mono ${
                          errors.accountNumber ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.accountNumber && <p className="text-xs text-red-600 font-semibold mt-1">{errors.accountNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Account Number</label>
                      <input 
                        ref={confirmAccountNumberRef}
                        type="password" 
                        inputMode="numeric"
                        maxLength={18}
                        placeholder="Re-enter account number" 
                        value={confirmAccountNumber} 
                        onChange={e => { 
                          const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                          setConfirmAccountNumber(val); 
                          clearError('confirmAccountNumber'); 
                        }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors font-mono ${
                          errors.confirmAccountNumber ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.confirmAccountNumber && <p className="text-xs text-red-600 font-semibold mt-1">{errors.confirmAccountNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                      <input 
                        ref={ifscRef}
                        type="text" 
                        maxLength={11}
                        placeholder="e.g. SBIN0001234" 
                        value={ifsc} 
                        onChange={e => { 
                          const val = e.target.value.toUpperCase().slice(0, 11);
                          setIfsc(val); 
                          clearError('ifsc'); 
                        }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors uppercase font-mono ${
                          errors.ifsc ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.ifsc && <p className="text-xs text-red-600 font-semibold mt-1">{errors.ifsc}</p>}
                    </div>

                    <button type="submit" className="w-full py-3.5 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
                      Continue to Verification
                    </button>
                  </form>
                )}

                {farmerFlowStep === 'register_otp' && (
                  <form onSubmit={handleFarmerRegisterOTP} className="space-y-4 animate-in fade-in duration-300" noValidate>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Aadhaar Verification</h3>
                      <p className="text-xs text-slate-500 mt-1">OTP sent to Aadhaar-linked mobile ******{mobileNumber.slice(-4)}</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit OTP</label>
                      <input 
                        ref={otpRef}
                        type="text" 
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="_ _ _ _ _ _" 
                        value={otp} 
                        onChange={e => { 
                          const raw = e.target.value;
                          if (raw.length > 6) {
                            setErrors({ otp: "OTP must be exactly 6 digits." });
                            setOtp(raw.slice(0, 6));
                            return;
                          }
                          const val = raw.replace(/\D/g, '');
                          setOtp(val); 
                          clearError('otp'); 
                        }} 
                        onPaste={e => {
                          const pasted = e.clipboardData.getData('text').trim();
                          if (pasted.length > 6) {
                            e.preventDefault();
                            setErrors({ otp: "OTP must be exactly 6 digits." });
                            setOtp(pasted.replace(/\D/g, '').slice(0, 6));
                          }
                        }}
                        className={`w-full rounded-xl p-3 text-center tracking-[1em] text-lg font-mono focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors ${
                          errors.otp ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.otp && <p className="text-xs text-red-600 font-semibold mt-1 text-center">{errors.otp}</p>}
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 text-center">Demo OTP: <strong className="font-mono text-emerald-900">123456</strong></p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-800 font-medium">
                        Identity Verification: Secure via UIDAI simulation.
                      </p>
                    </div>

                    <button type="submit" className="w-full py-3.5 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
                      Verify OTP
                    </button>
                  </form>
                )}

                {farmerFlowStep === 'register_success' && (
                  <div className="space-y-6 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Registration Successful</h3>
                      <p className="text-xs text-slate-500 mt-1">Your KisanSetu Farmer ID has been generated.</p>
                    </div>

                    {/* ID Card */}
                    <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-2xl p-6 text-white text-left relative overflow-hidden shadow-xl border border-emerald-500/30">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <User className="w-24 h-24" />
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Wheat className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold text-sm tracking-widest text-emerald-400">KISANSETU</span>
                      </div>
                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Farmer ID</p>
                        <p className="text-2xl font-mono font-bold tracking-wider">{farmerId}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Name</p>
                            <p className="text-sm font-bold">{farmerName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Aadhaar Linked</p>
                            <p className="text-sm font-mono">XXXX XXXX {aadhaarNumber.slice(-4)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setFarmerFlowStep('login_init');
                        setOtp("");
                        setErrors({});
                      }} 
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
                    >
                      Proceed to Login
                    </button>
                  </div>
                )}

                {farmerFlowStep === 'login_init' && (
                  <form onSubmit={handleFarmerLoginInit} className="space-y-4 animate-in fade-in duration-300" noValidate>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Farmer Login</h3>
                      <p className="text-xs text-slate-500 mt-1">Enter your KisanSetu ID to continue.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">KisanSetu Farmer ID</label>
                      <input 
                        ref={loginFarmerIdRef}
                        type="text" 
                        placeholder="FAR-XXXX" 
                        value={farmerId} 
                        onChange={e => { setFarmerId(e.target.value.toUpperCase()); clearError('farmerId'); }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors uppercase font-mono ${
                          errors.farmerId ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.farmerId && <p className="text-xs text-red-600 font-semibold mt-1">{errors.farmerId}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number</label>
                      <input 
                        ref={loginMobileRef}
                        type="tel" 
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10 Digit Mobile" 
                        value={mobileNumber} 
                        onChange={e => { 
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setMobileNumber(val); 
                          clearError('mobile'); 
                        }} 
                        className={`w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors font-mono ${
                          errors.mobile ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.mobile && <p className="text-xs text-red-600 font-semibold mt-1">{errors.mobile}</p>}
                    </div>

                    <button type="submit" className="w-full py-3.5 mt-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-colors">
                      Send OTP
                    </button>
                  </form>
                )}

                {farmerFlowStep === 'login_otp' && (
                  <form onSubmit={handleFarmerLoginOTP} className="space-y-4 animate-in fade-in duration-300" noValidate>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Verify Login</h3>
                      <p className="text-xs text-slate-500 mt-1">OTP sent to registered mobile ******{mobileNumber.slice(-4)}</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit OTP</label>
                      <input 
                        ref={loginOtpRef}
                        type="text" 
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="_ _ _ _ _ _" 
                        value={otp} 
                        onChange={e => { 
                          const raw = e.target.value;
                          if (raw.length > 6) {
                            setErrors({ otp: "OTP must be exactly 6 digits." });
                            setOtp(raw.slice(0, 6));
                            return;
                          }
                          const val = raw.replace(/\D/g, '');
                          setOtp(val); 
                          clearError('otp'); 
                        }} 
                        onPaste={e => {
                          const pasted = e.clipboardData.getData('text').trim();
                          if (pasted.length > 6) {
                            e.preventDefault();
                            setErrors({ otp: "OTP must be exactly 6 digits." });
                            setOtp(pasted.replace(/\D/g, '').slice(0, 6));
                          }
                        }}
                        className={`w-full rounded-xl p-3 text-center tracking-[1em] text-lg font-mono focus:ring-2 focus:ring-emerald-500 outline-none border transition-colors ${
                          errors.otp ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'bg-slate-50 border-slate-200'
                        }`} 
                      />
                      {errors.otp && <p className="text-xs text-red-600 font-semibold mt-1 text-center">{errors.otp}</p>}
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 text-center">Demo OTP: <strong className="font-mono text-emerald-900">123456</strong></p>
                    </div>

                    <button type="submit" className="w-full py-3.5 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
                      Login to Dashboard
                    </button>
                  </form>
                )}
              </>
            )}

            {/* OPERATOR FLOW */}
            {selectedRole === "operator" && (
              <form onSubmit={handleOperatorLogin} className="space-y-4 animate-in fade-in duration-300" noValidate>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600"/> Operator Login
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Please authenticate with Operator credentials.</p>
                </div>

                {errors.operator && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errors.operator}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID</label>
                  <input 
                    ref={operatorIdRef}
                    type="text" 
                    placeholder="OP-XXXX" 
                    value={operatorId}
                    onChange={e => { setOperatorId(e.target.value.toUpperCase()); clearError('operator'); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                    required 
                  />
                  <span className="text-[10px] text-slate-400">Demo Employee ID: OP-1042</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Procurement Centre</label>
                  <select 
                    value={operatorCentreId}
                    onChange={e => setOperatorCentreId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  >
                    {centres.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={operatorPassword}
                    onChange={e => { setOperatorPassword(e.target.value); clearError('operator'); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    required 
                  />
                  <span className="text-[10px] text-slate-400">Demo Password: password</span>
                </div>
                <button type="submit" className="w-full py-3.5 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors">
                  Login to Centre
                </button>
              </form>
            )}

            {/* ADMIN FLOW */}
            {selectedRole === "admin" && (
              <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in duration-300" noValidate>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600"/> Administrator Login
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Please authenticate with Administrator credentials.</p>
                </div>

                {errors.admin && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errors.admin}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Administrator ID</label>
                  <input 
                    ref={adminIdRef}
                    type="text" 
                    placeholder="ADMIN-XXXX" 
                    value={adminId}
                    onChange={e => { setAdminId(e.target.value.toUpperCase()); clearError('admin'); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono" 
                    required 
                  />
                  <span className="text-[10px] text-slate-400">Demo Administrator ID: ADMIN-001</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={adminPassword}
                    onChange={e => { setAdminPassword(e.target.value); clearError('admin'); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    required 
                  />
                  <span className="text-[10px] text-slate-400">Demo Password: password</span>
                </div>
                <button type="submit" className="w-full py-3.5 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-colors">
                  Access Dashboard
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
