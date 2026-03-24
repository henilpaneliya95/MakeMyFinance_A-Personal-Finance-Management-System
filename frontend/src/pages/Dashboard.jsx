// // // import { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import { Bell, Menu, TrendingUp, TrendingDown } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Sidebar } from "@/components/Sidebar"; // Corrected import path

// // // const Dashboard = ({ children }) => {
// // //   // Added children prop
// // //   const [sidebarOpen, setSidebarOpen] = useState(false);
// // //   const [account, setAccount] = useState(null);
// // //   const [transactions, setTransactions] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const accountId = localStorage.getItem("selectedAccountId");
// // //         const userId = localStorage.getItem("userId");
// // //         console.log("a", accountId);
// // //         console.log("u", userId);

// // //         // if (!userId) {
// // //         //   navigate("/login");
// // //         //   return;
// // //         // }

// // //         if (accountId) {
// // //           const accRes = await axios.get(
// // //             `http://localhost:8000/api/accounts/${accountId}/`
// // //           );
// // //           setAccount(accRes.data);

// // //           const txnRes = await axios.get(
// // //             `http://localhost:8000/api/transactions/accounts/${accountId}`
// // //           );
// // //           console.log(txnRes.data);

// // //           // Sort by date (latest first)
// // //           const sortedTxns = txnRes.data.sort(
// // //             (a, b) => new Date(b.date) - new Date(a.date)
// // //           );

// // //           // Take only the top 5 recent transactions
// // //           const recentTxns = sortedTxns.slice(0, 5);

// // //           // Set into state
// // //           setTransactions(recentTxns);

// // //           // ❌ Removed PUT request that was overwriting balance to zero
// // //         }
// // //       } catch (error) {
// // //         console.error("❌ Failed to load account data", error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, [navigate]); // Added navigate to dependency array

// // //   const getTotals = (txns, account) => {
// // //     let income = 0;
// // //     let expenses = 0;

// // //     txns.forEach((txn) => {
// // //       const amount = Number.parseFloat(txn.amount) || 0;
// // //       if (txn.type === "income") {
// // //         income += amount;
// // //       } else if (txn.type === "expense") {
// // //         expenses += amount;
// // //       }
// // //     });

// // //     // ✅ Use total_balance as fallback if initial_balance not available
// // //     const initial =
// // //       Number.parseFloat(account?.initial_balance ?? account?.total_balance) ||
// // //       0;
// // //     const balance = initial + income - expenses;
// // //     const savingsRate =
// // //       income > 0 ? (((income - expenses) / income) * 100).toFixed(2) : 0;

// // //     return {
// // //       balance: Number.parseFloat(balance.toFixed(2)),
// // //       income: Number.parseFloat(income.toFixed(2)),
// // //       expenses: Number.parseFloat(expenses.toFixed(2)),
// // //       savingsRate: Number.parseFloat(savingsRate),
// // //     };
// // //   };

// // //   const totals = getTotals(transactions, account);

// // //   const handleLogout = () => {
// // //     localStorage.clear();
// // //     navigate("/login");
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //         <div className="text-center">
// // //           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// // //           <p className="text-gray-600">Loading your dashboard...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
// // //       <Sidebar
// // //         sidebarOpen={sidebarOpen}
// // //         setSidebarOpen={setSidebarOpen}
// // //         handleLogout={handleLogout}
// // //       />

// // //       {/* Main Content */}
// // //       <main className="flex-1 overflow-y-auto">
// // //         {/* Top Bar */}
// // //         <header className="bg-white border-b border-gray-200 px-6 py-4">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex items-center space-x-4">
// // //               <Button
// // //                 variant="ghost"
// // //                 size="sm"
// // //                 onClick={() => setSidebarOpen(true)}
// // //                 className="lg:hidden"
// // //               >
// // //                 <Menu className="w-5 h-5" />
// // //               </Button>
// // //               <div>
// // //                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// // //                   Financial Dashboard
// // //                 </h1>
// // //                 <p className="text-sm text-gray-500">
// // //                   {new Date().toLocaleDateString("en-US", {
// // //                     month: "long",
// // //                     year: "numeric",
// // //                   })}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </header>

// // //         {/* Dashboard Content or children */}
// // //         <div className="p-6 space-y-8">
// // //           {children ? (
// // //             children
// // //           ) : (
// // //             <>
// // //               {/* Quick Actions */}

// // //               {/* Stats Cards */}
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// // //                 <StatCard
// // //                   title="Total Balance"
// // //                   value={`₹${totals.balance.toLocaleString()}`}
// // //                   trend={totals.balance >= 0 ? "up" : "down"}
// // //                   percent="100%"
// // //                   color="blue"
// // //                 />
// // //                 <StatCard
// // //                   title="Total Income"
// // //                   value={`₹${totals.income.toLocaleString()}`}
// // //                   trend="up"
// // //                   percent="100%"
// // //                   color="green"
// // //                 />
// // //                 <StatCard
// // //                   title="Total Expenses"
// // //                   value={`₹${totals.expenses.toLocaleString()}`}
// // //                   trend="down"
// // //                   percent="100%"
// // //                   color="red"
// // //                 />
// // //                 <StatCard
// // //                   title="Savings Rate"
// // //                   value={`${totals.savingsRate}%`}
// // //                   trend={totals.savingsRate > 0 ? "up" : "down"}
// // //                   percent="100%"
// // //                   color="purple"
// // //                 />
// // //               </div>

// // //               {/* Financial Alerts */}
// // //               <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
// // //                 <CardHeader>
// // //                   <CardTitle className="text-lg font-semibold text-orange-800 flex items-center">
// // //                     <Bell className="w-5 h-5 mr-2" />
// // //                     Financial Alerts
// // //                   </CardTitle>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="space-y-3">
// // //                     <div className="flex items-start gap-3 p-3 bg-white rounded-lg border-l-4 border-red-500">
// // //                       <span className="text-red-500 text-lg">💸</span>
// // //                       <div>
// // //                         <p className="font-medium text-gray-800">
// // //                           High spending detected
// // //                         </p>
// // //                         <p className="text-sm text-red-600">
// // //                           Travel expenses: ₹6,000
// // //                         </p>
// // //                       </div>
// // //                     </div>
// // //                     <div className="flex items-start gap-3 p-3 bg-white rounded-lg border-l-4 border-yellow-400">
// // //                       <span className="text-yellow-500 text-lg">⚠️</span>
// // //                       <div>
// // //                         <p className="font-medium text-gray-800">
// // //                           Low income recorded
// // //                         </p>
// // //                         <p className="text-sm text-yellow-600">
// // //                           Consider adding income sources
// // //                         </p>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>

// // //               {/* Charts and Recent Activity */}
// // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //                 <Card className="border-0 shadow-lg">
// // //                   <CardHeader>
// // //                     <CardTitle className="text-xl font-semibold">
// // //                       Spending Overview
// // //                     </CardTitle>
// // //                   </CardHeader>
// // //                   <CardContent>
// // //                     <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
// // //                       <p className="text-gray-500">
// // //                         Interactive Chart Coming Soon
// // //                       </p>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>

