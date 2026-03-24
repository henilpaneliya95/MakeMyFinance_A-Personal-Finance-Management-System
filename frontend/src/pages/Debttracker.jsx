// // import { useEffect, useMemo, useRef, useState } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Badge } from "@/components/ui/badge";
// // import { Progress } from "@/components/ui/progress";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // // Icons
// // import {
// //   CreditCard,
// //   RefreshCw,
// //   TrendingDown,
// //   Calendar,
// //   Percent,
// //   AlertTriangle,
// //   CheckCircle,
// //   Trash2,
// //   Edit,
// //   Plus,
// //   DollarSign,
// // } from "lucide-react";

// // // ---------- CONFIG (Goals style) ----------
// // const API_URL = "http://localhost:8000/api/debts/";
// // const USER_ID =
// //   typeof window !== "undefined" ? localStorage.getItem("userId") : null;

// // // ---------- helpers ----------
// // const GRAD_COLORS = [
// //   "red",
// //   "orange",
// //   "amber",
// //   "emerald",
// //   "teal",
// //   "cyan",
// //   "blue",
// //   "indigo",
// //   "violet",
// //   "purple",
// //   "pink",
// // ];
// // function randomGradient() {
// //   const c = GRAD_COLORS[Math.floor(Math.random() * GRAD_COLORS.length)];
// //   const c2 = GRAD_COLORS[Math.floor(Math.random() * GRAD_COLORS.length)];
// //   return `from-${c}-500 to-${c2}-600`;
// // }

// // // Backend id may come as id / _id / _id.$oid
// // function normalizeId(raw) {
// //   if (!raw) return "";
// //   if (typeof raw === "string") return raw;
// //   if (raw.id) return raw.id;
// //   if (raw._id && typeof raw._id === "string") return raw._id;
// //   if (raw._id && typeof raw._id === "object" && raw._id.$oid)
// //     return raw._id.$oid;
// //   if (raw.pk) return raw.pk;
// //   return "";
// // }

// // function normalizeDebt(raw) {
// //   const id = normalizeId(raw);
// //   const dueDateValue =
// //     raw?.due_date ??
// //     raw?.dueDate ??
// //     (raw?.due_date ? String(raw.due_date).split("T")[0] : "") ??
// //     "";

// //   return {
// //     id,
// //     name: raw?.name ?? "",
// //     type: raw?.type ?? "Credit Card",
// //     totalAmount: Number(raw?.total_amount ?? raw?.totalAmount ?? 0),
// //     remainingAmount: Number(raw?.remaining_amount ?? raw?.remainingAmount ?? 0),
// //     interestRate: Number(raw?.interest_rate ?? raw?.interestRate ?? 0),
// //     minimumPayment: Number(raw?.minimum_payment ?? raw?.minimumPayment ?? 0),
// //     dueDate: dueDateValue,
// //     color: raw?.color || randomGradient(),
// //     user_id: normalizeId(raw?.user_id) || USER_ID || "",
// //     raw,
// //   };
// // }

// // function showToast(msg, color = "blue") {
// //   const div = document.createElement("div");
// //   div.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`;
// //   div.innerText = msg;
// //   document.body.appendChild(div);
// //   setTimeout(() => document.body.removeChild(div), 2500);
// // }

// // // ---------- Component ----------
// // const Debttracker = () => {
// //   const [debts, setDebts] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const [dialogOpen, setDialogOpen] = useState(false);
// //   const [editDialogOpen, setEditDialogOpen] = useState(false);
// //   const [editingDebt, setEditingDebt] = useState(null);

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     type: "Credit Card",
// //     totalAmount: "",
// //     remainingAmount: "",
// //     interestRate: "",
// //     minimumPayment: "",
// //     dueDate: "",
// //   });

// //   const mountedRef = useRef(false);

// //   const debtTypes = [
// //     "Credit Card",
// //     "Personal Loan",
// //     "Auto Loan",
// //     "Home Loan",
// //     "Student Loan",
// //     "Other",
// //   ];

// //   const handleChange = (e) =>
// //     setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

// //   // -------- API: LIST (filtered by user) --------
// //   async function fetchDebts() {
// //     try {
// //       setLoading(true);
// //       if (!USER_ID || USER_ID === "null" || USER_ID === "undefined") {
// //         // Agar login nahi hai -> debts ko empty set karo
// //         if (mountedRef.current) setDebts([]);
// //         return;
// //       }

// //       const url = `${API_URL}?user_id=${encodeURIComponent(USER_ID)}`;
// //       const res = await fetch(url);
// //       const data = await res.json();
// //       const normalized = Array.isArray(data) ? data.map(normalizeDebt) : [];
// //       if (mountedRef.current) setDebts(normalized);
// //     } catch (err) {
// //       console.error("Error fetching debts:", err);
// //       showToast("Failed to fetch debts", "red");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // -------- API: CREATE --------
// //   async function createDebt() {
// //     try {
// //       const payload = {
// //         name: formData.name,
// //         type: formData.type,
// //         total_amount: Number(formData.totalAmount || 0),
// //         remaining_amount: Number(formData.remainingAmount || 0),
// //         interest_rate: Number(formData.interestRate || 0),
// //         minimum_payment: Number(formData.minimumPayment || 0),
// //         due_date: formData.dueDate || null,
// //         user_id: USER_ID || null,
// //       };
// //       const res = await fetch(API_URL, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });
// //       if (!res.ok) {
// //         const t = await res.text();
// //         throw new Error(t || "Failed to create debt");
// //       }
// //       await fetchDebts();
// //       setDialogOpen(false);
// //       resetForm();
// //       showToast("Debt created!", "green");
// //     } catch (err) {
// //       console.error("Error creating debt:", err);
// //       showToast("Create failed", "red");
// //     }
// //   }

// //   function resetForm() {
// //     setFormData({
// //       name: "",
// //       type: "Credit Card",
// //       totalAmount: "",
// //       remainingAmount: "",
// //       interestRate: "",
// //       minimumPayment: "",
// //       dueDate: "",
// //     });
// //   }

// //   useEffect(() => {
// //     mountedRef.current = true;
// //     fetchDebts();
// //     return () => {
// //       mountedRef.current = false;
// //     };
// //   }, []);
// //   // -------- API: UPDATE --------
// //   async function updateDebt(id, patch) {
// //     const debtId = typeof id === "string" ? id : normalizeId(id);
// //     if (!debtId) return showToast("Invalid id", "red");
// //     try {
// //       const res = await fetch(`${API_URL}${debtId}/`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ ...patch, user_id: USER_ID || null }),
// //       });
// //       if (!res.ok) {
// //         const t = await res.text();
// //         throw new Error(t || "Failed to update");
// //       }
// //       await fetchDebts();
// //       setEditDialogOpen(false);
// //       setEditingDebt(null);
// //       resetForm();
// //       showToast("Debt updated", "blue");
// //     } catch (err) {
// //       console.error("Error updating debt:", err);
// //       showToast("Update failed", "red");
// //     }
// //   }

