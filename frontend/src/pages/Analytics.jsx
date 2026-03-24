
import React, { useEffect, useMemo, useState, useCallback } from "react";
/**
 * Analytics.jsx (dynamic, end-to-end)
 * -----------------------------------------------------------------------------
 * This page replaces your static Analytics with fully dynamic data sourced from
 * your Django REST + MongoEngine backend that you shared:
 *
 * Data pulled:
 *  - Accounts:     GET /api/accounts/?user_id=<uid>
 *  - Transactions: GET /api/transactions/?user_id=<uid>
 *  - Budgets:      GET /api/budgets/user/           (requires Authorization)
 *  - Goals:        GET /api/goals/?user_id=<uid>
 *
 * Notes:
 *  - We keep the *same UI/flow* you already designed for the static version:
 *    Tabs: Overview, Spending Analysis, Income Streams, Financial Trends,
 *          Smart Insights, Spending Optimization, Goal Insights
 *  - The "Overview", "Spending Analysis", and "Income Streams" sections are
 *    fully dynamic (as requested). The remaining tabs also get dynamic content
 *    based on available data and mirror your styling/components.
 *  - This file includes:
 *      • Data fetching with robust loading & error states
 *      • Client-side transforms: monthly aggregation, category splits, top expenses,
 *        income stream breakdown, trend lines, health score heuristic, etc.
 *      • Filters: date range and account selector
 *  - If an endpoint path differs in your project, update the `ENDPOINTS` map.
 *
 * Drop-in replacement:
 *  - Replace your old Analytics.jsx file with this one.
 *  - Ensure react-chartjs-2 and chart.js are installed (you already use them).
 *  - Ensure you have shadcn/ui Button, Card, Badge, Separator.
 *  - Ensure lucide-react is installed for icons (already used in your app).
 * -----------------------------------------------------------------------------
 */
import { API_BASE } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  IndianRupee,
  Activity,
  Zap,
  Brain,
  Eye,
  Filter,
  RefreshCcw,
  Calendar,
  Wallet,
  ListChecks,
  Info,
  Layers,
  Gauge,
} from "lucide-react";

import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title as ChartTitle,
} from "chart.js";

// IMPORTANT: ChartJS registration
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ChartTitle
);

/** ---------------------------------------------------------------------------
 * API config
 * ------------------------------------------------------------------------- */

// Adjust if your API base path is different.
// You mentioned endpoints like /api/... in your app; keeping that convention.

// Centralized endpoints for easy maintenance.
// Make sure these match your urls.py (based on the views you shared).
const ENDPOINTS = {
  accountsByUser: (userId) =>
    `${API_BASE}/accounts/?user_id=${encodeURIComponent(userId)}`,
  transactionsByUser: (userId) =>
    `${API_BASE}/transactions/?user_id=${encodeURIComponent(userId)}`,
  budgetsByUser: (userId) =>
    `${API_BASE}/budgets/noauth/${encodeURIComponent(userId)}`, // requires JWT Authorization header (get_logged_in_user)
  goalsByUser: (userId) =>
    `${API_BASE}/goals/?user_id=${encodeURIComponent(userId)}`,
  // If you later wire ML endpoints, add them here (currently we compute insights in the client):
  // anomaliesByUser: (userId) => `${API_BASE}/ml/anomalies/user/${userId}/`,
  // recurringByUser: (userId) => `${API_BASE}/ml/recurring/user/${userId}/`,
  // predictExpense: (userId) => `${API_BASE}/ml/predict-expense/?user_id=${userId}`,
};

/** ---------------------------------------------------------------------------
 * Helper & Type utilities
 * ------------------------------------------------------------------------- */

/**
 * Light date utils for front-end filtering/aggregation
 */
const toDate = (v) => (v instanceof Date ? v : new Date(v));
const iso = (d) => toDate(d).toISOString();
const startOfMonth = (d) => {
  const dd = toDate(d);
  return new Date(dd.getFullYear(), dd.getMonth(), 1, 0, 0, 0, 0);
};
const endOfMonth = (d) => {
  const dd = toDate(d);
  return new Date(dd.getFullYear(), dd.getMonth() + 1, 0, 23, 59, 59, 999);
};
/** Format money in INR */
const fm = (num, currency = "INR") => {
  if (num == null || Number.isNaN(Number(num))) return "₹0.00";
  const val = Number(num);
  const f = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return f.format(val);
};
/** Quick numeric format */
const fnum = (num) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    Number(num) || 0
  );

/** Edge-safe get for nested props */
const get = (obj, path, fallback = undefined) => {
  try {
    return (
      path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj) ??
      fallback
    );
  } catch {
    return fallback;
  }
};

/** Transaction shape helper (based on your serializers): */
const getTxnAmount = (t) => Number(get(t, "amount", 0)) || 0;
const getTxnType = (t) =>
  get(t, "type", "").toLowerCase() === "income" ? "income" : "expense";
const getTxnDate = (t) => toDate(get(t, "date", new Date()));
const getTxnCategory = (t) =>
  get(t, "category", "Uncategorized") || "Uncategorized";
const getTxnAccountId = (t) =>
  get(t, "account_id.id") || get(t, "account_id") || null;

/** Budget shape helper (based on your serializers): */
const getBudgetCategory = (b) =>
  get(b, "category", "Uncategorized") || "Uncategorized";
const getBudgetAmount = (b) => Number(get(b, "amount", 0)) || 0;

/** Goal shape helper: */
const getGoalName = (g) => get(g, "name", "Goal");
const getGoalTarget = (g) => Number(get(g, "target_amount", 0)) || 0;
const getGoalSaved = (g) => Number(get(g, "current_amount", 0)) || 0;
const getGoalDeadline = (g) =>
  get(g, "deadline") ? toDate(get(g, "deadline")) : null;

/**
 * Group array to object by a key function.
 */
const groupBy = (arr, keyFn) =>
  arr.reduce((map, item) => {
    const k = keyFn(item);
    map[k] = map[k] || [];
    map[k].push(item);
    return map;
  }, {});

/**
 * Month label helpers
 */