// // //                 <Card className="border-0 shadow-lg">
// // //                   <CardHeader>
// // //                     <CardTitle className="text-xl font-semibold">
// // //                       Recent Transactions
// // //                     </CardTitle>
// // //                   </CardHeader>
// // //                   <CardContent>
// // //                     <TransactionList data={transactions} />
// // //                   </CardContent>
// // //                 </Card>
// // //               </div>
// // //             </>
// // //           )}
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // const StatCard = ({ title, value, trend, percent, color }) => {
// // //   const Icon = trend === "up" ? TrendingUp : TrendingDown;
// // //   const colorClasses = {
// // //     blue: "from-blue-500 to-blue-600",
// // //     green: "from-green-500 to-green-600",
// // //     red: "from-red-500 to-red-600",
// // //     purple: "from-purple-500 to-purple-600",
// // //   };

// // //   return (
// // //     <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// // //       <CardContent className="p-6">
// // //         <div className="flex items-center justify-between mb-2">
// // //           <p className="text-sm text-gray-500 font-medium">{title}</p>
// // //           <div
// // //             className={`w-10 h-10 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}
// // //           >
// // //             <Icon className="w-5 h-5 text-white" />
// // //           </div>
// // //         </div>
// // //         <div className="flex items-center justify-between">
// // //           <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
// // //           <div className="flex items-center text-sm text-gray-500">
// // //             <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
// // //               {percent}
// // //             </span>
// // //           </div>
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // const TransactionList = ({ data }) => {
// // //   return (
// // //     <div className="space-y-3 max-h-64 overflow-y-auto">
// // //       {data.slice(0, 5).map((item, index) => (
// // //         <div
// // //           key={index}
// // //           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
// // //         >
// // //           <div className="flex items-center space-x-3">
// // //             <div
// // //               className={`w-10 h-10 rounded-full flex items-center justify-center ${
// // //                 item.type === "income"
// // //                   ? "bg-green-100 text-green-600"
// // //                   : "bg-red-100 text-red-600"
// // //               }`}
// // //             >
// // //               {item.type === "income" ? (
// // //                 <TrendingUp className="w-5 h-5" />
// // //               ) : (
// // //                 <TrendingDown className="w-5 h-5" />
// // //               )}
// // //             </div>
// // //             <div>
// // //               <p className="font-medium text-gray-900">{item.category}</p>
// // //               <p className="text-sm text-gray-500">
// // //                 {item.description || "No description"}
// // //               </p>
// // //               <p className="text-xs text-gray-400">
// // //                 {new Date(item.date).toLocaleDateString()}
// // //               </p>
// // //             </div>
// // //           </div>
// // //           <span
// // //             className={`font-semibold ${
// // //               item.type === "income" ? "text-green-600" : "text-red-600"
// // //             }`}
// // //           >
// // //             {item.type === "income" ? "+" : "-"}₹
// // //             {Number(item.amount).toLocaleString()}
// // //           </span>
// // //         </div>
// // //       ))}
// // //       {data.length === 0 && (
// // //         <div className="text-center py-8 text-gray-500">
// // //           <p>No transactions yet</p>
// // //           <p className="text-sm">Start by adding your first transaction</p>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { Bell, Menu, TrendingUp, TrendingDown } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Sidebar } from "@/components/Sidebar";
// // import { Calendar } from "@/components/ui/calendar";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";

// // const Dashboard = ({ children }) => {
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const [account, setAccount] = useState(null);
// //   const [transactions, setTransactions] = useState([]);
// //   const [alerts, setAlerts] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const accountId = localStorage.getItem("selectedAccountId");
// //         const userId = localStorage.getItem("userId");

// //         if (accountId) {
// //           const accRes = await axios.get(
// //             `http://localhost:8000/api/accounts/${accountId}/`
// //           );
// //           setAccount(accRes.data);

// //           const txnRes = await axios.get(
// //             `http://localhost:8000/api/transactions/accounts/${accountId}`
// //           );
// //           const sortedTxns = txnRes.data.sort(
// //             (a, b) => new Date(b.date) - new Date(a.date)
// //           );
// //           const recentTxns = sortedTxns.slice(0, 5);
// //           setTransactions(recentTxns);
// //         }

// //         if (userId) {
// //           const alertsRes = await axios.get(
// //             `http://localhost:8000/api/ml/anomalies/users/${userId}/`
// //           );
// //           setAlerts(alertsRes.data || []);
// //         }
// //       } catch (error) {
// //         console.error("❌ Failed to load dashboard data", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [navigate]);

// //   const getTotals = (txns, account) => {
// //     if (!localStorage.getItem("userId")) {
// //       return { balance: 0, income: 0, expenses: 0, savingsRate: 0 };
// //     }

// //     let income = 0;
// //     let expenses = 0;
// //     txns.forEach((txn) => {
// //       const amount = Number.parseFloat(txn.amount) || 0;
// //       if (txn.type === "income") income += amount;
// //       else if (txn.type === "expense") expenses += amount;
// //     });

// //     const initial =
// //       Number.parseFloat(account?.initial_balance ?? account?.total_balance) || 0;
// //     const balance = initial + income - expenses;
// //     const savingsRate =
// //       income > 0 ? (((income - expenses) / income) * 100).toFixed(2) : 0;

// //     return {
// //       balance: Number.parseFloat(balance.toFixed(2)),
// //       income: Number.parseFloat(income.toFixed(2)),
// //       expenses: Number.parseFloat(expenses.toFixed(2)),
// //       savingsRate: Number.parseFloat(savingsRate),
// //     };
// //   };

// //   const totals = getTotals(transactions, account);

// //   const handleLogout = () => {
// //     localStorage.clear();
// //     navigate("/");
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading your dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
// //       <Sidebar
// //         sidebarOpen={sidebarOpen}
// //         setSidebarOpen={setSidebarOpen}
// //         handleLogout={handleLogout}
// //       />

// //       <main className="flex-1 overflow-y-auto">
// //         <header className="bg-white border-b border-gray-200 px-6 py-4">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center space-x-4">
// //               <Button
// //                 variant="ghost"
// //                 size="sm"
// //                 onClick={() => setSidebarOpen(true)}
// //                 className="lg:hidden"
// //               >
// //                 <Menu className="w-5 h-5" />
// //               </Button>
// //               <div>
// //                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //                   Financial Dashboard
// //                 </h1>
// //                 <p className="text-sm text-gray-500">
// //                   {new Date().toLocaleDateString("en-US", {
// //                     month: "long",
// //                     year: "numeric",
// //                   })}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         <div className="p-6 space-y-8">
// //           {children ? (
// //             children
// //           ) : (
// //             <>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //                 <StatCard
// //                   title="Total Balance"
// //                   value={`₹${totals.balance.toLocaleString()}`}
// //                   trend={totals.balance >= 0 ? "up" : "down"}
// //                   percent="100%"
// //                   color="blue"
// //                 />
// //                 <StatCard
// //                   title="Total Income"
// //                   value={`₹${totals.income.toLocaleString()}`}
// //                   trend="up"
// //                   percent="100%"
// //                   color="green"
// //                 />
// //                 <StatCard
// //                   title="Total Expenses"
// //                   value={`₹${totals.expenses.toLocaleString()}`}
// //                   trend="down"
// //                   percent="100%"
// //                   color="red"
// //                 />
// //                 <StatCard
// //                   title="Savings Rate"
// //                   value={`${totals.savingsRate}%`}
// //                   trend={totals.savingsRate > 0 ? "up" : "down"}
// //                   percent="100%"
// //                   color="purple"
// //                 />
// //               </div>

