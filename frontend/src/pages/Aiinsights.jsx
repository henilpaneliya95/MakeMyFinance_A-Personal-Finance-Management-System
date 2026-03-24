// import { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   Brain,
//   RefreshCw,
//   TrendingUp,
//   Wallet,
//   AlertTriangle,
//   Repeat,
//   Target,
//   Loader2,
//   Clock,
//   BarChart3,
//   Receipt,
//   XCircle,
// } from "lucide-react";

// // =============================================
// // CONFIG
// // =============================================
// const API_BASE = "http://localhost:8000/api"; // your backend root
// const ML_BASE = `${API_BASE}/ml`;

// // =============================================
// // UTILS
// // =============================================
// const fmt = (n) => Number(n || 0).toLocaleString();
// const inr = (n) => `₹${fmt(n)}`;

// const asDate = (d) => {
//   if (!d || d === "N/A") return null;
//   try {
//     return new Date(d);
//   } catch {
//     return null;
//   }
// };

// const shortDate = (d) => {
//   const dt = asDate(d);
//   return dt ? dt.toLocaleString() : "N/A";
// };

// const capitalize = (s) =>
//   typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

// function toast(message, type = "success") {
//   const el = document.createElement("div");
//   el.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right ${
//     type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
//   }`;
//   el.innerHTML = `
//     <div class="flex items-center gap-2">
//       <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//         <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
//       </svg>
//       <span>${message}</span>
//     </div>`;
//   document.body.appendChild(el);
//   setTimeout(() => {
//     try {
//       document.body.removeChild(el);
//     } catch {}
//   }, 2200);
// }

// // A tiny delay helper for UX sequencing
// const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// // =============================================
// // MAIN COMPONENT
// // =============================================
// const Aiinsights = () => {
//   // user id
//   const [userId, setUserId] = useState("");

//   // ---- loading flags
//   const [loadingAll, setLoadingAll] = useState(false);
//   const [loadingForecast, setLoadingForecast] = useState(false);
//   const [loadingAnoms, setLoadingAnoms] = useState(false);
//   const [loadingRecurring, setLoadingRecurring] = useState(false);
//   const [loadingEta, setLoadingEta] = useState(false);

//   // ---- data
//   const [forecast, setForecast] = useState(null);
//   const [anomsSummary, setAnomsSummary] = useState(null); // {created, anomaly_ids}
//   const [recurringSummary, setRecurringSummary] = useState(null); // {created, pattern_ids}
//   const [etas, setEtas] = useState([]); // results array

//   // Persisted history lists (full detail)
//   const [anomsList, setAnomsList] = useState([]); // Array of anomalies with joined transaction
//   const [recurringList, setRecurringList] = useState([]); // Array of recurring patterns

//   // ---- error states
//   const [errForecast, setErrForecast] = useState("");
//   const [errAnoms, setErrAnoms] = useState("");
//   const [errRecurring, setErrRecurring] = useState("");
//   const [errEta, setErrEta] = useState("");

//   // ---- timestamps
//   const [tForecast, setTForecast] = useState(null);
//   const [tAnoms, setTAnoms] = useState(null);
//   const [tRecurring, setTRecurring] = useState(null);
//   const [tEta, setTEta] = useState(null);

//   // Keep a mounted flag to avoid state updates on unmounted
//   const mountedRef = useRef(true);
//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   // Load userId from localStorage on mount
//   useEffect(() => {
//     const id = localStorage.getItem("userId");
//     if (id) setUserId(id);
//   }, []);

//   // ================================
//   // API CALLERS
//   // ================================
//   const fetchForecast = useCallback(async () => {
//     if (!userId) {
//     // fallback when not logged in
//     setForecast({
//       predicted_income: 0,
//       predicted_expense: 0,
//       predicted_balance: 0,
//       target_period: "N/A",
//       confidence: 0,
//       model_version: "v1",
//       created_at: null,
//     });
//     return;
//   }
//     setLoadingForecast(true);
//     try {
//       const { data } = await axios.get(`${ML_BASE}/predict-expense/${userId}/`);
//       if (!mountedRef.current) return;
//       setForecast(data || null);
//       setTForecast(new Date());
//     } catch (err) {
//       if (!mountedRef.current) return;
//       setErrForecast(
//         err?.response?.data?.error || err.message || "Failed to fetch forecast"
//       );
//     } finally {
//       if (!mountedRef.current) return;
//       setLoadingForecast(false);
//     }
//   }, [userId]);

//   // fetch full anomaly list (persisted history)
//   const fetchAnomaliesList = useCallback(async () => {
//     if (!userId) {
//     setAnomsList([]);   // no anomalies
//     return;
//   }
//     try {
//       const { data } = await axios.get(`${ML_BASE}/anomalies/users/${userId}/`);
//       if (!mountedRef.current) return;
//       const list = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.results)
//         ? data.results
//         : [];
//       setAnomsList(list);
//     } catch (err) {
//       if (!mountedRef.current) return;
//       setAnomsList([]);
//     }
//   }, [userId]);

