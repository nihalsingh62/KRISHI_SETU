import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Building2, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

export const CentreMonitoring = () => {
  const { centres, setActiveCentreId, setCurrentRole } = useKisanSetu();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Procurement Centre System Performance Table</span>
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
                      onClick={() => {
                        setActiveCentreId(c.id);
                        setCurrentRole("operator");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px]"
                    >
                      Inspect Operator Room
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
