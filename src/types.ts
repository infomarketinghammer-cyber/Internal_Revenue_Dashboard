export interface PO {
  client: string;
  category: string;
  monthly: number;
  noOfMonths: number;
  pendingRevenue: number;
  // Aliases for compatibility
  customer?: string;
  business?: string;
  poValue?: number;
  poNumber?: string;
  poDate?: string;
  status?: string;
  month?: string;
}

export interface BusinessAchievement {
  business: string; // Dept e.g. "AI & Robotics", "Digital Marketing", "Web Development", "Workshops", "Books", "Total"
  annualTarget: number;
  h1Target: number;
  actual: number;
  pending: number;
  target: number; // for backward compatibility & chart
  achievementPercentage: number; // calculated
  variance: number; // calculated
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number; // calculated
}

export interface MonthData {
  monthName: string; // e.g., "April", "May", "June", ...
  monthIndex: number; // 1 for April, 2 for May, ..., 12 for March
  revenueTarget: number;
  revenueActual: number;
  revenuePercentage?: number;
  poTarget: number;
  poActual: number;
  poPercentage?: number;
  monthlyAverageRevenue?: number;
  expenses: number;
  profit: number;
  businessAchievement: BusinessAchievement[];
  expensesBreakdown: ExpenseCategory[];
  pos?: PO[];
}

export interface DashboardState {
  selectedMonth: string; // e.g., "April", "May", ...
  monthsFromApril: number; // e.g., 1 for April, 5 for August
  revenueTarget: number;
  revenueActual: number;
  revenueAchievementPercentage: number;
  poTarget: number;
  poActual: number;
  poAchievementPercentage: number;
  monthlyAverageRevenue: number;
  expenses: number;
  profit: number;
  businessAchievement: BusinessAchievement[];
  expensesBreakdown: ExpenseCategory[];
  pos: PO[];
  availableMonths: string[];
}
