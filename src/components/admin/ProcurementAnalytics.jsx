import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { LineChart, CreditCard, Wheat, TrendingUp } from "lucide-react";

export const ProcurementAnalytics = () => {
  const commodityData = [
    { name: "Wheat", value: 58000, color: "#10b981" },
    { name: "Paddy", value: 32000, color: "#3b82f6" },
    { name: "Maize", value: 14000, color: "#f59e0b" }
  ];

  const paymentData = [
    { date: "Day 1", disbursed: 12.4 },
    { date: "Day 2", disbursed: 18.2 },
    { date: "Day 3", disbursed: 24.8 },
    { date: "Day 4", disbursed: 31.5 },
    { date: "Today", disbursed: 42.1 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Commodity Volume Distribution */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Wheat className="w-5 h-5 text-emerald-600" />
          <span>Procurement Volume by Commodity (Quintals)</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={commodityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {commodityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 text-xs font-bold pt-2">
          {commodityData.map((c) => (
            <span key={c.name} className="flex items-center gap-1.5" style={{ color: c.color }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
              {c.name}: {c.value.toLocaleString()} Qtl
            </span>
          ))}
        </div>
      </div>

      {/* Payment Disbursement Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          <span>Cumulative DBT Bank Disbursement (₹ Lakhs)</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
              <Bar dataKey="disbursed" name="₹ Disbursed (Lakhs)" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
