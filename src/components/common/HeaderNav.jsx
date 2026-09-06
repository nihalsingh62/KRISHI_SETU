import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import {
  Wheat,
  Globe,
  Wifi,
  WifiOff,
  Bell,
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  Sparkles
} from "lucide-react";

export const HeaderNav = () => {
  const {
    language,
    setLanguage,
    t,
    lowNetworkMode,
    setLowNetworkMode,
    currentRole,
    setCurrentRole,
    notifications,
    activeToken
  } = useKisanSetu();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* SIH Problem Statement Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            SIH Problem Statement 26032
          </span>
          <span className="hidden sm:inline text-slate-400">
            Smart Procurement & Queue Management Platform • Prototype Demo
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-amber-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3" /> Real-Time State Engine Active
          </span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">Active Token: <strong className="text-slate-200">{activeToken?.id || 'A124'}</strong></span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentRole("landing")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 bg-clip-text text-transparent">
                  KisanSetu
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  2.0
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">
                किसानसेतु • Smart Procurement
              </p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setCurrentRole("farmer")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === "farmer"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>👨‍🌾 {t("farmerRole")}</span>
            </button>

            <button
              onClick={() => setCurrentRole("operator")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === "operator"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>🏢 {t("operatorRole")}</span>
            </button>

            <button
              onClick={() => setCurrentRole("admin")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === "admin"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>🛡️ {t("adminRole")}</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Low Network Toggle */}
            <button
              onClick={() => setLowNetworkMode(!lowNetworkMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                lowNetworkMode
                  ? "bg-amber-50 text-amber-800 border-amber-300 font-bold animate-pulse-slow"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Toggle Low Network Mode for rural connectivity"
            >
              {lowNetworkMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Low-Net Mode: ON</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Low-Net</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  language === "en" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  language === "hi" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Notifications Popup Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" /> Notifications Feed
                    </h4>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Live State Updates
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 pl-5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-50 border-b border-slate-200 px-4 py-3 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Switch Portal View</div>
          <button
            onClick={() => { setCurrentRole("farmer"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl font-medium text-sm ${
              currentRole === "farmer" ? "bg-emerald-600 text-white font-semibold" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            <span>👨‍🌾 {t("farmerRole")}</span>
            <span className="text-xs opacity-80">Ramesh Singh</span>
          </button>

          <button
            onClick={() => { setCurrentRole("operator"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl font-medium text-sm ${
              currentRole === "operator" ? "bg-blue-600 text-white font-semibold" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            <span>🏢 {t("operatorRole")}</span>
            <span className="text-xs opacity-80">ABC Centre</span>
          </button>

          <button
            onClick={() => { setCurrentRole("admin"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl font-medium text-sm ${
              currentRole === "admin" ? "bg-indigo-600 text-white font-semibold" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            <span>🛡️ {t("adminRole")}</span>
            <span className="text-xs opacity-80">Department HQ</span>
          </button>
        </div>
      )}
    </header>
  );
};