// //   // -------- API: DELETE --------
// //   async function deleteDebt(id) {
// //     const debtId = typeof id === "string" ? id : normalizeId(id);
// //     if (!debtId) return showToast("Invalid id", "red");
// //     try {
// //       const res = await fetch(`${API_URL}${debtId}/`, { method: "DELETE" });
// //       if (!res.ok && res.status !== 204) {
// //         const t = await res.text();
// //         throw new Error(t || "Failed to delete");
// //       }
// //       setDebts((list) => list.filter((d) => normalizeId(d.id) !== debtId));
// //       showToast("Debt deleted", "red");
// //     } catch (err) {
// //       console.error("Error deleting debt:", err);
// //       showToast("Delete failed", "red");
// //     }
// //   }

// //   // -------- UI handlers --------
// //   function handleAddSubmit() {
// //     createDebt();
// //   }

// //   function handleEditOpen(debt) {
// //     setEditingDebt(debt);
// //     setFormData({
// //       name: debt.name || "",
// //       type: debt.type || "Credit Card",
// //       totalAmount: String(debt.totalAmount ?? ""),
// //       remainingAmount: String(debt.remainingAmount ?? ""),
// //       interestRate: String(debt.interestRate ?? ""),
// //       minimumPayment: String(debt.minimumPayment ?? ""),
// //       dueDate: (debt.dueDate && String(debt.dueDate).split("T")?.[0]) || "",
// //     });
// //     setEditDialogOpen(true);
// //   }

// //   function handleEditSubmit() {
// //     if (!editingDebt) return;
// //     const id = editingDebt.id;
// //     const payload = {
// //       name: formData.name,
// //       type: formData.type,
// //       total_amount: Number(formData.totalAmount || 0),
// //       remaining_amount: Number(formData.remainingAmount || 0),
// //       interest_rate: Number(formData.interestRate || 0),
// //       minimum_payment: Number(formData.minimumPayment || 0),
// //       due_date: formData.dueDate || null,
// //     };
// //     updateDebt(id, payload);
// //   }

// //   async function makePayment(goal, amount) {
// //     const debt = goal; // just naming alignment
// //     const newRemaining = Math.max(
// //       0,
// //       Number(debt.remainingAmount || 0) - Number(amount || 0)
// //     );
// //     const payload = {
// //       name: debt.name,
// //       type: debt.type,
// //       total_amount: Number(debt.totalAmount || 0),
// //       remaining_amount: newRemaining,
// //       interest_rate: Number(debt.interestRate || 0),
// //       minimum_payment: Number(debt.minimumPayment || 0),
// //       due_date: debt.dueDate || null,
// //     };
// //     await updateDebt(debt.id, payload);
// //   }

// //   // -------- derived values --------
// //   const totalDebt = useMemo(
// //     () => debts.reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0),
// //     [debts]
// //   );
// //   const totalMinimumPayments = useMemo(
// //     () => debts.reduce((sum, d) => sum + (Number(d.minimumPayment) || 0), 0),
// //     [debts]
// //   );
// //   const averageInterestRate = useMemo(() => {
// //     if (!debts.length) return 0;
// //     const s = debts.reduce((sum, d) => sum + (Number(d.interestRate) || 0), 0);
// //     return s / debts.length;
// //   }, [debts]);

// //   // -------- small utils for UI --------
// //   const getProgressPercentage = (remaining, total) => {
// //     const t = Number(total || 0);
// //     const r = Number(remaining || 0);
// //     if (t <= 0) return 0;
// //     const val = ((t - r) / t) * 100;
// //     return Math.min(100, Math.max(0, val));
// //   };

// //   const getDaysUntilDue = (dueDate) => {
// //     if (!dueDate) return NaN;
// //     const today = new Date();
// //     const due = new Date(dueDate);
// //     const diffTime = due.getTime() - today.getTime();
// //     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //   };

// //   // -------- RENDER --------
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //             Debt Tracker
// //           </h1>
// //           <p className="text-gray-600 mt-2">
// //             Monitor and manage your debts to achieve financial freedom
// //           </p>
// //         </div>
// //         <div className="flex items-center space-x-3">
// //           <Button variant="outline" onClick={fetchDebts} disabled={loading}>
// //             <RefreshCw className="w-4 h-4 mr-2" />
// //             {loading ? "Loading..." : "Refresh"}
// //           </Button>
// //           <Badge variant="secondary" className="px-3 py-1">
// //             <CreditCard className="w-4 h-4 mr-1" />
// //             {debts.length} Active Debts
// //           </Badge>
// //         </div>
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">Total Debt</p>
// //                 <p className="text-2xl font-bold text-red-600">
// //                   ₹{Number(totalDebt).toLocaleString()}
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">
// //                   Outstanding balance
// //                 </p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
// //                 <TrendingDown className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">
// //                   Monthly Payments
// //                 </p>
// //                 <p className="text-2xl font-bold text-orange-600">
// //                   ₹{Number(totalMinimumPayments).toLocaleString()}
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">Minimum required</p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
// //                 <Calendar className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">
// //                   Avg. Interest Rate
// //                 </p>
// //                 <p className="text-2xl font-bold text-purple-600">
// //                   {Number(averageInterestRate).toFixed(1)}%
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">Across all debts</p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
// //                 <Percent className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //       {/* Debt Cards */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {debts.map((debt, index) => {
// //           const pct = getProgressPercentage(
// //             debt.remainingAmount,
// //             debt.totalAmount
// //           );
// //           const days = getDaysUntilDue(debt.dueDate);
// //           const isOverdue = Number.isFinite(days) && days < 0;
// //           const isDueSoon = Number.isFinite(days) && days >= 0 && days <= 7;

// //           return (
// //             <Card
// //               key={String(debt.id)}
// //               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
// //               style={{ animationDelay: `${index * 100}ms` }}
// //             >
// //               <CardHeader className="pb-3">
// //                 <div className="flex items-center justify-between">
// //                   <div className="flex items-center space-x-3">
// //                     <div
// //                       className={`w-10 h-10 bg-gradient-to-r ${
// //                         debt.color || randomGradient()
// //                       } rounded-lg flex items-center justify-center`}
// //                     >
// //                       <CreditCard className="w-5 h-5 text-white" />
// //                     </div>
// //                     <div>
// //                       <CardTitle className="text-lg font-semibold text-gray-900">
// //                         {debt.name}
// //                       </CardTitle>
// //                       <Badge variant="secondary" className="text-xs">
// //                         {debt.type}
// //                       </Badge>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     {isOverdue && (
// //                       <AlertTriangle className="w-5 h-5 text-red-500" />
// //                     )}
// //                     {isDueSoon && (
// //                       <AlertTriangle className="w-5 h-5 text-yellow-500" />
// //                     )}
// //                     {Number(debt.remainingAmount) === 0 && (
// //                       <CheckCircle className="w-5 h-5 text-green-500" />
// //                     )}
// //                   </div>
// //                 </div>
// //               </CardHeader>

