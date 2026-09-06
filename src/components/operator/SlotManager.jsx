import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { Layers, Plus, Minus, Lock, Unlock, Settings, Scale } from "lucide-react";

export const SlotManager = () => {
  const { slots, updateSlotCapacity, activeCentre, updateCentreCapacity } = useKisanSetu();

  return (
    <div className="space-y-6">
      {/* Active Processing Equipment Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>Active Centre Processing Power & Hardware Configuration</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Adjust active counters and weighbridge lanes to recalculate wait time estimates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block font-semibold">Active Counters</span>
              <strong className="text-xl font-extrabold text-slate-900">{activeCentre.activeCounters}</strong>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCentreCapacity(activeCentre.id, { activeCounters: Math.max(1, activeCentre.activeCounters - 1) })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                -
              </button>
              <button
                onClick={() => updateCentreCapacity(activeCentre.id, { activeCounters: activeCentre.activeCounters + 1 })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block font-semibold">Weighbridges</span>
              <strong className="text-xl font-extrabold text-slate-900">{activeCentre.activeWeighbridges}</strong>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCentreCapacity(activeCentre.id, { activeWeighbridges: Math.max(1, activeCentre.activeWeighbridges - 1) })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                -
              </button>
              <button
                onClick={() => updateCentreCapacity(activeCentre.id, { activeWeighbridges: activeCentre.activeWeighbridges + 1 })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block font-semibold">Target Capacity</span>
              <strong className="text-xl font-extrabold text-slate-900">{activeCentre.capacity}</strong>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCentreCapacity(activeCentre.id, { capacity: Math.max(50, activeCentre.capacity - 10) })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                -
              </button>
              <button
                onClick={() => updateCentreCapacity(activeCentre.id, { capacity: activeCentre.capacity + 10 })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Slot Capacity Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Hourly Booking Slot Limits & Controls</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((s) => (
            <div key={s.time} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs text-slate-900">{s.time}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  s.status === "FULL" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {s.status}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-600 mb-3">
                Bookings: <strong className="text-slate-900 font-extrabold">{s.booked}</strong> / {s.capacity}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Adjust Max:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateSlotCapacity(s.time, -2)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded font-bold hover:bg-slate-100"
                  >
                    -2
                  </button>
                  <button
                    onClick={() => updateSlotCapacity(s.time, 2)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded font-bold hover:bg-slate-100"
                  >
                    +2
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
