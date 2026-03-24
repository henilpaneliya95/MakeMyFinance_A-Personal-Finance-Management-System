// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
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
// import {
//   Target,
//   Plus,
//   Edit,
//   Trash2,
//   TrendingDown,
//   AlertTriangle,
//   CheckCircle,
//   DollarSign,
//   PieChart,
//   RefreshCw,
// } from "lucide-react";

// const Budgets = () => {
//   const [budgets, setBudgets] = useState([]);
//   const [viewType, setViewType] = useState("monthly"); // Default view type (lowercase for internal state)
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingBudget, setEditingBudget] = useState(null);

//   const [formData, setFormData] = useState({
//     category: "", // Maps to API 'name'
//     budgetAmount: "", // Maps to API 'limit'
//     period: "monthly", // Maps to API 'type', default to monthly (lowercase)
//     date: new Date().toISOString(), // Required by backend, set to current date
//   });

//   const categories = [
//     // # Income Categories
//     "salary",
//     "freelance",
//     "business",
//     "investment",
//     "rental_income",
//     "gift",
//     "cashback",
//     "bonus",
//     "commission",
//     "other_income",

//     // # Expense Categories
//     "groceries",
//     "rent",
//     "utilities",
//     "internet",
//     "transportation",
//     "education",
//     "health",
//     "shopping",
//     "travel",
//     "other_expense",
//     "other",
//   ];

//   // Backend expects capitalized types: "Daily", "Weekly", "Monthly", "Yearly"
//   const budgetPeriods = ["daily", "weekly", "monthly", "yearly"];

//   // Helper to capitalize the first letter for display and API calls
//   const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

//   // Function to display toast messages
//   const showToast = useCallback((message, type) => {
//     const toastDiv = document.createElement("div");
//     toastDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right ${
//       type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
//     }`;
//     toastDiv.innerHTML = `
//       <div class="flex items-center space-x-2">
//         <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//           ${
//             type === "success"
//               ? `<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>`
//               : `<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>`
//           }
//         </svg>
//         <span>${message}</span>
//       </div>
//     `;
//     document.body.appendChild(toastDiv);
//     setTimeout(() => document.body.removeChild(toastDiv), 3000);
//   }, []);

//   const fetchBudgets = useCallback(async () => {
//     const accountId = localStorage.getItem("selectedAccountId");
//     const userId = localStorage.getItem("userId"); // ✅ added user id

//     if (!accountId || !userId) {
//       showToast(
//         "No account or user selected. Please select an account.",
//         "error"
//       );
//       setBudgets([]); // Clear budgets if no account/user is selected
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/budgets/accounts/${accountId}/`,
//         { params: { user_id: userId } } // ✅ send user id to backend
//       );
//       // Filter budgets by viewType (capitalized) on the client side to match backend 'type' field
//       setBudgets(
//         res.data.filter((budget) => budget.type === capitalize(viewType))
//       );
//     } catch (error) {
//       console.error("Failed to fetch budgets:", error);
//       showToast("Failed to load budgets. Please try again.", "error");
//       setBudgets([]); // Clear budgets on error
//     }
//   }, [viewType, showToast]);

//   useEffect(() => {
//     fetchBudgets();
//   }, [fetchBudgets]);

//   const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
//   const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
//   const totalRemaining = totalBudget - totalSpent;

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     const userId = localStorage.getItem("userId");
//     const accountId = localStorage.getItem("selectedAccountId");

//     if (!userId || !accountId) {
//       showToast(
//         "User ID or Account ID not found. Cannot create budget.",
//         "error"
//       );
//       return;
//     }

//     if (!formData.category || !formData.budgetAmount || !formData.period) {
//       showToast("Please fill all budget fields.", "error");
//       return;
//     }

//     const newBudgetPayload = {
//       user_id: userId,
//       account_id: accountId,
//       name: formData.category,
//       limit: Number.parseFloat(formData.budgetAmount),
//       spent: 0,
//       type: capitalize(formData.period), // Capitalize for backend
//       date: formData.date, // Send the date
//       toggle: false,
//       // spent, remaining, toggle are handled by backend serializer
//     };

//     try {
//       await axios.post("http://localhost:8000/api/budgets/", newBudgetPayload);
//       setDialogOpen(false);
//       setFormData({
//         category: "",
//         budgetAmount: "",
//         period: viewType,
//         date: new Date().toISOString(),
//       }); // Reset form and date
//       showToast("Budget created successfully!", "success");
//       fetchBudgets(); // Re-fetch budgets to update the list
//     } catch (error) {
//       console.error("Failed to create budget:", error);
//       showToast("Failed to create budget. Please try again.", "error");
//     }
//   };

//   const handleEditSubmit = async () => {
//     if (!editingBudget) return;

//     if (!formData.category || !formData.budgetAmount || !formData.period) {
//       showToast("Please fill all budget fields.", "error");
//       return;
//     }

//     const updatedBudgetPayload = {
//       name: formData.category,
//       limit: Number.parseFloat(formData.budgetAmount),
//       type: capitalize(formData.period), // Capitalize for backend
//       date: formData.date, // Send the date, even if unchanged
//       // spent, remaining, toggle are handled by backend serializer
//     };

//     try {
//       await axios.put(
//         `http://localhost:8000/api/budgets/${editingBudget.id}/`, // Use .id from serializer, and specific update path
//         updatedBudgetPayload
//       );
//       setEditDialogOpen(false);
//       setEditingBudget(null);
//       setFormData({
//         category: "",
//         budgetAmount: "",
//         period: viewType,
//         date: new Date().toISOString(),
//       }); // Reset form and date
//       showToast("Budget updated successfully!", "success");
//       fetchBudgets(); // Re-fetch budgets to update the list
//     } catch (error) {
//       console.error("Failed to update budget:", error);
//       showToast("Failed to update budget. Please try again.", "error");
//     }
//   };

