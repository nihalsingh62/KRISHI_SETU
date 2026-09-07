import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { MapPin, AlertTriangle, CheckCircle2, Building2, Users, ArrowRight, Sparkles } from "lucide-react";

export const CongestionMap = () => {
  const { centres, setActiveCentreId, setActiveAdminTab } = useKisanSetu();
  const [selectedMapCentre, setSelectedMapCentre] = useState(centres[0]);

  // Positions on simulated map canvas
  const MAP_MARKERS = [
    { id: "c1", x: 45, y: 35, label: "ABC Centre" },
    { id: "c2", x: 65, y: 25, label: "Rampur Mandi" },
    { id: "c3", x: 30, y: 60, label: "Shivaji Grain" },
    { id: "c4", x: 75, y: 70, label: "Main APMC City Yard" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Regional Procurement Congestion Heatmap</span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive map displaying real-time Mandi congestion load and queue pressure across regional centres.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Normal (&lt;80%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> High Load (80-94%)
            </span>
            <span className="flex items-center gap-1.5 text-red-700">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span> Critical (&ge;95%)
            </span>
          </div>
        </div>

        {/* Simulated Regional Map Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 relative min-h-[360px] border border-slate-800 flex flex-col justify-between overflow-hidden">
            {/* Map Grid Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>NORTH DISTRICT APMC SECTOR MAP</span>
              <span>GRID-REF: ND-4409</span>
            </div>

            {/* Interactive Centre Markers */}
            <div className="relative z-10 h-72 w-full">
              {MAP_MARKERS.map((marker) => {
                const centre = centres.find((c) => c.id === marker.id) || centres[0];
                const isSelected = selectedMapCentre.id === centre.id;

                const colorBg =
                  centre.loadPercent >= 95
                    ? "bg-red-500 text-white ring-red-400"
                    : centre.loadPercent >= 80
                    ? "bg-amber-500 text-slate-950 ring-amber-400"
                    : "bg-emerald-500 text-slate-950 ring-emerald-400";

                return (
                  <button
                    key={marker.id}
                    onClick={() => setSelectedMapCentre(centre)}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20 transition-all hover:scale-110 ${
                      isSelected ? "ring-4 ring-white z-30 scale-110" : "z-10 opacity-90"
                    } ${colorBg}`}
                  >
                    <Building2 className="w-4 h-4" />
                    <div className="text-left leading-tight hidden sm:block">
                      <span className="font-extrabold text-[11px] block">{centre.name}</span>
                      <span className="text-[9px] font-mono opacity-90">{centre.loadPercent}% Load • Queue: {centre.queueDepth}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <div className="mt-3 bg-amber-50 rounded-lg p-2 border border-amber-200/50 flex items-start gap-2 text-xs text-amber-800 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> System Recommendation: Redirect 25% bookings from Main APMC (98%) to Shivaji Hub (61%)
              </div>
            </div>
          </div>

          {/* Selected Centre Details Box */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    SELECTED CENTRE INSPECTION
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {selectedMapCentre.name}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedMapCentre.location}</p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                  selectedMapCentre.loadPercent >= 95
                    ? "bg-red-100 text-red-800"
                    : selectedMapCentre.loadPercent >= 80
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {selectedMapCentre.loadPercent}% Load
                </span>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500">Active Queue Depth</span>
                  <strong className="text-slate-900 font-mono font-extrabold">{selectedMapCentre.queueDepth} farmers</strong>
                </div>

                <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500">Target Capacity</span>
                  <strong className="text-slate-900 font-extrabold">{selectedMapCentre.capacity} / day</strong>
                </div>

                <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500">Active Counters / Weighbridges</span>
                  <strong className="text-slate-900 font-extrabold">{selectedMapCentre.activeCounters} C / {selectedMapCentre.activeWeighbridges} W</strong>
                </div>

                <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500">Avg Processing Time</span>
                  <strong className="text-slate-900 font-extrabold">{selectedMapCentre.avgProcessingMin} min</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setActiveCentreId(selectedMapCentre.id);
                  if (setActiveAdminTab) setActiveAdminTab("monitoring");
                }}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <span>Inspect Centre Telemetry in Monitoring</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
