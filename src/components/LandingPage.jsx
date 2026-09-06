import React, { useState } from "react";
import { useKisanSetu } from "../context/KisanSetuContext";
import {
  Wheat,
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

export const LandingPage = () => {
  const { login, registerFarmer, loginFarmer } = useKisanSetu();
  const [selectedRole, setSelectedRole] = useState(null); // 'farmer' | 'operator' | 'admin'
  
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
  
  const [error, setError] = useState("");

  const handleFarmerRegisterInit = (e) => {
    e.preventDefault();
    setError("");
    // Validation
    if (!/^\d{12}$/.test(aadhaarNumber.replace(/\s/g, ''))) {
      setError("Aadhaar must be exactly 12 digits.");
      return;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
    if (farmerName.trim().length < 3) {
      setError("Please enter a valid name.");
      return;
    }
    if (village.trim().length < 2) {
      setError("Please enter a valid village name.");
      return;
    }
    if (district.trim().length < 2) {
      setError("Please enter a valid district name.");
      return;
    }
    if (bankName.trim().length < 2) {
      setError("Please enter a valid bank name.");
      return;
    }
    if (accountHolder.trim().length < 3) {
      setError("Please enter a valid account holder name.");
      return;
    }
    if (!/^\d{9,18}$/.test(accountNumber)) {
      setError("Account Number must be between 9 and 18 digits (numeric only).");
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      setError("Account Numbers do not match.");
      return;
    }
    const ifscUpper = ifsc.toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscUpper)) {
      setError("Invalid IFSC code format. Must be 11 characters, 5th character must be '0'.");
      return;
    }

    setOtp("");
    setFarmerFlowStep('register_otp');
  };

  const handleFarmerRegisterOTP = (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }
    // Success - create user
    const newFarmer = registerFarmer({
      name: farmerName,
      aadhaar: aadhaarNumber.replace(/\s/g, ''),
      mobile: mobileNumber,
      village,
      district,
      bankDetails: {
        bankName,
        accountHolder,
        accountNumber,
        ifsc: ifsc.toUpperCase()
      }
    });
    setFarmerId(newFarmer.id);
    setFarmerFlowStep('register_success');
  };

  const handleFarmerLoginInit = (e) => {
    e.preventDefault();
    setError("");
    if (farmerId.trim() === "") {
      setError("Farmer ID is required.");
      return;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
    setOtp("");
    setFarmerFlowStep('login_otp');
  };

  const handleFarmerLoginOTP = (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }
    const success = loginFarmer(farmerId.trim().toUpperCase(), mobileNumber);
    if (!success) {
      setError("Invalid Farmer ID or Mobile Number. User not found.");
    }
  };

  const handleOperatorAdminLogin = (e) => {
    e.preventDefault();
    // Simulate authentication
    if (selectedRole === "operator") {
      login("operator", { name: "Operator User", centre: "ABC Procurement Centre", type: "operator" });
    } else if (selectedRole === "admin") {
      login("admin", { name: "System Admin", type: "admin" });
    }
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
              onClick={() => setSelectedRole("farmer")}
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
              onClick={() => setSelectedRole("operator")}
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
              onClick={() => setSelectedRole("admin")}
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
                setError("");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to roles
            </button>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
                {error}
              </div>
            )}

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
                    <button onClick={() => setFarmerFlowStep('register_init')} className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold transition-colors">
                      New Farmer Registration
                    </button>
                    <button onClick={() => setFarmerFlowStep('login_init')} className="w-full py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold transition-colors">
                      Login with Farmer ID
                    </button>
                  </div>
                )}

                {farmerFlowStep === 'register_init' && (
                  <form onSubmit={handleFarmerRegisterInit} className="space-y-4 animate-in fade-in duration-300">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Create Farmer Account</h3>
                      <p className="text-xs text-slate-500 mt-1">Link your Aadhaar to begin.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input type="text" placeholder="e.g. Amit Kumar" value={farmerName} onChange={e => setFarmerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Number</label>
                      <input type="password" placeholder="12 Digit Aadhaar" value={aadhaarNumber} onChange={e => setAadhaarNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input type="tel" placeholder="10 Digit Mobile" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Village</label>
                        <input type="text" placeholder="e.g. Rampur" value={village} onChange={e => setVillage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                        <input type="text" placeholder="e.g. Patna" value={district} onChange={e => setDistrict(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Bank Details</h4>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                      <input type="text" placeholder="e.g. State Bank of India" value={bankName} onChange={e => setBankName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name</label>
                      <input type="text" placeholder="e.g. Amit Kumar" value={accountHolder} onChange={e => setAccountHolder(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                      <input type="password" placeholder="9 to 18 digits" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Account Number</label>
                      <input type="password" placeholder="Re-enter account number" value={confirmAccountNumber} onChange={e => setConfirmAccountNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                      <input type="text" placeholder="e.g. SBIN0001234" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-mono" required />
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
                      Continue
                    </button>
                  </form>
                )}

                {farmerFlowStep === 'register_otp' && (
                  <form onSubmit={handleFarmerRegisterOTP} className="space-y-4 animate-in fade-in duration-300">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Aadhaar Verification</h3>
                      <p className="text-xs text-slate-500 mt-1">OTP sent to Aadhaar-linked mobile ******{mobileNumber.slice(-4)}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit OTP</label>
                      <input type="text" placeholder="_ _ _ _ _ _" value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center tracking-[1em] text-lg font-mono focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-800 font-medium">
                        Identity Verification: Secure via UIDAI.
                      </p>
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
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

                    <button onClick={() => {
                        setFarmerFlowStep('login_init');
                        setOtp("");
                    }} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors">
                      Proceed to Login
                    </button>
                  </div>
                )}

                {farmerFlowStep === 'login_init' && (
                  <form onSubmit={handleFarmerLoginInit} className="space-y-4 animate-in fade-in duration-300">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Farmer Login</h3>
                      <p className="text-xs text-slate-500 mt-1">Enter your KisanSetu ID to continue.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">KisanSetu Farmer ID</label>
                      <input type="text" placeholder="FAR-XXXX" value={farmerId} onChange={e => setFarmerId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-mono" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number</label>
                      <input type="tel" placeholder="10 Digit Mobile" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-colors">
                      Send OTP
                    </button>
                  </form>
                )}

                {farmerFlowStep === 'login_otp' && (
                  <form onSubmit={handleFarmerLoginOTP} className="space-y-4 animate-in fade-in duration-300">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Verify Login</h3>
                      <p className="text-xs text-slate-500 mt-1">OTP sent to registered mobile ******{mobileNumber.slice(-4)}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit OTP</label>
                      <input type="text" placeholder="_ _ _ _ _ _" value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center tracking-[1em] text-lg font-mono focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
                      Login to Dashboard
                    </button>
                  </form>
                )}
              </>
            )}

            {/* OPERATOR FLOW */}
            {selectedRole === "operator" && (
              <form onSubmit={handleOperatorAdminLogin} className="space-y-4 animate-in fade-in duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600"/> Operator Login
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Please authenticate to continue.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID</label>
                  <input type="text" placeholder="OP-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required defaultValue="OP-1042" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Procurement Centre</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>ABC Procurement Centre</option>
                    <option>Rampur Mandi Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password / OTP</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required defaultValue="password" />
                </div>
                <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors">
                  Login to Centre
                </button>
              </form>
            )}

            {/* ADMIN FLOW */}
            {selectedRole === "admin" && (
              <form onSubmit={handleOperatorAdminLogin} className="space-y-4 animate-in fade-in duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600"/> Administrator Login
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Please authenticate to continue.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Administrator ID</label>
                  <input type="text" placeholder="ADMIN-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required defaultValue="ADMIN-001" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password / OTP</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required defaultValue="password" />
                </div>
                <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-colors">
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
