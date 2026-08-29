import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { initAuth, googleSignIn, logout, getAccessToken } from "./firebase";
import { parseRawSpreadsheet, processDashboardData, FINANCIAL_MONTHS } from "./dataTransformer";
import { DashboardState, MonthData, PO, BusinessAchievement, ExpenseCategory } from "./types";
import { formatINR, formatINRShort } from "./utils";
import CompanyLogoBar from "./components/CompanyLogoBar";
import MonthSelector from "./components/MonthSelector";
import Gauge from "./components/Gauges";
import KPICard from "./components/KPICard";
import BusinessAchievementSection from "./components/BusinessAchievement";
import ExpensesSection from "./components/ExpensesSection";
import PODetailModal from "./components/PODetailModal";
import { RefreshCw, Database, LogIn, LogOut, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Actual PO data extracted directly from Google Sheet
const FALLBACK_POS: PO[] = [
  { client: "YBF", category: "Digital", monthly: 25000, noOfMonths: 4, pendingRevenue: 100000, customer: "YBF", business: "Digital", poValue: 100000 },
  { client: "Rightpath", category: "Digital", monthly: 26000, noOfMonths: 7, pendingRevenue: 182000, customer: "Rightpath", business: "Digital", poValue: 182000 },
  { client: "Indmark", category: "Digital", monthly: 25000, noOfMonths: 7, pendingRevenue: 175000, customer: "Indmark", business: "Digital", poValue: 175000 },
  { client: "Indmark", category: "AI", monthly: 25000, noOfMonths: 7, pendingRevenue: 175000, customer: "Indmark", business: "AI", poValue: 175000 },
  { client: "Mantri Constructions", category: "AI", monthly: 75000, noOfMonths: 4, pendingRevenue: 300000, customer: "Mantri Constructions", business: "AI", poValue: 300000 },
  { client: "Aakar Builders", category: "AI", monthly: 70000, noOfMonths: 5, pendingRevenue: 350000, customer: "Aakar Builders", business: "AI", poValue: 350000 },
  { client: "Darode", category: "AI", monthly: 100000, noOfMonths: 7, pendingRevenue: 700000, customer: "Darode", business: "AI", poValue: 700000 },
  { client: "Lahoti", category: "AI", monthly: 100000, noOfMonths: 7, pendingRevenue: 700000, customer: "Lahoti", business: "AI", poValue: 700000 },
  { client: "GPMT", category: "AI", monthly: 50000, noOfMonths: 7, pendingRevenue: 350000, customer: "GPMT", business: "AI", poValue: 350000 },
  { client: "Wilo", category: "Website", monthly: 55000, noOfMonths: 4, pendingRevenue: 220000, customer: "Wilo", business: "Website", poValue: 220000 },
  { client: "MIS B", category: "Digital", monthly: 130000, noOfMonths: 7, pendingRevenue: 910000, customer: "MIS B", business: "Digital", poValue: 910000 },
  { client: "MIS H", category: "Digital", monthly: 180000, noOfMonths: 7, pendingRevenue: 1260000, customer: "MIS H", business: "Digital", poValue: 1260000 },
  { client: "Brain Voyage", category: "Website", monthly: 65000, noOfMonths: 1, pendingRevenue: 65000, customer: "Brain Voyage", business: "Website", poValue: 65000 },
  { client: "MIS B", category: "Website", monthly: 80000, noOfMonths: 1, pendingRevenue: 80000, customer: "MIS B", business: "Website", poValue: 80000 },
  { client: "MIS B (One Time)", category: "Digital", monthly: 495000, noOfMonths: 1, pendingRevenue: 495000, customer: "MIS B (One Time)", business: "Digital", poValue: 495000 },
  { client: "MIS H (One Time)", category: "Digital", monthly: 565000, noOfMonths: 1, pendingRevenue: 565000, customer: "MIS H (One Time)", business: "Digital", poValue: 565000 },
  { client: "United Genetics", category: "Digital", monthly: 27500, noOfMonths: 7, pendingRevenue: 192500, customer: "United Genetics", business: "Digital", poValue: 192500 },
  { client: "Sports Katta", category: "Digital", monthly: 20000, noOfMonths: 7, pendingRevenue: 140000, customer: "Sports Katta", business: "Digital", poValue: 140000 },
  { client: "Camtech", category: "Digital", monthly: 15000, noOfMonths: 3, pendingRevenue: 45000, customer: "Camtech", business: "Digital", poValue: 45000 },
  { client: "YBF Book", category: "Books", monthly: 50000, noOfMonths: 1, pendingRevenue: 50000, customer: "YBF Book", business: "Books", poValue: 50000 },
  { client: "KPC", category: "Digital", monthly: 70000, noOfMonths: 3, pendingRevenue: 210000, customer: "KPC", business: "Digital", poValue: 210000 },
  { client: "Saquire", category: "Digital", monthly: 14000, noOfMonths: 3, pendingRevenue: 42000, customer: "Saquire", business: "Digital", poValue: 42000 },
  { client: "Saquire", category: "Website", monthly: 3000, noOfMonths: 1, pendingRevenue: 3000, customer: "Saquire", business: "Website", poValue: 3000 },
  { client: "Sapphire", category: "Digital", monthly: 10000, noOfMonths: 3, pendingRevenue: 30000, customer: "Sapphire", business: "Digital", poValue: 30000 },
  { client: "Regatta", category: "Digital", monthly: 9500, noOfMonths: 7, pendingRevenue: 66500, customer: "Regatta", business: "Digital", poValue: 66500 },
  { client: "Neuflex", category: "AI", monthly: 90000, noOfMonths: 2, pendingRevenue: 180000, customer: "Neuflex", business: "AI", poValue: 180000 },
  { client: "Kantheshwaram", category: "Digital", monthly: 15000, noOfMonths: 3, pendingRevenue: 45000, customer: "Kantheshwaram", business: "Digital", poValue: 45000 },
  { client: "CEMS", category: "AI", monthly: 35000, noOfMonths: 7, pendingRevenue: 245000, customer: "CEMS", business: "AI", poValue: 245000 },
  { client: "Vinsys", category: "AI", monthly: 65000, noOfMonths: 2, pendingRevenue: 130000, customer: "Vinsys", business: "AI", poValue: 130000 },
  { client: "Money Matters", category: "Digital", monthly: 15000, noOfMonths: 2, pendingRevenue: 30000, customer: "Money Matters", business: "Digital", poValue: 30000 },
  { client: "Vighnahartha Hospital", category: "Website", monthly: 45000, noOfMonths: 1, pendingRevenue: 45000, customer: "Vighnahartha Hospital", business: "Website", poValue: 45000 },
  { client: "Nyati (Legal)", category: "AI", monthly: 200000, noOfMonths: 1, pendingRevenue: 200000, customer: "Nyati (Legal)", business: "AI", poValue: 200000 },
  { client: "EFL", category: "AI", monthly: 135000, noOfMonths: 1, pendingRevenue: 135000, customer: "EFL", business: "AI", poValue: 135000 },
  { client: "Nyati (Other 5 depts)", category: "AI", monthly: 875000, noOfMonths: 1, pendingRevenue: 875000, customer: "Nyati (Other 5 depts)", business: "AI", poValue: 875000 },
  { client: "Wilo (AI Videos)", category: "AI", monthly: 650000, noOfMonths: 1, pendingRevenue: 650000, customer: "Wilo (AI Videos)", business: "AI", poValue: 650000 },
];

const FALLBACK_MONTHS: { [key: string]: Partial<MonthData> } = {
  April: {
    revenueTarget: 9500000,
    revenueActual: 7200000,
    poTarget: 8000000,
    poActual: 7100000,
    expenses: 4200000,
    profit: 3000000,
    businessAchievement: [
      { business: "AI & Robotics", annualTarget: 10000000, h1Target: 5000000, actual: 3184420, pending: -1815580, target: 10000000, achievementPercentage: 31.8, variance: -1815580 },
      { business: "Digital Marketing", annualTarget: 10000000, h1Target: 4500000, actual: 3153520, pending: -1346480, target: 10000000, achievementPercentage: 31.5, variance: -1346480 },
      { business: "Web Development", annualTarget: 3000000, h1Target: 1500000, actual: 1484800, pending: -15200, target: 3000000, achievementPercentage: 49.5, variance: -15200 },
      { business: "Workshops", annualTarget: 5000000, h1Target: 2000000, actual: 1317080, pending: -682920, target: 5000000, achievementPercentage: 26.3, variance: -682920 },
      { business: "Books", annualTarget: 250000, h1Target: 100000, actual: 155650, pending: 55650, target: 250000, achievementPercentage: 62.3, variance: 55650 },
      { business: "Total", annualTarget: 28250000, h1Target: 13100000, actual: 9295470, pending: -3804530, target: 28250000, achievementPercentage: 32.9, variance: -3804530 },
    ],
    expensesBreakdown: [
      { category: "Salaries", amount: 2520000, percentage: 60.0 },
      { category: "Stipend", amount: 420000, percentage: 10.0 },
      { category: "Vendors", amount: 1260000, percentage: 30.0 },
    ],
  },
  August: {
    revenueTarget: 13100000,
    revenueActual: 9295470,
    poTarget: 10250000,
    poActual: 9941000,
    expenses: 5120000,
    profit: 4175470,
    businessAchievement: [
      { business: "AI & Robotics", annualTarget: 10000000, h1Target: 5000000, actual: 3184420, pending: -1815580, target: 10000000, achievementPercentage: 31.8, variance: -1815580 },
      { business: "Digital Marketing", annualTarget: 10000000, h1Target: 4500000, actual: 3153520, pending: -1346480, target: 10000000, achievementPercentage: 31.5, variance: -1346480 },
      { business: "Web Development", annualTarget: 3000000, h1Target: 1500000, actual: 1484800, pending: -15200, target: 3000000, achievementPercentage: 49.5, variance: -15200 },
      { business: "Workshops", annualTarget: 5000000, h1Target: 2000000, actual: 1317080, pending: -682920, target: 5000000, achievementPercentage: 26.3, variance: -682920 },
      { business: "Books", annualTarget: 250000, h1Target: 100000, actual: 155650, pending: 55650, target: 250000, achievementPercentage: 62.3, variance: 55650 },
      { business: "Total", annualTarget: 28250000, h1Target: 13100000, actual: 9295470, pending: -3804530, target: 28250000, achievementPercentage: 32.9, variance: -3804530 },
    ],
    expensesBreakdown: [
      { category: "Salaries", amount: 3072000, percentage: 60.0 },
      { category: "Stipend", amount: 512000, percentage: 10.0 },
      { category: "Vendors", amount: 1536000, percentage: 30.0 },
    ],
  },
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentIdx = new Date().getMonth();
    const name = months[currentIdx];
    const exists = FINANCIAL_MONTHS.some(m => m.name.toLowerCase() === name.toLowerCase());
    return exists ? name : "August";
  });
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active state derived from sheet or fallbacks
  const [isLive, setIsLive] = useState(false);
  const [rawSheetData, setRawSheetData] = useState<any>(null);
  const [pos, setPOs] = useState<PO[]>(FALLBACK_POS);

  useEffect(() => {
    // Initial Auth check in background
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setIsAuthLoading(false);
        fetchSpreadsheetData(currentToken);
      },
      () => {
        setIsAuthLoading(false);
      }
    );
    
    // Fetch live central Google Sheet data immediately on mount for all viewers
    fetchSpreadsheetData();

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        fetchSpreadsheetData(result.accessToken);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMsg(err.message || "Google OAuth was blocked. Please ensure your email is added as a 'Test User' in your Google Cloud Console project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setIsLive(false);
      setRawSheetData(null);
      setPOs(FALLBACK_POS);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpreadsheetData = async (accessToken?: string, attempt: number = 0) => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch("/api/sheets/all", { headers });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to load Google Sheet data (Status ${response.status})`);
      }

      const rawData = await response.json();
      setRawSheetData(rawData);
      setIsLive(true);
      setLastUpdated(new Date().toLocaleTimeString());

      const parsed = parseRawSpreadsheet(rawData);
      const fetchedPOs = parsePOsFromSheet(parsed);
      if (fetchedPOs.length > 0) {
        setPOs(fetchedPOs);
      }
    } catch (err: any) {
      console.warn("Silent background fetch update notice:", err?.message || err);
      // Silent exponential backoff retry in background without intrusive UI error banners
      if (attempt < 3) {
        const delay = Math.pow(2, attempt) * 2000;
        setTimeout(() => {
          fetchSpreadsheetData(accessToken, attempt + 1);
        }, delay);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSpreadsheetData(token || undefined);
  };

  // Parsing PO list from the live Sheet
  const parsePOsFromSheet = (parsed: any): PO[] => {
    const data = processDashboardData(parsed, selectedMonth);
    return data.pos || [];
  };

  // Compile active dashboard figures based on live sheets or offline demonstration data
  const getDashboardData = (): MonthData => {
    if (isLive && rawSheetData) {
      const parsed = parseRawSpreadsheet(rawSheetData);
      const baseData = processDashboardData(parsed, selectedMonth);

      // Apply entity level filtering if a specific logo in header is active
      if (selectedCompany) {
        const filteredBiz = baseData.businessAchievement.filter(
          (b) => b.business.toLowerCase() === selectedCompany.toLowerCase()
        );
        const filteredTarget = filteredBiz.reduce((sum, b) => sum + b.target, 0);
        const filteredActual = filteredBiz.reduce((sum, b) => sum + b.actual, 0);

        // Filter the PO list to only include clients from this business unit/category
        const filteredPOs = (baseData.pos || []).filter(
          (p) =>
            p.category.toLowerCase().includes(selectedCompany.toLowerCase()) ||
            (p.business && p.business.toLowerCase().includes(selectedCompany.toLowerCase()))
        );
        const filteredPOActual = filteredPOs.reduce(
          (sum, p) => sum + (p.pendingRevenue || p.poValue || 0),
          0
        );

        // Adjust metrics for selected company
        return {
          ...baseData,
          revenueTarget: filteredTarget,
          revenueActual: filteredActual,
          poActual: filteredPOActual,
          revenuePercentage: undefined,
          poPercentage: undefined,
          monthlyAverageRevenue: undefined,
          businessAchievement: filteredBiz,
          pos: filteredPOs,
        };
      }
      return baseData;
    }

    // Offline / fallback data structure
    const monthDetails = FALLBACK_MONTHS[selectedMonth] || FALLBACK_MONTHS["August"];
    const businessAchievements = (monthDetails.businessAchievement || []) as BusinessAchievement[];
    const expensesBreakdown = (monthDetails.expensesBreakdown || []) as ExpenseCategory[];

    // Calculate sum of business units if company filter is active offline
    let revenueTarget = monthDetails.revenueTarget || 0;
    let revenueActual = monthDetails.revenueActual || 0;
    let filteredBiz = businessAchievements;
    let filteredPOs = FALLBACK_POS;

    if (selectedCompany) {
      filteredBiz = businessAchievements.filter(
        (b) => b.business.toLowerCase() === selectedCompany.toLowerCase()
      );
      revenueTarget = filteredBiz.reduce((sum, b) => sum + b.target, 0);
      revenueActual = filteredBiz.reduce((sum, b) => sum + b.actual, 0);

      filteredPOs = FALLBACK_POS.filter(
        (p) =>
          p.category.toLowerCase().includes(selectedCompany.toLowerCase()) ||
          (p.business && p.business.toLowerCase().includes(selectedCompany.toLowerCase()))
      );
    }

    const filteredPOActual = filteredPOs.reduce(
      (sum, p) => sum + (p.pendingRevenue || p.poValue || 0),
      0
    );

    return {
      monthName: selectedMonth,
      monthIndex: FINANCIAL_MONTHS.find((m) => m.name === selectedMonth)?.index || 5,
      revenueTarget,
      revenueActual,
      poTarget: monthDetails.poTarget || 0,
      poActual: selectedCompany ? filteredPOActual : (monthDetails.poActual || 0),
      expenses: monthDetails.expenses || 0,
      profit: revenueActual - (monthDetails.expenses || 0),
      businessAchievement: filteredBiz,
      expensesBreakdown,
      pos: filteredPOs,
    };
  };

  const dashboardData = getDashboardData();

  // Compute calculated metrics
  const revAchievementPercent = dashboardData.revenuePercentage !== undefined 
    ? dashboardData.revenuePercentage 
    : (dashboardData.revenueTarget > 0 ? (dashboardData.revenueActual / dashboardData.revenueTarget) * 100 : 0);

  const poAchievementPercent = dashboardData.poPercentage !== undefined 
    ? dashboardData.poPercentage 
    : (dashboardData.poTarget > 0 ? (dashboardData.poActual / dashboardData.poTarget) * 100 : 0);

  const monthlyAverageRevenue = dashboardData.monthlyAverageRevenue !== undefined 
    ? dashboardData.monthlyAverageRevenue 
    : (dashboardData.revenueActual / (dashboardData.monthIndex || 5));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Corporate Entities Bar - Sized & padded to match dashboard elements */}
        <CompanyLogoBar />

        {/* Dashboard Title Header */}
        <div
          id="dashboard-title-card"
          className="bg-white border border-slate-200/80 rounded-2xl py-3.5 sm:py-4 px-4 sm:px-6 shadow-sm w-full text-center flex items-center justify-center transition-all"
        >
          <h1
            id="dashboard-title"
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900"
          >
            Internal Revenue Dashboard
          </h1>
        </div>

        {/* Banner if in Demo Mode */}
        {!isLive && (
          <div className="bg-blue-50 border border-blue-100/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100/80 text-blue-700 p-2 rounded-xl shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-800">Viewing Demonstration Dashboard</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  To view live records, click "Connect Sheets" and authorize access to your Google Workspace sheets.
                </p>
              </div>
            </div>
            <button
              id="btn-demo-connect"
              onClick={handleLogin}
              className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Error message / Google OAuth verification guide if login failed */}
        {errorMsg && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 text-amber-800 p-2 rounded-xl shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">Google OAuth Authorization Troubleshooting</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Google blocks logins with <code className="bg-amber-100/60 px-1 py-0.5 rounded text-amber-900">Access blocked: has not completed the Google verification process</code> when the OAuth app is in <strong className="font-bold text-slate-800">Testing mode</strong>.
                </p>
              </div>
              <button 
                onClick={() => setErrorMsg(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded hover:bg-amber-100 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            
            <div className="text-xs text-slate-500 pl-11 space-y-2">
              <p className="font-semibold text-slate-700">To enable administrative access for your Google account, follow these exact steps:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Open the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Google Cloud Console</a>.</li>
                <li>Ensure you have selected the project <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">gen-lang-client-0899368323</code>.</li>
                <li>Navigate to <strong className="text-slate-700">APIs & Services</strong> &gt; <strong className="text-slate-700">OAuth consent screen</strong> from the left sidebar.</li>
                <li>Scroll down to the <strong className="text-slate-700">Test users</strong> section.</li>
                <li>Click <strong className="text-slate-700">+ Add Users</strong>, enter your administrator Google account email (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">info.marketinghammer@gmail.com</code>), and click <strong className="text-slate-700">Save</strong>.</li>
              </ol>
              <p className="pt-1.5 text-[11px] text-amber-700 font-medium">
                Note: The dashboard is fully operational and synchronized in real-time with the central Google Sheet via the secure server proxy. You do not need to sign in to view live records.
              </p>
            </div>
          </div>
        )}

        {/* Global Controls */}
        <div className="flex items-center justify-between">
          <MonthSelector selectedMonth={selectedMonth} onChangeMonth={setSelectedMonth} />
        </div>

        {/* TOP PERFORMANCE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch">
          {/* Revenue Speedometer */}
          <div className="xl:col-span-3">
            <Gauge
              title="Revenue Achievement"
              actual={dashboardData.revenueActual}
              target={dashboardData.revenueTarget}
              achievementPercentage={revAchievementPercent}
            />
          </div>

          {/* PO Speedometer */}
          <div className="xl:col-span-3">
            <Gauge
              title="PO's in Hand"
              actual={dashboardData.poActual}
              target={dashboardData.poTarget}
              achievementPercentage={poAchievementPercent}
              onViewMore={() => setIsPOModalOpen(true)}
              isPO={true}
            />
          </div>

          {/* Secondary KPIs */}
          <div className="xl:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <KPICard
              title="Monthly Average Revenue"
              value={monthlyAverageRevenue}
              type="average"
            />
            <KPICard
              title="Total Expenses"
              value={dashboardData.expenses}
              type="expense"
            />
            <KPICard
              title="Net Profit"
              value={dashboardData.profit}
              type="profit"
            />
          </div>
        </div>

        {/* Business-wise Achievement section */}
        <section className="space-y-4">
          <BusinessAchievementSection data={dashboardData.businessAchievement} />
        </section>

        {/* Expenses Section */}
        <section className="space-y-4">
          <ExpensesSection data={dashboardData.expensesBreakdown} />
        </section>
      </main>

      {/* PO Detail Modal */}
      <PODetailModal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        pos={dashboardData.pos || pos}
        selectedMonth={selectedMonth}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-6 text-center text-xs font-semibold text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2026 Internal Revenue Dashboard. Powered by Live Google Sheets & Firebase Security.</p>
        </div>
      </footer>
    </div>
  );
}