// //               <CardContent className="space-y-4">
// //                 <div className="space-y-2">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-600">
// //                       Remaining: ₹
// //                       {Number(debt.remainingAmount).toLocaleString()}
// //                     </span>
// //                     <span className="text-gray-600">
// //                       Total: ₹{Number(debt.totalAmount).toLocaleString()}
// //                     </span>
// //                   </div>
// //                   <Progress value={pct} className="h-3 [&>div]:bg-green-500" />
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-green-600 font-medium">
// //                       {pct.toFixed(1)}% paid off
// //                     </span>
// //                     <span className="text-gray-500">
// //                       {Number(debt.interestRate)}% APR
// //                     </span>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4 text-sm">
// //                   <div>
// //                     <p className="text-gray-500">Minimum Payment</p>
// //                     <p className="font-semibold text-gray-900">
// //                       ₹{Number(debt.minimumPayment).toLocaleString()}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-500">Due Date</p>
// //                     <p
// //                       className={`font-semibold ${
// //                         isOverdue
// //                           ? "text-red-600"
// //                           : isDueSoon
// //                           ? "text-yellow-600"
// //                           : "text-gray-900"
// //                       }`}
// //                     >
// //                       {debt.dueDate
// //                         ? new Date(debt.dueDate).toLocaleDateString()
// //                         : "—"}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {Number.isFinite(days) && (
// //                   <div className="text-sm">
// //                     <p className="text-gray-500">Days until due</p>
// //                     <p
// //                       className={`font-semibold ${
// //                         isOverdue
// //                           ? "text-red-600"
// //                           : isDueSoon
// //                           ? "text-yellow-600"
// //                           : "text-gray-900"
// //                       }`}
// //                     >
// //                       {isOverdue
// //                         ? `${Math.abs(days)} days overdue`
// //                         : `${days} days`}
// //                     </p>
// //                   </div>
// //                 )}

// //                 <div className="flex space-x-2 pt-2">
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => makePayment(debt, debt.minimumPayment || 0)}
// //                     className="flex-1 bg-transparent hover:bg-green-50"
// //                   >
// //                     <DollarSign className="w-4 h-4 mr-1" />
// //                     Pay Minimum
// //                   </Button>
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => handleEditOpen(debt)}
// //                     className="flex-1 bg-transparent"
// //                   >
// //                     <Edit className="w-4 h-4 mr-1" />
// //                     Edit
// //                   </Button>
// //                   <Button
// //                     variant="destructive"
// //                     size="sm"
// //                     onClick={() => deleteDebt(debt.id)}
// //                   >
// //                     <Trash2 className="w-4 h-4" />
// //                   </Button>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           );
// //         })}

// //         {/* Add New Debt Card */}
// //         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// //           <DialogTrigger asChild>
// //             <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
// //               <CardContent className="p-12 text-center">
// //                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
// //                   <Plus className="w-8 h-8 text-white" />
// //                 </div>
// //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //                   Add New Debt
// //                 </h3>
// //                 <p className="text-gray-600">Track a new debt or loan</p>
// //               </CardContent>
// //             </Card>
// //           </DialogTrigger>
// //           <DialogContent className="sm:max-w-md">
// //             <DialogHeader>
// //               <DialogTitle className="flex items-center">
// //                 <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
// //                 Add New Debt
// //               </DialogTitle>
// //               <p className="text-gray-600">
// //                 Add a new debt to track your payments
// //               </p>
// //             </DialogHeader>

// //             <div className="space-y-4 mt-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="name">Debt Name</Label>
// //                 <Input
// //                   id="name"
// //                   name="name"
// //                   placeholder="e.g., Credit Card - HDFC"
// //                   value={formData.name}
// //                   onChange={handleChange}
// //                 />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="type">Debt Type</Label>
// //                 <Select
// //                   value={formData.type}
// //                   onValueChange={(v) => setFormData((f) => ({ ...f, type: v }))}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {debtTypes.map((t) => (
// //                       <SelectItem key={t} value={t}>
// //                         {t}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="totalAmount">Total Amount</Label>
// //                   <Input
// //                     id="totalAmount"
// //                     name="totalAmount"
// //                     type="number"
// //                     value={formData.totalAmount}
// //                     onChange={handleChange}
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="remainingAmount">Remaining Amount</Label>
// //                   <Input
// //                     id="remainingAmount"
// //                     name="remainingAmount"
// //                     type="number"
// //                     value={formData.remainingAmount}
// //                     onChange={handleChange}
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="interestRate">Interest Rate (%)</Label>
// //                   <Input
// //                     id="interestRate"
// //                     name="interestRate"
// //                     type="number"
// //                     step="0.1"
// //                     value={formData.interestRate}
// //                     onChange={handleChange}
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="minimumPayment">Minimum Payment</Label>
// //                   <Input
// //                     id="minimumPayment"
// //                     name="minimumPayment"
// //                     type="number"
// //                     value={formData.minimumPayment}
// //                     onChange={handleChange}
// //                   />
// //                 </div>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="dueDate">Due Date</Label>
// //                 <Input
// //                   id="dueDate"
// //                   name="dueDate"
// //                   type="date"
// //                   value={formData.dueDate}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>

// //             <DialogFooter className="mt-6">
// //               <Button variant="outline" onClick={() => setDialogOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button
// //                 onClick={handleAddSubmit}
// //                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// //               >
// //                 <Plus className="w-4 h-4 mr-2" /> Add Debt
// //               </Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* Edit Debt Dialog */}
// //       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
// //         <DialogContent className="sm:max-w-md">
// //           <DialogHeader>
// //             <DialogTitle className="flex items-center">
// //               <Edit className="w-5 h-5 mr-2 text-blue-600" />
// //               Edit Debt
// //             </DialogTitle>
// //             <p className="text-gray-600">Update your debt information</p>
// //           </DialogHeader>

// //           <div className="space-y-4 mt-4">
// //             <div className="space-y-2">
// //               <Label htmlFor="edit-name">Debt Name</Label>
// //               <Input
// //                 id="edit-name"
// //                 name="name"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="edit-type">Debt Type</Label>
// //               <Select
// //                 value={formData.type}
// //                 onValueChange={(v) => setFormData((f) => ({ ...f, type: v }))}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {debtTypes.map((t) => (
// //                     <SelectItem key={t} value={t}>
// //                       {t}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-totalAmount">Total Amount</Label>
// //                 <Input
// //                   id="edit-totalAmount"
// //                   name="totalAmount"
// //                   type="number"
// //                   value={formData.totalAmount}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-remainingAmount">Remaining Amount</Label>
// //                 <Input
// //                   id="edit-remainingAmount"
// //                   name="remainingAmount"
// //                   type="number"
// //                   value={formData.remainingAmount}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-interestRate">Interest Rate (%)</Label>
// //                 <Input
// //                   id="edit-interestRate"
// //                   name="interestRate"
// //                   type="number"
// //                   step="0.1"
// //                   value={formData.interestRate}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-minimumPayment">Minimum Payment</Label>
// //                 <Input
// //                   id="edit-minimumPayment"
// //                   name="minimumPayment"
// //                   type="number"
// //                   value={formData.minimumPayment}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="edit-dueDate">Due Date</Label>
// //               <Input
// //                 id="edit-dueDate"
// //                 name="dueDate"
// //                 type="date"
// //                 value={formData.dueDate}
// //                 onChange={handleChange}
// //               />
// //             </div>
// //           </div>