//   // fetch full recurring list (persisted history)
//   const fetchRecurringList = useCallback(async () => {
//      if (!userId) {
//     setEtas([]); // no goals
//     return;
//   }
//     try {
//       const { data } = await axios.get(`${ML_BASE}/recurring/users/${userId}/`);
//       if (!mountedRef.current) return;
//       const list = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.results)
//         ? data.results
//         : [];
//       setRecurringList(list);
//     } catch (err) {
//       if (!mountedRef.current) return;
//       setRecurringList([]);
//     }
//   }, [userId]);

//   const runAnomalyDetection = useCallback(async () => {
//     if (!userId) return;
//     setErrAnoms("");
//     setLoadingAnoms(true);
//     try {
//       const { data } = await axios.post(`${ML_BASE}/anomalies/run/${userId}/`);
//       if (!mountedRef.current) return;
//       setAnomsSummary(data || null);
//       setTAnoms(new Date());
//       toast(`Anomaly scan complete • ${data?.created || 0} new`);
//       // IMPORTANT: refresh full list so old + new show together
//       await fetchAnomaliesList();
//     } catch (err) {
//       if (!mountedRef.current) return;
//       setErrAnoms(
//         err?.response?.data?.error || err.message || "Failed to run anomalies"
//       );
//       toast("Anomaly detection failed", "error");
//     } finally {
//       if (!mountedRef.current) return;
//       setLoadingAnoms(false);
//     }
//   }, [userId, fetchAnomaliesList]);

//   const runRecurringDetection = useCallback(async () => {
//     if (!userId) return;
//     setErrRecurring("");
//     setLoadingRecurring(true);
//     try {
//       const { data } = await axios.post(`${ML_BASE}/recurring/run/${userId}/`);
//       if (!mountedRef.current) return;
//       setRecurringSummary(data || null);
//       setTRecurring(new Date());
//       toast(`Recurring patterns updated • ${data?.created || 0} new`);
//       // refresh full list
//       await fetchRecurringList();
//     } catch (err) {
//       if (!mountedRef.current) return;
//       setErrRecurring(
//         err?.response?.data?.error ||
//           err.message ||
//           "Failed to run recurring detection"
//       );
//       toast("Recurring detection failed", "error");
//     } finally {
//       if (!mountedRef.current) return;
//       setLoadingRecurring(false);
//     }
//   }, [userId, fetchRecurringList]);

//   const fetchGoalEtas = useCallback(async () => {
//     if (!userId) return;
//     setErrEta("");
//     setLoadingEta(true);
//     try {
//       const { data } = await axios.get(`${ML_BASE}/goals/eta/${userId}/`);
//       if (!mountedRef.current) return;
//       const list = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.results)
//         ? data.results
//         : [];
//       setEtas(list);
//       setTEta(new Date());
//     } catch (err) {
//       if (!mountedRef.current) return;
//       setErrEta(
//         err?.response?.data?.error || err.message || "Failed to fetch goal ETAs"
//       );
//     } finally {
//       if (!mountedRef.current) return;
//       setLoadingEta(false);
//     }
//   }, [userId]);

//   const runAll = async () => {
//     if (!userId) {
//       toast("Missing userId in localStorage", "error");
//       return;
//     }
//     setLoadingAll(true);
//     try {
//       // First load the read-only + history lists so old detections are visible.
//       await Promise.all([
//         fetchForecast(),
//         fetchGoalEtas(),
//         fetchAnomaliesList(),
//         fetchRecurringList(),
//       ]);
//       // Then run mutating ones so new items append to the already shown lists
//       await sleep(150); // tiny gap for nicer UX
//       await runAnomalyDetection();
//       await runRecurringDetection();
//       toast("AI Insights refreshed");
//     } finally {
//       setLoadingAll(false);
//     }
//   };

//   // auto-load read-only + history on userId ready
//   useEffect(() => {
//     if (!userId) return;
//     fetchForecast();
//     fetchGoalEtas();
//     fetchAnomaliesList();
//     fetchRecurringList();
//   }, [
//     userId,
//     fetchForecast,
//     fetchGoalEtas,
//     fetchAnomaliesList,
//     fetchRecurringList,
//   ]);

//   // helpers for Goal cards
//   const progressPct = (curr, targ) => {
//     const t = Number(targ || 0);
//     if (t <= 0) return 0;
//     const p = (Number(curr || 0) / t) * 100;
//     return Math.max(0, Math.min(100, p));
//   };

//   // ================================
//   // HEADER
//   // ================================
//   const HeaderBar = useMemo(
//     () => (
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 grid place-items-center">
//             <Brain className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-semibold">AI Insights</h1>
//             <p className="text-sm text-muted-foreground">
//               Forecasts • Anomalies • Recurring • Goal ETA
//             </p>
//           </div>
//         </div>
//       </div>
//     ),
//     [loadingAll]
//   );

//   // ================================
//   // RENDER
//   // ================================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
//       {HeaderBar}