// //               {/* Financial Alerts - show only if alerts exist */}
// //               {alerts.length > 0 && (
// //                 <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
// //                   <CardHeader>
// //                     <CardTitle className="text-lg font-semibold text-orange-800 flex items-center">
// //                       <Bell className="w-5 h-5 mr-2" />
// //                       Financial Alerts
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="space-y-3">
// //                       {alerts.map((alert, idx) => (
// //                         <div
// //                           key={idx}
// //                           className="flex items-start gap-3 p-3 bg-white rounded-lg border-l-4 border-red-500"
// //                         >
// //                           <span className="text-red-500 text-lg">⚠️</span>
// //                           <div className="flex-1">
// //                             <p className="font-medium text-gray-800">
// //                               {alert.description || "Unusual transaction detected"}
// //                             </p>
// //                           </div>
// //                           <Dialog>
// //                             <DialogTrigger asChild>
// //                               <Button size="sm" variant="outline">View Details</Button>
// //                             </DialogTrigger>
// //                             <DialogContent className="max-w-md">
// //                               <DialogHeader>
// //                                 <DialogTitle>Alert Details</DialogTitle>
// //                               </DialogHeader>
// //                               <div className="space-y-2 text-sm text-gray-700">
// //                                 <p><strong>Type:</strong> {alert.transaction?.type}</p>
// //                                 <p><strong>Category:</strong> {alert.transaction?.category}</p>
// //                                 <p><strong>Description:</strong> {alert.transaction?.description}</p>
// //                                 <p><strong>Amount:</strong> ₹{Number(alert.transaction?.amount).toLocaleString()}</p>
// //                                 <p><strong>Date:</strong> {new Date(alert.transaction?.date).toLocaleString()}</p>
// //                                 {alert.transaction?.is_recurring && (
// //                                   <p><strong>Recurring:</strong> Yes</p>
// //                                 )}
// //                               </div>
// //                             </DialogContent>
// //                           </Dialog>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               )}

// //               {/* Charts and Recent Activity */}
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <Card className="border-0 shadow-lg">
// //                   <CardHeader>
// //                     <CardTitle className="text-xl font-semibold">
// //                       Spending Overview
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <Calendar
// //                       mode="multiple"
// //                       selected={transactions.map((t) => new Date(t.date))}
// //                       modifiers={{
// //                         hasTransaction: transactions.map((t) => new Date(t.date)),
// //                       }}
// //                       modifiersClassNames={{
// //                         hasTransaction: "bg-blue-500 text-white rounded-full",
// //                       }}
// //                       className="rounded-md border shadow-md"
// //                     />
// //                   </CardContent>
// //                 </Card>

// //                 <Card className="border-0 shadow-lg">
// //                   <CardHeader>
// //                     <CardTitle className="text-xl font-semibold">
// //                       Recent Transactions
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <TransactionList data={transactions} />
// //                   </CardContent>
// //                 </Card>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // const StatCard = ({ title, value, trend, percent, color }) => {
// //   const Icon = trend === "up" ? TrendingUp : TrendingDown;
// //   const colorClasses = {
// //     blue: "from-blue-500 to-blue-600",
// //     green: "from-green-500 to-green-600",
// //     red: "from-red-500 to-red-600",
// //     purple: "from-purple-500 to-purple-600",
// //   };

// //   return (
// //     <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //       <CardContent className="p-6">
// //         <div className="flex items-center justify-between mb-2">
// //           <p className="text-sm text-gray-500 font-medium">{title}</p>
// //           <div
// //             className={`w-10 h-10 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}
// //           >
// //             <Icon className="w-5 h-5 text-white" />
// //           </div>
// //         </div>
// //         <div className="flex items-center justify-between">
// //           <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
// //           <div className="flex items-center text-sm text-gray-500">
// //             <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
// //               {percent}
// //             </span>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // const TransactionList = ({ data }) => {
// //   return (
// //     <div className="space-y-3 max-h-64 overflow-y-auto">
// //       {data.slice(0, 5).map((item, index) => (
// //         <div
// //           key={index}
// //           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
// //         >
// //           <div className="flex items-center space-x-3">
// //             <div
// //               className={`w-10 h-10 rounded-full flex items-center justify-center ${
// //                 item.type === "income"
// //                   ? "bg-green-100 text-green-600"
// //                   : "bg-red-100 text-red-600"
// //               }`}
// //             >
// //               {item.type === "income" ? (
// //                 <TrendingUp className="w-5 h-5" />
// //               ) : (
// //                 <TrendingDown className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <p className="font-medium text-gray-900">{item.category}</p>
// //               <p className="text-sm text-gray-500">
// //                 {item.description || "No description"}
// //               </p>
// //               <p className="text-xs text-gray-400">
// //                 {new Date(item.date).toLocaleDateString()}
// //               </p>
// //             </div>
// //           </div>
// //           <span
// //             className={`font-semibold ${
// //               item.type === "income" ? "text-green-600" : "text-red-600"
// //             }`}
// //           >
// //             {item.type === "income" ? "+" : "-"}₹
// //             {Number(item.amount).toLocaleString()}
// //           </span>
// //         </div>
// //       ))}
// //       {data.length === 0 && (
// //         <div className="text-center py-8 text-gray-500">
// //           <p>No transactions yet</p>
// //           <p className="text-sm">Start by adding your first transaction</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Dashboard;

// // "use client"

// // import { useState, useEffect } from "react"
// // import { useNavigate } from "react-router-dom"
// // import axios from "axios"
// // import { Bell, Menu, TrendingUp, TrendingDown, CalendarIcon, AlertTriangle, CheckCircle, Info } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Sidebar } from "@/components/Sidebar"
// // import { Calendar } from "@/components/ui/calendar"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// // import { Badge } from "@/components/ui/badge"

// // const Dashboard = ({ children }) => {
// //   const [sidebarOpen, setSidebarOpen] = useState(false)
// //   const [account, setAccount] = useState(null)
// //   const [transactions, setTransactions] = useState([])
// //   const [alerts, setAlerts] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [selectedDate, setSelectedDate] = useState(new Date())

// //   const navigate = useNavigate()

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const accountId = localStorage.getItem("selectedAccountId")
// //         const userId = localStorage.getItem("userId")

// //         if (accountId) {
// //           const accRes = await axios.get(`http://localhost:8000/api/accounts/${accountId}/`)
// //           setAccount(accRes.data)

// //           const txnRes = await axios.get(`http://localhost:8000/api/transactions/accounts/${accountId}`)
// //           const sortedTxns = txnRes.data.sort((a, b) => new Date(b.date) - new Date(a.date))
// //           const recentTxns = sortedTxns.slice(0, 5)
// //           setTransactions(recentTxns)
// //         }

// //         if (userId) {
// //           const alertsRes = await axios.get(`http://localhost:8000/api/ml/anomalies/users/${userId}/`)
// //           setAlerts(alertsRes.data || [])
// //         }
// //       } catch (error) {
// //         console.error("❌ Failed to load dashboard data", error)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchData()
// //   }, [navigate])

