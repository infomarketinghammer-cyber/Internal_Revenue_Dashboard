import React from "react";
import { SYNC_AI_LOGO_BASE64 } from "@/image/sync ai.js";
import { A_CONSULTANCY_LOGO_BASE64 } from "@/image/a consultancy.js";
import { MARKETING_HAMMER_LOGO_BASE64 } from "@/image/marketing hammer.js";
import { APT_LEARNING_LOGO_BASE64 } from "@/image/apt learning.js";

// Helper to ensure clean base64 data-uri formatting
const getLogoSrc = (rawString: string) => {
  if (!rawString) return "";
  return rawString.startsWith("data:") ? rawString : `data:image/png;base64,${rawString}`;
};

export default function CompanyLogoBar() {
  return (
    <div
      id="company-logo-bar"
      className="bg-white border border-slate-200/80 rounded-2xl py-3.5 px-4 sm:px-6 shadow-sm w-full transition-all overflow-hidden"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 md:gap-8 items-center justify-items-center w-full">
        {/* 1. SYNC AI */}
        <div
          id="logo-sync-ai"
          className="flex items-center justify-center w-full h-14 px-2 group cursor-pointer"
          title="Sync AI"
        >
          <img
            src={getLogoSrc(SYNC_AI_LOGO_BASE64)}
            alt="Sync AI Logo"
            className="max-h-11 sm:max-h-12 md:max-h-[54px] w-auto max-w-[156px] sm:max-w-[180px] md:max-w-[204px] object-contain transition-transform duration-200 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 2. A CONSULTANCY (Position 2 as requested - scaled to match Sync AI) */}
        <div
          id="logo-a-consultancy"
          className="flex items-center justify-center w-full h-14 px-2 group cursor-pointer"
          title="A Consultancy"
        >
          <img
            src={getLogoSrc(A_CONSULTANCY_LOGO_BASE64)}
            alt="A Consultancy Logo"
            className="max-h-13 sm:max-h-14 md:max-h-[64px] w-auto max-w-[170px] sm:max-w-[195px] md:max-w-[220px] object-contain scale-[1.3] sm:scale-[1.35] md:scale-[1.4] transition-transform duration-200 group-hover:scale-[1.45]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 3. MARKETING HAMMER (Scaled to match Sync AI) */}
        <div
          id="logo-marketing-hammer"
          className="flex items-center justify-center w-full h-14 px-2 group cursor-pointer"
          title="Marketing Hammer"
        >
          <img
            src={getLogoSrc(MARKETING_HAMMER_LOGO_BASE64)}
            alt="Marketing Hammer Logo"
            className="max-h-13 sm:max-h-14 md:max-h-[64px] w-auto max-w-[170px] sm:max-w-[195px] md:max-w-[220px] object-contain scale-[1.25] sm:scale-[1.3] md:scale-[1.35] transition-transform duration-200 group-hover:scale-[1.4]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 4. APT LEARNING (Last position as requested) */}
        <div
          id="logo-apt-learning"
          className="flex items-center justify-center w-full h-14 px-2 group cursor-pointer"
          title="Apt Learning"
        >
          <img
            src={getLogoSrc(APT_LEARNING_LOGO_BASE64)}
            alt="Apt Learning Logo"
            className="max-h-11 sm:max-h-12 md:max-h-[54px] w-auto max-w-[156px] sm:max-w-[180px] md:max-w-[204px] object-contain transition-transform duration-200 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