//       <Tabs defaultValue="forecast" className="space-y-6">
//         <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
//           <TabsTrigger value="forecast" className="flex items-center gap-2">
//             <BarChart3 className="w-4 h-4" /> Forecast
//           </TabsTrigger>
//           <TabsTrigger value="anomalies" className="flex items-center gap-2">
//             <AlertTriangle className="w-4 h-4" /> Anomalies
//           </TabsTrigger>
//           <TabsTrigger value="recurring" className="flex items-center gap-2">
//             <Repeat className="w-4 h-4" /> Recurring
//           </TabsTrigger>
//           <TabsTrigger value="goals" className="flex items-center gap-2">
//             <Target className="w-4 h-4" /> Goal ETA
//           </TabsTrigger>
//         </TabsList>

//         {/* ================= FORECAST ================= */}
//         <TabsContent value="forecast">
//           <Card className="shadow-sm border border-gray-200">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <TrendingUp className="w-5 h-5" /> Monthly Forecast
//               </CardTitle>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 {tForecast && <span>Updated: {shortDate(tForecast)}</span>}
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={fetchForecast}
//                   disabled={loadingForecast}
//                 >
//                   {loadingForecast ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <RefreshCw className="w-4 h-4" />
//                   )}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {errForecast && <ErrorAlert message={errForecast} />}

//               {!forecast && !errForecast ? (
//                 <SkeletonRow label="Loading forecast" />
//               ) : (
//                 forecast && (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <StatTile
//                       icon={<Wallet className="w-4 h-4" />}
//                       label="Predicted Income"
//                       value={inr(forecast?.predicted_income || 0)}
//                     />
//                     <StatTile
//                       icon={<AlertTriangle className="w-4 h-4" />}
//                       label="Predicted Expense"
//                       value={inr(forecast?.predicted_expense || 0)}
//                     />
//                     <StatTile
//                       icon={<TrendingUp className="w-4 h-4" />}
//                       label="Predicted Balance"
//                       value={inr(forecast?.predicted_balance || 0)}
//                     />
//                   </div>
//                 )
//               )}

//               {forecast && (
//                 <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
//                   <Badge variant="secondary">
//                     Period: {forecast?.target_period || "—"}
//                   </Badge>
//                   <Badge variant="secondary">
//                     Confidence: {((forecast?.confidence || 0) * 100).toFixed(0)}
//                     %
//                   </Badge>
//                   <Badge variant="secondary">
//                     Model: {forecast?.model_version || "v1"}
//                   </Badge>
//                   <Badge variant="outline">
//                     Created: {shortDate(forecast?.created_at)}
//                   </Badge>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ================= ANOMALIES ================= */}
//         <TabsContent value="anomalies">
//           <Card className="shadow-sm border border-gray-200">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <AlertTriangle className="w-5 h-5" /> Spending Anomalies
//               </CardTitle>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 {tAnoms && <span>Last run: {shortDate(tAnoms)}</span>}
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={fetchAnomaliesList}
//                   disabled={loadingAnoms}
//                 >
//                   Refresh list
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={runAnomalyDetection}
//                   disabled={loadingAnoms}
//                 >
//                   {loadingAnoms ? (
//                     <span className="flex items-center gap-2">
//                       <Loader2 className="w-4 h-4 animate-spin" /> Running…
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-2">
//                       <RefreshCw className="w-4 h-4" /> Run detection
//                     </span>
//                   )}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {errAnoms && <ErrorAlert message={errAnoms} />}

//               {/* Summary badge of last run */}
//               {anomsSummary && (
//                 <div className="flex items-center gap-3 flex-wrap">
//                   <Badge
//                     variant={anomsSummary.created > 0 ? "default" : "secondary"}
//                   >
//                     {anomsSummary.created || 0} new anomalies
//                   </Badge>
//                 </div>
//               )}