// //           <DialogFooter className="mt-6">
// //             <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
// //               Cancel
// //             </Button>
// //             <Button
// //               onClick={handleEditSubmit}
// //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// //             >
// //               <CheckCircle className="w-4 h-4 mr-2" /> Update Debt
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Empty State */}
// //       {debts.length === 0 && !loading && (
// //         <Card className="border-0 shadow-lg">
// //           <CardContent className="p-12 text-center">
// //             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CreditCard className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-900 mb-4">
// //               No Debts to Track
// //             </h3>
// //             <p className="text-gray-600 mb-8 max-w-md mx-auto">
// //               Add your debts to monitor balances, due dates, and progress over
// //               time.
// //             </p>
// //             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// //               <DialogTrigger asChild>
// //                 <Button
// //                   size="lg"
// //                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
// //                 >
// //                   <Plus className="w-5 h-5 mr-2" /> Add Your First Debt
// //                 </Button>
// //               </DialogTrigger>
// //             </Dialog>
// //           </CardContent>
// //         </Card>
// //       )}
// //     </div>
// //   );
// // };

// // export default Debttracker;

// import { useEffect, useMemo, useRef, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Icons
// import {
//   CreditCard,
//   RefreshCw,
//   TrendingDown,
//   Calendar,
//   Percent,
//   AlertTriangle,
//   CheckCircle,
//   Trash2,
//   Edit,
//   Plus,
//   DollarSign,
// } from "lucide-react";

// // ---------- CONFIG (Goals style) ----------
// const API_URL = "http://localhost:8000/api/debts/";
// const USER_ID =
//   typeof window !== "undefined" ? localStorage.getItem("userId") : null;

// // ---------- helpers ----------
// const GRAD_COLORS = [
//   "red",
//   "orange",
//   "amber",
//   "emerald",
//   "teal",
//   "cyan",
//   "blue",
//   "indigo",
//   "violet",
//   "purple",
//   "pink",
// ];
// function randomGradient() {
//   const c = GRAD_COLORS[Math.floor(Math.random() * GRAD_COLORS.length)];
//   const c2 = GRAD_COLORS[Math.floor(Math.random() * GRAD_COLORS.length)];
//   return `from-${c}-500 to-${c2}-600`;
// }

// // Backend id may come as id / _id / _id.$oid
// function normalizeId(raw) {
//   if (!raw) return "";
//   if (typeof raw === "string") return raw;
//   if (raw.id) return raw.id;
//   if (raw._id && typeof raw._id === "string") return raw._id;
//   if (raw._id && typeof raw._id === "object" && raw._id.$oid)
//     return raw._id.$oid;
//   if (raw.pk) return raw.pk;
//   return "";
// }

// function normalizeDebt(raw) {
//   const id = normalizeId(raw);
//   const dueDateValue =
//     raw?.due_date ??
//     raw?.dueDate ??
//     (raw?.due_date ? String(raw.due_date).split("T")[0] : "") ??
//     "";

//   return {
//     id,
//     name: raw?.name ?? "",
//     type: raw?.type ?? "Credit Card",
//     totalAmount: Number(raw?.total_amount ?? raw?.totalAmount ?? 0),
//     remainingAmount: Number(raw?.remaining_amount ?? raw?.remainingAmount ?? 0),
//     interestRate: Number(raw?.interest_rate ?? raw?.interestRate ?? 0),
//     minimumPayment: Number(raw?.minimum_payment ?? raw?.minimumPayment ?? 0),
//     dueDate: dueDateValue,
//     color: raw?.color || randomGradient(),
//     user_id: normalizeId(raw?.user_id) || USER_ID || "",
//     raw,
//   };
// }

// function showToast(msg, color = "blue") {
//   const div = document.createElement("div");
//   div.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`;
//   div.innerText = msg;
//   document.body.appendChild(div);
//   setTimeout(() => document.body.removeChild(div), 2500);
// }

// // ---------- Component ----------
// const Debttracker = () => {
//   const [debts, setDebts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingDebt, setEditingDebt] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     type: "Credit Card",
//     totalAmount: "",
//     remainingAmount: "",
//     interestRate: "",
//     minimumPayment: "",
//     dueDate: "",
//   });

//   const mountedRef = useRef(false);

//   const debtTypes = [
//     "Credit Card",
//     "Personal Loan",
//     "Auto Loan",
//     "Home Loan",
//     "Student Loan",
//     "Other",
//   ];

//   const handleChange = (e) =>
//     setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

//   // -------- API: LIST (filtered by user) --------
//   async function fetchDebts() {
//     try {
//       setLoading(true);
//       if (!USER_ID || USER_ID === "null" || USER_ID === "undefined") {
//         // Agar login nahi hai -> debts ko empty set karo
//         if (mountedRef.current) setDebts([]);
//         return;
//       }

//       const url = `${API_URL}?user_id=${encodeURIComponent(USER_ID)}`;
//       const res = await fetch(url);
//       const data = await res.json();
//       const normalized = Array.isArray(data) ? data.map(normalizeDebt) : [];
//       if (mountedRef.current) setDebts(normalized);
//     } catch (err) {
//       console.error("Error fetching debts:", err);
//       showToast("Failed to fetch debts", "red");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // -------- API: CREATE --------
//   async function createDebt() {
//     try {
//       const payload = {
//         name: formData.name,
//         type: formData.type,
//         total_amount: Number(formData.totalAmount || 0),
//         remaining_amount: Number(formData.remainingAmount || 0),
//         interest_rate: Number(formData.interestRate || 0),
//         minimum_payment: Number(formData.minimumPayment || 0),
//         due_date: formData.dueDate || null,
//         user_id: USER_ID || null,
//       };
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error(t || "Failed to create debt");
//       }
//       await fetchDebts();
//       setDialogOpen(false);
//       resetForm();
//       showToast("Debt created!", "green");
//     } catch (err) {
//       console.error("Error creating debt:", err);
//       showToast("Create failed", "red");
//     }
//   }

//   function resetForm() {
//     setFormData({
//       name: "",
//       type: "Credit Card",
//       totalAmount: "",
//       remainingAmount: "",
//       interestRate: "",
//       minimumPayment: "",
//       dueDate: "",
//     });
//   }

