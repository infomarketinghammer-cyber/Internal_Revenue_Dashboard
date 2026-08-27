import React, { useState } from "react";
import { PO } from "../types";
import { formatExactINR } from "../utils";
import { X, Search, FileText } from "lucide-react";

interface PODetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pos: PO[];
  selectedMonth: string;
}

export default function PODetailModal({ isOpen, onClose, pos, selectedMonth }: PODetailModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter POs by search query (Client or Category)
  const filteredPOs = (pos || []).filter((po) => {
    const clientName = String(po.client || po.customer || "");
    const categoryName = String(po.category || po.business || "");
    const matchesSearch =
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPendingRevenue = filteredPOs.reduce(
    (sum, po) => sum + (po.pendingRevenue || po.poValue || (po.monthly * po.noOfMonths) || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header Bar */}
        <div className="bg-amber-400 border-b border-amber-500/30 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-wide">
                PO's in Hand
              </h2>
              <p className="text-[11px] font-semibold text-slate-800 mt-0.5">
                Live contract commitments fetched from Google Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-800 hover:text-slate-950 p-1.5 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Summary Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/50">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* KPI summaries */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm text-right">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Records</span>
              <span className="text-xs font-black text-slate-900">{filteredPOs.length} Contracts</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 py-1.5 px-3 rounded-lg shadow-sm text-right">
              <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Revenue</span>
              <span className="text-xs font-black text-amber-900">{formatExactINR(totalPendingRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredPOs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">No matching POs found</h3>
              <p className="text-[11px] text-slate-400 mt-1">Try clearing your search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-300/80 border-b border-amber-400/60 text-slate-900 font-black text-[11px]">
                    <th className="py-2.5 px-3.5 border-r border-amber-400/40">Client</th>
                    <th className="py-2.5 px-3 border-r border-amber-400/40">Category</th>
                    <th className="py-2.5 px-3 text-right border-r border-amber-400/40">Monthly</th>
                    <th className="py-2.5 px-3 text-center border-r border-amber-400/40">No. of Months</th>
                    <th className="py-2.5 px-3.5 text-right">Pending Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPOs.map((po, idx) => {
                    const client = po.client || po.customer || "";
                    const category = po.category || po.business || "";
                    const monthly = po.monthly || 0;
                    const noOfMonths = po.noOfMonths || 0;
                    const pendingRev = po.pendingRevenue || po.poValue || (monthly * noOfMonths);

                    return (
                      <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-2.5 px-3.5 font-bold text-slate-900 border-r border-slate-100">
                          {client}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
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
                <tfoot>
                  <tr className="bg-amber-300 font-black text-slate-950 border-t-2 border-amber-400">
                    <td className="py-2.5 px-3.5 border-r border-amber-400/50" colSpan={2}>
                      Total ({filteredPOs.length} Contracts)
                    </td>
                    <td className="py-2.5 px-3 text-right border-r border-amber-400/50">
                      {formatExactINR(filteredPOs.reduce((s, p) => s + (p.monthly || 0), 0))}
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-amber-400/50">
                      -
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      {formatExactINR(totalPendingRevenue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center">
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