// //   const getTotals = (txns, account) => {
// //     if (!localStorage.getItem("userId")) {
// //       return { balance: 0, income: 0, expenses: 0, savingsRate: 0 }
// //     }

// //     let income = 0
// //     let expenses = 0
// //     txns.forEach((txn) => {
// //       const amount = Number.parseFloat(txn.amount) || 0
// //       if (txn.type === "income") income += amount
// //       else if (txn.type === "expense") expenses += amount
// //     })

// //     const initial = Number.parseFloat(account?.initial_balance ?? account?.total_balance) || 0
// //     const balance = initial + income - expenses
// //     const savingsRate = income > 0 ? (((income - expenses) / income) * 100).toFixed(2) : 0

// //     return {
// //       balance: Number.parseFloat(balance.toFixed(2)),
// //       income: Number.parseFloat(income.toFixed(2)),
// //       expenses: Number.parseFloat(expenses.toFixed(2)),
// //       savingsRate: Number.parseFloat(savingsRate),
// //     }
// //   }

// //   const totals = getTotals(transactions, account)

// //   const handleLogout = () => {
// //     localStorage.clear()
// //     navigate("/")
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-background flex items-center justify-center">
// //         <div className="text-center space-y-4">
// //           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
// //           <div className="space-y-2">
// //             <h3 className="text-lg font-semibold text-foreground">Loading Dashboard</h3>
// //             <p className="text-muted-foreground">Preparing your financial overview...</p>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="flex h-screen w-screen overflow-hidden bg-background">
// //       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />

// //       <main className="flex-1 overflow-y-auto">
// //         <header className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30 backdrop-blur-sm bg-card/95">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center space-x-3 sm:space-x-4">
// //               <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
// //                 <Menu className="w-5 h-5" />
// //               </Button>
// //               <div>
// //                 <h1 className="text-xl sm:text-2xl font-bold gradient-text">Financial Dashboard</h1>
// //                 <p className="text-xs sm:text-sm text-muted-foreground">
// //                   {new Date().toLocaleDateString("en-US", {
// //                     weekday: "long",
// //                     month: "long",
// //                     day: "numeric",
// //                     year: "numeric",
// //                   })}
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-2">
// //               <Badge variant="secondary" className="hidden sm:flex">
// //                 {localStorage.getItem("username") || "User"}
// //               </Badge>
// //             </div>
// //           </div>
// //         </header>

// //         <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
// //           {children ? (
// //             children
// //           ) : (
// //             <>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
// //                 <StatCard
// //                   title="Total Balance"
// //                   value={`₹${totals.balance.toLocaleString()}`}
// //                   trend={totals.balance >= 0 ? "up" : "down"}
// //                   percent="100%"
// //                   color="blue"
// //                 />
// //                 <StatCard
// //                   title="Total Income"
// //                   value={`₹${totals.income.toLocaleString()}`}
// //                   trend="up"
// //                   percent="100%"
// //                   color="green"
// //                 />
// //                 <StatCard
// //                   title="Total Expenses"
// //                   value={`₹${totals.expenses.toLocaleString()}`}
// //                   trend="down"
// //                   percent="100%"
// //                   color="red"
// //                 />
// //                 <StatCard
// //                   title="Savings Rate"
// //                   value={`${totals.savingsRate}%`}
// //                   trend={totals.savingsRate > 0 ? "up" : "down"}
// //                   percent="100%"
// //                   color="purple"
// //                 />
// //               </div>

// //               {alerts.length > 0 && (
// //                 <Card className="border-0 shadow-lg bg-gradient-to-r from-warning/10 to-destructive/10 border-l-4 border-l-warning">
// //                   <CardHeader className="pb-3">
// //                     <CardTitle className="text-lg font-semibold text-warning-foreground flex items-center gap-2">
// //                       <Bell className="w-5 h-5" />
// //                       Financial Alerts
// //                       <Badge variant="destructive" className="ml-auto">
// //                         {alerts.length}
// //                       </Badge>
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="space-y-3">
// //                       {alerts.slice(0, 3).map((alert, idx) => (
// //                         <AlertCard key={idx} alert={alert} />
// //                       ))}
// //                       {alerts.length > 3 && (
// //                         <div className="text-center pt-2">
// //                           <Button variant="outline" size="sm">
// //                             View All {alerts.length} Alerts
// //                           </Button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               )}

// //               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
// //                 <Card className="border-0 shadow-lg">
// //                   <CardHeader className="pb-4">
// //                     <CardTitle className="text-xl font-semibold flex items-center gap-2">
// //                       <CalendarIcon className="w-5 h-5" />
// //                       Transaction Calendar
// //                     </CardTitle>
// //                     <p className="text-sm text-muted-foreground">Days with transactions are highlighted</p>
// //                   </CardHeader>
// //                   <CardContent className="p-4">
// //                     <div className="flex justify-center">
// //                       <Calendar
// //                         mode="single"
// //                         selected={selectedDate}
// //                         onSelect={setSelectedDate}
// //                         modifiers={{
// //                           hasTransaction: transactions.map((t) => new Date(t.date)),
// //                         }}
// //                         modifiersClassNames={{
// //                           hasTransaction: "bg-primary text-primary-foreground font-semibold rounded-full",
// //                         }}
// //                         className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
// //                         classNames={{
// //                           months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
// //                           month: "space-y-4",
// //                           caption: "flex justify-center pt-1 relative items-center",
// //                           caption_label: "text-sm font-medium",
// //                           nav: "space-x-1 flex items-center",
// //                           nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
// //                           nav_button_previous: "absolute left-1",
// //                           nav_button_next: "absolute right-1",
// //                           table: "w-full border-collapse space-y-1",
// //                           head_row: "flex",
// //                           head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
// //                           row: "flex w-full mt-2",
// //                           cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
// //                           day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
// //                           day_selected:
// //                             "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
// //                           day_today: "bg-accent text-accent-foreground font-semibold",
// //                           day_outside: "text-muted-foreground opacity-50",
// //                           day_disabled: "text-muted-foreground opacity-50",
// //                           day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
// //                           day_hidden: "invisible",
// //                         }}
// //                       />
// //                     </div>
// //                     {selectedDate && (
// //                       <div className="mt-4 p-3 bg-muted rounded-lg">
// //                         <p className="text-sm font-medium">
// //                           {selectedDate.toLocaleDateString("en-US", {
// //                             weekday: "long",
// //                             month: "long",
// //                             day: "numeric",
// //                           })}
// //                         </p>
// //                         <p className="text-xs text-muted-foreground">
// //                           {
// //                             transactions.filter((t) => new Date(t.date).toDateString() === selectedDate.toDateString())
// //                               .length
// //                           }{" "}
// //                           transaction(s)
// //                         </p>
// //                       </div>
// //                     )}
// //                   </CardContent>
// //                 </Card>

// //                 <Card className="border-0 shadow-lg">
// //                   <CardHeader className="pb-4">
// //                     <CardTitle className="text-xl font-semibold flex items-center justify-between">
// //                       Recent Transactions
// //                       <Badge variant="secondary">{transactions.length}</Badge>
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <TransactionList data={transactions} />
// //                   </CardContent>
// //                 </Card>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }

