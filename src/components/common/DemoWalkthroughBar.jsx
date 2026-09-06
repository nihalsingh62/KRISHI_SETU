import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Play, ChevronRight, ChevronLeft, RotateCcw, Sparkles, CheckCircle2, User, Building2, ShieldCheck } from "lucide-react";

export const DemoWalkthroughBar = () => {
  const { demoStep, runDemoStep, activeToken } = useKisanSetu();
  const [collapsed, setCollapsed] = useState(false);

  const DEMO_STEPS = [
    { title: "1. Landing & Positioning", role: "landing", desc: "Farmer opens KisanSetu landing page." },
    { title: "2. Smart Recommendation", role: "farmer", desc: "Centre A is overloaded (94%), Centre B recommended (18m wait)." },
    { title: "3. Slot Booked (Token A124)", role: "farmer", desc: "10:30 AM slot booked. Token A124 created (6 ahead, 35m wait)." },
    { title: "4. Operator Control Room", role: "operator", desc: "Operator sees Ramesh Singh (Token A124) in active queue." },
    { title: "5. Mark Arrived ✓", role: "operator", desc: "Operator verifies check-in. Farmer sees 'Arrived ✓' live." },
    { title: "6. Weighbridge Weighing", role: "operator", desc: "42.5 Quintals recorded. Farmer sees 'Weighing in progress'." },
    { title: "7. Quality Inspection", role: "operator", desc: "12% moisture, Grade A approved." },
    { title: "8. Complete Procurement", role: "operator", desc: "Receipt generated. Farmer sees 'Procurement Completed ✓'." },
    { title: "9. Payment Processing", role: "farmer", desc: "Bank disbursement initiated. Status becomes 'Processing'." },
    { title: "10. Payment Completed 🎉", role: "farmer", desc: "Payment completed (Ref: DEMO-TRX-10482). Confetti alert." },
    { title: "11. Admin System Sync", role: "admin", desc: "Admin dashboard metrics reflect completed transaction." }
  ];

  const currentStepInfo = DEMO_STEPS[demoStep] || DEMO_STEPS[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700 shadow-2xl transition-all">
      {collapsed ? (
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>SIH 26032 Interactive Demo Walkthrough</span>
            <span className="text-slate-400 font-normal">({demoStep + 1}/{DEMO_STEPS.length}: {currentStepInfo.title})</span>
          </div>
          <button
            onClick={() => setCollapsed(false)}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md font-medium"
          >
            Expand Demo Bar 🚀
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left title & step badge */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-extrabold text-sm text-emerald-400 tracking-wide uppercase">
                  SIH Demo Controller
                </span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="text-[11px] text-slate-400 hover:text-white underline md:hidden"
              >
                Hide
              </button>
            </div>

            {/* Middle Current Step Info */}
            <div className="flex-1 bg-slate-800/90 rounded-xl px-4 py-2 border border-slate-700 w-full md:w-auto flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-amber-400">Step {demoStep + 1} of {DEMO_STEPS.length}</span>
                  <span className="text-slate-500">•</span>
                  <span className="font-semibold text-slate-200">{currentStepInfo.title}</span>
                  <span className="text-slate-400 hidden lg:inline">({currentStepInfo.role.toUpperCase()})</span>
                </div>
                <p className="text-xs text-slate-300 font-medium truncate max-w-md mt-0.5">
                  {currentStepInfo.desc}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span className="text-slate-400">Current Token:</span>
                <strong className="text-emerald-400 font-mono">{activeToken?.id || 'A124'}</strong>
              </div>
            </div>

            {/* Right Control Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                disabled={demoStep === 0}
                onClick={() => runDemoStep(Math.max(0, demoStep - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <button
                disabled={demoStep === DEMO_STEPS.length - 1}
                onClick={() => runDemoStep(Math.min(DEMO_STEPS.length - 1, demoStep + 1))}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-xs font-bold text-white shadow-md transition-all"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => runDemoStep(0)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
                title="Reset Demo to Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCollapsed(true)}
                className="hidden md:block text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Minimize
              </button>
            </div>
          </div>

          {/* Quick Jump Step Dots */}
          <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800 overflow-x-auto">
            {DEMO_STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => runDemoStep(idx)}
                className={`flex-1 min-w-[24px] h-2 rounded-full transition-all ${
                  idx === demoStep
                    ? "bg-emerald-400 ring-2 ring-emerald-400/50 scale-110"
                    : idx < demoStep
                    ? "bg-emerald-600/60 hover:bg-emerald-500"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
                title={`${step.title}: ${step.desc}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