//               {/* Detailed list - persisted history */}
//               {!anomsList || anomsList.length === 0 ? (
//                 <EmptyState
//                   icon={<AlertTriangle className="w-6 h-6" />}
//                   title="No anomalies yet"
//                   subtitle="Click 'Run detection' to scan your recent expenses."
//                   actionLabel="Run detection"
//                   onAction={runAnomalyDetection}
//                   loading={loadingAnoms}
//                 />
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {anomsList.map((a, idx) => (
//                     <AnomalyCard key={a.id || a._id || idx} a={a} />
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ================= RECURRING ================= */}
//         <TabsContent value="recurring">
//           <Card className="shadow-sm border border-gray-200">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Repeat className="w-5 h-5" /> Recurring Patterns
//               </CardTitle>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 {tRecurring && <span>Last run: {shortDate(tRecurring)}</span>}
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={fetchRecurringList}
//                   disabled={loadingRecurring}
//                 >
//                   Refresh list
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={runRecurringDetection}
//                   disabled={loadingRecurring}
//                 >
//                   {loadingRecurring ? (
//                     <span className="flex items-center gap-2">
//                       <Loader2 className="w-4 h-4 animate-spin" /> Running…
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-2">
//                       <RefreshCw className="w-4 h-4" /> Run detection
//                     </span>
//                   )}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {errRecurring && <ErrorAlert message={errRecurring} />}

//               {/* Summary label of last run */}
//               {recurringSummary && (
//                 <div className="flex items-center gap-3 flex-wrap">
//                   <Badge
//                     variant={
//                       recurringSummary.created > 0 ? "default" : "secondary"
//                     }
//                   >
//                     {recurringSummary.created || 0} new patterns
//                   </Badge>
//                 </div>
//               )}

//               {/* Detailed list - persisted history */}
//               {!recurringList || recurringList.length === 0 ? (
//                 <EmptyState
//                   icon={<Repeat className="w-6 h-6" />}
//                   title="No recurring patterns detected yet"
//                   subtitle="Run the detector to discover weekly or monthly patterns."
//                   actionLabel="Run detection"
//                   onAction={runRecurringDetection}
//                   loading={loadingRecurring}
//                 />
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {recurringList.map((r, idx) => (
//                     <RecurringCard key={r.id || r._id || idx} r={r} />
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ================= GOAL ETA ================= */}
//         <TabsContent value="goals">
//           <Card className="shadow-sm border border-gray-200">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Target className="w-5 h-5" /> Goal Completion ETA
//               </CardTitle>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 {tEta && <span>Updated: {shortDate(tEta)}</span>}
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={fetchGoalEtas}
//                   disabled={loadingEta}
//                 >
//                   {loadingEta ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <RefreshCw className="w-4 h-4" />
//                   )}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {errEta && <ErrorAlert message={errEta} />}

//               {(!etas || etas.length === 0) && !errEta ? (
//                 <SkeletonRow label="No goals or not enough savings data" />
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {etas.map((g, idx) => (
//                     <GoalCard key={g.goal_id || idx} g={g} />
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// // =============================================
// // SUB-COMPONENTS & UI HELPERS
// // =============================================
// function StatTile({ icon, label, value }) {
//   return (
//     <div className="p-4 rounded-xl bg-white/70 backdrop-blur border border-gray-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <div className="text-xs uppercase tracking-wide text-muted-foreground">
//             {label}
//           </div>
//           <div className="text-xl font-semibold mt-1">{value}</div>
//         </div>
//         <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 grid place-items-center text-white">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ErrorAlert({ message }) {
//   if (!message) return null;
//   return (
//     <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
//       <XCircle className="w-4 h-4" />
//       <span className="truncate">{message}</span>
//     </div>
//   );
// }

// function SkeletonRow({ label = "Loading…" }) {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4">
//       <div className="flex items-center gap-3 animate-pulse">
//         <div className="w-10 h-10 rounded-lg bg-gray-200" />
//         <div className="flex-1">
//           <div className="h-3 w-40 bg-gray-200 rounded" />
//           <div className="h-3 w-24 bg-gray-100 rounded mt-2" />
//         </div>
//       </div>
//       <div className="mt-3 text-xs text-muted-foreground">{label}</div>
//     </div>
//   );
// }

// function EmptyState({ icon, title, subtitle, actionLabel, onAction, loading }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 p-8 border border-dashed rounded-xl bg-white/60">
//       <div className="w-10 h-10 rounded-full bg-gray-100 grid place-items-center text-gray-700">
//         {icon}
//       </div>
//       <div className="text-sm font-medium">{title}</div>
//       {subtitle ? (
//         <div className="text-xs text-muted-foreground">{subtitle}</div>
//       ) : null}
//       {actionLabel ? (
//         <Button
//           size="sm"
//           onClick={onAction}
//           disabled={loading}
//           className="mt-1"
//         >
//           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : actionLabel}
//         </Button>
//       ) : null}
//     </div>
//   );
// }

// // ---------------------------------------------
// // Goal Card
// // ---------------------------------------------
// function GoalCard({ g }) {
//   const pct = Math.round(
//     (Number(g.current_saved || 0) / Number(g.target_amount || 1)) * 100 || 0
//   );
//   const eta = g.predicted_completion_date;

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4">
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="text-sm text-muted-foreground mb-1">Goal</div>
//           <div className="text-lg font-semibold">
//             {g.title || "Untitled Goal"}
//           </div>
//         </div>
//         <Badge variant={eta === "N/A" ? "secondary" : "default"}>
//           {eta === "N/A" ? "No ETA" : shortDate(eta)}
//         </Badge>
//       </div>

//       <div className="mt-3 space-y-2">
//         <div className="flex justify-between text-sm">
//           <span>Saved: {inr(g.current_saved || 0)}</span>
//           <span>Target: {inr(g.target_amount || 0)}</span>
//         </div>
//         <Progress value={pct} />
//         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//           <Clock className="w-3.5 h-3.5" />
//           <span>Progress: {pct}%</span>
//           <span className="mx-1">•</span>
//           <span>
//             Monthly net used: {inr(g.assumptions?.monthly_net_saving || 0)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------------------------------------------
// // Anomaly Card (with joined transaction details)
// // ---------------------------------------------
// function AnomalyCard({ a }) {
//   // supports either nested transaction object or flat fields
//   const tx = a.transaction || a.tx || {};

//   // try commonly used keys
//   const amount = tx.amount ?? a.amount;
//   const category = tx.category ?? a.category;
//   const date = tx.date ?? a.flagged_at;
//   const merchant =
//     tx.merchant || tx.description || a.merchant || a.description || null;
//   const account = tx.account_name || tx.account || a.account_name || null;
//   const reason = a.flag_reason || a.reason || "High deviation";
//   const score = a.anomaly_score ?? a.score ?? null;

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 grid place-items-center">
//             <AlertTriangle className="w-5 h-5" />
//           </div>
//           <div>
//             <div className="text-sm font-medium">
//               {capitalize(category) || "expense"}
//             </div>
//             <div className="text-xs text-muted-foreground">
//               {shortDate(date)}
//             </div>
//             {merchant ? (
//               <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
//                 <Receipt className="w-3 h-3" />{" "}
//                 <span className="truncate max-w-[200px]">{merchant}</span>
//               </div>
//             ) : null}
//             {account ? (
//               <div className="text-[11px] text-muted-foreground flex items-center gap-1">
//                 <Wallet className="w-3 h-3" />
//                 <span className="truncate max-w-[200px]">{account}</span>
//               </div>
//             ) : null}
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="text-base font-semibold">{inr(amount || 0)}</div>
//           {score != null && (
//             <div className="text-xs text-muted-foreground">
//               score: {Number(score).toFixed(2)}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="mt-2 text-xs text-muted-foreground">{reason}</div>
//     </div>
//   );
// }

// // ---------------------------------------------
// // Recurring Card
// // ---------------------------------------------
// function RecurringCard({ r }) {
//   const label = r.pattern || `${r.category || "expense"}`;
//   const amt = r.average_amount ?? r.avg_amount ?? r.amount;
//   const freq = r.frequency || r.freq || "Irregular";
//   const last = r.last_detected || r.detected_on;

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 grid place-items-center">
//             <Repeat className="w-5 h-5" />
//           </div>
//           <div>
//             <div className="text-sm font-medium">{label}</div>
//             <div className="text-xs text-muted-foreground">
//               {freq} • Last: {shortDate(last)}
//             </div>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="text-base font-semibold">{inr(amt || 0)}</div>
//           {r.occurrences ? (
//             <div className="text-xs text-muted-foreground">
//               occurrences: {r.occurrences}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------------------------------------------
// // (Optional) Explanatory Legend component — stays minimal
// // ---------------------------------------------
// function Legend() {
//   return (
//     <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
//       <span className="inline-flex items-center gap-1">
//         <AlertTriangle className="w-3 h-3" /> Anomaly
//       </span>
//       <span className="inline-flex items-center gap-1">
//         <Repeat className="w-3 h-3" /> Recurring
//       </span>
//       <span className="inline-flex items-center gap-1">
//         <TrendingUp className="w-3 h-3" /> Forecast
//       </span>
//       <span className="inline-flex items-center gap-1">
//         <Target className="w-3 h-3" /> Goal
//       </span>
//     </div>
//   );
// }

// export default Aiinsights;


"use client"
import { API_BASE } from "@/lib/api"
import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Brain,
  RefreshCw,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Repeat,
  Target,
  Loader2,
  Clock,
  BarChart3,
  Receipt,
  XCircle,
} from "lucide-react"

// =============================================
// CONFIG
// =============================================
const ML_BASE = `${API_BASE}/ml`

// =============================================
// UTILS
// =============================================
const fmt = (n) => Number(n || 0).toLocaleString()
const inr = (n) => `₹${fmt(n)}`

const asDate = (d) => {
  if (!d || d === "N/A") return null
  try {
    return new Date(d)
  } catch {
    return null
  }
}

const shortDate = (d) => {
  const dt = asDate(d)
  return dt ? dt.toLocaleString() : "N/A"
}

const capitalize = (s) => (typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s)

function toast(message, type = "success") {
  const el = document.createElement("div")
  el.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right ${
    type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
  }`
  el.innerHTML = `
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
      </svg>
      <span>${message}</span>
    </div>`
  document.body.appendChild(el)
  setTimeout(() => {
    try {
      document.body.removeChild(el)
    } catch {}
  }, 2200)
}

// A tiny delay helper for UX sequencing
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// =============================================
// MAIN COMPONENT
// =============================================
const Aiinsights = () => {
  // user id
  const [userId, setUserId] = useState("")

  // ---- loading flags
  const [loadingAll, setLoadingAll] = useState(false)
  const [loadingForecast, setLoadingForecast] = useState(false)
  const [loadingAnoms, setLoadingAnoms] = useState(false)
  const [loadingRecurring, setLoadingRecurring] = useState(false)
  const [loadingEta, setLoadingEta] = useState(false)

  // ---- data
  const [forecast, setForecast] = useState(null)
  const [anomsSummary, setAnomsSummary] = useState(null) // {created, anomaly_ids}
  const [recurringSummary, setRecurringSummary] = useState(null) // {created, pattern_ids}
  const [etas, setEtas] = useState([]) // results array

  // Persisted history lists (full detail)
  const [anomsList, setAnomsList] = useState([]) // Array of anomalies with joined transaction
  const [recurringList, setRecurringList] = useState([]) // Array of recurring patterns

  // ---- error states
  const [errForecast, setErrForecast] = useState("")
  const [errAnoms, setErrAnoms] = useState("")
  const [errRecurring, setErrRecurring] = useState("")
  const [errEta, setErrEta] = useState("")

  // ---- timestamps
  const [tForecast, setTForecast] = useState(null)
  const [tAnoms, setTAnoms] = useState(null)
  const [tRecurring, setTRecurring] = useState(null)
  const [tEta, setTEta] = useState(null)

  // Keep a mounted flag to avoid state updates on unmounted
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Load userId from localStorage on mount
  useEffect(() => {
    const id = localStorage.getItem("userId")
    if (id) setUserId(id)
  }, [])

  // ================================
  // API CALLERS
  // ================================
  const fetchForecast = useCallback(async () => {
    if (!userId) {
      // fallback when not logged in
      setForecast({
        predicted_income: 0,
        predicted_expense: 0,
        predicted_balance: 0,
        target_period: "N/A",
        confidence: 0,
        model_version: "v1",
        created_at: null,
      })
      return
    }
    setLoadingForecast(true)
    try {
      const { data } = await axios.get(`${ML_BASE}/predict-expense/${userId}/`)
      if (!mountedRef.current) return
      setForecast(data || null)
      setTForecast(new Date())
    } catch (err) {
      if (!mountedRef.current) return
      setErrForecast(err?.response?.data?.error || err.message || "Failed to fetch forecast")
    } finally {
      if (!mountedRef.current) return
      setLoadingForecast(false)
    }
  }, [userId])

  // fetch full anomaly list (persisted history)
  const fetchAnomaliesList = useCallback(async () => {
    if (!userId) {
      setAnomsList([]) // no anomalies
      return
    }
    try {
      const { data } = await axios.get(`${ML_BASE}/anomalies/users/${userId}/`)
      if (!mountedRef.current) return
      const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
      setAnomsList(list)
    } catch (err) {
      if (!mountedRef.current) return
      setAnomsList([])
    }
  }, [userId])

  // fetch full recurring list (persisted history)
  const fetchRecurringList = useCallback(async () => {
    if (!userId) {
      setEtas([]) // no goals
      return
    }
    try {
      const { data } = await axios.get(`${ML_BASE}/recurring/users/${userId}/`)
      if (!mountedRef.current) return
      const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
      setRecurringList(list)
    } catch (err) {
      if (!mountedRef.current) return
      setRecurringList([])
    }
  }, [userId])

  const runAnomalyDetection = useCallback(async () => {
    if (!userId) return
    setErrAnoms("")
    setLoadingAnoms(true)
    try {
      const { data } = await axios.post(`${ML_BASE}/anomalies/run/${userId}/`)
      if (!mountedRef.current) return
      setAnomsSummary(data || null)
      setTAnoms(new Date())
      toast(`Anomaly scan complete • ${data?.created || 0} new`)
      // IMPORTANT: refresh full list so old + new show together
      await fetchAnomaliesList()
    } catch (err) {
      if (!mountedRef.current) return
      setErrAnoms(err?.response?.data?.error || err.message || "Failed to run anomalies")
      toast("Anomaly detection failed", "error")
    } finally {
      if (!mountedRef.current) return
      setLoadingAnoms(false)
    }
  }, [userId, fetchAnomaliesList])

  const runRecurringDetection = useCallback(async () => {
    if (!userId) return
    setErrRecurring("")
    setLoadingRecurring(true)
    try {
      const { data } = await axios.post(`${ML_BASE}/recurring/run/${userId}/`)
      if (!mountedRef.current) return
      setRecurringSummary(data || null)
      setTRecurring(new Date())
      toast(`Recurring patterns updated • ${data?.created || 0} new`)
      // refresh full list
      await fetchRecurringList()
    } catch (err) {
      if (!mountedRef.current) return
      setErrRecurring(err?.response?.data?.error || err.message || "Failed to run recurring detection")
      toast("Recurring detection failed", "error")
    } finally {
      if (!mountedRef.current) return
      setLoadingRecurring(false)
    }
  }, [userId, fetchRecurringList])

  const fetchGoalEtas = useCallback(async () => {
    if (!userId) return
    setErrEta("")
    setLoadingEta(true)
    try {
      const { data } = await axios.get(`${ML_BASE}/goals/eta/${userId}/`)
      if (!mountedRef.current) return
      const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
      setEtas(list)
      setTEta(new Date())
    } catch (err) {
      if (!mountedRef.current) return
      setErrEta(err?.response?.data?.error || err.message || "Failed to fetch goal ETAs")
    } finally {
      if (!mountedRef.current) return
      setLoadingEta(false)
    }
  }, [userId])

  const runAll = async () => {
    if (!userId) {
      toast("Missing userId in localStorage", "error")
      return
    }
    setLoadingAll(true)
    try {
      // First load the read-only + history lists so old detections are visible.
      await Promise.all([fetchForecast(), fetchGoalEtas(), fetchAnomaliesList(), fetchRecurringList()])
      // Then run mutating ones so new items append to the already shown lists
      await sleep(150) // tiny gap for nicer UX
      await runAnomalyDetection()
      await runRecurringDetection()
      toast("AI Insights refreshed")
    } finally {
      setLoadingAll(false)
    }
  }

  // auto-load read-only + history on userId ready
  useEffect(() => {
    if (!userId) return
    fetchForecast()
    fetchGoalEtas()
    fetchAnomaliesList()
    fetchRecurringList()
  }, [userId, fetchForecast, fetchGoalEtas, fetchAnomaliesList, fetchRecurringList])

  // helpers for Goal cards
  const progressPct = (curr, targ) => {
    const t = Number(targ || 0)
    if (t <= 0) return 0
    const p = (Number(curr || 0) / t) * 100
    return Math.max(0, Math.min(100, p))
  }

  // ================================
  // HEADER
  // ================================
  const HeaderBar = useMemo(
    () => (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 grid place-items-center">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">AI Insights</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Forecasts • Anomalies • Recurring • Goal ETA</p>
        </div>
      </div>
    ),
    [loadingAll],
  )

  // ================================
  // RENDER
  // ================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-4 md:p-6 lg:p-8">
      {HeaderBar}

      <Tabs defaultValue="forecast" className="space-y-4 sm:space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 w-full h-auto p-1">
          <TabsTrigger value="forecast" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Forecast</span>
            <span className="sm:hidden">Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Anomalies</span>
            <span className="sm:hidden">Anomalies</span>
          </TabsTrigger>
          <TabsTrigger value="recurring" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Repeat className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Recurring</span>
            <span className="sm:hidden">Recurring</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Goal ETA</span>
            <span className="sm:hidden">Goals</span>
          </TabsTrigger>
        </TabsList>

        {/* ================= FORECAST ================= */}
        <TabsContent value="forecast">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> Monthly Forecast
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {tForecast && <span className="hidden sm:inline">Updated: {shortDate(tForecast)}</span>}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchForecast}
                  disabled={loadingForecast}
                  className="text-xs sm:text-sm bg-transparent"
                >
                  {loadingForecast ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {errForecast && <ErrorAlert message={errForecast} />}

              {!forecast && !errForecast ? (
                <SkeletonRow label="Loading forecast" />
              ) : (
                forecast && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <StatTile
                      icon={<Wallet className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Predicted Income"
                      value={inr(forecast?.predicted_income || 0)}
                    />
                    <StatTile
                      icon={<AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Predicted Expense"
                      value={inr(forecast?.predicted_expense || 0)}
                    />
                    <StatTile
                      icon={<TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Predicted Balance"
                      value={inr(forecast?.predicted_balance || 0)}
                    />
                  </div>
                )
              )}

              {forecast && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Period: {forecast?.target_period || "—"}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Confidence: {((forecast?.confidence || 0) * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Model: {forecast?.model_version || "v1"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Created: {shortDate(forecast?.created_at)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= ANOMALIES ================= */}
        <TabsContent value="anomalies">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" /> Spending Anomalies
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-muted-foreground">
                {tAnoms && <span className="hidden sm:inline">Last run: {shortDate(tAnoms)}</span>}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={fetchAnomaliesList}
                    disabled={loadingAnoms}
                    className="text-xs bg-transparent"
                  >
                    Refresh list
                  </Button>
                  <Button size="sm" onClick={runAnomalyDetection} disabled={loadingAnoms} className="text-xs">
                    {loadingAnoms ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Running…
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Run detection
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {errAnoms && <ErrorAlert message={errAnoms} />}

              {anomsSummary && (
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant={anomsSummary.created > 0 ? "default" : "secondary"} className="text-xs">
                    {anomsSummary.created || 0} new anomalies
                  </Badge>
                </div>
              )}

              {!anomsList || anomsList.length === 0 ? (
                <EmptyState
                  icon={<AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="No anomalies yet"
                  subtitle="Click 'Run detection' to scan your recent expenses."
                  actionLabel="Run detection"
                  onAction={runAnomalyDetection}
                  loading={loadingAnoms}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {anomsList.map((a, idx) => (
                    <AnomalyCard key={a.id || a._id || idx} a={a} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= RECURRING ================= */}
        <TabsContent value="recurring">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Repeat className="w-4 h-4 sm:w-5 sm:h-5" /> Recurring Patterns
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-muted-foreground">
                {tRecurring && <span className="hidden sm:inline">Last run: {shortDate(tRecurring)}</span>}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={fetchRecurringList}
                    disabled={loadingRecurring}
                    className="text-xs bg-transparent"
                  >
                    Refresh list
                  </Button>
                  <Button size="sm" onClick={runRecurringDetection} disabled={loadingRecurring} className="text-xs">
                    {loadingRecurring ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Running…
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Run detection
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {errRecurring && <ErrorAlert message={errRecurring} />}

              {recurringSummary && (
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant={recurringSummary.created > 0 ? "default" : "secondary"} className="text-xs">
                    {recurringSummary.created || 0} new patterns
                  </Badge>
                </div>
              )}

              {!recurringList || recurringList.length === 0 ? (
                <EmptyState
                  icon={<Repeat className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="No recurring patterns detected yet"
                  subtitle="Run the detector to discover weekly or monthly patterns."
                  actionLabel="Run detection"
                  onAction={runRecurringDetection}
                  loading={loadingRecurring}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {recurringList.map((r, idx) => (
                    <RecurringCard key={r.id || r._id || idx} r={r} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= GOAL ETA ================= */}
        <TabsContent value="goals">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" /> Goal Completion ETA
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {tEta && <span className="hidden sm:inline">Updated: {shortDate(tEta)}</span>}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchGoalEtas}
                  disabled={loadingEta}
                  className="text-xs bg-transparent"
                >
                  {loadingEta ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {errEta && <ErrorAlert message={errEta} />}

              {(!etas || etas.length === 0) && !errEta ? (
                <SkeletonRow label="No goals or not enough savings data" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {etas.map((g, idx) => (
                    <GoalCard key={g.goal_id || idx} g={g} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =============================================
// SUB-COMPONENTS & UI HELPERS
// =============================================
function StatTile({ icon, label, value }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-white/70 backdrop-blur border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</div>
          <div className="text-base sm:text-lg lg:text-xl font-semibold truncate">{value}</div>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 grid place-items-center text-white flex-shrink-0 ml-2">
          {icon}
        </div>
      </div>
    </div>
  )
}

function ErrorAlert({ message }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
      <XCircle className="w-4 h-4" />
      <span className="truncate">{message}</span>
    </div>
  )
}

function SkeletonRow({ label = "Loading…" }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4">
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded mt-2" />
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function EmptyState({ icon, title, subtitle, actionLabel, onAction, loading }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 border border-dashed rounded-xl bg-white/60">
      <div className="w-10 h-10 rounded-full bg-gray-100 grid place-items-center text-gray-700">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
      {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
      {actionLabel ? (
        <Button size="sm" onClick={onAction} disabled={loading} className="mt-1">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

// ---------------------------------------------
// Goal Card
// ---------------------------------------------
function GoalCard({ g }) {
  const pct = Math.round((Number(g.current_saved || 0) / Number(g.target_amount || 1)) * 100 || 0)
  const eta = g.predicted_completion_date

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Goal</div>
          <div className="text-sm sm:text-base lg:text-lg font-semibold truncate">{g.title || "Untitled Goal"}</div>
        </div>
        <Badge variant={eta === "N/A" ? "secondary" : "default"} className="text-xs flex-shrink-0">
          {eta === "N/A" ? "No ETA" : shortDate(eta)}
        </Badge>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
          <span>Saved: {inr(g.current_saved || 0)}</span>
          <span>Target: {inr(g.target_amount || 0)}</span>
        </div>
        <Progress value={pct} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>Progress: {pct}%</span>
          <span className="mx-1">•</span>
          <span className="truncate">Monthly net used: {inr(g.assumptions?.monthly_net_saving || 0)}</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------
// Anomaly Card (with joined transaction details)
// ---------------------------------------------
function AnomalyCard({ a }) {
  const tx = a.transaction || a.tx || {}
  const amount = tx.amount ?? a.amount
  const category = tx.category ?? a.category
  const date = tx.date ?? a.flagged_at
  const merchant = tx.merchant || tx.description || a.merchant || a.description || null
  const account = tx.account_name || tx.account || a.account_name || null
  const reason = a.flag_reason || a.reason || "High deviation"
  const score = a.anomaly_score ?? a.score ?? null

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-100 text-red-700 grid place-items-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium truncate">{capitalize(category) || "expense"}</div>
            <div className="text-xs text-muted-foreground">{shortDate(date)}</div>
            {merchant ? (
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Receipt className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{merchant}</span>
              </div>
            ) : null}
            {account ? (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Wallet className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{account}</span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm sm:text-base font-semibold">{inr(amount || 0)}</div>
          {score != null && <div className="text-xs text-muted-foreground">score: {Number(score).toFixed(2)}</div>}
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{reason}</div>
    </div>
  )
}

// ---------------------------------------------
// Recurring Card
// ---------------------------------------------
function RecurringCard({ r }) {
  const label = r.pattern || `${r.category || "expense"}`
  const amt = r.average_amount ?? r.avg_amount ?? r.amount
  const freq = r.frequency || r.freq || "Irregular"
  const last = r.last_detected || r.detected_on

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-100 text-indigo-700 grid place-items-center flex-shrink-0">
            <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium truncate">{label}</div>
            <div className="text-xs text-muted-foreground">
              {freq} • Last: {shortDate(last)}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm sm:text-base font-semibold">{inr(amt || 0)}</div>
          {r.occurrences ? <div className="text-xs text-muted-foreground">occurrences: {r.occurrences}</div> : null}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------
// (Optional) Explanatory Legend component — stays minimal
// ---------------------------------------------
function Legend() {
  return (
    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Anomaly
      </span>
      <span className="inline-flex items-center gap-1">
        <Repeat className="w-3 h-3" /> Recurring
      </span>
      <span className="inline-flex items-center gap-1">
        <TrendingUp className="w-3 h-3" /> Forecast
      </span>
      <span className="inline-flex items-center gap-1">
        <Target className="w-3 h-3" /> Goal
      </span>
    </div>
  )
}

export default Aiinsights