//   const getProgressPercentage = (spent, budgetLimit) =>
//     budgetLimit === 0 ? 0 : (spent / budgetLimit) * 100;

//   const getProgressStatus = (percentage) => {
//     if (percentage >= 100) return "over";
//     if (percentage >= 80) return "warning";
//     return "good";
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/budgets/${id}/`); // Use specific delete path
//       showToast("Budget deleted successfully!", "success");
//       fetchBudgets(); // Re-fetch budgets to update the list
//     } catch (error) {
//       console.error("Failed to delete budget:", error);
//       showToast("Failed to delete budget. Please try again.", "error");
//     }
//   };

//   const handleEdit = (budgetId) => {
//     const budgetToEdit = budgets.find((budget) => budget.id === budgetId); // Use .id from serializer
//     if (budgetToEdit) {
//       setEditingBudget(budgetToEdit);
//       setFormData({
//         category: budgetToEdit.name,
//         budgetAmount: budgetToEdit.limit.toString(),
//         period: budgetToEdit.type.toLowerCase(), // Convert to lowercase for internal state
//         date: budgetToEdit.date, // Populate date from existing budget
//       });
//       setEditDialogOpen(true);
//     }
//   };

//   const cycleViewType = () => {
//     const currentIndex = budgetPeriods.indexOf(viewType);
//     const nextIndex = (currentIndex + 1) % budgetPeriods.length;
//     setViewType(budgetPeriods[nextIndex]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Budget Management
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Track your spending and stay within your budget limits
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button onClick={cycleViewType}>
//             Switch to{" "}
//             {capitalize(
//               budgetPeriods[
//                 (budgetPeriods.indexOf(viewType) + 1) % budgetPeriods.length
//               ]
//             )}{" "}
//             View
//           </Button>
//           <Button variant="outline" onClick={fetchBudgets}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//           <Badge variant="secondary" className="px-3 py-1">
//             <Target className="w-4 h-4 mr-1" />
//             {budgets.length} Active {capitalize(viewType)} Budgets
//           </Badge>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Total Budget ({capitalize(viewType)})
//                 </p>
//                 <p className="text-2xl font-bold text-blue-600">
//                   ₹{totalBudget.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Current {viewType} period
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Spent</p>
//                 <p className="text-2xl font-bold text-red-600">
//                   ₹{totalSpent.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalBudget > 0
//                     ? ((totalSpent / totalBudget) * 100).toFixed(1)
//                     : 0}
//                   % of budget
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
//                 <p className="text-sm text-gray-500 font-medium">Remaining</p>
//                 <p
//                   className={`text-2xl font-bold ${
//                     totalRemaining >= 0 ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   ₹{Math.abs(totalRemaining).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalRemaining >= 0 ? "Available" : "Over budget"}
//                 </p>
//               </div>
//               <div
//                 className={`w-12 h-12 bg-gradient-to-r ${
//                   totalRemaining >= 0
//                     ? "from-green-500 to-green-600"
//                     : "from-red-500 to-red-600"
//                 } rounded-lg flex items-center justify-center`}
//               >
//                 <DollarSign className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Budget Categories */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {budgets.map((budget, index) => {
//           const percentage = getProgressPercentage(budget.spent, budget.limit);
//           const status = getProgressStatus(percentage);
//           const remaining = budget.limit - budget.spent;

//           return (
//             <Card
//               key={budget.id} // Use .id from serializer for key
//               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className={`w-10 h-10 bg-gradient-to-r ${
//                         budget.color || "from-gray-500 to-gray-600"
//                       } rounded-lg flex items-center justify-center`}
//                     >
//                       <PieChart className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <CardTitle className="text-lg font-semibold text-gray-900">
//                         {budget.name}
//                       </CardTitle>
//                       <Badge variant="secondary" className="text-xs capitalize">
//                         {budget.type}
//                       </Badge>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {status === "over" && (
//                       <AlertTriangle className="w-5 h-5 text-red-500" />
//                     )}
//                     {status === "warning" && (
//                       <AlertTriangle className="w-5 h-5 text-yellow-500" />
//                     )}
//                     {status === "good" && (
//                       <CheckCircle className="w-5 h-5 text-green-500" />
//                     )}
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">
//                       Spent: ₹{budget.spent.toLocaleString()}
//                     </span>
//                     <span className="text-gray-600">
//                       Budget: ₹{budget.limit.toLocaleString()}
//                     </span>
//                   </div>
//                   <Progress
//                     value={Math.min(percentage, 100)}
//                     className={`h-3 ${
//                       status === "over"
//                         ? "[&>div]:bg-red-500"
//                         : status === "warning"
//                         ? "[&>div]:bg-yellow-500"
//                         : "[&>div]:bg-green-500"
//                     }`}
//                   />
//                   <div className="flex justify-between text-sm">
//                     <span
//                       className={`font-medium ${
//                         remaining >= 0 ? "text-green-600" : "text-red-600"
//                       }`}
//                     >
//                       {remaining >= 0
//                         ? `₹${remaining.toLocaleString()} remaining`
//                         : `₹${Math.abs(
//                             remaining
//                           ).toLocaleString()} over budget`}
//                     </span>
//                     <span className="text-gray-500">
//                       {percentage.toFixed(1)}%
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex space-x-2 pt-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleEdit(budget.id)} // Pass .id from serializer
//                     className="flex-1 bg-transparent"
//                   >
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(budget.id)} // Pass .id from serializer
//                     className="flex-1"
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" />
//                     Delete
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}

