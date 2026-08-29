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
  Cell,
} from "recharts";
import { Building2 } from "lucide-react";

interface BusinessAchievementProps {
  data: BizType[];
}

export function getBusinessColor(businessName: string) {
  const norm = (businessName || "").toLowerCase().trim();
  if (norm.includes("ai") || norm.includes("robotics")) {
    return {
      name: "AI & Robotics",
      shortName: "AI",
      actual: "#7C3AED", // Vibrant Violet / Purple
      target: "#DDD6FE", // Violet 200
      lightBg: "bg-purple-50 text-purple-700 border-purple-200",
      dotClass: "bg-purple-600",
      textClass: "text-purple-600",
    };
  }
  if (norm.includes("digital") || norm.includes("marketing")) {
    return {
      name: "Digital Marketing",
      shortName: "Digital",
      actual: "#0284C7", // Sky / Vibrant Blue
      target: "#BAE6FD", // Sky 200
      lightBg: "bg-sky-50 text-sky-700 border-sky-200",
      dotClass: "bg-sky-600",
      textClass: "text-sky-600",
    };
  }
  if (norm.includes("web") || norm.includes("site") || norm.includes("development")) {
    return {
      name: "Web Development",
      shortName: "Website",
      actual: "#059669", // Emerald 600
      target: "#A7F3D0", // Emerald 200
      lightBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotClass: "bg-emerald-600",
      textClass: "text-emerald-600",
    };
  }
  if (norm.includes("workshop")) {
    return {
      name: "Workshops",
      shortName: "Workshops",
      actual: "#EA580C", // Vibrant Orange
      target: "#FED7AA", // Orange 200
      lightBg: "bg-orange-50 text-orange-800 border-orange-200",
      dotClass: "bg-orange-600",
      textClass: "text-orange-600",
    };
  }
  if (norm.includes("book")) {
    return {
      name: "Books",
      shortName: "Books",
      actual: "#E11D48", // Rose 600
      target: "#FECDD3", // Rose 200
      lightBg: "bg-rose-50 text-rose-700 border-rose-200",
      dotClass: "bg-rose-600",
      textClass: "text-rose-600",
    };
  }
  return {
    name: businessName,
    shortName: businessName,
    actual: "#64748B", // Slate 500
    target: "#E2E8F0", // Slate 200
    lightBg: "bg-slate-50 text-slate-700 border-slate-200",
    dotClass: "bg-slate-500",
    textClass: "text-slate-600",
  };
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
      const h1TargetVal = payload.find((p: any) => p.dataKey === "h1Target")?.value ?? 0;
      const actualVal = payload.find((p: any) => p.dataKey === "actual")?.value ?? 0;
      const achievement = h1TargetVal > 0 ? (actualVal / h1TargetVal) * 100 : 0;
      const colors = getBusinessColor(label);

      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${colors.dotClass}`} />
            <p className="font-black text-slate-100 text-xs">{label}</p>
          </div>
          <div className="space-y-1.5">
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">H1 Target:</span>
              <span className="font-bold text-slate-200">{formatExactINR(h1TargetVal)}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Actual Achieved:</span>
              <span className="font-bold" style={{ color: colors.actual }}>{formatExactINR(actualVal)}</span>
            </p>
            <div className="h-[1px] bg-slate-800 my-1" />
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">H1 Achievement:</span>
              <span className="font-black text-emerald-400">{achievement.toFixed(1)}%</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Variance to H1:</span>
              <span className={`font-bold ${actualVal >= h1TargetVal ? "text-emerald-400" : "text-rose-400"}`}>
                {actualVal >= h1TargetVal ? `+${formatExactINR(actualVal - h1TargetVal)}` : formatExactINR(actualVal - h1TargetVal)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Table Section */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <div className="bg-amber-400 px-4 py-3 text-center border-b border-amber-500/20">
            <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wide">
              Business Wise Achievement
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-amber-300/80 border-b border-amber-400/60 text-slate-900 font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3.5 border-r border-amber-400/40">Dept</th>
                  <th className="py-3 px-3 text-right border-r border-amber-400/40">Annual Target</th>
                  <th className="py-3 px-3 text-right border-r border-amber-400/40">H1 Target</th>
                  <th className="py-3 px-3 text-right border-r border-amber-400/40">Actual</th>
                  <th className="py-3 px-3.5 text-right">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((biz, idx) => {
                  const isTotal = biz.business.toLowerCase().trim() === "total";
                  const colors = getBusinessColor(biz.business);
                  return (
                    <tr
                      key={biz.business + idx}
                      className={
                        isTotal
                          ? "bg-amber-300 font-black text-slate-950 border-t-2 border-amber-400"
                          : "hover:bg-slate-50 transition-colors text-slate-700"
                      }
                    >
                      <td className={`py-3 px-3.5 border-r border-slate-100 ${isTotal ? "font-black" : "font-bold text-slate-900"}`}>
                        <div className="flex items-center gap-2">
                          {!isTotal && (
                            <span
                              className="w-2.5 h-2.5 rounded-xs shrink-0 shadow-2xs"
                              style={{ backgroundColor: colors.actual }}
                            />
                          )}
                          <span>{biz.business}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right border-r border-slate-100 font-medium text-slate-700">
                        {formatExactINR(biz.annualTarget)}
                      </td>
                      <td className="py-3 px-3 text-right border-r border-slate-100 font-medium text-slate-700">
                        {formatExactINR(biz.h1Target)}
                      </td>
                      <td className={`py-3 px-3 text-right border-r border-slate-100 ${isTotal ? "font-black" : "font-bold text-slate-900"}`}>
                        {formatExactINR(biz.actual)}
                      </td>
                      <td className={`py-3 px-3.5 text-right ${isTotal ? "font-black" : "font-semibold"} ${
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
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                H1 Target vs Actual Comparison
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Business-wise H1 target performance with department color coding
              </p>
            </div>

            {/* Indicator of Bar styles */}
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 self-start sm:self-auto bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-300 border border-slate-400/50 inline-block" />
                <span>H1 Target</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-800 inline-block" />
                <span>Actual</span>
              </span>
            </div>
          </div>

          {/* Business Unit Color Chips Legend */}
          <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            {chartData.map((item) => {
              const colors = getBusinessColor(item.business);
              return (
                <div
                  key={item.business}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50/80 px-2 py-0.5 rounded-md border border-slate-100"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: colors.actual }}
                  />
                  <span>{item.business}</span>
                </div>
              );
            })}
          </div>

          <div className="w-full h-64 mt-1">
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
                {/* H1 Target Bar with Business-specific soft shade */}
                <Bar
                  name="H1 Target"
                  dataKey="h1Target"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                >
                  {chartData.map((entry, index) => {
                    const colors = getBusinessColor(entry.business);
                    return (
                      <Cell
                        key={`cell-h1-${index}`}
                        fill={colors.target}
                        stroke={colors.actual}
                        strokeWidth={1}
                      />
                    );
                  })}
                </Bar>
                {/* Actual Bar with Business-specific solid color */}
                <Bar
                  name="Actual"
                  dataKey="actual"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                >
                  {chartData.map((entry, index) => {
                    const colors = getBusinessColor(entry.business);
                    return (
                      <Cell
                        key={`cell-actual-${index}`}
                        fill={colors.actual}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