// // const AlertCard = ({ alert }) => {
// //   const getAlertIcon = (type) => {
// //     switch (type) {
// //       case "warning":
// //         return <AlertTriangle className="w-4 h-4" />
// //       case "success":
// //         return <CheckCircle className="w-4 h-4" />
// //       default:
// //         return <Info className="w-4 h-4" />
// //     }
// //   }

// //   const getAlertColor = (type) => {
// //     switch (type) {
// //       case "warning":
// //         return "border-warning bg-warning/10 text-warning-foreground"
// //       case "success":
// //         return "border-success bg-success/10 text-success-foreground"
// //       default:
// //         return "border-primary bg-primary/10 text-primary-foreground"
// //     }
// //   }

// //   return (
// //     <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${getAlertColor(alert.type || "info")} bg-card`}>
// //       <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
// //       <div className="flex-1 min-w-0">
// //         <p className="font-medium text-card-foreground">{alert.description || "Unusual transaction detected"}</p>
// //         {alert.transaction && (
// //           <p className="text-sm text-muted-foreground mt-1">
// //             {alert.transaction.category} • ₹{Number(alert.transaction.amount).toLocaleString()}
// //           </p>
// //         )}
// //       </div>
// //       <Dialog>
// //         <DialogTrigger asChild>
// //           <Button size="sm" variant="outline" className="flex-shrink-0 bg-transparent">
// //             Details
// //           </Button>
// //         </DialogTrigger>
// //         <DialogContent className="max-w-md">
// //           <DialogHeader>
// //             <DialogTitle className="flex items-center gap-2">
// //               {getAlertIcon(alert.type)}
// //               Alert Details
// //             </DialogTitle>
// //           </DialogHeader>
// //           <div className="space-y-4">
// //             <div className="p-4 bg-muted rounded-lg">
// //               <p className="font-medium text-sm">{alert.description || "Unusual transaction detected"}</p>
// //             </div>
// //             {alert.transaction && (
// //               <div className="space-y-3">
// //                 <h4 className="font-semibold text-sm">Transaction Information</h4>
// //                 <div className="grid grid-cols-2 gap-3 text-sm">
// //                   <div>
// //                     <p className="text-muted-foreground">Type</p>
// //                     <p className="font-medium capitalize">{alert.transaction.type}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-muted-foreground">Amount</p>
// //                     <p className="font-medium">₹{Number(alert.transaction.amount).toLocaleString()}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-muted-foreground">Category</p>
// //                     <p className="font-medium">{alert.transaction.category}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-muted-foreground">Date</p>
// //                     <p className="font-medium">{new Date(alert.transaction.date).toLocaleDateString()}</p>
// //                   </div>
// //                 </div>
// //                 {alert.transaction.description && (
// //                   <div>
// //                     <p className="text-muted-foreground text-sm">Description</p>
// //                     <p className="font-medium text-sm">{alert.transaction.description}</p>
// //                   </div>
// //                 )}
// //                 {alert.transaction.is_recurring && (
// //                   <Badge variant="secondary" className="w-fit">
// //                     Recurring Transaction
// //                   </Badge>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   )
// // }

// // const StatCard = ({ title, value, trend, percent, color }) => {
// //   const Icon = trend === "up" ? TrendingUp : TrendingDown
// //   const colorClasses = {
// //     blue: "from-blue-500 to-blue-600",
// //     green: "from-green-500 to-green-600",
// //     red: "from-red-500 to-red-600",
// //     purple: "from-purple-500 to-purple-600",
// //   }

// //   return (
// //     <Card className="border-0 shadow-lg card-hover group">
// //       <CardContent className="p-4 sm:p-6">
// //         <div className="flex items-center justify-between mb-3">
// //           <p className="text-xs sm:text-sm text-muted-foreground font-medium">{title}</p>
// //           <div
// //             className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
// //           >
// //             <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
// //           </div>
// //         </div>
// //         <div className="flex items-end justify-between">
// //           <h3 className="text-lg sm:text-2xl font-bold text-card-foreground">{value}</h3>
// //           <Badge variant="secondary" className="text-xs">
// //             {percent}
// //           </Badge>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// // const TransactionList = ({ data }) => {
// //   return (
// //     <div className="space-y-3 max-h-80 overflow-y-auto">
// //       {data.slice(0, 5).map((item, index) => (
// //         <div
// //           key={index}
// //           className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 group"
// //         >
// //           <div className="flex items-center space-x-3 min-w-0 flex-1">
// //             <div
// //               className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
// //                 item.type === "income"
// //                   ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
// //                   : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
// //               }`}
// //             >
// //               {item.type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
// //             </div>
// //             <div className="min-w-0 flex-1">
// //               <p className="font-medium text-card-foreground truncate">{item.category}</p>
// //               <p className="text-sm text-muted-foreground truncate">{item.description || "No description"}</p>
// //               <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
// //             </div>
// //           </div>
// //           <div className="text-right flex-shrink-0 ml-2">
// //             <span
// //               className={`font-semibold text-sm sm:text-base ${
// //                 item.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
// //               }`}
// //             >
// //               {item.type === "income" ? "+" : "-"}₹{Number(item.amount).toLocaleString()}
// //             </span>
// //           </div>
// //         </div>
// //       ))}
// //       {data.length === 0 && (
// //         <div className="text-center py-12 text-muted-foreground">
// //           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
// //             <TrendingUp className="w-8 h-8" />
// //           </div>
// //           <p className="font-medium">No transactions yet</p>
// //           <p className="text-sm">Start by adding your first transaction</p>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default Dashboard

// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { Bell, Menu, TrendingUp, TrendingDown, CalendarIcon, AlertTriangle, CheckCircle, Info } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sidebar } from "@/components/Sidebar"
// import { Calendar } from "@/components/ui/calendar"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"

// const Dashboard = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [account, setAccount] = useState(null)
//   const [transactions, setTransactions] = useState([])
//   const [alerts, setAlerts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedDate, setSelectedDate] = useState(new Date())

//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accountId = localStorage.getItem("selectedAccountId")
//         const userId = localStorage.getItem("userId")

//         if (accountId) {
//           const accRes = await axios.get(`http://localhost:8000/api/accounts/${accountId}/`)
//           setAccount(accRes.data)

//           const txnRes = await axios.get(`http://localhost:8000/api/transactions/accounts/${accountId}`)
//           const sortedTxns = txnRes.data.sort((a, b) => new Date(b.date) - new Date(a.date))
//           const recentTxns = sortedTxns.slice(0, 5)
//           setTransactions(recentTxns)
//         }

//         if (userId) {
//           const alertsRes = await axios.get(`http://localhost:8000/api/ml/anomalies/users/${userId}/`)
//           setAlerts(alertsRes.data || [])
//         }
//       } catch (error) {
//         console.error("❌ Failed to load dashboard data", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [navigate])

//   const getTotals = (txns, account) => {
//     if (!localStorage.getItem("userId")) {
//       return { balance: 0, income: 0, expenses: 0, savingsRate: 0 }
//     }

//     let income = 0
//     let expenses = 0
//     txns.forEach((txn) => {
//       const amount = Number.parseFloat(txn.amount) || 0
//       if (txn.type === "income") income += amount
//       else if (txn.type === "expense") expenses += amount
//     })

