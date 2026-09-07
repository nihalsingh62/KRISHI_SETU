import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { FarmerDashboard } from "./FarmerDashboard";
import { SmartBooking } from "./SmartBooking";
import { LiveQueueView } from "./LiveQueueView";
import { ProcurementTimeline } from "./ProcurementTimeline";
import { PaymentTracker } from "./PaymentTracker";
import {
  LayoutDashboard,
  Calendar,
  Truck,
  CreditCard,
  WifiOff,
  User,
  QrCode
} from "lucide-react";
import { FarmerProfile } from "./FarmerProfile";

export const FarmerPortalView = () => {
  const { t, lowNetworkMode, setLowNetworkMode, activeBooking, activeFarmerTab, setActiveFarmerTab } = useKisanSetu();

  // If low network mode is ON, render simplified rural offline card
  if (lowNetworkMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-400 text-amber-950 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-300 pb-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-6 h-6 text-amber-700 animate-pulse" />
              <h2 className="text-xl font-extrabold">{t("lowNetworkMode")}</h2>
            </div>
          </div>

          <p className="text-xs font-semibold">
            {t("lowNetworkDesc")}. Your booking is saved locally and will sync when connectivity returns.
          </p>

          <div className="bg-white rounded-2xl p-6 border border-amber-300 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase">{t("lastSynced")}</span>
              <span className="font-mono text-slate-800">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {!activeBooking ? (
              <div className="text-center py-6 bg-slate-100 rounded-2xl border border-slate-200">
                <p className="text-sm font-bold text-slate-700">{t("noActiveBooking")}</p>
                <p className="text-xs text-slate-500 mt-1">{t("noActiveBookingDesc")}</p>
                <button
                  onClick={() => setActiveFarmerTab("booking")}
                  className="cursor-pointer mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  {t("bookNewSlot")}
                </button>
              </div>
            ) : (
              <>
                <div className="text-center py-4 bg-slate-900 text-white rounded-2xl">
                  <span className="text-xs text-amber-400 font-extrabold uppercase block">{t("myToken")}</span>
                  <div className="text-5xl font-mono font-extrabold text-emerald-400 mt-1">
                    {activeBooking.token}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeBooking.farmerName} • {activeBooking.crop} ({activeBooking.quantity} Qtl)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-bold pt-2">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <span className="text-[10px] text-amber-800 block">{t("queuePosition")}</span>
                    <span className="text-xl text-slate-900">#{activeBooking.queuePosition || 1}</span>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <span className="text-[10px] text-emerald-800 block">{t("estimatedWait")}</span>
                    <span className="text-xl text-slate-900">{activeBooking.estimatedWait || 5} min</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Farmer Sub-navigation bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveFarmerTab("dashboard")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeFarmerTab === "dashboard"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t("tabDashboard") || "Dashboard"}</span>
        </button>

        <button
          onClick={() => setActiveFarmerTab("booking")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeFarmerTab === "booking"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t("tabBookSlot") || "Book Procurement Slot"}</span>
        </button>

        <button
          onClick={() => setActiveFarmerTab("queue")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeFarmerTab === "queue"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{t("tabQueue") || "Token & Queue"}</span>
        </button>

        <button
          onClick={() => setActiveFarmerTab("timeline")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeFarmerTab === "timeline"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t("tabProcurement") || "Procurement"}</span>
        </button>

        <button
          onClick={() => setActiveFarmerTab("payment")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeFarmerTab === "payment"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t("tabPayment") || "Payment Tracking"}</span>
        </button>

        <button
          onClick={() => setActiveFarmerTab("profile")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeFarmerTab === "profile"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t("tabProfile") || "Profile"}</span>
        </button>
      </div>

      {/* Render Active Farmer Tab */}
      {activeFarmerTab === "dashboard" && (
        <FarmerDashboard onNavigateTab={(tab) => setActiveFarmerTab(tab)} />
      )}
      {activeFarmerTab === "booking" && (
        <SmartBooking onBookingSuccess={() => setActiveFarmerTab("queue")} />
      )}
      {activeFarmerTab === "queue" && <LiveQueueView />}
      {activeFarmerTab === "timeline" && <ProcurementTimeline />}
      {activeFarmerTab === "payment" && <PaymentTracker />}
      {activeFarmerTab === "profile" && <FarmerProfile />}
    </div>
  );
};
