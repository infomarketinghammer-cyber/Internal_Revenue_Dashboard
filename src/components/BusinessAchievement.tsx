import React from "react";
import { BusinessAchievement as BizType } from "../types";
import { formatExactINR } from "../utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Building2 } from "lucide-react";

interface BusinessAchievementProps {
  data: BizType[];
}

export default function BusinessAchievement({ data }: BusinessAchievementProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm text-center">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">No Business-wise Data Available</h3>
        <p className="text-xs text-slate-400 mt-1">Check your Google Sheet range configuration.</p>
      </div>
    );
  }

  // Filter out the 'Total' summary row for the bar chart comparison
  const chartData = data.filter(
    (item) => item.business.toLowerCase().trim() !== "total"
  );

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const annualTargetVal = payload.find((p: any) => p.dataKey === "annualTarget")?.value ?? payload[0]?.value ?? 0;
      const actualVal = payload.find((p: any) => p.dataKey === "actual")?.value ?? payload[1]?.value ?? 0;
      const achievement = annualTargetVal > 0 ? (actualVal / annualTargetVal) * 100 : 0;

      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs">
          <p className="font-extrabold mb-2 text-slate-200">{label}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-6">
              <span className="text-slate-400 font-medium">Annual Target:</span>
              <span className="font-bold">{formatExactINR(annualTargetVal)}</span>
            </p>
            <p className="flex justify-between gap-6">
              <span className="text-slate-400 font-medium">Actual:</span>
              <span className="font-bold text-blue-400">{formatExactINR(actualVal)}</span>
            </p>
            <div className="h-[1px] bg-slate-800 my-1" />
            <p className="flex justify-between gap-6">
              <span className="text-slate-400 font-medium">Achievement:</span>
              <span className="font-black text-emerald-400">{achievement.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Table Section */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <div className="bg-amber-400 px-4 py-2.5 text-center border-b border-amber-500/20">
            <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wide">
              Business Wise Achievement
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-amber-300/80 border-b border-amber-400/60 text-slate-900 font-black text-[11px]">
                  <th className="py-2.5 px-3 border-r border-amber-400/40">Dept</th>
                  <th className="py-2.5 px-3 text-right border-r border-amber-400/40">Annual Target</th>
                  <th className="py-2.5 px-3 text-right border-r border-amber-400/40">H1 Target</th>
                  <th className="py-2.5 px-3 text-right border-r border-amber-400/40">Actual</th>
                  <th className="py-2.5 px-3 text-right">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((biz, idx) => {
                  const isTotal = biz.business.toLowerCase().trim() === "total";
                  return (
                    <tr
                      key={biz.business + idx}
                      className={
                        isTotal
                          ? "bg-amber-300 font-black text-slate-950 border-t-2 border-amber-400"
                          : "hover:bg-slate-50 transition-colors text-slate-700"
                      }
                    >
                      <td className={`py-2.5 px-3 border-r border-slate-100 ${isTotal ? "font-black" : "font-medium text-slate-900"}`}>
                        {biz.business}
                      </td>
                      <td className="py-2.5 px-3 text-right border-r border-slate-100 font-medium">
                        {formatExactINR(biz.annualTarget)}
                      </td>
                      <td className="py-2.5 px-3 text-right border-r border-slate-100 font-medium">
                        {formatExactINR(biz.h1Target)}
                      </td>
                      <td className={`py-2.5 px-3 text-right border-r border-slate-100 ${isTotal ? "font-black" : "font-bold text-slate-900"}`}>
                        {formatExactINR(biz.actual)}
                      </td>
                      <td className={`py-2.5 px-3 text-right ${isTotal ? "font-black" : "font-semibold"} ${
                        biz.pending < 0 ? "text-rose-600" : biz.pending > 0 ? "text-emerald-600" : "text-slate-800"
                      }`}>
                        {formatExactINR(biz.pending)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Target vs Actual Comparison
            </h3>
            <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded bg-slate-300 mr-1.5 inline-block"></span> Annual Target
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded bg-blue-500 mr-1.5 inline-block"></span> Actual
              </span>
            </div>
          </div>
          <div className="w-full h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="business"
                  stroke="#64748B"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={9}
                  fontWeight={500}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  name="Annual Target"
                  dataKey="annualTarget"
                  fill="#CBD5E1"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  name="Actual"
                  dataKey="actual"
                  fill="#3B82F6"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