//     const initial = Number.parseFloat(account?.initial_balance ?? account?.total_balance) || 0
//     const balance = initial + income - expenses
//     const savingsRate = income > 0 ? (((income - expenses) / income) * 100).toFixed(2) : 0

//     return {
//       balance: Number.parseFloat(balance.toFixed(2)),
//       income: Number.parseFloat(income.toFixed(2)),
//       expenses: Number.parseFloat(expenses.toFixed(2)),
//       savingsRate: Number.parseFloat(savingsRate),
//     }
//   }

//   const totals = getTotals(transactions, account)

//   const handleLogout = () => {
//     localStorage.clear()
//     navigate("/")
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold text-foreground">Loading Dashboard</h3>
//             <p className="text-muted-foreground">Preparing your financial overview...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-background">
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />

//       <main className="flex-1 overflow-y-auto">
//         <header className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30 backdrop-blur-sm bg-card/95">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3 sm:space-x-4">
//               <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
//                 <Menu className="w-5 h-5" />
//               </Button>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-bold gradient-text">Financial Dashboard</h1>
//                 <p className="text-xs sm:text-sm text-muted-foreground">
//                   {new Date().toLocaleDateString("en-US", {
//                     weekday: "long",
//                     month: "long",
//                     day: "numeric",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Badge variant="secondary" className="hidden sm:flex">
//                 {localStorage.getItem("username") || "User"}
//               </Badge>
//             </div>
//           </div>
//         </header>

//         <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
//           {children ? (
//             children
//           ) : (
//             <>
//               {/* Stats Cards - Now with better responsive positioning */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
//                 <StatCard
//                   title="Total Balance"
//                   value={`₹${totals.balance.toLocaleString()}`}
//                   trend={totals.balance >= 0 ? "up" : "down"}
//                   percent="100%"
//                   color="blue"
//                 />
//                 <StatCard
//                   title="Total Income"
//                   value={`₹${totals.income.toLocaleString()}`}
//                   trend="up"
//                   percent="100%"
//                   color="green"
//                 />
//                 <StatCard
//                   title="Total Expenses"
//                   value={`₹${totals.expenses.toLocaleString()}`}
//                   trend="down"
//                   percent="100%"
//                   color="red"
//                 />
//                 <StatCard
//                   title="Savings Rate"
//                   value={`${totals.savingsRate}%`}
//                   trend={totals.savingsRate > 0 ? "up" : "down"}
//                   percent="100%"
//                   color="purple"
//                 />
//               </div>

//               {alerts.length > 0 && (
//                 <Card className="border-0 shadow-lg bg-gradient-to-r from-warning/10 to-destructive/10 border-l-4 border-l-warning">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-lg font-semibold text-warning-foreground flex items-center gap-2">
//                       <Bell className="w-5 h-5" />
//                       Financial Alerts
//                       <Badge variant="destructive" className="ml-auto">
//                         {alerts.length}
//                       </Badge>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       {alerts.slice(0, 3).map((alert, idx) => (
//                         <AlertCard key={idx} alert={alert} />
//                       ))}
//                       {alerts.length > 3 && (
//                         <div className="text-center pt-2">
//                           <Button variant="outline" size="sm">
//                             View All {alerts.length} Alerts
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Recent Transactions - Now positioned first on mobile for better priority */}
//                 <div className="lg:col-span-2 order-2 lg:order-1">
//                   <Card className="border-0 shadow-lg h-full">
//                     <CardHeader className="pb-4">
//                       <CardTitle className="text-xl font-semibold flex items-center justify-between">
//                         Recent Transactions
//                         <Badge variant="secondary">{transactions.length}</Badge>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <TransactionList data={transactions} />
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Calendar - Now positioned as sidebar on desktop, top on mobile */}
//                 <div className="order-1 lg:order-2">
//                   <Card className="border-0 shadow-lg h-full">
//                     <CardHeader className="pb-4">
//                       <CardTitle className="text-lg font-semibold flex items-center gap-2">
//                         <CalendarIcon className="w-5 h-5" />
//                         Transaction Calendar
//                       </CardTitle>
//                       <p className="text-sm text-muted-foreground">Days with transactions are highlighted</p>
//                     </CardHeader>
//                     <CardContent className="p-4">
//                       <div className="flex justify-center">
//                         <Calendar
//                           mode="single"
//                           selected={selectedDate}
//                           onSelect={setSelectedDate}
//                           modifiers={{
//                             hasTransaction: transactions.map((t) => new Date(t.date)),
//                           }}
//                           modifiersClassNames={{
//                             hasTransaction: "bg-primary text-primary-foreground font-semibold rounded-full",
//                           }}
//                           className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
//                           classNames={{
//                             months: "flex flex-col space-y-4",
//                             month: "space-y-4",
//                             caption: "flex justify-center pt-1 relative items-center",
//                             caption_label: "text-sm font-medium",
//                             nav: "space-x-1 flex items-center",
//                             nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
//                             nav_button_previous: "absolute left-1",
//                             nav_button_next: "absolute right-1",
//                             table: "w-full border-collapse space-y-1",
//                             head_row: "flex",
//                             head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
//                             row: "flex w-full mt-2",
//                             cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//                             day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
//                             day_selected:
//                               "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//                             day_today: "bg-accent text-accent-foreground font-semibold",
//                             day_outside: "text-muted-foreground opacity-50",
//                             day_disabled: "text-muted-foreground opacity-50",
//                             day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
//                             day_hidden: "invisible",
//                           }}
//                         />
//                       </div>
//                       {selectedDate && (
//                         <div className="mt-4 p-3 bg-muted rounded-lg">
//                           <p className="text-sm font-medium">
//                             {selectedDate.toLocaleDateString("en-US", {
//                               weekday: "long",
//                               month: "long",
//                               day: "numeric",
//                             })}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {
//                               transactions.filter(
//                                 (t) => new Date(t.date).toDateString() === selectedDate.toDateString(),
//                               ).length
//                             }{" "}
//                             transaction(s)
//                           </p>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

// const AlertCard = ({ alert }) => {
//   const getAlertIcon = (type) => {
//     switch (type) {
//       case "warning":
//         return <AlertTriangle className="w-4 h-4" />
//       case "success":
//         return <CheckCircle className="w-4 h-4" />
//       default:
//         return <Info className="w-4 h-4" />
//     }
//   }

//   const getAlertColor = (type) => {
//     switch (type) {
//       case "warning":
//         return "border-warning bg-warning/10 text-warning-foreground"
//       case "success":
//         return "border-success bg-success/10 text-success-foreground"
//       default:
//         return "border-primary bg-primary/10 text-primary-foreground"
//     }
//   }