//         {/* Add New Budget Card */}
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
//               <CardContent className="p-12 text-center">
//                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   <Plus className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Create New Budget
//                 </h3>
//                 <p className="text-gray-600">
//                   Set spending limits for different categories
//                 </p>
//               </CardContent>
//             </Card>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center">
//                 <Target className="w-5 h-5 mr-2 text-blue-600" />
//                 Create New Budget
//               </DialogTitle>
//               <p className="text-gray-600">
//                 Set spending limits to control your expenses
//               </p>
//             </DialogHeader>
//             <div className="space-y-4 mt-4">
//               <div className="space-y-2">
//                 <Label htmlFor="category">Category</Label>
//                 <Select
//                   value={formData.category}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, category: value })
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="budgetAmount">Budget Amount</Label>
//                 <Input
//                   id="budgetAmount"
//                   name="budgetAmount"
//                   type="number"
//                   placeholder="Enter budget amount"
//                   value={formData.budgetAmount}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="period">Period</Label>
//                 <Select
//                   value={formData.period}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, period: value })
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select period" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {budgetPeriods.map((period) => (
//                       <SelectItem key={period} value={period}>
//                         {capitalize(period)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <DialogFooter className="mt-6">
//               <Button variant="outline" onClick={() => setDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Create Budget
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Edit Budget Dialog */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center">
//               <Edit className="w-5 h-5 mr-2 text-blue-600" />
//               Edit Budget
//             </DialogTitle>
//             <p className="text-gray-600">Update your budget settings</p>
//           </DialogHeader>
//           <div className="space-y-4 mt-4">
//             <div className="space-y-2">
//               <Label htmlFor="edit-category">Category</Label>
//               <Select
//                 value={formData.category}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, category: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="edit-budgetAmount">Budget Amount</Label>
//               <Input
//                 id="edit-budgetAmount"
//                 name="budgetAmount"
//                 type="number"
//                 value={formData.budgetAmount}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="edit-period">Period</Label>
//               <Select
//                 value={formData.period}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, period: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {budgetPeriods.map((period) => (
//                     <SelectItem key={period} value={period}>
//                       {capitalize(period)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
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
//               <CheckCircle className="w-4 h-4 mr-2" />
//               Update Budget
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Budgets;



"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Target,
  Plus,
  Edit,
  Trash2,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  PieChart,
  RefreshCw,
} from "lucide-react"
import { API_BASE } from "@/lib/api"