const monthKey = (d) => {
  const dt = toDate(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};
const monthLabel = (d) => {
  const dt = toDate(d);
  return dt.toLocaleDateString("en-US", { month: "short" });
};

/** ---------------------------------------------------------------------------
 * Filters + URL params helpers
 * ------------------------------------------------------------------------- */

const getStoredAuth = () => {
  // You already store token & user in localStorage in Login.jsx
  const token = localStorage.getItem("accessToken") || null;
  // Some parts of your app store username/email separately; we only need token + decoded user id or stored user id
  const userId = localStorage.getItem("userId") || null;

  // In your existing Login.jsx you set token + possibly decode it; if you only have token,
  // consider also storing user_id during login; fallback to decoded token if needed.
  return { token, userId };
};

const defaultDateRange = () => {
  // Last 6 months inclusive (to match your original labels Feb..Jul)
  const end = endOfMonth(new Date());
  const start = startOfMonth(
    new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
  );
  return { start, end };
};

/** ---------------------------------------------------------------------------
 * Tabs
 * ------------------------------------------------------------------------- */

const tabs = [
  { id: "Overview", label: "Overview", icon: BarChart3 },
  { id: "Spending Analysis", label: "Spending Analysis", icon: PieChart },
  { id: "Income Streams", label: "Income Streams", icon: TrendingUp },
  { id: "Financial Trends", label: "Financial Trends", icon: Activity },
  // { id: "Smart Insights", label: "Smart Insights", icon: Brain },
  { id: "Spending Optimization", label: "Optimization", icon: Zap },
  { id: "Goal Insights", label: "Goal Insights", icon: Target },
];

/** ---------------------------------------------------------------------------
 * Core component
 * ------------------------------------------------------------------------- */

const Analytics = () => {
  /** -----------------------------------------------------------------------
   * UI State
   * --------------------------------------------------------------------- */
  const [activeTab, setActiveTab] = useState("Overview");
  const [{ start, end }, setRange] = useState(defaultDateRange);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [currency, setCurrency] = useState("INR");

  /** -----------------------------------------------------------------------
   * Data State
   * --------------------------------------------------------------------- */
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  /** Loading & Error states */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** -----------------------------------------------------------------------
   * Auth + Fetchers (respecting get_logged_in_user & query param patterns)
   * --------------------------------------------------------------------- */
  const { token, userId } = useMemo(getStoredAuth, []);

  const headers = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }, [token]);

  /** Generic GET wrapper with error handling */
  const apiGet = useCallback(
    async (url, includeAuth = false) => {
      const res = await fetch(url, {
        method: "GET",
        headers: includeAuth ? headers : { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
          `GET ${url} failed: ${res.status} ${res.statusText} — ${body}`
        );
      }
      return res.json();
    },
    [headers]
  );

  /** Fetch all core data parallel */
  const fetchAll = useCallback(async () => {
    if (!userId) {
      throw new Error(
        "Missing user_id. Ensure you store user_id in localStorage at login, or decode it from the JWT."
      );
    }
    const [acc, txns, buds, gls] = await Promise.all([
      apiGet(ENDPOINTS.accountsByUser(userId), false),
      apiGet(ENDPOINTS.transactionsByUser(userId), false),
      apiGet(ENDPOINTS.budgetsByUser(userId), true), // requires Authorization due to get_logged_in_user
      apiGet(ENDPOINTS.goalsByUser(userId), false),
    ]);
    return {
      acc: Array.isArray(acc) ? acc : [],
      txns: Array.isArray(txns) ? txns : [],
      buds: Array.isArray(buds) ? buds : [],
      gls: Array.isArray(gls) ? gls : [],
    };
  }, [apiGet, userId]);

  /** Initial + manual refresh */
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { acc, txns, buds, gls } = await fetchAll();
      setAccounts(acc);
      setTransactions(txns);
      setBudgets(buds);
      setGoals(gls);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  useEffect(() => {
    load();
  }, [load]);

  /** -----------------------------------------------------------------------
   * Filtering (date range + account)
   * --------------------------------------------------------------------- */

  const isWithinRange = useCallback(
    (d) => {
      if (!start || !end) return true;
      const t = toDate(d).getTime();
      return t >= start.getTime() && t <= end.getTime();
    },
    [start, end]
  );

  const filteredTxns = useMemo(() => {
    if (!transactions?.length) return [];
    return transactions.filter((t) => {
      const matchDate = isWithinRange(getTxnDate(t));
      const matchAccount =
        selectedAccountId === "all" ||
        selectedAccountId === "" ||
        selectedAccountId === null
          ? true
          : String(getTxnAccountId(t)) === String(selectedAccountId);
      return matchDate && matchAccount;
    });
  }, [transactions, isWithinRange, selectedAccountId]);

  /** -----------------------------------------------------------------------
   * Aggregations & Derived Metrics
   * --------------------------------------------------------------------- */

  /**
   * 1) Overview metrics:
   *    - Total Income
   *    - Total Expenses
   *    - Active Budgets (count)
   *    - Savings Goals (count)
   */
  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;

    for (const t of filteredTxns) {
      const amt = getTxnAmount(t);
      if (getTxnType(t) === "income") income += amt;
      else expenses += amt;
    }

    return {
      income,
      expenses,
      activeBudgets: budgets?.length || 0,
      goalsCount: goals?.length || 0,
    };
  }, [filteredTxns, budgets, goals]);

  /**
   * 2) Monthly income vs expenses (for the bar chart).
   *    We generate labels for each month in the current range (up to 12 months for performance).
   */
  const monthlySeries = useMemo(() => {
    // Build month buckets across the selected range (cap to 24 months to be safe).
    if (!start || !end) return { labels: [], income: [], expenses: [] };

    const months = [];
    let cur = new Date(start.getFullYear(), start.getMonth(), 1);
    const hardCap = 24;
    let guard = 0;

    while (cur <= end && guard < hardCap) {
      months.push(new Date(cur));
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      guard++;
    }

    // map month key -> sums
    const incMap = {};
    const expMap = {};

    for (const t of filteredTxns) {
      const mk = monthKey(getTxnDate(t));
      const amt = getTxnAmount(t);
      if (getTxnType(t) === "income") {
        incMap[mk] = (incMap[mk] || 0) + amt;
      } else {
        expMap[mk] = (expMap[mk] || 0) + amt;
      }
    }

    const labels = months.map((d) => monthLabel(d));
    const income = months.map((d) => incMap[monthKey(d)] || 0);
    const expenses = months.map((d) => expMap[monthKey(d)] || 0);

    return { labels, income, expenses };
  }, [filteredTxns, start, end]);

  /**
   * 3) Category breakdown (Spending Analysis Pie + Top Expenses Progress)
   */
  const categorySpend = useMemo(() => {
    const map = {};
    let total = 0;

    for (const t of filteredTxns) {
      if (getTxnType(t) !== "expense") continue;
      const cat = getTxnCategory(t);
      const amt = getTxnAmount(t);
      map[cat] = (map[cat] || 0) + amt;
      total += amt;
    }

    // Convert to sorted array
    const items = Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      total,
      items,
    };
  }, [filteredTxns]);

  /**
   * 4) Income Streams (Pie + Stats)
   *    Uses transaction "source" or "description" to group — if not available,
   *    fallback to account_name or generic bucket.
   */
  const incomeStreams = useMemo(() => {
    const map = {};
    let total = 0;

    for (const t of filteredTxns) {
      if (getTxnType(t) !== "income") continue;
      const amt = getTxnAmount(t);
      total += amt;

      // Prefer an explicit field if you have it, e.g. t.source or t.income_source
      const raw =
        get(t, "source") ||
        get(t, "income_source") ||
        get(t, "description") ||
        get(t, "notes") ||
        "General Income";

      // Normalize a bit
      const label =
        typeof raw === "string" && raw.trim()
          ? raw.trim().slice(0, 40)
          : "General Income";
      map[label] = (map[label] || 0) + amt;
    }

    const items = Object.entries(map)
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount);

    return { total, items };
  }, [filteredTxns]);

  /**
   * 5) Income Stability (mocked logic improved for dynamic):
   *    We compute the standard deviation of monthly income / average => variability %
   */
  const incomeStability = useMemo(() => {
    if (!monthlySeries?.income?.length) {
      return {
        variabilityPct: 0,
        avg: 0,
        monthsWithIncome: 0,
        highest: 0,
        highestMonthIndex: -1,
      };
    }
    const arr = monthlySeries.income;
    const monthsWithIncome = arr.filter((x) => x > 0).length;
    const avg = arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
    const variance =
      arr.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / (arr.length || 1);
    const stdDev = Math.sqrt(variance);
    const variabilityPct = avg ? Math.min(100, (stdDev / avg) * 100) : 0;
    const highest = Math.max(...arr, 0);
    const highestMonthIndex = arr.indexOf(highest);
    return {
      variabilityPct,
      avg,
      monthsWithIncome,
      highest,
      highestMonthIndex,
    };
  }, [monthlySeries]);

  /**
   * 6) Financial Health Score (heuristic):
   *    Score = 70 + 30 * clamp(savingsRate, 0..1) - penalty for high variability
   */
  const financialHealth = useMemo(() => {
    const income = totals.income || 0;
    const expenses = totals.expenses || 0;
    const net = income - expenses;
    const savingsRate = income > 0 ? Math.max(0, net / income) : 0;

    // Base 70 + up to +30 from savings rate
    let score = 70 + 30 * savingsRate;

    // Penalize if income variability is high
    const variability = incomeStability.variabilityPct || 0;
    if (variability > 10) {
      score -= Math.min(20, (variability - 10) * 0.5);
    }

    // Bound
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      savingsRate,
      message:
        score >= 80
          ? "Excellent financial health!"
          : score >= 60
          ? "Solid financial footing."
          : score >= 40
          ? "Okay — room for improvement."
          : "Needs attention — consider optimizing spending.",
    };
  }, [totals, incomeStability]);

  /**
   * 7) Comparative Analysis (this month vs last month by category)
   */
  const comparative = useMemo(() => {
    // Identify current & previous month windows (complete months)
    const now = new Date();
    const cmStart = startOfMonth(now);
    const cmEnd = endOfMonth(now);
    const lmStart = startOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1)
    );
    const lmEnd = endOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1)
    );

    const sumByCat = (from, to) => {
      const map = {};
      for (const t of filteredTxns) {
        if (getTxnType(t) !== "expense") continue;
        const dt = getTxnDate(t);
        if (dt < from || dt > to) continue;
        const cat = getTxnCategory(t);
        map[cat] = (map[cat] || 0) + getTxnAmount(t);
      }
      return map;
    };

    const cm = sumByCat(cmStart, cmEnd);
    const lm = sumByCat(lmStart, lmEnd);

    const cats = Array.from(new Set([...Object.keys(cm), ...Object.keys(lm)]));
    const rows = cats
      .map((c) => {
        const a = cm[c] || 0;
        const b = lm[c] || 0;
        const diff = a - b;
        const pct = b === 0 ? 100 : (diff / b) * 100;
        return {
          category: c,
          thisMonth: a,
          lastMonth: b,
          change: diff,
          changePct: pct,
        };
      })
      .sort((x, y) => y.thisMonth - x.thisMonth);

    return rows;
  }, [filteredTxns]);

  /**
   * 8) Financial Trends (line chart) – dynamic multi-series:
   *    - Total balance trend isn't available in transactions directly (your Account model can store totals),
   *      so we display Income and Expense lines and optional "Net" line across months in current range.
   */
  const trends = useMemo(() => {
    const { labels, income, expenses } = monthlySeries;
    const net = income.map((v, i) => v - (expenses[i] || 0));
    return { labels, income, expenses, net };
  }, [monthlySeries]);

  /**
   * 9) Goal Insights:
   *    - Progress, days remaining, projected shortfall/excess based on current monthly savings rate.
   *    - If the goal deadline is missing, show only progress.
   */
  const goalInsights = useMemo(() => {
    const monthlyNet =
      (monthlySeries?.income?.reduce((s, v) => s + v, 0) || 0) -
      (monthlySeries?.expenses?.reduce((s, v) => s + v, 0) || 0);
    const monthsInRange = monthlySeries?.income?.length || 1;
    const avgMonthlySavings = monthsInRange ? monthlyNet / monthsInRange : 0;

    return goals.map((g) => {
      const target = getGoalTarget(g);
      const saved = getGoalSaved(g);
      const deadline = getGoalDeadline(g); // can be null
      const remaining = Math.max(0, target - saved);
      const progressPct =
        target > 0 ? Math.min(100, (saved / target) * 100) : 0;

      let daysRemaining = null;
      let monthsToGo = null;
      let etaMessage = "No deadline set.";
      let projectedShortfall = 0;

      if (deadline) {
        const now = new Date();
        const diffms = toDate(deadline) - now;
        daysRemaining = Math.ceil(diffms / (1000 * 60 * 60 * 24));
        monthsToGo = Math.max(0, Math.ceil(daysRemaining / 30));

        const projected = monthsToGo * Math.max(0, avgMonthlySavings);
        if (projected >= remaining) {
          etaMessage = "On track to reach this goal before the deadline.";
        } else {
          projectedShortfall = remaining - projected;
          etaMessage = "At current savings rate, you may miss the deadline.";
        }
      }

      return {
        id: get(g, "id") || get(g, "_id") || Math.random(),
        name: getGoalName(g),
        target,
        saved,
        remaining,
        progressPct,
        deadline,
        daysRemaining,
        monthsToGo,
        avgMonthlySavings,
        projectedShortfall,
        etaMessage,
      };
    });
  }, [goals, monthlySeries]);

  /**
   * 10) Optimization Hints (simple rules derived from data)
   */
  const optimizationHints = useMemo(() => {
    const hints = [];

    // If any category is >35% of total expenses, suggest a cap or review.
    if (categorySpend.total > 0) {
      const top = [...categorySpend.items];
      if (top.length) {
        const leader = top[0];
        const share = leader.amount / categorySpend.total;
        if (share >= 0.35) {
          hints.push(
            `Your "${leader.category}" spends are ${Math.round(
              share * 100
            )}% of expenses — consider setting a tighter budget or finding alternatives.`
          );
        }
      }
    }

    // If monthly net is negative for 2+ months, warn.
    const negMonths = trends.net.filter((v) => v < 0).length;
    if (negMonths >= 2) {
      hints.push(
        `You ran a negative net balance in ${negMonths} month(s) in this range. Review recurring subscriptions or large tickets.`
      );
    }

    // If income variability is high.
    if (incomeStability.variabilityPct > 40) {
      hints.push(
        `Income variability is ${incomeStability.variabilityPct.toFixed(
          1
        )}%. Consider building a larger emergency fund or smoothing income sources.`
      );
    }

    // Compare budgets vs actuals quickly (only categories present in budgets)
    if (budgets?.length && categorySpend.items?.length) {
      const budgetMap = budgets.reduce((m, b) => {
        const c = getBudgetCategory(b);
        m[c] = Math.max(m[c] || 0, getBudgetAmount(b));
        return m;
      }, {});
      for (const item of categorySpend.items) {
        const cap = budgetMap[item.category] || 0;
        if (cap > 0 && item.amount > cap) {
          hints.push(
            `Category "${item.category}" exceeded its budget (${fm(
              item.amount,
              currency
            )} vs ${fm(cap, currency)}). Adjust your budget or spending.`
          );
        }
      }
    }

    return hints;
  }, [categorySpend, trends, incomeStability, budgets, currency]);

  /** -----------------------------------------------------------------------
   * UI atoms (same as your static version, kept 1:1 where possible)
   * --------------------------------------------------------------------- */

  const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {typeof change === "string" && change.length > 0 ? (
              <div className="flex items-center mt-1">
                {trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change}
                </span>
              </div>
            ) : null}
          </div>
          <div
            className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProgressBar = ({ label, value, total, color = "blue" }) => {
    const percentage = total > 0 ? Math.min(100, (value / total) * 100) : 0;
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{fm(value, currency)}</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              colorClasses[color] ?? colorClasses.blue
            } rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  /** -----------------------------------------------------------------------
   * Small helpers for UI display
   * --------------------------------------------------------------------- */

  const monthName = (index) => monthlySeries?.labels?.[index] ?? "";

  const accountOptions = useMemo(() => {
    const opts = [{ value: "all", label: "All Accounts" }];
    for (const a of accounts || []) {
      // Account serializer likely returns id + account_name
      const id = get(a, "id") || get(a, "_id") || "";
      const label = get(a, "account_name", "Account");
      opts.push({ value: String(id), label });
    }
    return opts;
  }, [accounts]);

  const handleQuickRange = (monthsBack) => {
    const endDate = endOfMonth(new Date());
    const startDate = startOfMonth(
      new Date(endDate.getFullYear(), endDate.getMonth() - monthsBack + 1, 1)
    );
    setRange({ start: startDate, end: endDate });
  };

  const handleCustomDate = (key, val) => {
    const d = new Date(val);
    if (key === "start") {
      setRange((r) => ({ ...r, start: startOfMonth(d) }));
    } else {
      setRange((r) => ({ ...r, end: endOfMonth(d) }));
    }
  };

  /** -----------------------------------------------------------------------
   * Renderers for Tabs
   * --------------------------------------------------------------------- */

  const renderOverview = () => {
    // Compute change vs previous month for income & expenses
    const idxLast = monthlySeries.income.length - 1;
    const idxPrev = monthlySeries.income.length - 2;

    let incomeChange = "0%";
    let incomeTrend = "up";
    let expenseChange = "0%";
    let expenseTrend = "up";

    if (idxPrev >= 0) {
      const cI = monthlySeries.income[idxLast] || 0;
      const pI = monthlySeries.income[idxPrev] || 0;
      const diffI = cI - pI;
      incomeTrend = diffI >= 0 ? "up" : "down";
      incomeChange = `${diffI >= 0 ? "+" : ""}${(
        (pI === 0 ? 1 : diffI / pI) * 100
      ).toFixed(0)}%`;

      const cE = monthlySeries.expenses[idxLast] || 0;
      const pE = monthlySeries.expenses[idxPrev] || 0;
      const diffE = cE - pE;
      expenseTrend = diffE >= 0 ? "up" : "down";
      expenseChange = `${diffE >= 0 ? "+" : ""}${(
        (pE === 0 ? 1 : diffE / pE) * 100
      ).toFixed(0)}%`;
    }

    const healthScore = Math.round(financialHealth.score);

    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Income"
            value={fm(totals.income, currency)}
            change={incomeChange}
            trend={incomeTrend}
            icon={TrendingUp}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Total Expenses"
            value={fm(totals.expenses, currency)}
            change={expenseChange}
            trend={expenseTrend}
            icon={TrendingDown}
            color="from-red-500 to-red-600"
          />
          <StatCard
            title="Active Budgets"
            value={String(totals.activeBudgets)}
            change=""
            trend="up"
            icon={Target}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Savings Goals"
            value={String(totals.goalsCount)}
            change=""
            trend="up"
            icon={IndianRupee}
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Financial Health Score */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Financial Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className={`text-3xl font-bold ${
                    healthScore >= 80
                      ? "text-green-600"
                      : healthScore >= 60
                      ? "text-emerald-600"
                      : healthScore >= 40
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {healthScore}/100
                </p>
                <p className="text-gray-600">{financialHealth.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Savings rate:{" "}
                  <span className="font-medium">
                    {(financialHealth.savingsRate * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
              <div className="w-24 h-24 relative">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke={
                      healthScore >= 80
                        ? "#10b981"
                        : healthScore >= 60
                        ? "#34d399"
                        : healthScore >= 40
                        ? "#f59e0b"
                        : "#ef4444"
                    }
                    strokeWidth="2"
                    strokeDasharray={`${healthScore}, 100`}
                    className="animate-pulse"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-lg font-bold ${
                      healthScore >= 80
                        ? "text-green-600"
                        : healthScore >= 60
                        ? "text-emerald-600"
                        : healthScore >= 40
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {healthScore}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Keep tracking your budgets and goals to maintain your score. A
              diversified set of income streams and controlled category spending
              will help stabilize it.
            </p>
          </CardContent>
        </Card>

        {/* Monthly Performance Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: monthlySeries.labels,
                  datasets: [
                    {
                      label: "Income",
                      data: monthlySeries.income,
                      backgroundColor: "rgba(59, 130, 246, 0.8)",
                      borderRadius: 8,
                    },
                    {
                      label: "Expenses",
                      data: monthlySeries.expenses,
                      backgroundColor: "rgba(239, 68, 68, 0.8)",
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSpendingAnalysis = () => {
    const labels = categorySpend.items.map((x) => x.category);
    const data = categorySpend.items.map((x) => x.amount);

    // Color palette
    const palette = [
      "#3b82f6",
      "#f59e0b",
      "#ef4444",
      "#10b981",
      "#8b5cf6",
      "#06b6d4",
      "#f97316",
      "#22c55e",
      "#eab308",
      "#6366f1",
    ];

    const topTwo = categorySpend.items.slice(0, 2);
    const primary = topTwo[0] || { category: "N/A", amount: 0 };
    const secondary = topTwo[1] || { category: "N/A", amount: 0 };

    return (
      <div className="space-y-8">
        {/* Spending Categories + Top Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                Spending Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Pie
                  data={{
                    labels,
                    datasets: [
                      {
                        data,
                        backgroundColor: labels.map(
                          (_, i) => palette[i % palette.length]
                        ),
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Top Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorySpend.items.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No expense data in the selected range.
                </p>
              ) : (
                categorySpend.items
                  .slice(0, 6)
                  .map((row, i) => (
                    <ProgressBar
                      key={row.category}
                      label={row.category}
                      value={row.amount}
                      total={Math.max(1, categorySpend.total)}
                      color={
                        i === 0
                          ? "blue"
                          : i === 1
                          ? "yellow"
                          : i === 2
                          ? "red"
                          : "green"
                      }
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expense Trends */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Expense Category Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line
                data={{
                  labels: monthlySeries.labels,
                  datasets: [
                    {
                      label: primary.category,
                      data: monthlySeries.labels.map((_, i) => {
                        // Approximate monthly distribution for the selected top category based on filteredTxns
                        const month = monthlySeries.labels[i];
                        // To compute each label month sum for a category, redo a quick sum:
                        const sum = filteredTxns
                          .filter((t) => getTxnType(t) === "expense")
                          .filter((t) => getTxnCategory(t) === primary.category)
                          .filter((t) => monthLabel(getTxnDate(t)) === month)
                          .reduce((s, t) => s + getTxnAmount(t), 0);
                        return sum;
                      }),
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      fill: true,
                      tension: 0.4,
                    },
                    {
                      label: secondary.category,
                      data: monthlySeries.labels.map((_, i) => {
                        const month = monthlySeries.labels[i];
                        const sum = filteredTxns
                          .filter((t) => getTxnType(t) === "expense")
                          .filter(
                            (t) => getTxnCategory(t) === secondary.category
                          )
                          .filter((t) => monthLabel(getTxnDate(t)) === month)
                          .reduce((s, t) => s + getTxnAmount(t), 0);
                        return sum;
                      }),
                      borderColor: "#f59e0b",
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Comparative Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Comparative Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-3 font-semibold">Category</th>
                    <th className="py-3 font-semibold">This Month</th>
                    <th className="py-3 font-semibold">Last Month</th>
                    <th className="py-3 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparative.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-gray-500">
                        No data to compare yet.
                      </td>
                    </tr>
                  ) : (
                    comparative.slice(0, 10).map((row) => {
                      const up = row.change >= 0;
                      return (
                        <tr key={row.category} className="hover:bg-gray-50">
                          <td className="py-3 font-medium">{row.category}</td>
                          <td className="py-3 font-semibold">
                            <span className="text-green-600">
                              {fm(row.thisMonth, currency)}
                            </span>
                          </td>
                          <td className="py-3 text-gray-500">
                            {fm(row.lastMonth, currency)}
                          </td>
                          <td className="py-3">
                            <Badge
                              variant="default"
                              className={
                                up
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {up ? "+" : ""}
                              {fm(row.change, currency)} (
                              {(row.changePct || 0).toFixed(1)}%)
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderIncomeStreams = () => {
    const labels = incomeStreams.items.map((x) => x.label);
    const data = incomeStreams.items.map((x) => x.amount);

    return (
      <div className="space-y-8">
        {/* Income Sources + Stability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                Income Sources
              </CardTitle>
              <p className="text-gray-600">Breakdown of your income streams</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Pie
                  data={{
                    labels: labels.length ? labels : ["No income"],
                    datasets: [
                      {
                        data: data.length ? data : [1],
                        backgroundColor:
                          labels.length === 0
                            ? ["#e5e7eb"]
                            : [
                                "#3b82f6",
                                "#10b981",
                                "#f59e0b",
                                "#ef4444",
                                "#8b5cf6",
                                "#06b6d4",
                              ],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {fm(incomeStreams.total, currency)}
                </p>
                <p className="text-sm text-gray-500">Total Income in Range</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Income Stability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Income Variability</p>
                <div className="w-full bg-gray-200 h-4 rounded-full">
                  <div
                    className={`h-4 rounded-full ${
                      incomeStability.variabilityPct <= 15
                        ? "bg-green-500"
                        : incomeStability.variabilityPct <= 35
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        incomeStability.variabilityPct
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {incomeStability.variabilityPct.toFixed(1)}% — lower is more
                  stable
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Average Income (monthly):
                  </span>
                  <span className="font-semibold">
                    {fm(incomeStability.avg || 0, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Months with Income:
                  </span>
                  <span className="font-semibold">
                    {incomeStability.monthsWithIncome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Highest Month:</span>
                  <span className="font-semibold text-green-600">
                    {fm(incomeStability.highest || 0, currency)}
                    {incomeStability.highestMonthIndex >= 0
                      ? ` (${monthName(incomeStability.highestMonthIndex)})`
                      : ""}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income Trends */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Monthly Income Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line
                data={{
                  labels: monthlySeries.labels,
                  datasets: [
                    {
                      label: "Income",
                      data: monthlySeries.income,
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Income Insights */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Income Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Income Streams:</span>
                  <span className="font-semibold">
                    {incomeStreams.items.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Primary Source:</span>
                  <span className="font-semibold">
                    {incomeStreams.items[0]?.label || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Share of Primary:
                  </span>
                  <span className="font-semibold">
                    {incomeStreams.total > 0
                      ? `${(
                          ((incomeStreams.items[0]?.amount || 0) /
                            incomeStreams.total) *
                          100
                        ).toFixed(1)}%`
                      : "—"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Projected Annual:
                  </span>
                  <span className="font-semibold text-blue-600">
                    {fm((incomeStability.avg || 0) * 12, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Previous Year Data:
                  </span>
                  <span className="font-semibold text-gray-500">
                    Not available
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFinancialTrends = () => {
    return (
      <div className="space-y-8">
        {/* Combined Trend Lines */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Income vs Expenses vs Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line
                data={{
                  labels: trends.labels,
                  datasets: [
                    {
                      label: "Income",
                      data: trends.income,
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16,185,129,0.1)",
                      fill: true,
                      tension: 0.35,
                    },
                    {
                      label: "Expenses",
                      data: trends.expenses,
                      borderColor: "#ef4444",
                      backgroundColor: "rgba(239,68,68,0.1)",
                      fill: true,
                      tension: 0.35,
                    },
                    {
                      label: "Net",
                      data: trends.net,
                      borderColor: "#6366f1",
                      backgroundColor: "rgba(99,102,241,0.1)",
                      fill: true,
                      tension: 0.35,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base font-semibold">
                <Gauge className="w-4 h-4 mr-2 text-blue-600" />
                Average Monthly Net
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {fm(
                  (trends.net.reduce((s, x) => s + x, 0) || 0) /
                    (trends.net.length || 1),
                  currency
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Average across selected months
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base font-semibold">
                <Layers className="w-4 h-4 mr-2 text-blue-600" />
                Positive Months
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {trends.net.filter((x) => x >= 0).length}/{trends.net.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Months with a non-negative net
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base font-semibold">
                <Info className="w-4 h-4 mr-2 text-blue-600" />
                Largest Expense Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const m = trends.expenses;
                const max = Math.max(...m, 0);
                const idx = m.indexOf(max);
                return (
                  <>
                    <p className="text-2xl font-bold">{fm(max, currency)}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {idx >= 0 ? monthName(idx) : "—"}
                    </p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderSmartInsights = () => {
    // We derive insights client-side; you can wire your ML endpoints later using ENDPOINTS.
    const insights = [];

    // 1) Savings rate commentary
    const sr = (financialHealth.savingsRate * 100).toFixed(0);
    if (financialHealth.savingsRate >= 0.5) {
      insights.push(`Your savings rate is ${sr}%, which is excellent.`);
    } else if (financialHealth.savingsRate >= 0.2) {
      insights.push(
        `Your savings rate is ${sr}%. You're on a solid track — aim for 30–40%.`
      );
    } else {
      insights.push(
        `Your savings rate is ${sr}%. Consider cutting high-impact categories and increasing income.`
      );
    }

    // 2) Income stability commentary
    const varPct = incomeStability.variabilityPct.toFixed(1);
    if (incomeStability.variabilityPct <= 15) {
      insights.push(
        `Income variability is low at ${varPct}%. This supports predictable planning.`
      );
    } else if (incomeStability.variabilityPct <= 35) {
      insights.push(
        `Income variability is moderate at ${varPct}%. Maintain a buffer for slower months.`
      );
    } else {
      insights.push(
        `Income variability is ${varPct}%. Build a larger emergency fund and diversify income sources.`
      );
    }

    // 3) Category leader commentary
    if (categorySpend.items.length) {
      const leader = categorySpend.items[0];
      const share =
        categorySpend.total > 0
          ? (leader.amount / categorySpend.total) * 100
          : 0;
      insights.push(
        `"${
          leader.category
        }" is your largest expense category at ${share.toFixed(
          1
        )}% of expenses.`
      );
    } else {
      insights.push(
        `No expense data yet to generate category insights for this range.`
      );
    }

    // 4) Budgets vs actuals quick callout
    if (budgets.length) {
      insights.push(
        `You have ${budgets.length} active budget${
          budgets.length > 1 ? "s" : ""
        }. Keep actuals under caps to improve your health score.`
      );
    } else {
      insights.push(
        `No budgets set — consider adding category budgets to keep spending in check.`
      );
    }

    return (
      <div className="space-y-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Actionable Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {insights.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {optimizationHints.length ? (
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {optimizationHints.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No specific optimization hints found right now.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOptimization = () => {
    // For a visual "budget vs actuals" comparison based on budgets + expenses.
    const budgetMap = budgets.reduce((m, b) => {
      const c = getBudgetCategory(b);
      m[c] = Math.max(m[c] || 0, getBudgetAmount(b));
      return m;
    }, {});

    const actuals = categorySpend.items.map((x) => ({
      category: x.category,
      actual: x.amount,
      budget: budgetMap[x.category] || 0,
    }));

    const labels = actuals.map((x) => x.category);
    const actualData = actuals.map((x) => x.actual);
    const budgetData = actuals.map((x) => x.budget);

    return (
      <div className="space-y-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <ListChecks className="w-5 h-5 mr-2 text-blue-600" />
              Budget vs Actuals by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {labels.length === 0 ? (
              <p className="text-sm text-gray-500">
                No expense data to compare with budgets.
              </p>
            ) : (
              <div className="h-96">
                <Bar
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Actual",
                        data: actualData,
                        backgroundColor: "rgba(239, 68, 68, 0.8)",
                        borderRadius: 6,
                      },
                      {
                        label: "Budget Cap",
                        data: budgetData,
                        backgroundColor: "rgba(59, 130, 246, 0.8)",
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "top" } },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {optimizationHints.length ? (
              optimizationHints.map((h, i) => (
                <div key={i} className="text-sm text-gray-700">
                  • {h}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                You're well within budgets for the selected range.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGoalInsights = () => {
    return (
      <div className="space-y-8">
        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {goalInsights.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600">
                  You don't have any goals yet. Create a goal to start tracking
                  progress.
                </p>
              </CardContent>
            </Card>
          ) : (
            goalInsights.map((g) => (
              <Card key={g.id} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    {g.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Target</span>
                    <span className="font-semibold">
                      {fm(g.target, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Saved</span>
                    <span className="font-semibold text-green-600">
                      {fm(g.saved, currency)}
                    </span>
                  </div>
                  <ProgressBar
                    label="Progress"
                    value={g.saved}
                    total={Math.max(1, g.target)}
                    color="purple"
                  />
                  <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex justify-between">
                      <span>Remaining</span>
                      <span className="font-semibold">
                        {fm(g.remaining, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Monthly Savings</span>
                      <span className="font-semibold">
                        {fm(g.avgMonthlySavings, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deadline</span>
                      <span className="font-semibold">
                        {g.deadline
                          ? new Date(g.deadline).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Remaining</span>
                      <span className="font-semibold">
                        {g.daysRemaining ?? "—"}
                      </span>
                    </div>
                    {g.deadline ? (
                      <div className="flex justify-between">
                        <span>Projected Shortfall</span>
                        <span
                          className={`font-semibold ${
                            g.projectedShortfall > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {fm(g.projectedShortfall, currency)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="text-sm text-gray-700 mt-2">
                    {g.etaMessage}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  /** Fallback for tabs not deeply implemented on purpose */
  const renderSoon = (
    title = "Coming Soon",
    desc = "This analytics feature is under development."
  ) => {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{desc}</p>
        </CardContent>
      </Card>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverview();
      case "Spending Analysis":
        return renderSpendingAnalysis();
      case "Income Streams":
        return renderIncomeStreams();
      case "Financial Trends":
        return renderFinancialTrends();
      // case "Smart Insights":
      //   return renderSmartInsights();
      case "Spending Optimization":
        return renderOptimization();
      case "Goal Insights":
        return renderGoalInsights();
      default:
        return renderSoon();
    }
  };

  /** -----------------------------------------------------------------------
   * Main Render
   * --------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize your financial data and discover actionable insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <BarChart3 className="w-4 h-4 mr-1" />
            Advanced Analytics
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Wallet className="w-4 h-4 mr-1" />
            {accountOptions.find(
              (x) => String(x.value) === String(selectedAccountId)
            )?.label || "All Accounts"}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleQuickRange(3)}
                className="flex items-center"
                title="Last 3 months"
              >
                <Calendar className="w-4 h-4 mr-2" />
                3M
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickRange(6)}
                className="flex items-center"
                title="Last 6 months"
              >
                <Calendar className="w-4 h-4 mr-2" />
                6M
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickRange(12)}
                className="flex items-center"
                title="Last 12 months"
              >
                <Calendar className="w-4 h-4 mr-2" />
                12M
              </Button>

              <Separator orientation="vertical" className="h-0" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Start:</span>
                <input
                  type="date"
                  value={iso(start).slice(0, 10)}
                  onChange={(e) => handleCustomDate("start", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">End:</span>
                <input
                  type="date"
                  value={iso(end).slice(0, 10)}
                  onChange={(e) => handleCustomDate("end", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {accountOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <Button
                variant="outline"
                onClick={load}
                className="flex items-center"
                title="Refresh data"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Loading / Error */}
          {(loading || error) && (
            <div className="mt-4">
              {loading ? (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                  Loading latest analytics…
                </div>
              ) : null}
              {error ? (
                <div className="text-sm text-red-600 mt-1">{error}</div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="animate-fade-in-up">{renderTabContent()}</div>
    </div>
  );
};

export default Analytics;



// "use client"

// import { useEffect, useMemo, useState, useCallback } from "react"
// /**
//  * Analytics.jsx (dynamic, end-to-end)
//  * -----------------------------------------------------------------------------
//  * This page replaces your static Analytics with fully dynamic data sourced from
//  * your Django REST + MongoEngine backend that you shared:
//  *
//  * Data pulled:
//  *  - Accounts:     GET /api/accounts/?user_id=<uid>
//  *  - Transactions: GET /api/transactions/?user_id=<uid>
//  *  - Budgets:      GET /api/budgets/user/           (requires Authorization)
//  *  - Goals:        GET /api/goals/?user_id=<uid>
//  *
//  * Notes:
//  *  - We keep the *same UI/flow* you already designed for the static version:
//  *    Tabs: Overview, Spending Analysis, Income Streams, Financial Trends,
//  *          Smart Insights, Spending Optimization, Goal Insights
//  *  - The "Overview", "Spending Analysis", and "Income Streams" sections are
//  *    fully dynamic (as requested). The remaining tabs also get dynamic content
//  *    based on available data and mirror your styling/components.
//  *  - This file includes:
//  *      • Data fetching with robust loading & error states
//  *      • Client-side transforms: monthly aggregation, category splits, top expenses,
//  *        income stream breakdown, trend lines, health score heuristic, etc.
//  *      • Filters: date range and account selector
//  *  - If an endpoint path differs in your project, update the `ENDPOINTS` map.
//  *
//  * Drop-in replacement:
//  *  - Replace your old Analytics.jsx file with this one.
//  *  - Ensure react-chartjs-2 and chart.js are installed (you already use them).
//  *  - Ensure you have shadcn/ui Button, Card, Badge, Separator.
//  *  - Ensure lucide-react is installed for icons (already used in your app).
//  * -----------------------------------------------------------------------------
//  */

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"

// import {
//   BarChart3,
//   TrendingUp,
//   TrendingDown,
//   PieChart,
//   Target,
//   DollarSign,
//   Activity,
//   Zap,
//   Brain,
//   Eye,
//   Filter,
//   RefreshCcw,
//   Calendar,
//   ListChecks,
//   Info,
//   Layers,
//   Gauge,
// } from "lucide-react"

// import { Pie, Line, Bar } from "react-chartjs-2"
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title as ChartTitle,
// } from "chart.js"

// // IMPORTANT: ChartJS registration
// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ChartTitle,
// )

// /** ---------------------------------------------------------------------------
//  * API config
//  * ------------------------------------------------------------------------- */

// // Adjust if your API base path is different.
// // You mentioned endpoints like /api/... in your app; keeping that convention.
// const API_BASE = "http://localhost:8000/api"

// // Centralized endpoints for easy maintenance.
// // Make sure these match your urls.py (based on the views you shared).
// const ENDPOINTS = {
//   accountsByUser: (userId) => `${API_BASE}/accounts/?user_id=${encodeURIComponent(userId)}`,
//   transactionsByUser: (userId) => `${API_BASE}/transactions/?user_id=${encodeURIComponent(userId)}`,
//   budgetsByUser: (userId) => `${API_BASE}/budgets/noauth/${encodeURIComponent(userId)}`, // requires JWT Authorization header (get_logged_in_user)
//   goalsByUser: (userId) => `${API_BASE}/goals/?user_id=${encodeURIComponent(userId)}`,
//   // If you later wire ML endpoints, add them here (currently we compute insights in the client):
//   // anomaliesByUser: (userId) => `${API_BASE}/ml/anomalies/user/${userId}/`,
//   // recurringByUser: (userId) => `${API_BASE}/ml/recurring/user/${userId}/`,
//   // predictExpense: (userId) => `${API_BASE}/ml/predict-expense/?user_id=${userId}`,
// }

// /** ---------------------------------------------------------------------------
//  * Helper & Type utilities
//  * ------------------------------------------------------------------------- */

// /**
//  * Light date utils for front-end filtering/aggregation
//  */
// const toDate = (v) => (v instanceof Date ? v : new Date(v))
// const iso = (d) => toDate(d).toISOString()
// const startOfMonth = (d) => {
//   const dd = toDate(d)
//   return new Date(dd.getFullYear(), dd.getMonth(), 1, 0, 0, 0, 0)
// }
// const endOfMonth = (d) => {
//   const dd = toDate(d)
//   return new Date(dd.getFullYear(), dd.getMonth() + 1, 0, 23, 59, 59, 999)
// }
// /** Format money with $ by default (you can switch to ₹ if you like) */
// const fm = (num, currency = "USD") => {
//   if (num == null || Number.isNaN(Number(num))) return "$0.00"
//   const val = Number(num)
//   const f =
//     currency === "INR"
//       ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })
//       : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
//   return f.format(val)
// }
// /** Quick numeric format */
// const fnum = (num) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(num) || 0)

// /** Edge-safe get for nested props */
// const get = (obj, path, fallback = undefined) => {
//   try {
//     return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj) ?? fallback
//   } catch {
//     return fallback
//   }
// }

// /** Transaction shape helper (based on your serializers): */
// const getTxnAmount = (t) => Number(get(t, "amount", 0)) || 0
// const getTxnType = (t) => (get(t, "type", "").toLowerCase() === "income" ? "income" : "expense")
// const getTxnDate = (t) => toDate(get(t, "date", new Date()))
// const getTxnCategory = (t) => get(t, "category", "Uncategorized") || "Uncategorized"
// const getTxnAccountId = (t) => get(t, "account_id.id") || get(t, "account_id") || null

// /** Budget shape helper (based on your serializers): */
// const getBudgetCategory = (b) => get(b, "category", "Uncategorized") || "Uncategorized"
// const getBudgetAmount = (b) => Number(get(b, "amount", 0)) || 0

// /** Goal shape helper: */
// const getGoalName = (g) => get(g, "name", "Goal")
// const getGoalTarget = (g) => Number(get(g, "target_amount", 0)) || 0
// const getGoalSaved = (g) => Number(get(g, "current_amount", 0)) || 0
// const getGoalDeadline = (g) => (get(g, "deadline") ? toDate(get(g, "deadline")) : null)

// /**
//  * Group array to object by a key function.
//  */
// const groupBy = (arr, keyFn) =>
//   arr.reduce((map, item) => {
//     const k = keyFn(item)
//     map[k] = map[k] || []
//     map[k].push(item)
//     return map
//   }, {})

// /**
//  * Month label helpers
//  */
// const monthKey = (d) => {
//   const dt = toDate(d)
//   return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`
// }
// const monthLabel = (d) => {
//   const dt = toDate(d)
//   return dt.toLocaleDateString("en-US", { month: "short" })
// }

// /** ---------------------------------------------------------------------------
//  * Filters + URL params helpers
//  * ------------------------------------------------------------------------- */

// const getStoredAuth = () => {
//   // You already store token & user in localStorage in Login.jsx
//   const token = localStorage.getItem("accessToken") || null
//   // Some parts of your app store username/email separately; we only need token + decoded user id or stored user id
//   const userId = localStorage.getItem("userId") || null

//   // In your existing Login.jsx you set token + possibly decode it; if you only have token,
//   // consider also storing user_id during login; fallback to decoded token if needed.
//   return { token, userId }
// }

// const defaultDateRange = () => {
//   // Last 6 months inclusive (to match your original labels Feb..Jul)
//   const end = endOfMonth(new Date())
//   const start = startOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1))
//   return { start, end }
// }

// /** ---------------------------------------------------------------------------
//  * Tabs
//  * ------------------------------------------------------------------------- */

// const tabs = [
//   { id: "Overview", label: "Overview", icon: BarChart3 },
//   { id: "Spending Analysis", label: "Spending Analysis", icon: PieChart },
//   { id: "Income Streams", label: "Income Streams", icon: TrendingUp },
//   { id: "Financial Trends", label: "Financial Trends", icon: Activity },
//   { id: "Smart Insights", label: "Smart Insights", icon: Brain },
//   { id: "Spending Optimization", label: "Optimization", icon: Zap },
//   { id: "Goal Insights", label: "Goal Insights", icon: Target },
// ]

// /** ---------------------------------------------------------------------------
//  * Core component
//  * ------------------------------------------------------------------------- */

// const Analytics = () => {
//   /** -----------------------------------------------------------------------
//    * UI State
//    * --------------------------------------------------------------------- */
//   const [activeTab, setActiveTab] = useState("Overview")
//   const [{ start, end }, setRange] = useState(defaultDateRange)
//   const [selectedAccountId, setSelectedAccountId] = useState("all")
//   const [currency, setCurrency] = useState("USD") // flip to "INR" if you want ₹ display

//   /** -----------------------------------------------------------------------
//    * Data State
//    * --------------------------------------------------------------------- */
//   const [accounts, setAccounts] = useState([])
//   const [transactions, setTransactions] = useState([])
//   const [budgets, setBudgets] = useState([])
//   const [goals, setGoals] = useState([])

//   /** Loading & Error states */
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   /** -----------------------------------------------------------------------
//    * Auth + Fetchers (respecting get_logged_in_user & query param patterns)
//    * --------------------------------------------------------------------- */
//   const { token, userId } = useMemo(getStoredAuth, [])

//   const headers = useMemo(() => {
//     const h = { "Content-Type": "application/json" }
//     if (token) h["Authorization"] = `Bearer ${token}`
//     return h
//   }, [token])

//   /** Generic GET wrapper with error handling */
//   const apiGet = useCallback(
//     async (url, includeAuth = false) => {
//       const res = await fetch(url, {
//         method: "GET",
//         headers: includeAuth ? headers : { "Content-Type": "application/json" },
//       })
//       if (!res.ok) {
//         const body = await res.text().catch(() => "")
//         throw new Error(`GET ${url} failed: ${res.status} ${res.statusText} — ${body}`)
//       }
//       return res.json()
//     },
//     [headers],
//   )

//   /** Fetch all core data parallel */
//   const fetchAll = useCallback(async () => {
//     if (!userId) {
//       throw new Error("Missing user_id. Ensure you store user_id in localStorage at login, or decode it from the JWT.")
//     }
//     const [acc, txns, buds, gls] = await Promise.all([
//       apiGet(ENDPOINTS.accountsByUser(userId), false),
//       apiGet(ENDPOINTS.transactionsByUser(userId), false),
//       apiGet(ENDPOINTS.budgetsByUser(userId), true), // requires Authorization due to get_logged_in_user
//       apiGet(ENDPOINTS.goalsByUser(userId), false),
//     ])
//     return {
//       acc: Array.isArray(acc) ? acc : [],
//       txns: Array.isArray(txns) ? txns : [],
//       buds: Array.isArray(buds) ? buds : [],
//       gls: Array.isArray(gls) ? gls : [],
//     }
//   }, [apiGet, userId])

//   /** Initial + manual refresh */
//   const load = useCallback(async () => {
//     setLoading(true)
//     setError("")
//     try {
//       const { acc, txns, buds, gls } = await fetchAll()
//       setAccounts(acc)
//       setTransactions(txns)
//       setBudgets(buds)
//       setGoals(gls)
//     } catch (e) {
//       console.error(e)
//       setError(e?.message || "Failed to load analytics data.")
//     } finally {
//       setLoading(false)
//     }
//   }, [fetchAll])

//   useEffect(() => {
//     load()
//   }, [load])

//   /** -----------------------------------------------------------------------
//    * Filtering (date range + account)
//    * --------------------------------------------------------------------- */

//   const isWithinRange = useCallback(
//     (d) => {
//       if (!start || !end) return true
//       const t = toDate(d).getTime()
//       return t >= start.getTime() && t <= end.getTime()
//     },
//     [start, end],
//   )

//   const filteredTxns = useMemo(() => {
//     if (!transactions?.length) return []
//     return transactions.filter((t) => {
//       const matchDate = isWithinRange(getTxnDate(t))
//       const matchAccount =
//         selectedAccountId === "all" || selectedAccountId === "" || selectedAccountId === null
//           ? true
//           : String(getTxnAccountId(t)) === String(selectedAccountId)
//       return matchDate && matchAccount
//     })
//   }, [transactions, isWithinRange, selectedAccountId])

//   /** -----------------------------------------------------------------------
//    * Aggregations & Derived Metrics
//    * --------------------------------------------------------------------- */

//   /**
//    * 1) Overview metrics:
//    *    - Total Income
//    *    - Total Expenses
//    *    - Active Budgets (count)
//    *    - Savings Goals (count)
//    */
//   const totals = useMemo(() => {
//     let income = 0
//     let expenses = 0

//     for (const t of filteredTxns) {
//       const amt = getTxnAmount(t)
//       if (getTxnType(t) === "income") income += amt
//       else expenses += amt
//     }

//     return {
//       income,
//       expenses,
//       activeBudgets: budgets?.length || 0,
//       goalsCount: goals?.length || 0,
//     }
//   }, [filteredTxns, budgets, goals])

//   /**
//    * 2) Monthly income vs expenses (for the bar chart).
//    *    We generate labels for each month in the current range (up to 12 months for performance).
//    */
//   const monthlySeries = useMemo(() => {
//     // Build month buckets across the selected range (cap to 24 months to be safe).
//     if (!start || !end) return { labels: [], income: [], expenses: [] }

//     const months = []
//     let cur = new Date(start.getFullYear(), start.getMonth(), 1)
//     const hardCap = 24
//     let guard = 0

//     while (cur <= end && guard < hardCap) {
//       months.push(new Date(cur))
//       cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
//       guard++
//     }

//     // map month key -> sums
//     const incMap = {}
//     const expMap = {}

//     for (const t of filteredTxns) {
//       const mk = monthKey(getTxnDate(t))
//       const amt = getTxnAmount(t)
//       if (getTxnType(t) === "income") {
//         incMap[mk] = (incMap[mk] || 0) + amt
//       } else {
//         expMap[mk] = (expMap[mk] || 0) + amt
//       }
//     }

//     const labels = months.map((d) => monthLabel(d))
//     const income = months.map((d) => incMap[monthKey(d)] || 0)
//     const expenses = months.map((d) => expMap[monthKey(d)] || 0)

//     return { labels, income, expenses }
//   }, [filteredTxns, start, end])

//   /**
//    * 3) Category breakdown (Spending Analysis Pie + Top Expenses Progress)
//    */
//   const categorySpend = useMemo(() => {
//     const map = {}
//     let total = 0

//     for (const t of filteredTxns) {
//       if (getTxnType(t) !== "expense") continue
//       const cat = getTxnCategory(t)
//       const amt = getTxnAmount(t)
//       map[cat] = (map[cat] || 0) + amt
//       total += amt
//     }

//     // Convert to sorted array
//     const items = Object.entries(map)
//       .map(([category, amount]) => ({ category, amount }))
//       .sort((a, b) => b.amount - a.amount)

//     return {
//       total,
//       items,
//     }
//   }, [filteredTxns])

//   /**
//    * 4) Income Streams (Pie + Stats)
//    *    Uses transaction "source" or "description" to group — if not available,
//    *    fallback to account_name or generic bucket.
//    */
//   const incomeStreams = useMemo(() => {
//     const map = {}
//     let total = 0

//     for (const t of filteredTxns) {
//       if (getTxnType(t) !== "income") continue
//       const amt = getTxnAmount(t)
//       total += amt

//       // Prefer an explicit field if you have it, e.g. t.source or t.income_source
//       const raw =
//         get(t, "source") || get(t, "income_source") || get(t, "description") || get(t, "notes") || "General Income"

//       // Normalize a bit
//       const label = typeof raw === "string" && raw.trim() ? raw.trim().slice(0, 40) : "General Income"
//       map[label] = (map[label] || 0) + amt
//     }

//     const items = Object.entries(map)
//       .map(([label, amount]) => ({ label, amount }))
//       .sort((a, b) => b.amount - a.amount)

//     return { total, items }
//   }, [filteredTxns])

//   /**
//    * 5) Income Stability (mocked logic improved for dynamic):
//    *    We compute the standard deviation of monthly income / average => variability %
//    */
//   const incomeStability = useMemo(() => {
//     if (!monthlySeries?.income?.length) {
//       return {
//         variabilityPct: 0,
//         avg: 0,
//         monthsWithIncome: 0,
//         highest: 0,
//         highestMonthIndex: -1,
//       }
//     }
//     const arr = monthlySeries.income
//     const monthsWithIncome = arr.filter((x) => x > 0).length
//     const avg = arr.reduce((s, v) => s + v, 0) / (arr.length || 1)
//     const variance = arr.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / (arr.length || 1)
//     const stdDev = Math.sqrt(variance)
//     const variabilityPct = avg ? Math.min(100, (stdDev / avg) * 100) : 0
//     const highest = Math.max(...arr, 0)
//     const highestMonthIndex = arr.indexOf(highest)
//     return {
//       variabilityPct,
//       avg,
//       monthsWithIncome,
//       highest,
//       highestMonthIndex,
//     }
//   }, [monthlySeries])

//   /**
//    * 6) Financial Health Score (heuristic):
//    *    Score = 70 + 30 * clamp(savingsRate, 0..1) - penalty for high variability
//    */
//   const financialHealth = useMemo(() => {
//     const income = totals.income || 0
//     const expenses = totals.expenses || 0
//     const net = income - expenses
//     const savingsRate = income > 0 ? Math.max(0, net / income) : 0

//     // Base 70 + up to +30 from savings rate
//     let score = 70 + 30 * savingsRate

//     // Penalize if income variability is high
//     const variability = incomeStability.variabilityPct || 0
//     if (variability > 10) {
//       score -= Math.min(20, (variability - 10) * 0.5)
//     }

//     // Bound
//     score = Math.max(0, Math.min(100, score))

//     return {
//       score,
//       savingsRate,
//       message:
//         score >= 80
//           ? "Excellent financial health!"
//           : score >= 60
//             ? "Solid financial footing."
//             : score >= 40
//               ? "Okay — room for improvement."
//               : "Needs attention — consider optimizing spending.",
//     }
//   }, [totals, incomeStability])

//   /**
//    * 7) Comparative Analysis (this month vs last month by category)
//    */
//   const comparative = useMemo(() => {
//     // Identify current & previous month windows (complete months)
//     const now = new Date()
//     const cmStart = startOfMonth(now)
//     const cmEnd = endOfMonth(now)
//     const lmStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
//     const lmEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))

//     const sumByCat = (from, to) => {
//       const map = {}
//       for (const t of filteredTxns) {
//         if (getTxnType(t) !== "expense") continue
//         const dt = getTxnDate(t)
//         if (dt < from || dt > to) continue
//         const cat = getTxnCategory(t)
//         map[cat] = (map[cat] || 0) + getTxnAmount(t)
//       }
//       return map
//     }

//     const cm = sumByCat(cmStart, cmEnd)
//     const lm = sumByCat(lmStart, lmEnd)

//     const cats = Array.from(new Set([...Object.keys(cm), ...Object.keys(lm)]))
//     const rows = cats
//       .map((c) => {
//         const a = cm[c] || 0
//         const b = lm[c] || 0
//         const diff = a - b
//         const pct = b === 0 ? 100 : (diff / b) * 100
//         return {
//           category: c,
//           thisMonth: a,
//           lastMonth: b,
//           change: diff,
//           changePct: pct,
//         }
//       })
//       .sort((x, y) => y.thisMonth - x.thisMonth)

//     return rows
//   }, [filteredTxns])

//   /**
//    * 8) Financial Trends (line chart) – dynamic multi-series:
//    *    - Total balance trend isn't available in transactions directly (your Account model can store totals),
//    *      so we display Income and Expense lines and optional "Net" line across months in current range.
//    */
//   const trends = useMemo(() => {
//     const { labels, income, expenses } = monthlySeries
//     const net = income.map((v, i) => v - (expenses[i] || 0))
//     return { labels, income, expenses, net }
//   }, [monthlySeries])

//   /**
//    * 9) Goal Insights:
//    *    - Progress, days remaining, projected shortfall/excess based on current monthly savings rate.
//    *    - If the goal deadline is missing, show only progress.
//    */
//   const goalInsights = useMemo(() => {
//     const monthlyNet =
//       (monthlySeries?.income?.reduce((s, v) => s + v, 0) || 0) -
//       (monthlySeries?.expenses?.reduce((s, v) => s + v, 0) || 0)
//     const monthsInRange = monthlySeries?.income?.length || 1
//     const avgMonthlySavings = monthsInRange ? monthlyNet / monthsInRange : 0

//     return goals.map((g) => {
//       const target = getGoalTarget(g)
//       const saved = getGoalSaved(g)
//       const deadline = getGoalDeadline(g) // can be null
//       const remaining = Math.max(0, target - saved)
//       const progressPct = target > 0 ? Math.min(100, (saved / target) * 100) : 0

//       let daysRemaining = null
//       let monthsToGo = null
//       let etaMessage = "No deadline set."
//       let projectedShortfall = 0

//       if (deadline) {
//         const now = new Date()
//         const diffms = toDate(deadline) - now
//         daysRemaining = Math.ceil(diffms / (1000 * 60 * 60 * 24))
//         monthsToGo = Math.max(0, Math.ceil(daysRemaining / 30))

//         const projected = monthsToGo * Math.max(0, avgMonthlySavings)
//         if (projected >= remaining) {
//           etaMessage = "On track to reach this goal before the deadline."
//         } else {
//           projectedShortfall = remaining - projected
//           etaMessage = "At current savings rate, you may miss the deadline."
//         }
//       }

//       return {
//         id: get(g, "id") || get(g, "_id") || Math.random(),
//         name: getGoalName(g),
//         target,
//         saved,
//         remaining,
//         progressPct,
//         deadline,
//         daysRemaining,
//         monthsToGo,
//         avgMonthlySavings,
//         projectedShortfall,
//         etaMessage,
//       }
//     })
//   }, [goals, monthlySeries])

//   /**
//    * 10) Optimization Hints (simple rules derived from data)
//    */
//   const optimizationHints = useMemo(() => {
//     const hints = []

//     // If any category is >35% of total expenses, suggest a cap or review.
//     if (categorySpend.total > 0) {
//       const top = [...categorySpend.items]
//       if (top.length) {
//         const leader = top[0]
//         const share = leader.amount / categorySpend.total
//         if (share >= 0.35) {
//           hints.push(
//             `Your "${leader.category}" spends are ${Math.round(
//               share * 100,
//             )}% of expenses — consider setting a tighter budget or finding alternatives.`,
//           )
//         }
//       }
//     }

//     // If monthly net is negative for 2+ months, warn.
//     const negMonths = trends.net.filter((v) => v < 0).length
//     if (negMonths >= 2) {
//       hints.push(
//         `You ran a negative net balance in ${negMonths} month(s) in this range. Review recurring subscriptions or large tickets.`,
//       )
//     }

//     // If income variability is high.
//     if (incomeStability.variabilityPct > 40) {
//       hints.push(
//         `Income variability is ${incomeStability.variabilityPct.toFixed(
//           1,
//         )}%. Consider building a larger emergency fund or smoothing income sources.`,
//       )
//     }

//     // Compare budgets vs actuals quickly (only categories present in budgets)
//     if (budgets?.length && categorySpend.items?.length) {
//       const budgetMap = budgets.reduce((m, b) => {
//         const c = getBudgetCategory(b)
//         m[c] = Math.max(m[c] || 0, getBudgetAmount(b))
//         return m
//       }, {})
//       for (const item of categorySpend.items) {
//         const cap = budgetMap[item.category] || 0
//         if (cap > 0 && item.amount > cap) {
//           hints.push(
//             `Category "${item.category}" exceeded its budget (${fm(
//               item.amount,
//               currency,
//             )} vs ${fm(cap, currency)}). Adjust your budget or spending.`,
//           )
//         }
//       }
//     }

//     return hints
//   }, [categorySpend, trends, incomeStability, budgets, currency])

//   /** -----------------------------------------------------------------------
//    * UI atoms (same as your static version, kept 1:1 where possible)
//    * --------------------------------------------------------------------- */

//   const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
//     <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-500 font-medium">{title}</p>
//             <p className="text-2xl font-bold text-gray-900">{value}</p>
//             {typeof change === "string" && change.length > 0 ? (
//               <div className="flex items-center mt-1">
//                 {trend === "up" ? (
//                   <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
//                 ) : (
//                   <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
//                 )}
//                 <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
//                   {change}
//                 </span>
//               </div>
//             ) : null}
//           </div>
//           <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
//             <Icon className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )

//   const ProgressBar = ({ label, value, total, color = "blue" }) => {
//     const percentage = total > 0 ? Math.min(100, (value / total) * 100) : 0
//     const colorClasses = {
//       blue: "bg-blue-500",
//       green: "bg-green-500",
//       yellow: "bg-yellow-500",
//       red: "bg-red-500",
//       purple: "bg-purple-500",
//     }

//     return (
//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="font-medium text-gray-700">{label}</span>
//           <span className="text-sm text-gray-500">{fm(value, currency)}</span>
//         </div>
//         <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
//           <div
//             className={`h-full ${
//               colorClasses[color] ?? colorClasses.blue
//             } rounded-full transition-all duration-500 ease-out`}
//             style={{ width: `${percentage}%` }}
//           />
//         </div>
//       </div>
//     )
//   }

//   /** -----------------------------------------------------------------------
//    * Small helpers for UI display
//    * --------------------------------------------------------------------- */

//   const monthName = (index) => monthlySeries?.labels?.[index] ?? ""

//   const accountOptions = useMemo(() => {
//     const opts = [{ value: "all", label: "All Accounts" }]
//     for (const a of accounts || []) {
//       // Account serializer likely returns id + account_name
//       const id = get(a, "id") || get(a, "_id") || ""
//       const label = get(a, "account_name", "Account")
//       opts.push({ value: String(id), label })
//     }
//     return opts
//   }, [accounts])

//   const handleQuickRange = (monthsBack) => {
//     const endDate = endOfMonth(new Date())
//     const startDate = startOfMonth(new Date(endDate.getFullYear(), endDate.getMonth() - monthsBack + 1, 1))
//     setRange({ start: startDate, end: endDate })
//   }

//   const handleCustomDate = (key, val) => {
//     const d = new Date(val)
//     if (key === "start") {
//       setRange((r) => ({ ...r, start: startOfMonth(d) }))
//     } else {
//       setRange((r) => ({ ...r, end: endOfMonth(d) }))
//     }
//   }

//   /** -----------------------------------------------------------------------
//    * Renderers for Tabs
//    * --------------------------------------------------------------------- */

//   const renderOverview = () => {
//     // Compute change vs previous month for income & expenses
//     const idxLast = monthlySeries.income.length - 1
//     const idxPrev = monthlySeries.income.length - 2

//     let incomeChange = "0%"
//     let incomeTrend = "up"
//     let expenseChange = "0%"
//     let expenseTrend = "up"

//     if (idxPrev >= 0) {
//       const cI = monthlySeries.income[idxLast] || 0
//       const pI = monthlySeries.income[idxPrev] || 0
//       const diffI = cI - pI
//       incomeTrend = diffI >= 0 ? "up" : "down"
//       incomeChange = `${diffI >= 0 ? "+" : ""}${((pI === 0 ? 1 : diffI / pI) * 100).toFixed(0)}%`

//       const cE = monthlySeries.expenses[idxLast] || 0
//       const pE = monthlySeries.expenses[idxPrev] || 0
//       const diffE = cE - pE
//       expenseTrend = diffE >= 0 ? "up" : "down"
//       expenseChange = `${diffE >= 0 ? "+" : ""}${((pE === 0 ? 1 : diffE / pE) * 100).toFixed(0)}%`
//     }

//     const healthScore = Math.round(financialHealth.score)

//     return (
//       <div className="space-y-8">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Total Income"
//             value={fm(totals.income, currency)}
//             change={incomeChange}
//             trend={incomeTrend}
//             icon={TrendingUp}
//             color="from-green-500 to-green-600"
//           />
//           <StatCard
//             title="Total Expenses"
//             value={fm(totals.expenses, currency)}
//             change={expenseChange}
//             trend={expenseTrend}
//             icon={TrendingDown}
//             color="from-red-500 to-red-600"
//           />
//           <StatCard
//             title="Active Budgets"
//             value={String(totals.activeBudgets)}
//             change=""
//             trend="up"
//             icon={Target}
//             color="from-blue-500 to-blue-600"
//           />
//           <StatCard
//             title="Savings Goals"
//             value={String(totals.goalsCount)}
//             change=""
//             trend="up"
//             icon={DollarSign}
//             color="from-purple-500 to-purple-600"
//           />
//         </div>

//         {/* Financial Health Score */}
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Activity className="w-5 h-5 mr-2 text-blue-600" />
//               Financial Health Score
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <p
//                   className={`text-3xl font-bold ${
//                     healthScore >= 80
//                       ? "text-green-600"
//                       : healthScore >= 60
//                         ? "text-emerald-600"
//                         : healthScore >= 40
//                           ? "text-yellow-600"
//                           : "text-red-600"
//                   }`}
//                 >
//                   {healthScore}/100
//                 </p>
//                 <p className="text-gray-600">{financialHealth.message}</p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Savings rate: <span className="font-medium">{(financialHealth.savingsRate * 100).toFixed(0)}%</span>
//                 </p>
//               </div>
//               <div className="w-24 h-24 relative">
//                 <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
//                   <path
//                     d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
//                     fill="none"
//                     stroke="#e5e7eb"
//                     strokeWidth="2"
//                   />
//                   <path
//                     d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
//                     fill="none"
//                     stroke={
//                       healthScore >= 80
//                         ? "#10b981"
//                         : healthScore >= 60
//                           ? "#34d399"
//                           : healthScore >= 40
//                             ? "#f59e0b"
//                             : "#ef4444"
//                     }
//                     strokeWidth="2"
//                     strokeDasharray={`${healthScore}, 100`}
//                     className="animate-pulse"
//                   />
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span
//                     className={`text-lg font-bold ${
//                       healthScore >= 80
//                         ? "text-green-600"
//                         : healthScore >= 60
//                           ? "text-emerald-600"
//                           : healthScore >= 40
//                             ? "text-yellow-600"
//                             : "text-red-600"
//                     }`}
//                   >
//                     {healthScore}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <p className="text-sm text-gray-600">
//               Keep tracking your budgets and goals to maintain your score. A diversified set of income streams and
//               controlled category spending will help stabilize it.
//             </p>
//           </CardContent>
//         </Card>

//         {/* Monthly Performance Chart */}
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
//               Monthly Performance
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <Bar
//                 data={{
//                   labels: monthlySeries.labels,
//                   datasets: [
//                     {
//                       label: "Income",
//                       data: monthlySeries.income,
//                       backgroundColor: "rgba(59, 130, 246, 0.8)",
//                       borderRadius: 8,
//                     },
//                     {
//                       label: "Expenses",
//                       data: monthlySeries.expenses,
//                       backgroundColor: "rgba(239, 68, 68, 0.8)",
//                       borderRadius: 8,
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: { position: "top" },
//                   },
//                   scales: {
//                     y: { beginAtZero: true },
//                   },
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderSpendingAnalysis = () => {
//     const labels = categorySpend.items.map((x) => x.category)
//     const data = categorySpend.items.map((x) => x.amount)

//     // Color palette
//     const palette = [
//       "#3b82f6",
//       "#f59e0b",
//       "#ef4444",
//       "#10b981",
//       "#8b5cf6",
//       "#06b6d4",
//       "#f97316",
//       "#22c55e",
//       "#eab308",
//       "#6366f1",
//     ]

//     const topTwo = categorySpend.items.slice(0, 2)
//     const primary = topTwo[0] || { category: "N/A", amount: 0 }
//     const secondary = topTwo[1] || { category: "N/A", amount: 0 }

//     return (
//       <div className="space-y-8">
//         {/* Spending Categories + Top Expenses */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center text-xl font-semibold">
//                 <PieChart className="w-5 h-5 mr-2 text-blue-600" />
//                 Spending Categories
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 <Pie
//                   data={{
//                     labels,
//                     datasets: [
//                       {
//                         data,
//                         backgroundColor: labels.map((_, i) => palette[i % palette.length]),
//                         borderWidth: 0,
//                       },
//                     ],
//                   }}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: { position: "bottom" },
//                     },
//                   }}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center text-xl font-semibold">
//                 <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
//                 Top Expenses
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {categorySpend.items.length === 0 ? (
//                 <p className="text-sm text-gray-500">No expense data in the selected range.</p>
//               ) : (
//                 categorySpend.items
//                   .slice(0, 6)
//                   .map((row, i) => (
//                     <ProgressBar
//                       key={row.category}
//                       label={row.category}
//                       value={row.amount}
//                       total={Math.max(1, categorySpend.total)}
//                       color={i === 0 ? "blue" : i === 1 ? "yellow" : i === 2 ? "red" : "green"}
//                     />
//                   ))
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Expense Trends */}
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Activity className="w-5 h-5 mr-2 text-blue-600" />
//               Expense Category Trends
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <Line
//                 data={{
//                   labels: monthlySeries.labels,
//                   datasets: [
//                     {
//                       label: primary.category,
//                       data: monthlySeries.labels.map((_, i) => {
//                         // Approximate monthly distribution for the selected top category based on filteredTxns
//                         const month = monthlySeries.labels[i]
//                         // To compute each label month sum for a category, redo a quick sum:
//                         const sum = filteredTxns
//                           .filter((t) => getTxnType(t) === "expense")
//                           .filter((t) => getTxnCategory(t) === primary.category)
//                           .filter((t) => monthLabel(getTxnDate(t)) === month)
//                           .reduce((s, t) => s + getTxnAmount(t), 0)
//                         return sum
//                       }),
//                       borderColor: "#3b82f6",
//                       backgroundColor: "rgba(59, 130, 246, 0.1)",
//                       fill: true,
//                       tension: 0.4,
//                     },
//                     {
//                       label: secondary.category,
//                       data: monthlySeries.labels.map((_, i) => {
//                         const month = monthlySeries.labels[i]
//                         const sum = filteredTxns
//                           .filter((t) => getTxnType(t) === "expense")
//                           .filter((t) => getTxnCategory(t) === secondary.category)
//                           .filter((t) => monthLabel(getTxnDate(t)) === month)
//                           .reduce((s, t) => s + getTxnAmount(t), 0)
//                         return sum
//                       }),
//                       borderColor: "#f59e0b",
//                       backgroundColor: "rgba(245, 158, 11, 0.1)",
//                       fill: true,
//                       tension: 0.4,
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: { legend: { position: "top" } },
//                   scales: { y: { beginAtZero: true } },
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Comparative Analysis */}
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Eye className="w-5 h-5 mr-2 text-blue-600" />
//               Comparative Analysis
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-600 border-b">
//                     <th className="py-3 font-semibold">Category</th>
//                     <th className="py-3 font-semibold">This Month</th>
//                     <th className="py-3 font-semibold">Last Month</th>
//                     <th className="py-3 font-semibold">Change</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {comparative.length === 0 ? (
//                     <tr>
//                       <td colSpan={4} className="py-4 text-gray-500">
//                         No data to compare yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     comparative.slice(0, 10).map((row) => {
//                       const up = row.change >= 0
//                       return (
//                         <tr key={row.category} className="hover:bg-gray-50">
//                           <td className="py-3 font-medium">{row.category}</td>
//                           <td className="py-3 font-semibold">
//                             <span className="text-green-600">{fm(row.thisMonth, currency)}</span>
//                           </td>
//                           <td className="py-3 text-gray-500">{fm(row.lastMonth, currency)}</td>
//                           <td className="py-3">
//                             <Badge
//                               variant="default"
//                               className={up ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
//                             >
//                               {up ? "+" : ""}
//                               {fm(row.change, currency)} ({(row.changePct || 0).toFixed(1)}%)
//                             </Badge>
//                           </td>
//                         </tr>
//                       )
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderIncomeStreams = () => {
//     const labels = incomeStreams.items.map((x) => x.label)
//     const data = incomeStreams.items.map((x) => x.amount)

//     return (
//       <div className="space-y-8">
//         {/* Income Sources + Stability */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center text-xl font-semibold">
//                 <PieChart className="w-5 h-5 mr-2 text-blue-600" />
//                 Income Sources
//               </CardTitle>
//               <p className="text-gray-600">Breakdown of your income streams</p>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 <Pie
//                   data={{
//                     labels: labels.length ? labels : ["No income"],
//                     datasets: [
//                       {
//                         data: data.length ? data : [1],
//                         backgroundColor:
//                           labels.length === 0
//                             ? ["#e5e7eb"]
//                             : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
//                         borderWidth: 0,
//                       },
//                     ],
//                   }}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: { legend: { position: "bottom" } },
//                   }}
//                 />
//               </div>
//               <div className="mt-4 text-center">
//                 <p className="text-2xl font-bold text-green-600">{fm(incomeStreams.total, currency)}</p>
//                 <p className="text-sm text-gray-500">Total Income in Range</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center text-xl font-semibold">
//                 <Activity className="w-5 h-5 mr-2 text-blue-600" />
//                 Income Stability
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <p className="text-sm text-gray-600 mb-2">Income Variability</p>
//                 <div className="w-full bg-gray-200 h-4 rounded-full">
//                   <div
//                     className={`h-4 rounded-full ${
//                       incomeStability.variabilityPct <= 15
//                         ? "bg-green-500"
//                         : incomeStability.variabilityPct <= 35
//                           ? "bg-yellow-500"
//                           : "bg-red-500"
//                     }`}
//                     style={{
//                       width: `${Math.min(100, incomeStability.variabilityPct)}%`,
//                     }}
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {incomeStability.variabilityPct.toFixed(1)}% — lower is more stable
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Average Income (monthly):</span>
//                   <span className="font-semibold">{fm(incomeStability.avg || 0, currency)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Months with Income:</span>
//                   <span className="font-semibold">{incomeStability.monthsWithIncome}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Highest Month:</span>
//                   <span className="font-semibold text-green-600">
//                     {fm(incomeStability.highest || 0, currency)}
//                     {incomeStability.highestMonthIndex >= 0 ? ` (${monthName(incomeStability.highestMonthIndex)})` : ""}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Income Trends */}
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
//               Monthly Income Trends
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <Line
//                 data={{
//                   labels: monthlySeries.labels,
//                   datasets: [
//                     {
//                       label: "Income",
//                       data: monthlySeries.income,
//                       borderColor: "#10b981",
//                       backgroundColor: "rgba(16, 185, 129, 0.1)",
//                       fill: true,
//                       tension: 0.4,
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: { legend: { position: "top" } },
//                   scales: { y: { beginAtZero: true } },
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Income Insights */}
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Brain className="w-5 h-5 mr-2 text-blue-600" />
//               Income Insights
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Income Streams:</span>
//                   <span className="font-semibold">{incomeStreams.items.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Primary Source:</span>
//                   <span className="font-semibold">{incomeStreams.items[0]?.label || "—"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Share of Primary:</span>
//                   <span className="font-semibold">
//                     {incomeStreams.total > 0
//                       ? `${(((incomeStreams.items[0]?.amount || 0) / incomeStreams.total) * 100).toFixed(1)}%`
//                       : "—"}
//                   </span>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Projected Annual:</span>
//                   <span className="font-semibold text-blue-600">{fm((incomeStability.avg || 0) * 12, currency)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Previous Year Data:</span>
//                   <span className="font-semibold text-gray-500">Not available</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderFinancialTrends = () => {
//     return (
//       <div className="space-y-8">
//         {/* Combined Trend Lines */}
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Activity className="w-5 h-5 mr-2 text-blue-600" />
//               Income vs Expenses vs Net
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <Line
//                 data={{
//                   labels: trends.labels,
//                   datasets: [
//                     {
//                       label: "Income",
//                       data: trends.income,
//                       borderColor: "#10b981",
//                       backgroundColor: "rgba(16,185,129,0.1)",
//                       fill: true,
//                       tension: 0.35,
//                     },
//                     {
//                       label: "Expenses",
//                       data: trends.expenses,
//                       borderColor: "#ef4444",
//                       backgroundColor: "rgba(239,68,68,0.1)",
//                       fill: true,
//                       tension: 0.35,
//                     },
//                     {
//                       label: "Net",
//                       data: trends.net,
//                       borderColor: "#6366f1",
//                       backgroundColor: "rgba(99,102,241,0.1)",
//                       fill: true,
//                       tension: 0.35,
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: { legend: { position: "top" } },
//                   scales: { y: { beginAtZero: true } },
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card className="border-0 shadow-lg">
//             <CardHeader className="pb-2">
//               <CardTitle className="flex items-center text-base font-semibold">
//                 <Gauge className="w-4 h-4 mr-2 text-blue-600" />
//                 Average Monthly Net
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {fm((trends.net.reduce((s, x) => s + x, 0) || 0) / (trends.net.length || 1), currency)}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">Average across selected months</p>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg">
//             <CardHeader className="pb-2">
//               <CardTitle className="flex items-center text-base font-semibold">
//                 <Layers className="w-4 h-4 mr-2 text-blue-600" />
//                 Positive Months
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {trends.net.filter((x) => x >= 0).length}/{trends.net.length}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">Months with a non-negative net</p>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg">
//             <CardHeader className="pb-2">
//               <CardTitle className="flex items-center text-base font-semibold">
//                 <Info className="w-4 h-4 mr-2 text-blue-600" />
//                 Largest Expense Month
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {(() => {
//                 const m = trends.expenses
//                 const max = Math.max(...m, 0)
//                 const idx = m.indexOf(max)
//                 return (
//                   <>
//                     <p className="text-2xl font-bold">{fm(max, currency)}</p>
//                     <p className="text-sm text-gray-500 mt-1">{idx >= 0 ? monthName(idx) : "—"}</p>
//                   </>
//                 )
//               })()}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   const renderSmartInsights = () => {
//     // We derive insights client-side; you can wire your ML endpoints later using ENDPOINTS.
//     const insights = []

//     // 1) Savings rate commentary
//     const sr = (financialHealth.savingsRate * 100).toFixed(0)
//     if (financialHealth.savingsRate >= 0.5) {
//       insights.push(`Your savings rate is ${sr}%, which is excellent.`)
//     } else if (financialHealth.savingsRate >= 0.2) {
//       insights.push(`Your savings rate is ${sr}%. You're on a solid track — aim for 30–40%.`)
//     } else {
//       insights.push(`Your savings rate is ${sr}%. Consider cutting high-impact categories and increasing income.`)
//     }

//     // 2) Income stability commentary
//     const varPct = incomeStability.variabilityPct.toFixed(1)
//     if (incomeStability.variabilityPct <= 15) {
//       insights.push(`Income variability is low at ${varPct}%. This supports predictable planning.`)
//     } else if (incomeStability.variabilityPct <= 35) {
//       insights.push(`Income variability is moderate at ${varPct}%. Maintain a buffer for slower months.`)
//     } else {
//       insights.push(`Income variability is ${varPct}%. Build a larger emergency fund and diversify income sources.`)
//     }

//     // 3) Category leader commentary
//     if (categorySpend.items.length) {
//       const leader = categorySpend.items[0]
//       const share = categorySpend.total > 0 ? (leader.amount / categorySpend.total) * 100 : 0
//       insights.push(`"${leader.category}" is your largest expense category at ${share.toFixed(1)}% of expenses.`)
//     } else {
//       insights.push(`No expense data yet to generate category insights for this range.`)
//     }

//     // 4) Budgets vs actuals quick callout
//     if (budgets.length) {
//       insights.push(
//         `You have ${budgets.length} active budget${
//           budgets.length > 1 ? "s" : ""
//         }. Keep actuals under caps to improve your health score.`,
//       )
//     } else {
//       insights.push(`No budgets set — consider adding category budgets to keep spending in check.`)
//     }

//     return (
//       <div className="space-y-8">
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Brain className="w-5 h-5 mr-2 text-blue-600" />
//               Actionable Insights
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="list-disc pl-6 space-y-2 text-gray-700">
//               {insights.map((i, idx) => (
//                 <li key={idx}>{i}</li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Zap className="w-5 h-5 mr-2 text-blue-600" />
//               Optimization Opportunities
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {optimizationHints.length ? (
//               <ul className="list-disc pl-6 space-y-2 text-gray-700">
//                 {optimizationHints.map((h, idx) => (
//                   <li key={idx}>{h}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-500">No specific optimization hints found right now.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderOptimization = () => {
//     // For a visual "budget vs actuals" comparison based on budgets + expenses.
//     const budgetMap = budgets.reduce((m, b) => {
//       const c = getBudgetCategory(b)
//       m[c] = Math.max(m[c] || 0, getBudgetAmount(b))
//       return m
//     }, {})

//     const actuals = categorySpend.items.map((x) => ({
//       category: x.category,
//       actual: x.amount,
//       budget: budgetMap[x.category] || 0,
//     }))

//     const labels = actuals.map((x) => x.category)
//     const actualData = actuals.map((x) => x.actual)
//     const budgetData = actuals.map((x) => x.budget)

//     return (
//       <div className="space-y-8">
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <ListChecks className="w-5 h-5 mr-2 text-blue-600" />
//               Budget vs Actuals by Category
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {labels.length === 0 ? (
//               <p className="text-sm text-gray-500">No expense data to compare with budgets.</p>
//             ) : (
//               <div className="h-96">
//                 <Bar
//                   data={{
//                     labels,
//                     datasets: [
//                       {
//                         label: "Actual",
//                         data: actualData,
//                         backgroundColor: "rgba(239, 68, 68, 0.8)",
//                         borderRadius: 6,
//                       },
//                       {
//                         label: "Budget Cap",
//                         data: budgetData,
//                         backgroundColor: "rgba(59, 130, 246, 0.8)",
//                         borderRadius: 6,
//                       },
//                     ],
//                   }}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: { legend: { position: "top" } },
//                     scales: { y: { beginAtZero: true } },
//                   }}
//                 />
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Target className="w-5 h-5 mr-2 text-blue-600" />
//               Recommendations
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             {optimizationHints.length ? (
//               optimizationHints.map((h, i) => (
//                 <div key={i} className="text-sm text-gray-700">
//                   • {h}
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500">You're well within budgets for the selected range.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderGoalInsights = () => {
//     return (
//       <div className="space-y-8">
//         {/* Goals Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {goalInsights.length === 0 ? (
//             <Card className="border-0 shadow-lg">
//               <CardContent className="p-8">
//                 <p className="text-gray-600">You don't have any goals yet. Create a goal to start tracking progress.</p>
//               </CardContent>
//             </Card>
//           ) : (
//             goalInsights.map((g) => (
//               <Card key={g.id} className="border-0 shadow-lg">
//                 <CardHeader>
//                   <CardTitle className="flex items-center text-xl font-semibold">
//                     <Target className="w-5 h-5 mr-2 text-blue-600" />
//                     {g.name}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>Target</span>
//                     <span className="font-semibold">{fm(g.target, currency)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>Saved</span>
//                     <span className="font-semibold text-green-600">{fm(g.saved, currency)}</span>
//                   </div>
//                   <ProgressBar label="Progress" value={g.saved} total={Math.max(1, g.target)} color="purple" />
//                   <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <div className="flex justify-between">
//                       <span>Remaining</span>
//                       <span className="font-semibold">{fm(g.remaining, currency)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Avg Monthly Savings</span>
//                       <span className="font-semibold">{fm(g.avgMonthlySavings, currency)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Deadline</span>
//                       <span className="font-semibold">
//                         {g.deadline ? new Date(g.deadline).toLocaleDateString() : "—"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Days Remaining</span>
//                       <span className="font-semibold">{g.daysRemaining ?? "—"}</span>
//                     </div>
//                     {g.deadline ? (
//                       <div className="flex justify-between">
//                         <span>Projected Shortfall</span>
//                         <span
//                           className={`font-semibold ${g.projectedShortfall > 0 ? "text-red-600" : "text-green-600"}`}
//                         >
//                           {fm(g.projectedShortfall, currency)}
//                         </span>
//                       </div>
//                     ) : null}
//                   </div>
//                   <div className="text-sm text-gray-700 mt-2">{g.etaMessage}</div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     )
//   }

//   /** Fallback for tabs not deeply implemented on purpose */
//   const renderSoon = (title = "Coming Soon", desc = "This analytics feature is under development.") => {
//     return (
//       <Card className="border-0 shadow-lg">
//         <CardContent className="p-12 text-center">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Brain className="w-8 h-8 text-white" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
//           <p className="text-gray-600">{desc}</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "Overview":
//         return renderOverview()
//       case "Spending Analysis":
//         return renderSpendingAnalysis()
//       case "Income Streams":
//         return renderIncomeStreams()
//       case "Financial Trends":
//         return renderFinancialTrends()
//       case "Smart Insights":
//         return renderSmartInsights()
//       case "Spending Optimization":
//         return renderOptimization()
//       case "Goal Insights":
//         return renderGoalInsights()
//       default:
//         return renderSoon()
//     }
//   }

//   /** -----------------------------------------------------------------------
//    * Main Render
//    * --------------------------------------------------------------------- */

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="text-center sm:text-left">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Analytics
//           </h1>
//           <p className="text-gray-600 mt-2 text-sm sm:text-base">
//             Visualize your financial data and discover actionable insights
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge variant="secondary" className="px-3 py-1">
//             <BarChart3 className="w-4 h-4 mr-1" />
//             Advanced Analytics
//           </Badge>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card className="border-0 shadow-lg">
//         <CardContent className="p-4 sm:p-6">
//           <div className="flex flex-col lg:flex-row gap-4 justify-between">
//             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => handleQuickRange(3)}
//                 className="flex items-center text-xs sm:text-sm"
//                 title="Last 3 months"
//               >
//                 <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
//                 3M
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => handleQuickRange(6)}
//                 className="flex items-center text-xs sm:text-sm"
//                 title="Last 6 months"
//               >
//                 <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
//                 6M
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => handleQuickRange(12)}
//                 className="flex items-center text-xs sm:text-sm"
//                 title="Last 12 months"
//               >
//                 <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
//                 12M
//               </Button>

//               <Separator orientation="vertical" className="h-6" />

//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">Start:</span>
//                 <input
//                   type="date"
//                   value={iso(start).slice(0, 10)}
//                   onChange={(e) => handleCustomDate("start", e.target.value)}
//                   className="border rounded px-2 py-1 text-xs sm:text-sm"
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">End:</span>
//                 <input
//                   type="date"
//                   value={iso(end).slice(0, 10)}
//                   onChange={(e) => handleCustomDate("end", e.target.value)}
//                   className="border rounded px-2 py-1 text-xs sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <Filter className="w-4 h-4 text-gray-500" />
//                 <select
//                   value={selectedAccountId}
//                   onChange={(e) => setSelectedAccountId(e.target.value)}
//                   className="border rounded px-2 py-1 text-xs sm:text-sm"
//                 >
//                   {accountOptions.map((o) => (
//                     <option key={o.value} value={o.value}>
//                       {o.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">Currency:</span>
//                 <select
//                   value={currency}
//                   onChange={(e) => setCurrency(e.target.value)}
//                   className="border rounded px-2 py-1 text-xs sm:text-sm"
//                 >
//                   <option value="USD">USD ($)</option>
//                   <option value="INR">INR (₹)</option>
//                 </select>
//               </div>

//               <Button
//                 variant="outline"
//                 onClick={load}
//                 className="flex items-center text-xs sm:text-sm bg-transparent"
//                 title="Refresh data"
//               >
//                 <RefreshCcw className="w-4 h-4 mr-2" />
//                 Refresh
//               </Button>
//             </div>
//           </div>

//           {/* Loading / Error */}
//           {(loading || error) && (
//             <div className="mt-4">
//               {loading ? (
//                 <div className="text-sm text-gray-600 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
//                   Loading latest analytics…
//                 </div>
//               ) : null}
//               {error ? <div className="text-sm text-red-600 mt-1">{error}</div> : null}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//         <StatCard
//           title="Total Income"
//           value={fm(totals.income, currency)}
//           change={incomeChange}
//           trend={incomeTrend}
//           icon={TrendingUp}
//           color="from-green-500 to-green-600"
//         />
//         <StatCard
//           title="Total Expenses"
//           value={fm(totals.expenses, currency)}
//           change={expenseChange}
//           trend={expenseTrend}
//           icon={TrendingDown}
//           color="from-red-500 to-red-600"
//         />
//         <StatCard
//           title="Active Budgets"
//           value={String(totals.activeBudgets)}
//           change=""
//           trend="up"
//           icon={Target}
//           color="from-blue-500 to-blue-600"
//         />
//         <StatCard
//           title="Savings Goals"
//           value={String(totals.goalsCount)}
//           change=""
//           trend="up"
//           icon={DollarSign}
//           color="from-purple-500 to-purple-600"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-lg sm:text-xl font-semibold">
//               <PieChart className="w-5 h-5 mr-2 text-blue-600" />
//               Spending Categories
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-64">
//               <Pie
//                 data={{
//                   labels,
//                   datasets: [
//                     {
//                       data,
//                       backgroundColor: labels.map((_, i) => palette[i % palette.length]),
//                       borderWidth: 0,
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: { position: "bottom" },
//                   },
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-lg sm:text-xl font-semibold">
//               <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
//               Top Expenses
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {categorySpend.items.length === 0 ? (
//               <p className="text-sm text-gray-500">No expense data in the selected range.</p>
//             ) : (
//               categorySpend.items
//                 .slice(0, 6)
//                 .map((row, i) => (
//                   <ProgressBar
//                     key={row.category}
//                     label={row.category}
//                     value={row.amount}
//                     total={Math.max(1, categorySpend.total)}
//                     color={i === 0 ? "blue" : i === 1 ? "yellow" : i === 2 ? "red" : "green"}
//                   />
//                 ))
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Comparative Analysis Table */}
//       <Card className="border-0 shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-lg sm:text-xl font-semibold">Comparative Analysis</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm min-w-[600px]">
//               <thead>
//                 <tr className="text-left text-gray-600 border-b">
//                   <th className="py-3 font-semibold">Category</th>
//                   <th className="py-3 font-semibold">This Month</th>
//                   <th className="py-3 font-semibold">Last Month</th>
//                   <th className="py-3 font-semibold">Change</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {comparative.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="py-4 text-gray-500 text-center">
//                       No data to compare yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   comparative.slice(0, 10).map((row) => {
//                     const up = row.change >= 0
//                     return (
//                       <tr key={row.category} className="hover:bg-gray-50">
//                         <td className="py-3 font-medium">{row.category}</td>
//                         <td className="py-3 font-semibold">
//                           <span className="text-green-600">{fm(row.thisMonth, currency)}</span>
//                         </td>
//                         <td className="py-3 text-gray-500">{fm(row.lastMonth, currency)}</td>
//                         <td className="py-3">
//                           <Badge
//                             variant="default"
//                             className={up ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
//                           >
//                             {up ? "+" : ""}
//                             {fm(row.change, currency)} ({(row.changePct || 0).toFixed(1)}%)
//                           </Badge>
//                         </td>
//                       </tr>
//                     )
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default Analytics
