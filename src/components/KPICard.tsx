import React from "react";
import { formatINRShort } from "../utils";

interface KPICardProps {
  title: string;
  value: number;
  subtext?: string;
  type?: "average" | "expense" | "profit";
  percentage?: number;
}

export default function KPICard({ title, value, type = "average" }: KPICardProps) {
  const isNegative = value < 0;

  // Visual formatting based on the type
  let valueClass = "text-slate-800";
  if (type === "profit") {
    valueClass = isNegative ? "text-rose-600" : "text-emerald-600";
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex flex-col justify-center relative overflow-hidden transition-all hover:border-slate-300">
      <div className="text-[11px] font-bold uppercase text-slate-400 mb-1 tracking-wider">
        {title}
      </div>
      <div className={`text-xl sm:text-2xl font-bold tracking-tight ${valueClass}`}>
        {formatINRShort(value)}
      </div>
    </div>
  );
}

