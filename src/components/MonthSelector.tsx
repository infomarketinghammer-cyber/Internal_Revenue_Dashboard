import React from "react";
import { FINANCIAL_MONTHS } from "../dataTransformer";
import { Calendar, RotateCcw } from "lucide-react";

interface MonthSelectorProps {
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
}

export default function MonthSelector({ selectedMonth, onChangeMonth }: MonthSelectorProps) {
  const currentCalendarMonth = new Date().toLocaleString("default", { month: "long" });

  const currentMonthInfo = FINANCIAL_MONTHS.find(
    (m) => m.name.toLowerCase() === selectedMonth.toLowerCase()
  ) || FINANCIAL_MONTHS[0];

  const monthIndexString = String(currentMonthInfo.index).padStart(2, "0");
  const isCurrentActive = selectedMonth.toLowerCase() === currentCalendarMonth.toLowerCase();

  return (
    <div className="flex items-center justify-between gap-4 sm:gap-6 bg-white border border-slate-200 rounded-2xl px-4 sm:px-5 py-3 shadow-2xs shrink-0">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Months from April</div>
          <div className="text-base font-mono font-black text-amber-500 leading-none mt-0.5">{monthIndexString}</div>
        </div>
        
        <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />

        {/* Month Selector dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-black pr-9 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer text-slate-800 uppercase tracking-wider transition-colors shadow-2xs"
            >
              {FINANCIAL_MONTHS.map((m) => {
                const isRealCurrent = m.name.toLowerCase() === currentCalendarMonth.toLowerCase();
                return (
                  <option key={m.name} value={m.name}>
                    {m.name} {isRealCurrent ? "(Current)" : ""}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sync status indicator badge / reset button */}
          {isCurrentActive ? (
            <span className="hidden md:inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto Synced
            </span>
          ) : (
            <button
              onClick={() => onChangeMonth(currentCalendarMonth)}
              title="Reset to current calendar month"
              className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Sync Today</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-right">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Financial Year</span>
        <span className="text-xs font-black text-slate-800 uppercase mt-0.5 block">FY 2026-27</span>
      </div>
    </div>
  );
}