//   useEffect(() => {
//     mountedRef.current = true;
//     fetchDebts();
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);
//   // -------- API: UPDATE --------
//   async function updateDebt(id, patch) {
//     const debtId = typeof id === "string" ? id : normalizeId(id);
//     if (!debtId) return showToast("Invalid id", "red");
//     try {
//       const res = await fetch(`${API_URL}${debtId}/`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...patch, user_id: USER_ID || null }),
//       });
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error(t || "Failed to update");
//       }
//       await fetchDebts();
//       setEditDialogOpen(false);
//       setEditingDebt(null);
//       resetForm();
//       showToast("Debt updated", "blue");
//     } catch (err) {
//       console.error("Error updating debt:", err);
//       showToast("Update failed", "red");
//     }
//   }

//   // -------- API: DELETE --------
//   async function deleteDebt(id) {
//     const debtId = typeof id === "string" ? id : normalizeId(id);
//     if (!debtId) return showToast("Invalid id", "red");
//     try {
//       const res = await fetch(`${API_URL}${debtId}/`, { method: "DELETE" });
//       if (!res.ok && res.status !== 204) {
//         const t = await res.text();
//         throw new Error(t || "Failed to delete");
//       }
//       setDebts((list) => list.filter((d) => normalizeId(d.id) !== debtId));
//       showToast("Debt deleted", "red");
//     } catch (err) {
//       console.error("Error deleting debt:", err);
//       showToast("Delete failed", "red");
//     }
//   }

//   // -------- UI handlers --------
//   function handleAddSubmit() {
//     createDebt();
//   }

//   function handleEditOpen(debt) {
//     setEditingDebt(debt);
//     setFormData({
//       name: debt.name || "",
//       type: debt.type || "Credit Card",
//       totalAmount: String(debt.totalAmount ?? ""),
//       remainingAmount: String(debt.remainingAmount ?? ""),
//       interestRate: String(debt.interestRate ?? ""),
//       minimumPayment: String(debt.minimumPayment ?? ""),
//       dueDate: (debt.dueDate && String(debt.dueDate).split("T")?.[0]) || "",
//     });
//     setEditDialogOpen(true);
//   }

//   function handleEditSubmit() {
//     if (!editingDebt) return;
//     const id = editingDebt.id;
//     const payload = {
//       name: formData.name,
//       type: formData.type,
//       total_amount: Number(formData.totalAmount || 0),
//       remaining_amount: Number(formData.remainingAmount || 0),
//       interest_rate: Number(formData.interestRate || 0),
//       minimum_payment: Number(formData.minimumPayment || 0),
//       due_date: formData.dueDate || null,
//     };
//     updateDebt(id, payload);
//   }

//   async function makePayment(goal, amount) {
//     const debt = goal; // just naming alignment
//     const newRemaining = Math.max(
//       0,
//       Number(debt.remainingAmount || 0) - Number(amount || 0)
//     );
//     const payload = {
//       name: debt.name,
//       type: debt.type,
//       total_amount: Number(debt.totalAmount || 0),
//       remaining_amount: newRemaining,
//       interest_rate: Number(debt.interestRate || 0),
//       minimum_payment: Number(debt.minimumPayment || 0),
//       due_date: debt.dueDate || null,
//     };
//     await updateDebt(debt.id, payload);
//   }

//   // -------- derived values --------
//   const totalDebt = useMemo(
//     () => debts.reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0),
//     [debts]
//   );
//   const totalMinimumPayments = useMemo(
//     () => debts.reduce((sum, d) => sum + (Number(d.minimumPayment) || 0), 0),
//     [debts]
//   );
//   const averageInterestRate = useMemo(() => {
//     if (!debts.length) return 0;
//     const s = debts.reduce((sum, d) => sum + (Number(d.interestRate) || 0), 0);
//     return s / debts.length;
//   }, [debts]);

//   // -------- small utils for UI --------
//   const getProgressPercentage = (remaining, total) => {
//     const t = Number(total || 0);
//     const r = Number(remaining || 0);
//     if (t <= 0) return 0;
//     const val = ((t - r) / t) * 100;
//     return Math.min(100, Math.max(0, val));
//   };

//   const getDaysUntilDue = (dueDate) => {
//     if (!dueDate) return Number.NaN;
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due.getTime() - today.getTime();
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   // -------- RENDER --------
//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
//       {/* Header */}
//       {/* <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Debt Tracker
//           </h1>
//           <p className="text-gray-600 mt-2">Monitor and manage your debts to achieve financial freedom</p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button variant="outline" onClick={fetchDebts} disabled={loading}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             {loading ? "Loading..." : "Refresh"}
//           </Button>
//           <Badge variant="secondary" className="px-3 py-1">
//             <CreditCard className="w-4 h-4 mr-1" />
//             {debts.length} Active Debts
//           </Badge>
//         </div>
//       </div> */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         {/* Left Side: Title & Subtitle */}
//         <div>
//           <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Debt Tracker
//           </h1>
//           <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
//             Monitor and manage your debts to achieve financial freedom
//           </p>
//         </div>

//         {/* Right Side: Buttons & Badge */}
//         <div className="flex flex-wrap items-center gap-3">
//           <Button variant="outline" onClick={fetchDebts} disabled={loading}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             {loading ? "Loading..." : "Refresh"}
//           </Button>
//           <Badge variant="secondary" className="px-3 py-1">
//             <CreditCard className="w-4 h-4 mr-1" />
//             {debts.length} Active Debts
//           </Badge>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Debt</p>
//                 <p className="text-2xl font-bold text-red-600">
//                   ₹{Number(totalDebt).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Outstanding balance
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
//                 <TrendingDown className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Monthly Payments
//                 </p>
//                 <p className="text-2xl font-bold text-orange-600">
//                   ₹{Number(totalMinimumPayments).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">Minimum required</p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
//                 <Calendar className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Avg. Interest Rate
//                 </p>
//                 <p className="text-2xl font-bold text-purple-600">
//                   {Number(averageInterestRate).toFixed(1)}%
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">Across all debts</p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <Percent className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {/* Debt Cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {debts.map((debt, index) => {
//           const pct = getProgressPercentage(
//             debt.remainingAmount,
//             debt.totalAmount
//           );
//           const days = getDaysUntilDue(debt.dueDate);
//           const isOverdue = Number.isFinite(days) && days < 0;
//           const isDueSoon = Number.isFinite(days) && days >= 0 && days <= 7;