//   return (
//     <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${getAlertColor(alert.type || "info")} bg-card`}>
//       <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
//       <div className="flex-1 min-w-0">
//         <p className="font-medium text-card-foreground">{alert.description || "Unusual transaction detected"}</p>
//         {alert.transaction && (
//           <p className="text-sm text-muted-foreground mt-1">
//             {alert.transaction.category} • ₹{Number(alert.transaction.amount).toLocaleString()}
//           </p>
//         )}
//       </div>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button size="sm" variant="outline" className="flex-shrink-0 bg-transparent">
//             Details
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {getAlertIcon(alert.type)}
//               Alert Details
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="p-4 bg-muted rounded-lg">
//               <p className="font-medium text-sm">{alert.description || "Unusual transaction detected"}</p>
//             </div>
//             {alert.transaction && (
//               <div className="space-y-3">
//                 <h4 className="font-semibold text-sm">Transaction Information</h4>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-muted-foreground">Type</p>
//                     <p className="font-medium capitalize">{alert.transaction.type}</p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Amount</p>
//                     <p className="font-medium">₹{Number(alert.transaction.amount).toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Category</p>
//                     <p className="font-medium">{alert.transaction.category}</p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Date</p>
//                     <p className="font-medium">{new Date(alert.transaction.date).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//                 {alert.transaction.description && (
//                   <div>
//                     <p className="text-muted-foreground text-sm">Description</p>
//                     <p className="font-medium text-sm">{alert.transaction.description}</p>
//                   </div>
//                 )}
//                 {alert.transaction.is_recurring && (
//                   <Badge variant="secondary" className="w-fit">
//                     Recurring Transaction
//                   </Badge>
//                 )}
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// const StatCard = ({ title, value, trend, percent, color }) => {
//   const Icon = trend === "up" ? TrendingUp : TrendingDown
//   const colorClasses = {
//     blue: "from-blue-500 to-blue-600",
//     green: "from-green-500 to-green-600",
//     red: "from-red-500 to-red-600",
//     purple: "from-purple-500 to-purple-600",
//   }

//   return (
//     <Card className="border-0 shadow-lg card-hover group">
//       <CardContent className="p-4 sm:p-6">
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs sm:text-sm text-muted-foreground font-medium">{title}</p>
//           <div
//             className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
//           >
//             <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//           </div>
//         </div>
//         <div className="flex items-end justify-between">
//           <h3 className="text-lg sm:text-2xl font-bold text-card-foreground">{value}</h3>
//           <Badge variant="secondary" className="text-xs">
//             {percent}
//           </Badge>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// const TransactionList = ({ data }) => {
//   return (
//     <div className="space-y-3 max-h-80 overflow-y-auto">
//       {data.slice(0, 5).map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 group"
//         >
//           <div className="flex items-center space-x-3 min-w-0 flex-1">
//             <div
//               className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
//                 item.type === "income"
//                   ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
//                   : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
//               }`}
//             >
//               {item.type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="font-medium text-card-foreground truncate">{item.category}</p>
//               <p className="text-sm text-muted-foreground truncate">{item.description || "No description"}</p>
//               <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
//             </div>
//           </div>
//           <div className="text-right flex-shrink-0 ml-2">
//             <span
//               className={`font-semibold text-sm sm:text-base ${
//                 item.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
//               }`}
//             >
//               {item.type === "income" ? "+" : "-"}₹{Number(item.amount).toLocaleString()}
//             </span>
//           </div>
//         </div>
//       ))}
//       {data.length === 0 && (
//         <div className="text-center py-12 text-muted-foreground">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <TrendingUp className="w-8 h-8" />
//           </div>
//           <p className="font-medium">No transactions yet</p>
//           <p className="text-sm">Start by adding your first transaction</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Dashboard

"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  Menu,
  TrendingUp,
  TrendingDown,
  CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { API_BASE } from "@/lib/api";


