import React, { useState, useMemo } from "react";
import { PO } from "../types";
import { formatExactINR } from "../utils";
import { getBusinessColor } from "./BusinessAchievement";
import { X, Search, FileText, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PODetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pos: PO[];
  selectedMonth: string;
}

export default function PODetailModal({ isOpen, onClose, pos, selectedMonth }: PODetailModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group and aggregate POs by business category
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { category: string; pendingRevenue: number; monthly: number; count: number }> = {};

    (pos || []).forEach((po) => {
      const rawCat = String(po.category || po.business || "Other").trim();
      let cat = rawCat || "Other";
      const norm = cat.toLowerCase();

      if (norm.includes("ai") || norm.includes("robotics")) cat = "AI";
      else if (norm.includes("digital") || norm.includes("marketing")) cat = "Digital";
      else if (norm.includes("web") || norm.includes("site")) cat = "Website";
      else if (norm.includes("book")) cat = "Books";
      else if (norm.includes("workshop")) cat = "Workshops";

      if (!map[cat]) {
        map[cat] = { category: cat, pendingRevenue: 0, monthly: 0, count: 0 };
      }
      const pending = po.pendingRevenue || po.poValue || (po.monthly * po.noOfMonths) || 0;
      map[cat].pendingRevenue += pending;
      map[cat].monthly += (po.monthly || 0);
      map[cat].count += 1;
    });

    const total = Object.values(map).reduce((sum, item) => sum + item.pendingRevenue, 0);

    return Object.values(map)
      .map((item) => ({
        ...item,
        percentage: total > 0 ? (item.pendingRevenue / total) * 100 : 0,
      }))
      .sort((a, b) => b.pendingRevenue - a.pendingRevenue);
  }, [pos]);

  const totalAllPending = useMemo(() => {
    return categoryBreakdown.reduce((sum, item) => sum + item.pendingRevenue, 0);
  }, [categoryBreakdown]);

  // Filter POs by search query and category filter
  const filteredPOs = useMemo(() => {
    return (pos || []).filter((po) => {
      const clientName = String(po.client || po.customer || "");
      const categoryName = String(po.category || po.business || "");
      
      const matchesSearch =
        clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory) {
        const norm = categoryName.toLowerCase();
        if (selectedCategory === "AI") {
          return norm.includes("ai") || norm.includes("robotics");
        }
        if (selectedCategory === "Digital") {
          return norm.includes("digital") || norm.includes("marketing");
        }
        if (selectedCategory === "Website") {
          return norm.includes("web") || norm.includes("site");
        }
        if (selectedCategory === "Books") {
          return norm.includes("book");
        }
        if (selectedCategory === "Workshops") {
          return norm.includes("workshop");
        }
        return categoryName.toLowerCase() === selectedCategory.toLowerCase();
      }

      return true;
    });
  }, [pos, searchQuery, selectedCategory]);

  const totalFilteredPendingRevenue = useMemo(() => {
    return filteredPOs.reduce(
      (sum, po) => sum + (po.pendingRevenue || po.poValue || (po.monthly * po.noOfMonths) || 0),
      0
    );
  }, [filteredPOs]);

  if (!isOpen) return null;

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const colors = getBusinessColor(data.category);
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[180px]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${colors.dotClass}`} />
            <p className="font-black text-slate-100">{data.category}</p>
          </div>
          <div className="space-y-1">
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Pending:</span>
              <span className="font-bold text-amber-400">{formatExactINR(data.pendingRevenue)}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Share:</span>
              <span className="font-bold text-emerald-400">{data.percentage.toFixed(1)}%</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Contracts:</span>
              <span className="font-bold text-slate-200">{data.count} POs</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header Bar */}
        <div className="bg-amber-400 border-b border-amber-500/30 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wide">
                PO's in Hand
              </h2>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                Contract commitments and business-wise distribution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-800 hover:text-slate-950 p-2 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body: Two Columns (Left = PO Table, Right = Pie Chart & Category Filter) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Left Column: PO Table & Search */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full overflow-hidden bg-white">
            {/* Search & Pending Revenue Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white shrink-0">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search client or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-800 placeholder-slate-400 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100/70 border border-amber-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Filter ({selectedCategory}) ✕
                  </button>
                )}
                <div className="bg-amber-50 border border-amber-200 py-1.5 px-3.5 rounded-xl shadow-2xs text-right">
                  <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    {selectedCategory ? `${selectedCategory} Pending` : "Total Pending"}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-950">
                    {formatExactINR(totalFilteredPendingRevenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable PO Table */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 min-h-0">
              {filteredPOs.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">No matching POs found</h3>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search query or category filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-amber-300 border-b border-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                        <th className="py-3 px-3.5 border-r border-amber-400/50">Client</th>
                        <th className="py-3 px-3 border-r border-amber-400/50">Category</th>
                        <th className="py-3 px-3 text-right border-r border-amber-400/50">Monthly</th>
                        <th className="py-3 px-3 text-center border-r border-amber-400/50">Months</th>
                        <th className="py-3 px-3.5 text-right">Pending Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredPOs.map((po, idx) => {
                        const client = po.client || po.customer || "Unknown";
                        const category = po.category || po.business || "General";
                        const monthly = po.monthly || 0;
                        const noOfMonths = po.noOfMonths || 0;
                        const pendingRev = po.pendingRevenue || po.poValue || (monthly * noOfMonths);
                        const colors = getBusinessColor(category);

                        return (
                          <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-2.5 px-3.5 font-bold text-slate-900 border-r border-slate-100">
                              {client}
                            </td>
                            <td className="py-2.5 px-3 border-r border-slate-100">
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs"
                                style={{
                                  backgroundColor: `${colors.actual}15`,
                                  borderColor: `${colors.actual}35`,
                                  color: colors.actual,
                                }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: colors.actual }}
                                />
                                {category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-medium text-slate-700 border-r border-slate-100">
                              {formatExactINR(monthly)}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800 border-r border-slate-100">
                              {noOfMonths}
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-black text-slate-950">
                              {formatExactINR(pendingRev)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="sticky bottom-0 z-10">
                      <tr className="bg-amber-300 font-black text-slate-950 border-t-2 border-amber-400 text-xs sm:text-sm">
                        <td className="py-3 px-3.5 border-r border-amber-400/50" colSpan={2}>
                          Total {selectedCategory ? `(${selectedCategory})` : `(${filteredPOs.length} Contracts)`}
                        </td>
                        <td className="py-3 px-3 text-right border-r border-amber-400/50">
                          {formatExactINR(filteredPOs.reduce((s, p) => s + (p.monthly || 0), 0))}
                        </td>
                        <td className="py-3 px-3 text-center border-r border-amber-400/50">
                          -
                        </td>
                        <td className="py-3 px-3.5 text-right font-black">
                          {formatExactINR(totalFilteredPendingRevenue)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Business-wise Pie Chart & Category Filter Cards */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full bg-slate-50/80 p-4 sm:p-5 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-200/80 space-y-4">
            {/* Donut Chart Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Business Distribution
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">By Pending Revenue</span>
              </div>

              <div className="w-full h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="pendingRevenue"
                      nameKey="category"
                      strokeWidth={2}
                      stroke="#ffffff"
                      onClick={(entry: any) => {
                        const clickedCat = entry?.category || entry?.payload?.category || entry?.name;
                        if (clickedCat) {
                          setSelectedCategory(selectedCategory === clickedCat ? null : clickedCat);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {categoryBreakdown.map((entry) => {
                        const colors = getBusinessColor(entry.category);
                        return (
                          <Cell
                            key={`cell-${entry.category}`}
                            fill={colors.actual}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Summary Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total PO</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                    {formatExactINR(totalAllPending)}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Breakdown & Click-to-Filter Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category Filter
                </span>
                <span className="text-[10px] font-medium text-slate-400">Click to filter table</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {categoryBreakdown.map((cat) => {
                  const colors = getBusinessColor(cat.category);
                  const isSelected = selectedCategory === cat.category;
                  return (
                    <button
                      key={cat.category}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.category)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer w-full ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400"
                          : "bg-white hover:bg-slate-100/80 border-slate-200/80 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: colors.actual }}
                          />
                          <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                            {cat.category}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold ${isSelected ? "text-amber-300" : "text-slate-400"}`}>
                          {cat.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className={`text-xs sm:text-sm font-extrabold ${isSelected ? "text-amber-400" : "text-slate-900"}`}>
                          {formatExactINR(cat.pendingRevenue)}
                        </span>
                        <span className={`text-[10px] font-medium ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                          {cat.count} {cat.count === 1 ? "PO" : "POs"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center shrink-0">
          <span className="text-[11px] font-medium text-slate-500">
            Source: Google Sheets Dashboard
          </span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