//           return (
//             <Card
//               key={String(debt.id)}
//               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className={`w-10 h-10 bg-gradient-to-r ${
//                         debt.color || randomGradient()
//                       } rounded-lg flex items-center justify-center`}
//                     >
//                       <CreditCard className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <CardTitle className="text-lg font-semibold text-gray-900">
//                         {debt.name}
//                       </CardTitle>
//                       <Badge variant="secondary" className="text-xs">
//                         {debt.type}
//                       </Badge>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {isOverdue && (
//                       <AlertTriangle className="w-5 h-5 text-red-500" />
//                     )}
//                     {isDueSoon && (
//                       <AlertTriangle className="w-5 h-5 text-yellow-500" />
//                     )}
//                     {Number(debt.remainingAmount) === 0 && (
//                       <CheckCircle className="w-5 h-5 text-green-500" />
//                     )}
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">
//                       Remaining: ₹
//                       {Number(debt.remainingAmount).toLocaleString()}
//                     </span>
//                     <span className="text-gray-600">
//                       Total: ₹{Number(debt.totalAmount).toLocaleString()}
//                     </span>
//                   </div>
//                   <Progress value={pct} className="h-3 [&>div]:bg-green-500" />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-green-600 font-medium">
//                       {pct.toFixed(1)}% paid off
//                     </span>
//                     <span className="text-gray-500">
//                       {Number(debt.interestRate)}% APR
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-gray-500">Minimum Payment</p>
//                     <p className="font-semibold text-gray-900">
//                       ₹{Number(debt.minimumPayment).toLocaleString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Due Date</p>
//                     <p
//                       className={`font-semibold ${
//                         isOverdue
//                           ? "text-red-600"
//                           : isDueSoon
//                           ? "text-yellow-600"
//                           : "text-gray-900"
//                       }`}
//                     >
//                       {debt.dueDate
//                         ? new Date(debt.dueDate).toLocaleDateString()
//                         : "—"}
//                     </p>
//                   </div>
//                 </div>

//                 {Number.isFinite(days) && (
//                   <div className="text-sm">
//                     <p className="text-gray-500">Days until due</p>
//                     <p
//                       className={`font-semibold ${
//                         isOverdue
//                           ? "text-red-600"
//                           : isDueSoon
//                           ? "text-yellow-600"
//                           : "text-gray-900"
//                       }`}
//                     >
//                       {isOverdue
//                         ? `${Math.abs(days)} days overdue`
//                         : `${days} days`}
//                     </p>
//                   </div>
//                 )}

//                 {/* <div className="flex space-x-2 pt-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => makePayment(debt, debt.minimumPayment || 0)}
//                     className="flex-1 bg-transparent hover:bg-green-50"
//                   >
//                     <DollarSign className="w-4 h-4 mr-1" />
//                     Pay Minimum
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleEditOpen(debt)}
//                     className="flex-1 bg-transparent"
//                   >
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => deleteDebt(debt.id)}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div> */}
//                 <div className="flex flex-col sm:flex-row gap-2 pt-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => makePayment(debt, debt.minimumPayment || 0)}
//                     className="flex-1 bg-transparent hover:bg-green-50"
//                   >
//                     <DollarSign className="w-4 h-4 mr-1" />
//                     Pay Minimum
//                   </Button>

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleEditOpen(debt)}
//                     className="flex-1 bg-transparent"
//                   >
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>

//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => deleteDebt(debt.id)}
//                     className="flex-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     <span className="sm:inline hidden">Delete</span>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}

//         {/* Add New Debt Card */}
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
//               <CardContent className="p-12 text-center">
//                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   <Plus className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Add New Debt
//                 </h3>
//                 <p className="text-gray-600">Track a new debt or loan</p>
//               </CardContent>
//             </Card>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center">
//                 <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
//                 Add New Debt
//               </DialogTitle>
//               <p className="text-gray-600">
//                 Add a new debt to track your payments
//               </p>
//             </DialogHeader>

//             <div className="space-y-4 mt-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Debt Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   placeholder="e.g., Credit Card - HDFC"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="type">Debt Type</Label>
//                 <Select
//                   value={formData.type}
//                   onValueChange={(v) => setFormData((f) => ({ ...f, type: v }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {debtTypes.map((t) => (
//                       <SelectItem key={t} value={t}>
//                         {t}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="totalAmount">Total Amount</Label>
//                   <Input
//                     id="totalAmount"
//                     name="totalAmount"
//                     type="number"
//                     value={formData.totalAmount}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="remainingAmount">Remaining Amount</Label>
//                   <Input
//                     id="remainingAmount"
//                     name="remainingAmount"
//                     type="number"
//                     value={formData.remainingAmount}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="interestRate">Interest Rate (%)</Label>
//                   <Input
//                     id="interestRate"
//                     name="interestRate"
//                     type="number"
//                     step="0.1"
//                     value={formData.interestRate}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="minimumPayment">Minimum Payment</Label>
//                   <Input
//                     id="minimumPayment"
//                     name="minimumPayment"
//                     type="number"
//                     value={formData.minimumPayment}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="dueDate">Due Date</Label>
//                 <Input
//                   id="dueDate"
//                   name="dueDate"
//                   type="date"
//                   value={formData.dueDate}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <DialogFooter className="mt-6">
//               <Button variant="outline" onClick={() => setDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleAddSubmit}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//               >
//                 <Plus className="w-4 h-4 mr-2" /> Add Debt
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Edit Debt Dialog */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center">
//               <Edit className="w-5 h-5 mr-2 text-blue-600" />
//               Edit Debt
//             </DialogTitle>
//             <p className="text-gray-600">Update your debt information</p>
//           </DialogHeader>

//           <div className="space-y-4 mt-4">
//             <div className="space-y-2">
//               <Label htmlFor="edit-name">Debt Name</Label>
//               <Input
//                 id="edit-name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="edit-type">Debt Type</Label>
//               <Select
//                 value={formData.type}
//                 onValueChange={(v) => setFormData((f) => ({ ...f, type: v }))}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {debtTypes.map((t) => (
//                     <SelectItem key={t} value={t}>
//                       {t}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="edit-totalAmount">Total Amount</Label>
//                 <Input
//                   id="edit-totalAmount"
//                   name="totalAmount"
//                   type="number"
//                   value={formData.totalAmount}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="edit-remainingAmount">Remaining Amount</Label>
//                 <Input
//                   id="edit-remainingAmount"
//                   name="remainingAmount"
//                   type="number"
//                   value={formData.remainingAmount}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="edit-interestRate">Interest Rate (%)</Label>
//                 <Input
//                   id="edit-interestRate"
//                   name="interestRate"
//                   type="number"
//                   step="0.1"
//                   value={formData.interestRate}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="edit-minimumPayment">Minimum Payment</Label>
//                 <Input
//                   id="edit-minimumPayment"
//                   name="minimumPayment"
//                   type="number"
//                   value={formData.minimumPayment}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="edit-dueDate">Due Date</Label>
//               <Input
//                 id="edit-dueDate"
//                 name="dueDate"
//                 type="date"
//                 value={formData.dueDate}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <DialogFooter className="mt-6">
//             <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleEditSubmit}
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//             >
//               <CheckCircle className="w-4 h-4 mr-2" /> Update Debt
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Empty State */}
//       {debts.length === 0 && !loading && (
//         <Card className="border-0 shadow-lg">
//           <CardContent className="p-12 text-center">
//             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CreditCard className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               No Debts to Track
//             </h3>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               Add your debts to monitor balances, due dates, and progress over
//               time.
//             </p>
//             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   size="lg"
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
//                 >
//                   <Plus className="w-5 h-5 mr-2" /> Add Your First Debt
//                 </Button>
//               </DialogTrigger>
//             </Dialog>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default Debttracker;

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  CreditCard,
  RefreshCw,
  TrendingDown,
  Calendar,
  Percent,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit,
  Plus,
  IndianRupee,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