const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountId = localStorage.getItem("selectedAccountId");
        const userId = localStorage.getItem("userId");

        if (accountId) {
          const accRes = await axios.get(
            `${API_BASE}/accounts/${accountId}/`
          );
          setAccount(accRes.data);

          const txnRes = await axios.get(
            `${API_BASE}/transactions/accounts/${accountId}`
          );
          const sortedTxns = txnRes.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          const recentTxns = sortedTxns.slice(0, 5);
          setTransactions(recentTxns);
        }

        if (userId) {
          const alertsRes = await axios.get(
            `${API_BASE}/ml/anomalies/users/${userId}/`
          );
          setAlerts(alertsRes.data || []);
        }
      } catch (error) {
        console.error("❌ Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const getTotals = (txns, account) => {
    if (!localStorage.getItem("userId")) {
      return { balance: 0, income: 0, expenses: 0, savingsRate: 0 };
    }

    let income = 0;
    let expenses = 0;
    txns.forEach((txn) => {
      const amount = Number.parseFloat(txn.amount) || 0;
      if (txn.type === "income") income += amount;
      else if (txn.type === "expense") expenses += amount;
    });

    const initial =
      Number.parseFloat(account?.initial_balance ?? account?.total_balance) ||
      0;
    const balance = initial + income - expenses;
    const savingsRate =
      income > 0 ? (((income - expenses) / income) * 100).toFixed(2) : 0;

    return {
      balance: Number.parseFloat(balance.toFixed(2)),
      income: Number.parseFloat(income.toFixed(2)),
      expenses: Number.parseFloat(expenses.toFixed(2)),
      savingsRate: Number.parseFloat(savingsRate),
    };
  };

  const totals = getTotals(transactions, account);
  const selectedDateTransactions = selectedDate
    ? transactions.filter(
        (t) =>
          new Date(t.date).toDateString() === selectedDate.toDateString()
      )
    : [];
  const selectedDateTotal = selectedDateTransactions.reduce(
    (sum, transaction) =>
      sum + (Number.parseFloat(transaction.amount) || 0),
    0
  );
  const selectedMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });
  const selectedMonthIncomeTotal = selectedMonthTransactions.reduce(
    (sum, transaction) =>
      transaction.type === "income"
        ? sum + (Number.parseFloat(transaction.amount) || 0)
        : sum,
    0
  );
  const selectedMonthExpenseTotal = selectedMonthTransactions.reduce(
    (sum, transaction) =>
      transaction.type === "expense"
        ? sum + (Number.parseFloat(transaction.amount) || 0)
        : sum,
    0
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Loading Dashboard
            </h3>
            <p className="text-muted-foreground">
              Preparing your financial overview...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30 backdrop-blur-sm bg-card/95">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                  Financial Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {children ? (
            children
          ) : (
            <>
              {/* Stats Cards - Now with better responsive positioning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <StatCard
                  title="Total Balance"
                  value={`₹${totals.balance.toLocaleString()}`}
                  trend={totals.balance >= 0 ? "up" : "down"}
                  color="blue"
                />
                <StatCard
                  title="Total Income"
                  value={`₹${totals.income.toLocaleString()}`}
                  trend="up"
                  color="green"
                />
                <StatCard
                  title="Total Expenses"
                  value={`₹${totals.expenses.toLocaleString()}`}
                  trend="down"
                  color="red"
                />
                <StatCard
                  title="Savings Rate"
                  value={`${totals.savingsRate}%`}
                  trend={totals.savingsRate > 0 ? "up" : "down"}
                  color="purple"
                />
              </div>

              {alerts.length > 0 && (
                <Card className="border-0 shadow-lg bg-gradient-to-r from-warning/10 to-destructive/10 border-l-4 border-l-warning">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Financial Alerts
                      <Badge variant="destructive" className="ml-auto">
                        {alerts.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.slice(0, 3).map((alert, idx) => (
                        <AlertCard key={idx} alert={alert} />
                      ))}
                      {alerts.length > 3 && (
                        <div className="text-center pt-2">
                          <Button variant="outline" size="sm">
                            View All {alerts.length} Alerts
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Transactions - Now positioned first on mobile for better priority */}
                <div className="md:col-span-2 order-2 md:order-1 self-start">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-5">
                      <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                        Recent Transactions
                        <Badge variant="secondary">{transactions.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TransactionList data={transactions} />
                    </CardContent>
                  </Card>
                </div>

                {/* Calendar - Now positioned as sidebar on desktop, top on mobile */}
                <div className="order-1 md:order-2 md:sticky md:top-24 self-start">
                  <Card className="relative overflow-hidden border-0 shadow-[0_18px_44px_-22px_rgba(6,78,59,0.65)] bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40">
                    <div className="pointer-events-none absolute -top-12 right-0 h-36 w-36 rounded-full bg-cyan-300/30 blur-2xl dark:bg-cyan-700/20" />
                    <CardHeader className="relative pb-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
                              <CalendarIcon className="w-4 h-4" />
                            </span>
                            Transaction Calendar
                          </CardTitle>
                          <p className="text-xs mt-1 text-teal-800/80 dark:text-teal-300/80">
                            Track activity by date and month
                          </p>
                        </div>
                        <Badge className="bg-teal-700 text-white hover:bg-teal-700">
                          {selectedDate.toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-teal-200/70 dark:border-teal-900/70 bg-white/80 dark:bg-slate-900/80 p-2.5">
                          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            This Month
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {selectedMonthTransactions.length} txns
                          </p>
                        </div>
                        <div className="rounded-lg border border-teal-200/70 dark:border-teal-900/70 bg-white/80 dark:bg-slate-900/80 p-2.5">
                          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Net Flow
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            ₹{(selectedMonthIncomeTotal - selectedMonthExpenseTotal).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
                      <div className="rounded-xl border border-teal-200/70 dark:border-teal-900/70 bg-white/90 dark:bg-slate-950/70 p-1.5 sm:p-2.5 shadow-sm">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          modifiers={{
                            hasTransaction: transactions.map(
                              (t) => new Date(t.date)
                            ),
                          }}
                          modifiersClassNames={{
                            hasTransaction:
                              "bg-emerald-600 text-white font-semibold rounded-md ring-1 ring-emerald-300 dark:ring-emerald-800",
                          }}
                          className="w-full p-0.5 sm:p-1"
                          classNames={{
                            months: "flex flex-col",
                            month: "space-y-2 sm:space-y-3",
                            caption:
                              "flex justify-center pt-1 pb-1 relative items-center",
                            caption_label:
                              "text-xs sm:text-sm font-bold tracking-tight text-slate-700 dark:text-slate-200",
                            nav: "space-x-1 flex items-center",
                            nav_button:
                              "h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-transparent p-0 text-slate-600 hover:text-slate-900 opacity-80 hover:opacity-100 hover:bg-teal-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-separate border-spacing-y-1 sm:border-spacing-y-1.5",
                            head_row: "flex mb-1.5 justify-between",
                            head_cell:
                              "text-slate-600 dark:text-slate-300 bg-teal-100/70 dark:bg-slate-800/80 rounded-lg w-7 h-5 sm:w-8 sm:h-6 flex items-center justify-center font-semibold text-[9px] sm:text-[10px]",
                            row: "flex w-full justify-between",
                            cell: "text-center text-sm p-0 relative flex-1",
                            day: "h-7 w-7 sm:h-8 sm:w-8 p-0 text-[11px] sm:text-[12px] font-medium rounded-lg border border-transparent hover:bg-teal-100 hover:border-teal-200 dark:hover:bg-slate-800 dark:hover:border-slate-700 transition-colors",
                            day_selected:
                              "bg-teal-700 text-white hover:bg-teal-700 hover:text-white focus:bg-teal-700 focus:text-white",
                            day_today:
                              "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 font-semibold",
                            day_outside: "text-slate-400 opacity-45",
                            day_disabled: "text-slate-400 opacity-45",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900 bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <span className="h-2 w-2 rounded-full bg-emerald-600" />
                          Has transaction
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-900 bg-amber-50 px-2.5 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Today
                        </span>
                      </div>

                      {selectedDate && (
                        <div className="rounded-xl border border-teal-200/70 dark:border-teal-900/70 bg-white/90 dark:bg-slate-950/75 p-3.5 space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {selectedDate.toLocaleDateString("en-US", {
                                weekday: "long",
                              })}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              {selectedDate.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-md bg-slate-100/80 dark:bg-slate-900 p-2">
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Transactions</p>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {selectedDateTransactions.length}
                              </p>
                            </div>
                            <div className="rounded-md bg-slate-100/80 dark:bg-slate-900 p-2">
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Amount</p>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                ₹{selectedDateTotal.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {selectedDateTransactions.length > 0 && (
                            <div className="space-y-1.5">
                              {selectedDateTransactions.slice(0, 3).map((txn) => (
                                <div
                                  key={txn.id}
                                  className="flex items-center justify-between rounded-md px-2 py-1.5 bg-slate-100/70 dark:bg-slate-900/70"
                                >
                                  <p className="text-xs text-slate-700 dark:text-slate-300 truncate pr-2">
                                    {txn.category || "Transaction"}
                                  </p>
                                  <p
                                    className={`text-xs font-semibold ${
                                      txn.type === "income"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-600 dark:text-rose-400"
                                    }`}
                                  >
                                    {txn.type === "income" ? "+" : "-"}₹
                                    {(Number.parseFloat(txn.amount) || 0).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const AlertCard = ({ alert }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "warning":
        return "border-warning bg-warning/10 text-warning-foreground";
      case "success":
        return "border-success bg-success/10 text-success-foreground";
      default:
        return "border-primary bg-primary/10 text-primary-foreground";
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${getAlertColor(
        alert.type || "info"
      )} bg-card`}
    >
      <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 dark:text-slate-200">
          {alert.description || "Unusual transaction detected"}
        </p>
        {alert.transaction && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {alert.transaction.category} • ₹
            {Number(alert.transaction.amount).toLocaleString()}
          </p>
        )}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 bg-transparent"
          >
            Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getAlertIcon(alert.type)}
              Alert Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-sm">
                {alert.description || "Unusual transaction detected"}
              </p>
            </div>
            {alert.transaction && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Transaction Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">
                      {alert.transaction.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      ₹{Number(alert.transaction.amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{alert.transaction.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(alert.transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {alert.transaction.description && (
                  <div>
                    <p className="text-muted-foreground text-sm">Description</p>
                    <p className="font-medium text-sm">
                      {alert.transaction.description}
                    </p>
                  </div>
                )}
                {alert.transaction.is_recurring && (
                  <Badge variant="secondary" className="w-fit">
                    Recurring Transaction
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ title, value, trend, percent, color }) => {
  const Icon = trend === "up" ? TrendingUp : TrendingDown;
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <Card className="border-0 shadow-lg card-hover group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            {title}
          </p>
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
            {value}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {percent}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const TransactionList = ({ data }) => {
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {data.slice(0, 5).map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 group"
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.type === "income"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {item.type === "income" ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {item.category}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                {item.description || "No description"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <span
              className={`font-semibold text-sm sm:text-base ${
                item.type === "income"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {item.type === "income" ? "+" : "-"}₹
              {Number(item.amount).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            No transactions yet
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Start by adding your first transaction
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
