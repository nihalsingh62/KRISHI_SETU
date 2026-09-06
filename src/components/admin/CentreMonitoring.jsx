import React, { useState } from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Building2, ArrowRight, ShieldCheck, AlertTriangle, Eye, X, Scale, Users, CheckCircle2 } from "lucide-react";

export const CentreMonitoring = () => {
  const { centres, bookings } = useKisanSetu();
  const [inspectedCentre, setInspectedCentre] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Procurement Centre Network Operational Status</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="p-3.5 rounded-l-xl">Centre Name & Code</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">Capacity Load</th>
                <th className="p-3.5">Queue Depth</th>
                <th className="p-3.5">Processing Speed</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-xl text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {centres.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <strong className="text-slate-900 font-extrabold text-sm block">{c.name}</strong>
                    <span className="text-[10px] text-slate-400">{c.code} • {c.location}</span>
                  </td>

                  <td className="p-3.5 text-slate-600">{c.distanceKm} km</td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{c.loadPercent}%</span>
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.loadPercent >= 90 ? 'bg-red-500' : c.loadPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${c.loadPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono font-extrabold text-slate-900">
                    {c.queueDepth} farmers
                  </td>

                  <td className="p-3.5 text-slate-600">
                    {c.avgProcessingMin} min / farmer ({c.activeCounters} Counters)
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.status === "CRITICAL"
                        ? "bg-red-100 text-red-800"
                        : c.status === "HIGH_LOAD"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setInspectedCentre(c)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Telemetry</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Centre Inspection Modal */}
      {inspectedCentre && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{inspectedCentre.name}</h3>
                  <p className="text-xs text-slate-500">{inspectedCentre.code} • {inspectedCentre.location}</p>
                </div>
              </div>
              <button onClick={() => setInspectedCentre(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Capacity Load</span>
                <span className="text-xl font-extrabold text-slate-900">{inspectedCentre.loadPercent}%</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Queue Depth</span>
                <span className="text-xl font-extrabold text-amber-600">{inspectedCentre.queueDepth} farmers</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Counters</span>
                <span className="text-xl font-extrabold text-slate-900">{inspectedCentre.activeCounters} Lanes</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Weighbridges</span>
                <span className="text-xl font-extrabold text-slate-900">{inspectedCentre.activeWeighbridges || 2} Active</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Live Bookings & Queue at this Centre</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {bookings.filter(b => b.centreId === inspectedCentre.id).map(b => (
                  <div key={b.bookingId || b.token} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold px-2 py-0.5 bg-slate-200 rounded text-slate-800">{b.token}</span>
                      <span className="font-bold text-slate-900">{b.farmerName}</span>
                      <span className="text-slate-400">• {b.crop} ({b.quantity} Qtl)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-200 text-slate-700">
                      {b.status.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectedCentre(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