// ---------- CONFIG (Goals style) ----------
const API_URL = `${API_BASE}/debts/`;
const USER_ID =
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;

// ---------- helpers ----------
const GRAD_COLORS = [
  "red",
  "orange",
  "amber",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
];
function randomGradient() {
  const c = GRAD_COLORS[Math.floor(Math.random() * GRAD_COLORS.length)];
  const c2 = GRAD_COLORS[Math.floor(Math.random() * GRAD_COLORS.length)];
  return `from-${c}-500 to-${c2}-600`;
}

// Backend id may come as id / _id / _id.$oid
function normalizeId(raw) {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (raw.id) return raw.id;
  if (raw._id && typeof raw._id === "string") return raw._id;
  if (raw._id && typeof raw._id === "object" && raw._id.$oid)
    return raw._id.$oid;
  if (raw.pk) return raw.pk;
  return "";
}

function normalizeDebt(raw) {
  const id = normalizeId(raw);
  const dueDateValue =
    raw?.due_date ??
    raw?.dueDate ??
    (raw?.due_date ? String(raw.due_date).split("T")[0] : "") ??
    "";

  return {
    id,
    name: raw?.name ?? "",
    type: raw?.type ?? "Credit Card",
    totalAmount: Number(raw?.total_amount ?? raw?.totalAmount ?? 0),
    remainingAmount: Number(raw?.remaining_amount ?? raw?.remainingAmount ?? 0),
    interestRate: Number(raw?.interest_rate ?? raw?.interestRate ?? 0),
    minimumPayment: Number(raw?.minimum_payment ?? raw?.minimumPayment ?? 0),
    dueDate: dueDateValue,
    color: raw?.color || randomGradient(),
    user_id: normalizeId(raw?.user_id) || USER_ID || "",
    raw,
  };
}

