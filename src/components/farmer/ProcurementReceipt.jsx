import React from "react";
import { CheckCircle2, FileText, IndianRupee, ShieldCheck } from "lucide-react";

export const ProcurementReceipt = ({ token, centre }) => {
  if (!token) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 right-0 p-4">
        <ShieldCheck className="w-16 h-16 text-emerald-50 opacity-50" />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Procurement Completed</h3>
          <p className="text-xs text-slate-500 font-medium">Digital Receipt generated securely</p>
        </div>
      </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Farmer Name</p>
          <p className="text-base font-extrabold text-slate-900">{token.farmerName}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Token Number</p>
          <p className="text-lg font-mono font-extrabold text-slate-900">{token.token}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Booking / Lot ID</p>
          <p className="text-sm font-mono font-bold text-slate-700">
            {token.bookingId || `KS-${(token.crop || 'WHT').substring(0,3).toUpperCase()}-2026-${token.token}`}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Commodity</p>
          <p className="text-sm font-bold text-slate-800">{token.crop}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Procurement Centre</p>
          <p className="text-sm font-bold text-slate-800">{centre.name}</p>
        </div>
        
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Procurement Status</p>
          <p className="text-sm font-bold text-slate-800">{token.status.replace(/_/g, " ")}</p>
        </div>
      </div>

      <div className="mt-4 bg-emerald-50 rounded-2xl p-5 border border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Booked Qty</p>
          <p className="text-sm font-bold text-emerald-950">{token.quantity} Qtl</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Accepted Qty</p>
          <p className="text-sm font-bold text-emerald-950">{token.actualWeightQtl || token.quantity} Qtl</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Moisture</p>
          <p className="text-sm font-bold text-emerald-950">{token.moisturePercent || 12.0}%</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Quality Grade</p>
          <p className="text-sm font-bold text-emerald-950">{token.grade || "FAQ"}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-dashed border-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Payment Status: <span className="text-blue-700">{token.paymentStatus === "COMPLETED" ? "COMPLETED" : "INITIATED"}</span></p>
            <p className="text-[10px] text-slate-500">₹{token.totalAmount?.toLocaleString()} total value at MSP</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors">
          <FileText className="w-3.5 h-3.5" />
          Download PDF
        </button>
      </div>
    </div>
  );
};
