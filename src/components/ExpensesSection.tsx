import React from "react";
import { ExpenseCategory } from "../types";
import { formatExactINR } from "../utils";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ShieldAlert } from "lucide-react";

interface ExpensesSectionProps {
  data?: ExpenseCategory[];
}

// Tailored palette for the three categories
const CATEGORY_COLORS: { [key: string]: string } = {
  salaries: "#3B82F6", // Vibrant Blue
  stipend: "#10B981",  // Emerald Green
  vendors: "#F59E0B",  // Warm Amber
};

const DEFAULT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

function getCategoryColor(category: string, index: number): string {
  const normalized = category.toLowerCase().trim();
  if (CATEGORY_COLORS[normalized]) {
    return CATEGORY_COLORS[normalized];
  }
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

export default function ExpensesSection({ data }: ExpensesSectionProps) {
  // Ensure default dummy data if none provided or empty
  const defaultExpenseData: ExpenseCategory[] = [
    { category: "Salaries", amount: 3072000, percentage: 60.0 },
    { category: "Stipend", amount: 512000, percentage: 10.0 },
    { category: "Vendors", amount: 1536000, percentage: 30.0 },
  ];

  const expenseItems = data && data.length > 0 ? data : defaultExpenseData;
  const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs">
          <p className="font-extrabold mb-1.5 text-slate-200">{item.category}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-6">
              <span className="text-slate-400 font-medium">Amount:</span>
              <span className="font-bold text-amber-400">{formatExactINR(item.amount)}</span>
            </p>
            <p className="flex justify-between gap-6">
              <span className="text-slate-400 font-medium">Share:</span>
              <span className="font-black text-emerald-400">{item.percentage.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="expense-table-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Table Section */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <div className="bg-amber-400 px-4 py-3 text-center border-b border-amber-500/20">
            <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wide">
              Expense Table
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-amber-300/80 border-b border-amber-400/60 text-slate-900 font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 border-r border-amber-400/40">Category</th>
                  <th className="py-3 px-4 text-right border-r border-amber-400/40">Amount</th>
                  <th className="py-3 px-4 text-right border-r border-amber-400/40">Share (%)</th>
                  <th className="py-3 px-4 text-center">Visual Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {expenseItems.map((item, idx) => {
                  const color = getCategoryColor(item.category, idx);
                  return (
                    <tr key={item.category} className="hover:bg-slate-50 transition-colors text-slate-700">
                      <td className="py-3.5 px-4 border-r border-slate-100 flex items-center gap-2.5 font-bold text-slate-900">
                        <span
                          className="w-3 h-3 rounded-xs inline-block shrink-0 shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                        <span>{item.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 border-r border-slate-100">
                        {formatExactINR(item.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-800 border-r border-slate-100">
                        {item.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(item.percentage, 100)}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-amber-300 font-black text-slate-950 border-t-2 border-amber-400">
                  <td className="py-3.5 px-4 border-r border-amber-400/50">
                    Total Expenses
                  </td>
                  <td className="py-3.5 px-4 text-right border-r border-amber-400/50">
                    {formatExactINR(totalExpenses)}
                  </td>
                  <td className="py-3.5 px-4 text-right border-r border-amber-400/50">
                    100.0%
                  </td>
                  <td className="py-3.5 px-4 text-center text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    Full Allocation
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Donut Chart Breakdown Section */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Expense Distribution Breakdown
            </h3>
          </div>
          <div className="w-full h-60 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseItems}
                  cx="50%"
                  cy="46%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="category"
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {expenseItems.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getCategoryColor(entry.category, index)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={32}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs font-bold text-slate-700 mx-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Expense</span>
              <span className="text-sm font-black text-slate-900 mt-0.5">{formatExactINR(totalExpenses)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
