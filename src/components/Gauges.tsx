import React from "react";
import { formatINRShort } from "../utils";
import { TrendingUp, Award, ClipboardCheck } from "lucide-react";

interface GaugeProps {
  title: string;
  actual: number;
  target: number;
  achievementPercentage: number;
  onViewMore?: () => void;
  viewMoreLabel?: string;
  isPO?: boolean;
}

export default function Gauge({
  title,
  actual,
  target,
  achievementPercentage,
  onViewMore,
  viewMoreLabel = "View More",
  isPO = false,
}: GaugeProps) {
  // Cap visual percentage for the needle rotation at 115% to prevent complete flipping, but display actual value
  const visualPct = Math.min(Math.max(achievementPercentage, 0), 115);
  
  // Determine color category
  let colorClass = "text-red-600";
  let bgGradient = "from-red-500 to-red-600";
  let badgeColor = "bg-red-50 text-red-700 border-red-100";
  let ratingText = "Needs Focus";

  if (achievementPercentage > 90) {
    colorClass = "text-emerald-600";
    bgGradient = "from-emerald-500 to-emerald-600";
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
    ratingText = "Excellent";
  } else if (achievementPercentage > 50) {
    colorClass = "text-amber-500";
    bgGradient = "from-amber-400 to-amber-500";
    badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
    ratingText = "On Track";
  }

  const isExceeded = achievementPercentage > 100;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between h-full relative overflow-hidden">
      {/* Exceeded Target Banner */}
      {isExceeded && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 py-0.5 px-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Award className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Exceeded</span>
        </div>
      )}

      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 self-start flex items-center gap-1.5">
        {isPO ? <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" /> : <TrendingUp className="w-3.5 h-3.5 text-slate-400" />}
        {title}
      </h3>

      {/* SVG Semi-Circular Speedometer Gauge */}
      <div className="relative w-40 h-20 mt-2 mb-2">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          {/* Background Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Actual Progress Overlay Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={achievementPercentage > 90 ? "#10B981" : achievementPercentage > 50 ? "#F59E0B" : "#EF4444"}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * Math.min(achievementPercentage, 100)) / 100}
          />

          {/* Clean progress track ring layout */}
        </svg>

        {/* Floating Digital Readout inside the arc */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-xl font-bold text-slate-800 leading-none">
            {achievementPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Target vs Actual Grid */}
      <div className="w-full flex justify-between items-end mt-2">
        <div className="text-left">
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Actual</span>
          <span className="text-sm font-bold text-slate-800 block">
            {formatINRShort(actual)}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Target</span>
          <span className="text-xs font-semibold text-slate-500 block">
            {formatINRShort(target)}
          </span>
        </div>
      </div>

      {/* View More Button for PO */}
      {onViewMore && (
        <button
          id="btn-view-more-po"
          onClick={onViewMore}
          className="mt-3 w-full py-1.5 px-3 border border-slate-200 text-blue-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer uppercase tracking-wider"
        >
          {viewMoreLabel}
        </button>
      )}
    </div>
  );
}