const Budgets = () => {
  const [budgets, setBudgets] = useState([])
  const [viewType, setViewType] = useState("monthly") // Default view type (lowercase for internal state)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  const [formData, setFormData] = useState({
    category: "", // Maps to API 'name'
    budgetAmount: "", // Maps to API 'limit'
    period: "monthly", // Maps to API 'type', default to monthly (lowercase)
    date: new Date().toISOString(), // Required by backend, set to current date
  })

  const categories = [
    // # Income Categories
    "salary",
    "freelance",
    "business",
    "investment",
    "rental_income",
    "gift",
    "cashback",
    "bonus",
    "commission",
    "other_income",

    // # Expense Categories
    "groceries",
    "rent",
    "utilities",
    "internet",
    "transportation",
    "education",
    "health",
    "shopping",
    "travel",
    "other_expense",
    "other",
  ]

  // Backend expects capitalized types: "Daily", "Weekly", "Monthly", "Yearly"
  const budgetPeriods = ["daily", "weekly", "monthly", "yearly"]

  // Helper to capitalize the first letter for display and API calls
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  // Function to display toast messages
  const showToast = useCallback((message, type) => {
    const toastDiv = document.createElement("div")
    toastDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`
    toastDiv.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          ${
            type === "success"
              ? `<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>`
              : `<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L8.707 7.293z" clipRule="evenodd"></path>`
          }
        </svg>
        <span>${message}</span>
      </div>
    `
    document.body.appendChild(toastDiv)
    setTimeout(() => document.body.removeChild(toastDiv), 3000)
  }, [])

  const fetchBudgets = useCallback(async () => {
    const accountId = localStorage.getItem("selectedAccountId")
    const userId = localStorage.getItem("userId") // ✅ added user id

    if (!accountId || !userId) {
      showToast("No account or user selected. Please select an account.", "error")
      setBudgets([]) // Clear budgets if no account/user is selected
      return
    }

    try {
      const res = await axios.get(
        `${API_BASE}/budgets/accounts/${accountId}/`,
        { params: { user_id: userId } }, // ✅ send user id to backend
      )
      // Filter budgets by viewType (capitalized) on the client side to match backend 'type' field
      setBudgets(res.data.filter((budget) => budget.type === capitalize(viewType)))
    } catch (error) {
      console.error("Failed to fetch budgets:", error)
      showToast("Failed to load budgets. Please try again.", "error")
      setBudgets([]) // Clear budgets on error
    }
  }, [viewType, showToast])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId")
    const accountId = localStorage.getItem("selectedAccountId")

    if (!userId || !accountId) {
      showToast("User ID or Account ID not found. Cannot create budget.", "error")
      return
    }

    if (!formData.category || !formData.budgetAmount || !formData.period) {
      showToast("Please fill all budget fields.", "error")
      return
    }

    const newBudgetPayload = {
      user_id: userId,
      account_id: accountId,
      name: formData.category,
      limit: Number.parseFloat(formData.budgetAmount),
      spent: 0,
      type: capitalize(formData.period), // Capitalize for backend
      date: formData.date, // Send the date
      toggle: false,
      // spent, remaining, toggle are handled by backend serializer
    }

    try {
      await axios.post(`${API_BASE}/budgets/`, newBudgetPayload)
      setDialogOpen(false)
      setFormData({
        category: "",
        budgetAmount: "",
        period: viewType,
        date: new Date().toISOString(),
      }) // Reset form and date
      showToast("Budget created successfully!", "success")
      fetchBudgets() // Re-fetch budgets to update the list
    } catch (error) {
      console.error("Failed to create budget:", error)
      showToast("Failed to create budget. Please try again.", "error")
    }
  }

  const handleEditSubmit = async () => {
    if (!editingBudget) return

    if (!formData.category || !formData.budgetAmount || !formData.period) {
      showToast("Please fill all budget fields.", "error")
      return
    }

    const updatedBudgetPayload = {
      name: formData.category,
      limit: Number.parseFloat(formData.budgetAmount),
      type: capitalize(formData.period), // Capitalize for backend
      date: formData.date, // Send the date, even if unchanged
      // spent, remaining, toggle are handled by backend serializer
    }

    try {
      await axios.put(
        `${API_BASE}/budgets/${editingBudget.id}/`, // Use .id from serializer, and specific update path
        updatedBudgetPayload,
      )
      setEditDialogOpen(false)
      setEditingBudget(null)
      setFormData({
        category: "",
        budgetAmount: "",
        period: viewType,
        date: new Date().toISOString(),
      }) // Reset form and date
      showToast("Budget updated successfully!", "success")
      fetchBudgets() // Re-fetch budgets to update the list
    } catch (error) {
      console.error("Failed to update budget:", error)
      showToast("Failed to update budget. Please try again.", "error")
    }
  }

  const getProgressPercentage = (spent, budgetLimit) => (budgetLimit === 0 ? 0 : (spent / budgetLimit) * 100)

  const getProgressStatus = (percentage) => {
    if (percentage >= 100) return "over"
    if (percentage >= 80) return "warning"
    return "good"
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/budgets/${id}/`) // Use specific delete path
      showToast("Budget deleted successfully!", "success")
      fetchBudgets() // Re-fetch budgets to update the list
    } catch (error) {
      console.error("Failed to delete budget:", error)
      showToast("Failed to delete budget. Please try again.", "error")
    }
  }

  const handleEdit = (budgetId) => {
    const budgetToEdit = budgets.find((budget) => budget.id === budgetId) // Use .id from serializer
    if (budgetToEdit) {
      setEditingBudget(budgetToEdit)
      setFormData({
        category: budgetToEdit.name,
        budgetAmount: budgetToEdit.limit.toString(),
        period: budgetToEdit.type.toLowerCase(), // Convert to lowercase for internal state
        date: budgetToEdit.date, // Populate date from existing budget
      })
      setEditDialogOpen(true)
    }
  }

  const cycleViewType = () => {
    const currentIndex = budgetPeriods.indexOf(viewType)
    const nextIndex = (currentIndex + 1) % budgetPeriods.length
    setViewType(budgetPeriods[nextIndex])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Budget Management
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Track your spending and stay within your budget limits
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button onClick={cycleViewType} size="sm" className="text-xs sm:text-sm">
              Switch to {capitalize(budgetPeriods[(budgetPeriods.indexOf(viewType) + 1) % budgetPeriods.length])} View
            </Button>
            <Button variant="outline" onClick={fetchBudgets} size="sm">
              <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {budgets.length} Active {capitalize(viewType)} Budgets
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Budget ({capitalize(viewType)})</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 truncate">
                    ₹{totalBudget.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current {viewType} period</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Spent</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 truncate">
                    ₹{totalSpent.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% of budget
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Remaining</p>
                  <p
                    className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${
                      totalRemaining >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{Math.abs(totalRemaining).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{totalRemaining >= 0 ? "Available" : "Over budget"}</p>
                </div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${
                    totalRemaining >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600"
                  } rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {budgets.map((budget, index) => {
            const percentage = getProgressPercentage(budget.spent, budget.limit)
            const status = getProgressStatus(percentage)
            const remaining = budget.limit - budget.spent

            return (
              <Card
                key={budget.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${
                          budget.color || "from-gray-500 to-gray-600"
                        } rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {budget.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {budget.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {status === "over" && <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />}
                      {status === "warning" && <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                      {status === "good" && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 truncate pr-2">Spent: ₹{budget.spent.toLocaleString()}</span>
                      <span className="text-gray-600 flex-shrink-0">Budget: ₹{budget.limit.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 sm:h-3 ${
                        status === "over"
                          ? "[&>div]:bg-red-500"
                          : status === "warning"
                            ? "[&>div]:bg-yellow-500"
                            : "[&>div]:bg-green-500"
                      }`}
                    />
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span
                        className={`font-medium truncate pr-2 ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {remaining >= 0
                          ? `₹${remaining.toLocaleString()} remaining`
                          : `₹${Math.abs(remaining).toLocaleString()} over budget`}
                      </span>
                      <span className="text-gray-500 flex-shrink-0">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(budget.id)}
                      className="flex-1 bg-transparent text-xs sm:text-sm"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Create New Budget</h3>
                  <p className="text-sm sm:text-base text-gray-600">Set spending limits for different categories</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Create New Budget
                </DialogTitle>
                <p className="text-gray-600">Set spending limits to control your expenses</p>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetAmount">Budget Amount</Label>
                  <Input
                    id="budgetAmount"
                    name="budgetAmount"
                    type="number"
                    placeholder="Enter budget amount"
                    value={formData.budgetAmount}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value) => setFormData({ ...formData, period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetPeriods.map((period) => (
                        <SelectItem key={period} value={period}>
                          {capitalize(period)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Budget Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2 text-blue-600" />
                Edit Budget
              </DialogTitle>
              <p className="text-gray-600">Update your budget settings</p>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budgetAmount">Budget Amount</Label>
                <Input
                  id="edit-budgetAmount"
                  name="budgetAmount"
                  type="number"
                  value={formData.budgetAmount}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-period">Period</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetPeriods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {capitalize(period)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Budgets
