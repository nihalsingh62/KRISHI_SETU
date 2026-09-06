import React from "react";
import { useKisanSetu } from "../context/KisanSetuContext";
import {
  Wheat,
  User,
  Building2,
  ShieldCheck,
  Clock,
  QrCode,
  LineChart,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  Layers,
  Bot,
  Globe
} from "lucide-react";

export const LandingPage = () => {
  const { t, setCurrentRole, runDemoStep } = useKisanSetu();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-28">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>SIH Problem Statement 26032 Platform Solution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Smart Procurement. <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Less Waiting. Better Visibility.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Book procurement slots, receive digital tokens, track your live queue, know exactly when to arrive, and monitor procurement and payment status — while procurement centres manage daily operations and administrators monitor congestion across centres.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setCurrentRole("farmer")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:scale-105 transition-all"
              >
                <span>Enter KisanSetu</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => runDemoStep(1)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-md transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Launch Interactive SIH Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Select Your Role to Access Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Experience three synchronized perspectives of the same underlying real-time workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Farmer Card */}
          <div
            onClick={() => setCurrentRole("farmer")}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-2xl hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Role 1 • Farmer
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-2">
                Farmer Portal
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Book predictable slots, track your digital queue position live, receive AI-assisted wait predictions, and track direct bank payments.
              </p>
              <div className="bg-slate-50 rounded-2xl p-3 text-xs font-medium text-slate-700 space-y-1.5 border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Book → Track → Arrive → Sell → Get Paid</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bilingual (English & हिंदी) + Offline Mode</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-sm text-emerald-700">
              <span>Open Farmer View</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Operator Card */}
          <div
            onClick={() => setCurrentRole("operator")}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-2xl hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Role 2 • Procurement Operator
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-2">
                Procurement Centre
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Operational control room for managing daily arrivals, gate check-in, weighbridge weighing, quality testing, and capacity balancing.
              </p>
              <div className="bg-slate-50 rounded-2xl p-3 text-xs font-medium text-slate-700 space-y-1.5 border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Manage → Queue → Process → Complete</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Capacity Controls & No-Show Handling</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-sm text-blue-700">
              <span>Open Operator View</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => setCurrentRole("admin")}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-2xl hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Role 3 • Admin & Department
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-2">
                Department Administrator
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                System-wide monitoring dashboard with regional congestion heatmaps, centre comparisons, commodity procurement statistics, and load balancing intelligence.
              </p>
              <div className="bg-slate-50 rounded-2xl p-3 text-xs font-medium text-slate-700 space-y-1.5 border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  <span>Monitor → Analyze → Optimize</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <LineChart className="w-3.5 h-3.5 text-slate-400" />
                  <span>Congestion Map & Procurement Analytics</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-sm text-indigo-700">
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Without vs With KisanSetu Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Transforming Mandi Operations
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Why KisanSetu Changes the Game
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Without KisanSetu */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 text-red-400 font-bold text-lg mb-4">
                <XCircle className="w-6 h-6" />
                <span>WITHOUT KISANSETU</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Uncertain arrival without scheduled slots</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Overcrowded Mandis & 8-12 hour queue waiting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Centres overloaded while nearby capacity sits empty</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Manual paper tokens & lack of payment tracking</span>
                </li>
              </ul>
            </div>

            {/* With KisanSetu */}
            <div className="bg-emerald-950/80 rounded-2xl p-6 border border-emerald-500/50 relative">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-4">
                <CheckCircle className="w-6 h-6" />
                <span>WITH KISANSETU</span>
              </div>
              <ul className="space-y-3 text-sm text-emerald-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Book predictable time slots online or via mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Digital token with live queue position & smart wait prediction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Smart load balancing recommends less congested nearby centres</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Real-time weighbridge, quality check & payment tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
