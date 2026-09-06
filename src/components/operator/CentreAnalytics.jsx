import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Clock, Users, CheckCircle2 } from "lucide-react";

export const CentreAnalytics = () => {
  const { activeCentre } = useKisanSetu();

  const hourlyData = [
    { hour: "08 AM", farmers: 12, completed: 10 },
    { hour: "09 AM", farmers: 15, completed: 14 },
    { hour: "10 AM", farmers: 18, completed: 12 },
    { hour: "11 AM", farmers: 14, completed: 8 },
    { hour: "12 PM", farmers: 8, completed: 2 },
    { hour: "02 PM", farmers: 5, completed: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          <span>Centre Operational Analytics & Peak Hours</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
              />
              <Bar dataKey="farmers" name="Booked Arrivals" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" name="Completed Procurements" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
