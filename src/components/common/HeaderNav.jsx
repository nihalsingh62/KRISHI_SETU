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
  Sparkles,
  LogOut,
  ChevronDown
} from "lucide-react";

export const HeaderNav = () => {
  const {
    language,
    setLanguage,
    t,
    lowNetworkMode,
    setLowNetworkMode,
    currentRole,
    isAuthenticated,
    authenticatedUser,
    logout,
    notifications,
    activeToken
  } = useKisanSetu();

  const [activePopover, setActivePopover] = useState(null); // 'notifications' | 'network' | 'user' | 'mobile' | null
  const headerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const togglePopover = (popoverName) => {
    setActivePopover((prev) => (prev === popoverName ? null : popoverName));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 bg-clip-text text-transparent">
                  KisanSetu
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">
                Digital Procurement
              </p>
            </div>
          </div>

          {/* Role Indicator / Center */}
          <div className="hidden md:flex items-center">
            {isAuthenticated && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                {currentRole === "farmer" && "Farmer Portal"}
                {currentRole === "operator" && "Procurement Centre"}
                {currentRole === "admin" && "Department Dashboard"}
              </span>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Low Network Toggle Dropdown */}
            <div className="relative">
              <button
                onClick={() => togglePopover("network")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  lowNetworkMode
                    ? "bg-amber-50 text-amber-800 border-amber-300 font-bold"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {lowNetworkMode ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">Low-bandwidth mode</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Connected</span>
                  </>
                )}
              </button>

              {activePopover === "network" && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Connectivity</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Status: {lowNetworkMode ? "Offline UI Active" : "Connected"}<br/>
                      Network quality: {lowNetworkMode ? "Poor" : "Good"}<br/>
                      Last synced: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="px-2 pt-2">
                    <button
                      onClick={() => { setLowNetworkMode(!lowNetworkMode); setActivePopover(null); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      {lowNetworkMode ? "Disable Low-Bandwidth Mode" : "Enable Low-Bandwidth Mode"}
                    </button>
                  </div>
                </div>
              )}
            </div>

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
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => togglePopover("notifications")}
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {activePopover === "notifications" && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4 text-emerald-600" /> Notifications
                      </h4>
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
            )}

            {/* User Profile Menu */}
            {isAuthenticated && authenticatedUser && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => togglePopover("user")}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{authenticatedUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {activePopover === "user" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{authenticatedUser.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{currentRole}</p>
                    </div>
                    {currentRole === "farmer" && (
                      <button className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActivePopover(null);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => togglePopover("mobile")}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {activePopover === "mobile" ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {activePopover === "mobile" && (
        <div className="md:hidden bg-slate-50 border-b border-slate-200 px-4 py-3 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="px-2 py-3 border-b border-slate-200 mb-2">
                <p className="text-sm font-bold text-slate-800">{authenticatedUser?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase">{currentRole} Portal</p>
              </div>
              <button
                onClick={() => { setActivePopover(null); logout(); }}
                className="w-full flex items-center justify-center p-2.5 rounded-xl font-bold text-sm bg-red-100 text-red-700 border border-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="text-center p-4">
              <p className="text-xs text-slate-500">Please login from the main screen.</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
