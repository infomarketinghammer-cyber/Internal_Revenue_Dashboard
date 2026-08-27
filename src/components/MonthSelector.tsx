import React from "react";
import { FINANCIAL_MONTHS } from "../dataTransformer";

interface MonthSelectorProps {
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
}

export default function MonthSelector({ selectedMonth, onChangeMonth }: MonthSelectorProps) {
  const currentMonthInfo = FINANCIAL_MONTHS.find(
    (m) => m.name.toLowerCase() === selectedMonth.toLowerCase()
  ) || FINANCIAL_MONTHS[0];

  const monthIndexString = String(currentMonthInfo.index).padStart(2, "0");

  return (
    <div className="flex items-center justify-between gap-6 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm shrink-0">
      <div className="flex items-center space-x-4">
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">No. of Months from April</div>
          <div className="text-base font-mono font-bold text-blue-600 leading-none mt-1">{monthIndexString}</div>
        </div>
        
        <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />

        <div className="relative">
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => onChangeMonth(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-1.5 text-xs font-bold pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-slate-700 uppercase tracking-wider"
          >
            {FINANCIAL_MONTHS.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-right">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Financial Year</span>
        <span className="text-xs font-bold text-slate-800 uppercase mt-0.5 block">FY 2026-27</span>
      </div>
    </div>
  );
}