function showToast(msg, color = "blue") {
  const div = document.createElement("div");
  div.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`;
  div.innerText = msg;
  document.body.appendChild(div);
  setTimeout(() => document.body.removeChild(div), 2500);
}

// ---------- Component ----------
const Debttracker = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Credit Card",
    totalAmount: "",
    remainingAmount: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
  });

  const mountedRef = useRef(false);

  const debtTypes = [
    "Credit Card",
    "Personal Loan",
    "Auto Loan",
    "Home Loan",
    "Student Loan",
    "Other",
  ];

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  // -------- API: LIST (filtered by user) --------
  async function fetchDebts() {
    try {
      setLoading(true);
      if (!USER_ID || USER_ID === "null" || USER_ID === "undefined") {
        // Agar login nahi hai -> debts ko empty set karo
        if (mountedRef.current) setDebts([]);
        return;
      }

      const url = `${API_URL}?user_id=${encodeURIComponent(USER_ID)}`;
      const res = await fetch(url);
      const data = await res.json();
      const normalized = Array.isArray(data) ? data.map(normalizeDebt) : [];
      if (mountedRef.current) setDebts(normalized);
    } catch (err) {
      console.error("Error fetching debts:", err);
      showToast("Failed to fetch debts", "red");
    } finally {
      setLoading(false);
    }
  }

  // -------- API: CREATE --------
  async function createDebt() {
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        total_amount: Number(formData.totalAmount || 0),
        remaining_amount: Number(formData.remainingAmount || 0),
        interest_rate: Number(formData.interestRate || 0),
        minimum_payment: Number(formData.minimumPayment || 0),
        due_date: formData.dueDate || null,
        user_id: USER_ID || null,
      };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to create debt");
      }
      await fetchDebts();
      setDialogOpen(false);
      resetForm();
      showToast("Debt created!", "green");
    } catch (err) {
      console.error("Error creating debt:", err);
      showToast("Create failed", "red");
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      type: "Credit Card",
      totalAmount: "",
      remainingAmount: "",
      interestRate: "",
      minimumPayment: "",
      dueDate: "",
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    fetchDebts();
    return () => {
      mountedRef.current = false;
    };
  }, []);
  // -------- API: UPDATE --------
  async function updateDebt(id, patch) {
    const debtId = typeof id === "string" ? id : normalizeId(id);
    if (!debtId) return showToast("Invalid id", "red");
    try {
      const res = await fetch(`${API_URL}${debtId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patch, user_id: USER_ID || null }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to update");
      }
      await fetchDebts();
      setEditDialogOpen(false);
      setEditingDebt(null);
      resetForm();
      showToast("Debt updated", "blue");
    } catch (err) {
      console.error("Error updating debt:", err);
      showToast("Update failed", "red");
    }
  }

  // -------- API: DELETE --------
  async function deleteDebt(id) {
    const debtId = typeof id === "string" ? id : normalizeId(id);
    if (!debtId) return showToast("Invalid id", "red");
    try {
      const res = await fetch(`${API_URL}${debtId}/`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const t = await res.text();
        throw new Error(t || "Failed to delete");
      }
      setDebts((list) => list.filter((d) => normalizeId(d.id) !== debtId));
      showToast("Debt deleted", "red");
    } catch (err) {
      console.error("Error deleting debt:", err);
      showToast("Delete failed", "red");
    }
  }

  // -------- UI handlers --------
  function handleAddSubmit() {
    createDebt();
  }

  function handleEditOpen(debt) {
    setEditingDebt(debt);
    setFormData({
      name: debt.name || "",
      type: debt.type || "Credit Card",
      totalAmount: String(debt.totalAmount ?? ""),
      remainingAmount: String(debt.remainingAmount ?? ""),
      interestRate: String(debt.interestRate ?? ""),
      minimumPayment: String(debt.minimumPayment ?? ""),
      dueDate: (debt.dueDate && String(debt.dueDate).split("T")?.[0]) || "",
    });
    setEditDialogOpen(true);
  }

  function handleEditSubmit() {
    if (!editingDebt) return;
    const id = editingDebt.id;
    const payload = {
      name: formData.name,
      type: formData.type,
      total_amount: Number(formData.totalAmount || 0),
      remaining_amount: Number(formData.remainingAmount || 0),
      interest_rate: Number(formData.interestRate || 0),
      minimum_payment: Number(formData.minimumPayment || 0),
      due_date: formData.dueDate || null,
    };
    updateDebt(id, payload);
  }

  async function makePayment(goal, amount) {
    const debt = goal; // just naming alignment
    const newRemaining = Math.max(
      0,
      Number(debt.remainingAmount || 0) - Number(amount || 0)
    );
    const payload = {
      name: debt.name,
      type: debt.type,
      total_amount: Number(debt.totalAmount || 0),
      remaining_amount: newRemaining,
      interest_rate: Number(debt.interestRate || 0),
      minimum_payment: Number(debt.minimumPayment || 0),
      due_date: debt.dueDate || null,
    };
    await updateDebt(debt.id, payload);
  }

  // -------- derived values --------
  const totalDebt = useMemo(
    () => debts.reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0),
    [debts]
  );
  const totalMinimumPayments = useMemo(
    () => debts.reduce((sum, d) => sum + (Number(d.minimumPayment) || 0), 0),
    [debts]
  );
  const averageInterestRate = useMemo(() => {
    if (!debts.length) return 0;
    const s = debts.reduce((sum, d) => sum + (Number(d.interestRate) || 0), 0);
    return s / debts.length;
  }, [debts]);

  // -------- small utils for UI --------
  const getProgressPercentage = (remaining, total) => {
    const t = Number(total || 0);
    const r = Number(remaining || 0);
    if (t <= 0) return 0;
    const val = ((t - r) / t) * 100;
    return Math.min(100, Math.max(0, val));
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return Number.NaN;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // -------- RENDER --------
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your debt information...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          {/* <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Debt Tracker
              </h1>
              <p className="text-gray-600 mt-2">Monitor and manage your debts to achieve financial freedom</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={fetchDebts} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                <CreditCard className="w-4 h-4 mr-1" />
                {debts.length} Active Debts
              </Badge>
            </div>
          </div> */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Side: Title & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Debt Tracker
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Monitor and manage your debts to achieve financial freedom
              </p>
            </div>

            {/* Right Side: Buttons & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={fetchDebts} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                <CreditCard className="w-4 h-4 mr-1" />
                {debts.length} Active Debts
              </Badge>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Debt
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{Number(totalDebt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Outstanding balance
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Monthly Payments
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{Number(totalMinimumPayments).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum required
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Avg. Interest Rate
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Number(averageInterestRate).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Across all debts
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Debt Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {debts.map((debt, index) => {
              const pct = getProgressPercentage(
                debt.remainingAmount,
                debt.totalAmount
              );
              const days = getDaysUntilDue(debt.dueDate);
              const isOverdue = Number.isFinite(days) && days < 0;
              const isDueSoon = Number.isFinite(days) && days >= 0 && days <= 7;

              return (
                <Card
                  key={String(debt.id)}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${
                            debt.color || randomGradient()
                          } rounded-lg flex items-center justify-center`}
                        >
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {debt.name}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {debt.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isOverdue && (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                        {isDueSoon && (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                        {Number(debt.remainingAmount) === 0 && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Remaining: ₹
                          {Number(debt.remainingAmount).toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          Total: ₹{Number(debt.totalAmount).toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={pct}
                        className="h-3 [&>div]:bg-green-500"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-medium">
                          {pct.toFixed(1)}% paid off
                        </span>
                        <span className="text-gray-500">
                          {Number(debt.interestRate)}% APR
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Minimum Payment</p>
                        <p className="font-semibold text-gray-900">
                          ₹{Number(debt.minimumPayment).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Due Date</p>
                        <p
                          className={`font-semibold ${
                            isOverdue
                              ? "text-red-600"
                              : isDueSoon
                              ? "text-yellow-600"
                              : "text-gray-900"
                          }`}
                        >
                          {debt.dueDate
                            ? new Date(debt.dueDate).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {Number.isFinite(days) && (
                      <div className="text-sm">
                        <p className="text-gray-500">Days until due</p>
                        <p
                          className={`font-semibold ${
                            isOverdue
                              ? "text-red-600"
                              : isDueSoon
                              ? "text-yellow-600"
                              : "text-gray-900"
                          }`}
                        >
                          {isOverdue
                            ? `${Math.abs(days)} days overdue`
                            : `${days} days`}
                        </p>
                      </div>
                    )}

                    {/* <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => makePayment(debt, debt.minimumPayment || 0)}
                        className="flex-1 bg-transparent hover:bg-green-50"
                      >
                        <IndianRupee className="w-4 h-4 mr-1" />
                        Pay Minimum
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOpen(debt)}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDebt(debt.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div> */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          makePayment(debt, debt.minimumPayment || 0)
                        }
                        className="flex-1 bg-transparent hover:bg-green-50"
                      >
                        <IndianRupee className="w-4 h-4 mr-1" />
                        Pay Minimum
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOpen(debt)}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDebt(debt.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sm:inline hidden">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Add New Debt Card */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Add New Debt
                    </h3>
                    <p className="text-gray-600">Track a new debt or loan</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Add New Debt
                  </DialogTitle>
                  <p className="text-gray-600">
                    Add a new debt to track your payments
                  </p>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Debt Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Credit Card - HDFC"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Debt Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData((f) => ({ ...f, type: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {debtTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input
                        id="totalAmount"
                        name="totalAmount"
                        type="number"
                        value={formData.totalAmount}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remainingAmount">Remaining Amount</Label>
                      <Input
                        id="remainingAmount"
                        name="remainingAmount"
                        type="number"
                        value={formData.remainingAmount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <Input
                        id="interestRate"
                        name="interestRate"
                        type="number"
                        step="0.1"
                        value={formData.interestRate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimumPayment">Minimum Payment</Label>
                      <Input
                        id="minimumPayment"
                        name="minimumPayment"
                        type="number"
                        value={formData.minimumPayment}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSubmit}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Debt
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Debt Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2 text-blue-600" />
                  Edit Debt
                </DialogTitle>
                <p className="text-gray-600">Update your debt information</p>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Debt Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type">Debt Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) =>
                      setFormData((f) => ({ ...f, type: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {debtTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-totalAmount">Total Amount</Label>
                    <Input
                      id="edit-totalAmount"
                      name="totalAmount"
                      type="number"
                      value={formData.totalAmount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-remainingAmount">
                      Remaining Amount
                    </Label>
                    <Input
                      id="edit-remainingAmount"
                      name="remainingAmount"
                      type="number"
                      value={formData.remainingAmount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-interestRate">Interest Rate (%)</Label>
                    <Input
                      id="edit-interestRate"
                      name="interestRate"
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-minimumPayment">Minimum Payment</Label>
                    <Input
                      id="edit-minimumPayment"
                      name="minimumPayment"
                      type="number"
                      value={formData.minimumPayment}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input
                    id="edit-dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Update Debt
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Empty State */}
          {debts.length === 0 && !loading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No Debts to Track
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Add your debts to monitor balances, due dates, and progress
                  over time.
                </p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
                    >
                      <Plus className="w-5 h-5 mr-2" /> Add Your First Debt
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Debttracker;
