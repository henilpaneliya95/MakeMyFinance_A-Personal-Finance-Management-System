// // // import { useState, useEffect } from "react";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Progress } from "@/components/ui/progress";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // //   DialogFooter,
// // //   DialogTrigger,
// // // } from "@/components/ui/dialog";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import { Textarea } from "@/components/ui/textarea";
// // // import {
// // //   Target,
// // //   Plus,
// // //   Edit,
// // //   Trash2,
// // //   DollarSign,
// // //   CheckCircle,
// // //   Clock,
// // //   Star,
// // //   RefreshCw,
// // //   Trophy,
// // //   Flag,
// // // } from "lucide-react";

// // // const API_URL = "http://localhost:8000/api/goals/";
// // // const USER_ID = localStorage.getItem("userId"); // 👈 portfolio jaisa

// // // const Goals = () => {
// // //   const [goals, setGoals] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [dialogOpen, setDialogOpen] = useState(false);
// // //   const [editDialogOpen, setEditDialogOpen] = useState(false);
// // //   const [editingGoal, setEditingGoal] = useState(null);
// // //   const [formData, setFormData] = useState({
// // //     title: "",
// // //     description: "",
// // //     targetAmount: "",
// // //     currentAmount: "",
// // //     targetDate: "",
// // //     category: "Emergency",
// // //     priority: "Medium",
// // //   });

// // //   const categories = [
// // //     "Emergency",
// // //     "Travel",
// // //     "Transportation",
// // //     "Housing",
// // //     "Education",
// // //     "Investment",
// // //     "Other",
// // //   ];
// // //   const priorities = ["Low", "Medium", "High"];

// // //   // -----------------
// // //   // API FUNCTIONS
// // //   // -----------------
// // //   const fetchGoals = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const res = await fetch(`${API_URL}?user_id=${USER_ID}`);
// // //       const data = await res.json();
// // //       setGoals(data);
// // //     } catch (err) {
// // //       console.error("Error fetching goals:", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const createGoal = async () => {
// // //     try {
// // //       const res = await fetch(API_URL, {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ ...formData, user_id: USER_ID }),
// // //       });
// // //       if (res.ok) {
// // //         await fetchGoals();
// // //         setDialogOpen(false);
// // //         resetForm();
// // //         showToast("Goal created successfully!", "green");
// // //       }
// // //     } catch (err) {
// // //       console.error("Error creating goal:", err);
// // //     }
// // //   };

// // //   const updateGoal = async (id) => {
// // //     try {
// // //       const res = await fetch(`${API_URL}${id}/`, {
// // //         method: "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ ...formData, user_id: USER_ID }),
// // //       });
// // //       if (res.ok) {
// // //         await fetchGoals();
// // //         setEditDialogOpen(false);
// // //         setEditingGoal(null);
// // //         resetForm();
// // //         showToast("Goal updated successfully!", "blue");
// // //       }
// // //     } catch (err) {
// // //       console.error("Error updating goal:", err);
// // //     }
// // //   };

// // //   const deleteGoal = async (id) => {
// // //     try {
// // //       const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
// // //       if (res.ok) {
// // //         setGoals(goals.filter((g) => g.id !== id));
// // //         showToast("Goal deleted successfully!", "red");
// // //       }
// // //     } catch (err) {
// // //       console.error("Error deleting goal:", err);
// // //     }
// // //   };

// // //   const addContribution = async (goal, amount) => {
// // //     const newAmount = Number(goal.currentAmount) + amount;
// // //     const updatedGoal = { ...goal, currentAmount: newAmount, user_id: USER_ID };
// // //     try {
// // //       const res = await fetch(`${API_URL}${goal.id}/`, {
// // //         method: "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(updatedGoal),
// // //       });
// // //       if (res.ok) {
// // //         await fetchGoals();
// // //         showToast("Contribution added!", "green");
// // //       }
// // //     } catch (err) {
// // //       console.error("Error adding contribution:", err);
// // //     }
// // //   };

// // //   // -----------------
// // //   // HELPERS
// // //   // -----------------
// // //   const handleChange = (e) =>
// // //     setFormData({ ...formData, [e.target.name]: e.target.value });

// // //   const resetForm = () =>
// // //     setFormData({
// // //       title: "",
// // //       description: "",
// // //       targetAmount: "",
// // //       currentAmount: "",
// // //       targetDate: "",
// // //       category: "Emergency",
// // //       priority: "Medium",
// // //     });

// // //   const showToast = (msg, color = "blue") => {
// // //     const div = document.createElement("div");
// // //     div.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`;
// // //     div.innerText = msg;
// // //     document.body.appendChild(div);
// // //     setTimeout(() => document.body.removeChild(div), 3000);
// // //   };

// // //   const handleSubmit = () => createGoal();
// // //   const handleEditSubmit = () => updateGoal(editingGoal.id);
// // //   const handleEdit = (goal) => {
// // //     setEditingGoal(goal);
// // //     setFormData({
// // //       title: goal.title,
// // //       description: goal.description,
// // //       targetAmount: goal.targetAmount,
// // //       currentAmount: goal.currentAmount,
// // //       targetDate: goal.targetDate?.split("T")[0],
// // //       category: goal.category,
// // //       priority: goal.priority,
// // //     });
// // //     setEditDialogOpen(true);
// // //   };

// // //   const getProgressPercentage = (current, target) => (current / target) * 100;
// // //   const getDaysRemaining = (targetDate) => {
// // //     const today = new Date();
// // //     const target = new Date(targetDate);
// // //     const diff = target - today;
// // //     return Math.ceil(diff / (1000 * 60 * 60 * 24));
// // //   };

// // //   const getPriorityColor = (priority) => {
// // //     switch (priority) {
// // //       case "High":
// // //         return "bg-red-100 text-red-800 border-red-200";
// // //       case "Medium":
// // //         return "bg-yellow-100 text-yellow-800 border-yellow-200";
// // //       case "Low":
// // //         return "bg-green-100 text-green-800 border-green-200";
// // //       default:
// // //         return "bg-gray-100 text-gray-800 border-gray-200";
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchGoals();
// // //   }, []);
// // //   // -----------------
// // //   // RENDER
// // //   // -----------------
// // //   // Calculate totals
// // //   const totalGoals = goals.length;
// // //   const completedGoals = goals.filter(
// // //     (goal) => goal.status === "Completed"
// // //   ).length;
// // //   const totalTargetAmount = goals.reduce(
// // //     (sum, goal) => sum + (Number(goal.targetAmount) || 0),
// // //     0
// // //   );
// // //   const totalCurrentAmount = goals.reduce(
// // //     (sum, goal) => sum + (Number(goal.currentAmount) || 0),
// // //     0
// // //   );

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
// // //       {/* Header */}
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// // //             Financial Goals
// // //           </h1>
// // //           <p className="text-gray-600 mt-2">
// // //             Set, track, and achieve your financial objectives
// // //           </p>
// // //         </div>
// // //         <div className="flex items-center space-x-3">
// // //           <Button variant="outline" onClick={fetchGoals}>
// // //             <RefreshCw className="w-4 h-4 mr-2" />
// // //             Refresh
// // //           </Button>
// // //           <Badge variant="secondary" className="px-3 py-1">
// // //             <Target className="w-4 h-4 mr-1" />
// // //             {totalGoals} Goals
// // //           </Badge>
// // //         </div>
// // //       </div>

// // //       {/* Summary Cards */}
// // //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// // //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// // //           <CardContent className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500 font-medium">Total Goals</p>
// // //                 <p className="text-2xl font-bold text-blue-600">{totalGoals}</p>
// // //                 <p className="text-sm text-gray-500 mt-1">Active goals</p>
// // //               </div>
// // //               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
// // //                 <Target className="w-6 h-6 text-white" />
// // //               </div>
// // //             </div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// // //           <CardContent className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500 font-medium">Completed</p>
// // //                 <p className="text-2xl font-bold text-green-600">
// // //                   {completedGoals}
// // //                 </p>
// // //                 <p className="text-sm text-gray-500 mt-1">
// // //                   {totalGoals > 0
// // //                     ? ((completedGoals / totalGoals) * 100).toFixed(0)
// // //                     : 0}
// // //                   % success rate
// // //                 </p>
// // //               </div>
// // //               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
// // //                 <Trophy className="w-6 h-6 text-white" />
// // //               </div>
// // //             </div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// // //           <CardContent className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500 font-medium">
// // //                   Target Amount
// // //                 </p>
// // //                 <p className="text-2xl font-bold text-purple-600">
// // //                   ₹{totalTargetAmount.toLocaleString()}
// // //                 </p>
// // //                 <p className="text-sm text-gray-500 mt-1">Total target</p>
// // //               </div>
// // //               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
// // //                 <Flag className="w-6 h-6 text-white" />
// // //               </div>
// // //             </div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// // //           <CardContent className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500 font-medium">
// // //                   Saved So Far
// // //                 </p>
// // //                 <p className="text-2xl font-bold text-orange-600">
// // //                   ₹{totalCurrentAmount.toLocaleString()}
// // //                 </p>
// // //                 <p className="text-sm text-gray-500 mt-1">
// // //                   {totalTargetAmount > 0
// // //                     ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(
// // //                         1
// // //                       )
// // //                     : 0}
// // //                   % of target
// // //                 </p>
// // //               </div>
// // //               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
// // //                 <DollarSign className="w-6 h-6 text-white" />
// // //               </div>
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {/* Goals Grid */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //         {goals.map((goal, index) => {
// // //           const progressPercentage = getProgressPercentage(
// // //             goal.currentAmount,
// // //             goal.targetAmount
// // //           );
// // //           const daysRemaining = getDaysRemaining(goal.targetDate);
// // //           const isCompleted = goal.status === "Completed";
// // //           const isOverdue = daysRemaining < 0 && !isCompleted;

// // //           return (
// // //             <Card
// // //               key={goal.id}
// // //               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
// // //               style={{ animationDelay: `${index * 100}ms` }}
// // //             >
// // //               <CardHeader className="pb-3">
// // //                 <div className="flex items-center justify-between">
// // //                   <div className="flex items-center space-x-3">
// // //                     <div
// // //                       className={`w-10 h-10 bg-gradient-to-r ${
// // //                         goal.color || "from-blue-500 to-blue-600"
// // //                       } rounded-lg flex items-center justify-center`}
// // //                     >
// // //                       {isCompleted ? (
// // //                         <CheckCircle className="w-5 h-5 text-white" />
// // //                       ) : (
// // //                         <Target className="w-5 h-5 text-white" />
// // //                       )}
// // //                     </div>
// // //                     <div>
// // //                       <CardTitle className="text-lg font-semibold text-gray-900">
// // //                         {goal.title}
// // //                       </CardTitle>
// // //                       <div className="flex items-center space-x-2 mt-1">
// // //                         <Badge variant="secondary" className="text-xs">
// // //                           {goal.category}
// // //                         </Badge>
// // //                         <Badge
// // //                           className={`text-xs ${getPriorityColor(
// // //                             goal.priority
// // //                           )}`}
// // //                         >
// // //                           {goal.priority}
// // //                         </Badge>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                   <div className="flex items-center space-x-2">
// // //                     {isCompleted && (
// // //                       <Star className="w-5 h-5 text-yellow-500" />
// // //                     )}
// // //                     {isOverdue && <Clock className="w-5 h-5 text-red-500" />}
// // //                   </div>
// // //                 </div>
// // //               </CardHeader>

// // //               <CardContent className="space-y-4">
// // //                 <p className="text-gray-600 text-sm">{goal.description}</p>

// // //                 <div className="space-y-2">
// // //                   <div className="flex justify-between text-sm">
// // //                     <span className="text-gray-600">
// // //                       Saved: ₹{Number(goal.currentAmount).toLocaleString()}
// // //                     </span>
// // //                     <span className="text-gray-600">
// // //                       Target: ₹{Number(goal.targetAmount).toLocaleString()}
// // //                     </span>
// // //                   </div>
// // //                   <Progress
// // //                     value={Math.min(progressPercentage, 100)}
// // //                     className={`h-3 ${
// // //                       isCompleted
// // //                         ? "[&>div]:bg-green-500"
// // //                         : "[&>div]:bg-blue-500"
// // //                     }`}
// // //                   />
// // //                   <div className="flex justify-between text-sm">
// // //                     <span
// // //                       className={`font-medium ${
// // //                         isCompleted ? "text-green-600" : "text-blue-600"
// // //                       }`}
// // //                     >
// // //                       {progressPercentage.toFixed(1)}% complete
// // //                     </span>
// // //                     <span className="text-gray-500">
// // //                       ₹
// // //                       {(
// // //                         goal.targetAmount - goal.currentAmount
// // //                       ).toLocaleString()}{" "}
// // //                       remaining
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //                 <div className="grid grid-cols-2 gap-4 text-sm">
// // //                   <div>
// // //                     <p className="text-gray-500">Target Date</p>
// // //                     <p
// // //                       className={`font-semibold ${
// // //                         isOverdue ? "text-red-600" : "text-gray-900"
// // //                       }`}
// // //                     >
// // //                       {new Date(goal.targetDate).toLocaleDateString()}
// // //                     </p>
// // //                   </div>
// // //                   <div>
// // //                     <p className="text-gray-500">Days Remaining</p>
// // //                     <p
// // //                       className={`font-semibold ${
// // //                         isOverdue
// // //                           ? "text-red-600"
// // //                           : isCompleted
// // //                           ? "text-green-600"
// // //                           : "text-gray-900"
// // //                       }`}
// // //                     >
// // //                       {isCompleted
// // //                         ? "Completed!"
// // //                         : isOverdue
// // //                         ? `${Math.abs(daysRemaining)} days overdue`
// // //                         : `${daysRemaining} days`}
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 {isCompleted && (
// // //                   <div className="bg-green-50 border border-green-200 rounded-lg p-3">
// // //                     <p className="text-green-800 text-sm font-medium flex items-center">
// // //                       <Trophy className="w-4 h-4 mr-2" />
// // //                       🎉 Congratulations! Goal achieved!
// // //                     </p>
// // //                   </div>
// // //                 )}

// // //                 {isOverdue && (
// // //                   <div className="bg-red-50 border border-red-200 rounded-lg p-3">
// // //                     <p className="text-red-800 text-sm font-medium">
// // //                       ⚠️ Goal deadline has passed. Consider adjusting your
// // //                       target date.
// // //                     </p>
// // //                   </div>
// // //                 )}

// // //                 <div className="flex space-x-2 pt-2">
// // //                   {!isCompleted && (
// // //                     <Button
// // //                       variant="outline"
// // //                       size="sm"
// // //                       onClick={() => addContribution(goal, 5000)}
// // //                       className="flex-1 bg-transparent hover:bg-green-50"
// // //                     >
// // //                       <DollarSign className="w-4 h-4 mr-1" />
// // //                       Add ₹5K
// // //                     </Button>
// // //                   )}
// // //                   <Button
// // //                     variant="outline"
// // //                     size="sm"
// // //                     onClick={() => handleEdit(goal)}
// // //                     className="flex-1 bg-transparent"
// // //                   >
// // //                     <Edit className="w-4 h-4 mr-1" />
// // //                     Edit
// // //                   </Button>
// // //                   <Button
// // //                     variant="destructive"
// // //                     size="sm"
// // //                     onClick={() => deleteGoal(goal.id)}
// // //                   >
// // //                     <Trash2 className="w-4 h-4" />
// // //                   </Button>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           );
// // //         })}

// // //         {/* Add New Goal Card */}
// // //         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// // //           <DialogTrigger asChild>
// // //             <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
// // //               <CardContent className="p-12 text-center">
// // //                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
// // //                   <Plus className="w-8 h-8 text-white" />
// // //                 </div>
// // //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
// // //                   Create New Goal
// // //                 </h3>
// // //                 <p className="text-gray-600">
// // //                   Set a new financial goal to work towards
// // //                 </p>
// // //               </CardContent>
// // //             </Card>
// // //           </DialogTrigger>
// // //           <DialogContent className="sm:max-w-md">
// // //             <DialogHeader>
// // //               <DialogTitle className="flex items-center">
// // //                 <Target className="w-5 h-5 mr-2 text-blue-600" />
// // //                 Create New Goal
// // //               </DialogTitle>
// // //               <p className="text-gray-600">
// // //                 Set a new financial goal to track your progress
// // //               </p>
// // //             </DialogHeader>
// // //             <div className="space-y-4 mt-4">
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="title">Goal Title</Label>
// // //                 <Input
// // //                   id="title"
// // //                   name="title"
// // //                   placeholder="e.g., Emergency Fund"
// // //                   value={formData.title}
// // //                   onChange={handleChange}
// // //                 />
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="description">Description</Label>
// // //                 <Textarea
// // //                   id="description"
// // //                   name="description"
// // //                   placeholder="Describe your goal..."
// // //                   value={formData.description}
// // //                   onChange={handleChange}
// // //                 />
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="targetAmount">Target Amount</Label>
// // //                   <Input
// // //                     id="targetAmount"
// // //                     name="targetAmount"
// // //                     type="number"
// // //                     placeholder="100000"
// // //                     value={formData.targetAmount}
// // //                     onChange={handleChange}
// // //                   />
// // //                 </div>
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="currentAmount">Current Amount</Label>
// // //                   <Input
// // //                     id="currentAmount"
// // //                     name="currentAmount"
// // //                     type="number"
// // //                     placeholder="0"
// // //                     value={formData.currentAmount}
// // //                     onChange={handleChange}
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="targetDate">Target Date</Label>
// // //                 <Input
// // //                   id="targetDate"
// // //                   name="targetDate"
// // //                   type="date"
// // //                   value={formData.targetDate}
// // //                   onChange={handleChange}
// // //                 />
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="category">Category</Label>
// // //                   <Select
// // //                     value={formData.category}
// // //                     onValueChange={(value) =>
// // //                       setFormData({ ...formData, category: value })
// // //                     }
// // //                   >
// // //                     <SelectTrigger>
// // //                       <SelectValue />
// // //                     </SelectTrigger>
// // //                     <SelectContent>
// // //                       {categories.map((category) => (
// // //                         <SelectItem key={category} value={category}>
// // //                           {category}
// // //                         </SelectItem>
// // //                       ))}
// // //                     </SelectContent>
// // //                   </Select>
// // //                 </div>
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="priority">Priority</Label>
// // //                   <Select
// // //                     value={formData.priority}
// // //                     onValueChange={(value) =>
// // //                       setFormData({ ...formData, priority: value })
// // //                     }
// // //                   >
// // //                     <SelectTrigger>
// // //                       <SelectValue />
// // //                     </SelectTrigger>
// // //                     <SelectContent>
// // //                       {priorities.map((priority) => (
// // //                         <SelectItem key={priority} value={priority}>
// // //                           {priority}
// // //                         </SelectItem>
// // //                       ))}
// // //                     </SelectContent>
// // //                   </Select>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             <DialogFooter className="mt-6">
// // //               <Button variant="outline" onClick={() => setDialogOpen(false)}>
// // //                 Cancel
// // //               </Button>
// // //               <Button
// // //                 onClick={createGoal}
// // //                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// // //               >
// // //                 <Plus className="w-4 h-4 mr-2" /> Create Goal
// // //               </Button>
// // //             </DialogFooter>
// // //           </DialogContent>
// // //         </Dialog>
// // //       </div>

// // //       {/* Edit Goal Dialog */}
// // //       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
// // //         <DialogContent className="sm:max-w-md">
// // //           <DialogHeader>
// // //             <DialogTitle className="flex items-center">
// // //               <Edit className="w-5 h-5 mr-2 text-blue-600" />
// // //               Edit Goal
// // //             </DialogTitle>
// // //             <p className="text-gray-600">Update your goal details</p>
// // //           </DialogHeader>
// // //           <div className="space-y-4 mt-4">
// // //             <div className="space-y-2">
// // //               <Label htmlFor="edit-title">Goal Title</Label>
// // //               <Input
// // //                 id="edit-title"
// // //                 name="title"
// // //                 value={formData.title}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="edit-description">Description</Label>
// // //               <Textarea
// // //                 id="edit-description"
// // //                 name="description"
// // //                 value={formData.description}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="edit-targetAmount">Target Amount</Label>
// // //                 <Input
// // //                   id="edit-targetAmount"
// // //                   name="targetAmount"
// // //                   type="number"
// // //                   value={formData.targetAmount}
// // //                   onChange={handleChange}
// // //                 />
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="edit-currentAmount">Current Amount</Label>
// // //                 <Input
// // //                   id="edit-currentAmount"
// // //                   name="currentAmount"
// // //                   type="number"
// // //                   value={formData.currentAmount}
// // //                   onChange={handleChange}
// // //                 />
// // //               </div>
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="edit-targetDate">Target Date</Label>
// // //               <Input
// // //                 id="edit-targetDate"
// // //                 name="targetDate"
// // //                 type="date"
// // //                 value={formData.targetDate}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="edit-category">Category</Label>
// // //                 <Select
// // //                   value={formData.category}
// // //                   onValueChange={(value) =>
// // //                     setFormData({ ...formData, category: value })
// // //                   }
// // //                 >
// // //                   <SelectTrigger>
// // //                     <SelectValue />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     {categories.map((category) => (
// // //                       <SelectItem key={category} value={category}>
// // //                         {category}
// // //                       </SelectItem>
// // //                     ))}
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //               <div className="space-y-2">
// // //                 <Label htmlFor="edit-priority">Priority</Label>
// // //                 <Select
// // //                   value={formData.priority}
// // //                   onValueChange={(value) =>
// // //                     setFormData({ ...formData, priority: value })
// // //                   }
// // //                 >
// // //                   <SelectTrigger>
// // //                     <SelectValue />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     {priorities.map((priority) => (
// // //                       <SelectItem key={priority} value={priority}>
// // //                         {priority}
// // //                       </SelectItem>
// // //                     ))}
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <DialogFooter className="mt-6">
// // //             <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
// // //               Cancel
// // //             </Button>
// // //             <Button
// // //               onClick={() => updateGoal(editingGoal.id)}
// // //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// // //             >
// // //               <CheckCircle className="w-4 h-4 mr-2" /> Update Goal
// // //             </Button>
// // //           </DialogFooter>
// // //         </DialogContent>
// // //       </Dialog>

// // //       {/* Empty State */}
// // //       {goals.length === 0 && (
// // //         <Card className="border-0 shadow-lg">
// // //           <CardContent className="p-12 text-center">
// // //             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
// // //               <Target className="w-10 h-10 text-white" />
// // //             </div>
// // //             <h3 className="text-2xl font-bold text-gray-900 mb-4">
// // //               Set Your First Goal
// // //             </h3>
// // //             <p className="text-gray-600 mb-8 max-w-md mx-auto">
// // //               Start your financial journey by setting clear, achievable goals.
// // //               Track your progress and celebrate your wins!
// // //             </p>
// // //             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// // //               <DialogTrigger asChild>
// // //                 <Button
// // //                   size="lg"
// // //                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
// // //                 >
// // //                   <Plus className="w-5 h-5 mr-2" /> Create Your First Goal
// // //                 </Button>
// // //               </DialogTrigger>
// // //             </Dialog>
// // //           </CardContent>
// // //         </Card>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Goals;

// // "use client"

// // import { useState, useEffect } from "react"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Badge } from "@/components/ui/badge"
// // import { Progress } from "@/components/ui/progress"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Target, Plus, Edit, Trash2, DollarSign, CheckCircle, Clock, Star, RefreshCw, Trophy, Flag } from "lucide-react"

// // const API_URL = "http://localhost:8000/api/goals/"
// // const USER_ID = localStorage.getItem("userId") // 👈 portfolio jaisa

// // const Goals = () => {
// //   const [goals, setGoals] = useState([])
// //   const [loading, setLoading] = useState(false)
// //   const [dialogOpen, setDialogOpen] = useState(false)
// //   const [editDialogOpen, setEditDialogOpen] = useState(false)
// //   const [editingGoal, setEditingGoal] = useState(null)
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     targetAmount: "",
// //     currentAmount: "",
// //     targetDate: "",
// //     category: "Emergency",
// //     priority: "Medium",
// //   })

// //   const categories = ["Emergency", "Travel", "Transportation", "Housing", "Education", "Investment", "Other"]
// //   const priorities = ["Low", "Medium", "High"]

// //   // -----------------
// //   // API FUNCTIONS
// //   // -----------------
// //   const fetchGoals = async () => {
// //     try {
// //       setLoading(true)
// //       const res = await fetch(`${API_URL}?user_id=${USER_ID}`)
// //       const data = await res.json()
// //       setGoals(data)
// //     } catch (err) {
// //       console.error("Error fetching goals:", err)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const createGoal = async () => {
// //     try {
// //       const res = await fetch(API_URL, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ ...formData, user_id: USER_ID }),
// //       })
// //       if (res.ok) {
// //         await fetchGoals()
// //         setDialogOpen(false)
// //         resetForm()
// //         showToast("Goal created successfully!", "green")
// //       }
// //     } catch (err) {
// //       console.error("Error creating goal:", err)
// //     }
// //   }

// //   const updateGoal = async (id) => {
// //     try {
// //       const res = await fetch(`${API_URL}${id}/`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ ...formData, user_id: USER_ID }),
// //       })
// //       if (res.ok) {
// //         await fetchGoals()
// //         setEditDialogOpen(false)
// //         setEditingGoal(null)
// //         resetForm()
// //         showToast("Goal updated successfully!", "blue")
// //       }
// //     } catch (err) {
// //       console.error("Error updating goal:", err)
// //     }
// //   }

// //   const deleteGoal = async (id) => {
// //     try {
// //       const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" })
// //       if (res.ok) {
// //         setGoals(goals.filter((g) => g.id !== id))
// //         showToast("Goal deleted successfully!", "red")
// //       }
// //     } catch (err) {
// //       console.error("Error deleting goal:", err)
// //     }
// //   }

// //   const addContribution = async (goal, amount) => {
// //     const newAmount = Number(goal.currentAmount) + amount
// //     const updatedGoal = { ...goal, currentAmount: newAmount, user_id: USER_ID }
// //     try {
// //       const res = await fetch(`${API_URL}${goal.id}/`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(updatedGoal),
// //       })
// //       if (res.ok) {
// //         await fetchGoals()
// //         showToast("Contribution added!", "green")
// //       }
// //     } catch (err) {
// //       console.error("Error adding contribution:", err)
// //     }
// //   }

// //   // -----------------
// //   // HELPERS
// //   // -----------------
// //   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

// //   const resetForm = () =>
// //     setFormData({
// //       title: "",
// //       description: "",
// //       targetAmount: "",
// //       currentAmount: "",
// //       targetDate: "",
// //       category: "Emergency",
// //       priority: "Medium",
// //     })

// //   const showToast = (msg, color = "blue") => {
// //     const div = document.createElement("div")
// //     div.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`
// //     div.innerText = msg
// //     document.body.appendChild(div)
// //     setTimeout(() => document.body.removeChild(div), 3000)
// //   }

// //   const handleSubmit = () => createGoal()
// //   const handleEditSubmit = () => updateGoal(editingGoal.id)
// //   const handleEdit = (goal) => {
// //     setEditingGoal(goal)
// //     setFormData({
// //       title: goal.title,
// //       description: goal.description,
// //       targetAmount: goal.targetAmount,
// //       currentAmount: goal.currentAmount,
// //       targetDate: goal.targetDate?.split("T")[0],
// //       category: goal.category,
// //       priority: goal.priority,
// //     })
// //     setEditDialogOpen(true)
// //   }

// //   const getProgressPercentage = (current, target) => (current / target) * 100
// //   const getDaysRemaining = (targetDate) => {
// //     const today = new Date()
// //     const target = new Date(targetDate)
// //     const diff = target - today
// //     return Math.ceil(diff / (1000 * 60 * 60 * 24))
// //   }

// //   const getPriorityColor = (priority) => {
// //     switch (priority) {
// //       case "High":
// //         return "bg-red-100 text-red-800 border-red-200"
// //       case "Medium":
// //         return "bg-yellow-100 text-yellow-800 border-yellow-200"
// //       case "Low":
// //         return "bg-green-100 text-green-800 border-green-200"
// //       default:
// //         return "bg-gray-100 text-gray-800 border-gray-200"
// //     }
// //   }

// //   useEffect(() => {
// //     fetchGoals()
// //   }, [])
// //   // -----------------
// //   // RENDER
// //   // -----------------
// //   // Calculate totals
// //   const totalGoals = goals.length
// //   const completedGoals = goals.filter((goal) => goal.status === "Completed").length
// //   const totalTargetAmount = goals.reduce((sum, goal) => sum + (Number(goal.targetAmount) || 0), 0)
// //   const totalCurrentAmount = goals.reduce((sum, goal) => sum + (Number(goal.currentAmount) || 0), 0)

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //             Financial Goals
// //           </h1>
// //           <p className="text-gray-600 mt-2">Set, track, and achieve your financial objectives</p>
// //         </div>
// //         <div className="flex items-center space-x-3">
// //           <Button variant="outline" onClick={fetchGoals}>
// //             <RefreshCw className="w-4 h-4 mr-2" />
// //             Refresh
// //           </Button>
// //           <Badge variant="secondary" className="px-3 py-1">
// //             <Target className="w-4 h-4 mr-1" />
// //             {totalGoals} Goals
// //           </Badge>
// //         </div>
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">Total Goals</p>
// //                 <p className="text-2xl font-bold text-blue-600">{totalGoals}</p>
// //                 <p className="text-sm text-gray-500 mt-1">Active goals</p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
// //                 <Target className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">Completed</p>
// //                 <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
// //                 <p className="text-sm text-gray-500 mt-1">
// //                   {totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : 0}% success rate
// //                 </p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
// //                 <Trophy className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">Target Amount</p>
// //                 <p className="text-2xl font-bold text-purple-600">₹{totalTargetAmount.toLocaleString()}</p>
// //                 <p className="text-sm text-gray-500 mt-1">Total target</p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
// //                 <Flag className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">Saved So Far</p>
// //                 <p className="text-2xl font-bold text-orange-600">₹{totalCurrentAmount.toLocaleString()}</p>
// //                 <p className="text-sm text-gray-500 mt-1">
// //                   {totalTargetAmount > 0 ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1) : 0}% of target
// //                 </p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
// //                 <DollarSign className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Goals Grid */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {goals.map((goal, index) => {
// //           const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount)
// //           const daysRemaining = getDaysRemaining(goal.targetDate)
// //           const isCompleted = goal.status === "Completed"
// //           const isOverdue = daysRemaining < 0 && !isCompleted

// //           return (
// //             <Card
// //               key={goal.id}
// //               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
// //               style={{ animationDelay: `${index * 100}ms` }}
// //             >
// //               <CardHeader className="pb-3">
// //                 <div className="flex items-center justify-between">
// //                   <div className="flex items-center space-x-3">
// //                     <div
// //                       className={`w-10 h-10 bg-gradient-to-r ${
// //                         goal.color || "from-blue-500 to-blue-600"
// //                       } rounded-lg flex items-center justify-center`}
// //                     >
// //                       {isCompleted ? (
// //                         <CheckCircle className="w-5 h-5 text-white" />
// //                       ) : (
// //                         <Target className="w-5 h-5 text-white" />
// //                       )}
// //                     </div>
// //                     <div>
// //                       <CardTitle className="text-lg font-semibold text-gray-900">{goal.title}</CardTitle>
// //                       <div className="flex items-center space-x-2 mt-1">
// //                         <Badge variant="secondary" className="text-xs">
// //                           {goal.category}
// //                         </Badge>
// //                         <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>{goal.priority}</Badge>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     {isCompleted && <Star className="w-5 h-5 text-yellow-500" />}
// //                     {isOverdue && <Clock className="w-5 h-5 text-red-500" />}
// //                   </div>
// //                 </div>
// //               </CardHeader>

// //               <CardContent className="space-y-4">
// //                 <p className="text-gray-600 text-sm">{goal.description}</p>

// //                 <div className="space-y-2">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-600">Saved: ₹{Number(goal.currentAmount).toLocaleString()}</span>
// //                     <span className="text-gray-600">Target: ₹{Number(goal.targetAmount).toLocaleString()}</span>
// //                   </div>
// //                   <Progress
// //                     value={Math.min(progressPercentage, 100)}
// //                     className={`h-3 ${isCompleted ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`}
// //                   />
// //                   <div className="flex justify-between text-sm">
// //                     <span className={`font-medium ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
// //                       {progressPercentage.toFixed(1)}% complete
// //                     </span>
// //                     <span className="text-gray-500">
// //                       ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-4 text-sm">
// //                   <div>
// //                     <p className="text-gray-500">Target Date</p>
// //                     <p className={`font-semibold ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
// //                       {new Date(goal.targetDate).toLocaleDateString()}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-500">Days Remaining</p>
// //                     <p
// //                       className={`font-semibold ${
// //                         isOverdue ? "text-red-600" : isCompleted ? "text-green-600" : "text-gray-900"
// //                       }`}
// //                     >
// //                       {isCompleted
// //                         ? "Completed!"
// //                         : isOverdue
// //                           ? `${Math.abs(daysRemaining)} days overdue`
// //                           : `${daysRemaining} days`}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {isCompleted && (
// //                   <div className="bg-green-50 border border-green-200 rounded-lg p-3">
// //                     <p className="text-green-800 text-sm font-medium flex items-center">
// //                       <Trophy className="w-4 h-4 mr-2" />🎉 Congratulations! Goal achieved!
// //                     </p>
// //                   </div>
// //                 )}

// //                 {isOverdue && (
// //                   <div className="bg-red-50 border border-red-200 rounded-lg p-3">
// //                     <p className="text-red-800 text-sm font-medium">
// //                       ⚠️ Goal deadline has passed. Consider adjusting your target date.
// //                     </p>
// //                   </div>
// //                 )}

// //                 <div className="flex space-x-2 pt-2">
// //                   {!isCompleted && (
// //                     <Button
// //                       variant="outline"
// //                       size="sm"
// //                       onClick={() => addContribution(goal, 5000)}
// //                       className="flex-1 bg-transparent hover:bg-green-50"
// //                     >
// //                       <DollarSign className="w-4 h-4 mr-1" />
// //                       Add ₹5K
// //                     </Button>
// //                   )}
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => handleEdit(goal)}
// //                     className="flex-1 bg-transparent"
// //                   >
// //                     <Edit className="w-4 h-4 mr-1" />
// //                     Edit
// //                   </Button>
// //                   <Button variant="destructive" size="sm" onClick={() => deleteGoal(goal.id)}>
// //                     <Trash2 className="w-4 h-4" />
// //                   </Button>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           )
// //         })}

// //         {/* Add New Goal Card */}
// //         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// //           <DialogTrigger asChild>
// //             <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
// //               <CardContent className="p-12 text-center">
// //                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
// //                   <Plus className="w-8 h-8 text-white" />
// //                 </div>
// //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Goal</h3>
// //                 <p className="text-gray-600">Set a new financial goal to work towards</p>
// //               </CardContent>
// //             </Card>
// //           </DialogTrigger>
// //           <DialogContent className="sm:max-w-md">
// //             <DialogHeader>
// //               <DialogTitle className="flex items-center">
// //                 <Target className="w-5 h-5 mr-2 text-blue-600" />
// //                 Create New Goal
// //               </DialogTitle>
// //               <p className="text-gray-600">Set a new financial goal to track your progress</p>
// //             </DialogHeader>
// //             <div className="space-y-4 mt-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="title">Goal Title</Label>
// //                 <Input
// //                   id="title"
// //                   name="title"
// //                   placeholder="e.g., Emergency Fund"
// //                   value={formData.title}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="description">Description</Label>
// //                 <Textarea
// //                   id="description"
// //                   name="description"
// //                   placeholder="Describe your goal..."
// //                   value={formData.description}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="targetAmount">Target Amount</Label>
// //                   <Input
// //                     id="targetAmount"
// //                     name="targetAmount"
// //                     type="number"
// //                     placeholder="100000"
// //                     value={formData.targetAmount}
// //                     onChange={handleChange}
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="currentAmount">Current Amount</Label>
// //                   <Input
// //                     id="currentAmount"
// //                     name="currentAmount"
// //                     type="number"
// //                     placeholder="0"
// //                     value={formData.currentAmount}
// //                     onChange={handleChange}
// //                   />
// //                 </div>
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="targetDate">Target Date</Label>
// //                 <Input
// //                   id="targetDate"
// //                   name="targetDate"
// //                   type="date"
// //                   value={formData.targetDate}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="category">Category</Label>
// //                   <Select
// //                     value={formData.category}
// //                     onValueChange={(value) => setFormData({ ...formData, category: value })}
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {categories.map((category) => (
// //                         <SelectItem key={category} value={category}>
// //                           {category}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="priority">Priority</Label>
// //                   <Select
// //                     value={formData.priority}
// //                     onValueChange={(value) => setFormData({ ...formData, priority: value })}
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {priorities.map((priority) => (
// //                         <SelectItem key={priority} value={priority}>
// //                           {priority}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //               </div>
// //             </div>
// //             <DialogFooter className="mt-6">
// //               <Button variant="outline" onClick={() => setDialogOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button
// //                 onClick={createGoal}
// //                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// //               >
// //                 <Plus className="w-4 h-4 mr-2" /> Create Goal
// //               </Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* Edit Goal Dialog */}
// //       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
// //         <DialogContent className="sm:max-w-md">
// //           <DialogHeader>
// //             <DialogTitle className="flex items-center">
// //               <Edit className="w-5 h-5 mr-2 text-blue-600" />
// //               Edit Goal
// //             </DialogTitle>
// //             <p className="text-gray-600">Update your goal details</p>
// //           </DialogHeader>
// //           <div className="space-y-4 mt-4">
// //             <div className="space-y-2">
// //               <Label htmlFor="edit-title">Goal Title</Label>
// //               <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="edit-description">Description</Label>
// //               <Textarea id="edit-description" name="description" value={formData.description} onChange={handleChange} />
// //             </div>
// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-targetAmount">Target Amount</Label>
// //                 <Input
// //                   id="edit-targetAmount"
// //                   name="targetAmount"
// //                   type="number"
// //                   value={formData.targetAmount}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-currentAmount">Current Amount</Label>
// //                 <Input
// //                   id="edit-currentAmount"
// //                   name="currentAmount"
// //                   type="number"
// //                   value={formData.currentAmount}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="edit-targetDate">Target Date</Label>
// //               <Input
// //                 id="edit-targetDate"
// //                 name="targetDate"
// //                 type="date"
// //                 value={formData.targetDate}
// //                 onChange={handleChange}
// //               />
// //             </div>
// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-category">Category</Label>
// //                 <Select
// //                   value={formData.category}
// //                   onValueChange={(value) => setFormData({ ...formData, category: value })}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {categories.map((category) => (
// //                       <SelectItem key={category} value={category}>
// //                         {category}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="edit-priority">Priority</Label>
// //                 <Select
// //                   value={formData.priority}
// //                   onValueChange={(value) => setFormData({ ...formData, priority: value })}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {priorities.map((priority) => (
// //                       <SelectItem key={priority} value={priority}>
// //                         {priority}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>
// //           </div>
// //           <DialogFooter className="mt-6">
// //             <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
// //               Cancel
// //             </Button>
// //             <Button
// //               onClick={() => updateGoal(editingGoal.id)}
// //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// //             >
// //               <CheckCircle className="w-4 h-4 mr-2" /> Update Goal
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Empty State */}
// //       {goals.length === 0 && (
// //         <Card className="border-0 shadow-lg">
// //           <CardContent className="p-12 text-center">
// //             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <Target className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-900 mb-4">Set Your First Goal</h3>
// //             <p className="text-gray-600 mb-8 max-w-md mx-auto">
// //               Start your financial journey by setting clear, achievable goals. Track your progress and celebrate your
// //               wins!
// //             </p>
// //             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// //               <DialogTrigger asChild>
// //                 <Button
// //                   size="lg"
// //                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
// //                 >
// //                   <Plus className="w-5 h-5 mr-2" /> Create Your First Goal
// //                 </Button>
// //               </DialogTrigger>
// //             </Dialog>
// //           </CardContent>
// //         </Card>
// //       )}
// //     </div>
// //   )
// // }

// // export default Goals

// "use client";

// import { useState, useEffect } from "react";
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
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Target,
//   Plus,
//   Edit,
//   Trash2,
//   DollarSign,
//   CheckCircle,
//   Clock,
//   Star,
//   RefreshCw,
//   Trophy,
//   Flag,
// } from "lucide-react";

// const API_URL = "http://localhost:8000/api/goals/";
// const USER_ID = localStorage.getItem("userId"); // 👈 portfolio jaisa

// const Goals = () => {
//   const [goals, setGoals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingGoal, setEditingGoal] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     targetAmount: "",
//     currentAmount: "",
//     targetDate: "",
//     category: "Emergency",
//     priority: "Medium",
//   });

//   const categories = [
//     "Emergency",
//     "Travel",
//     "Transportation",
//     "Housing",
//     "Education",
//     "Investment",
//     "Other",
//   ];
//   const priorities = ["Low", "Medium", "High"];

//   // -----------------
//   // API FUNCTIONS
//   // -----------------
//   const fetchGoals = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_URL}?user_id=${USER_ID}`);
//       const data = await res.json();
//       setGoals(data);
//     } catch (err) {
//       console.error("Error fetching goals:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createGoal = async () => {
//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, user_id: USER_ID }),
//       });
//       if (res.ok) {
//         await fetchGoals();
//         setDialogOpen(false);
//         resetForm();
//         showToast("Goal created successfully!", "green");
//       }
//     } catch (err) {
//       console.error("Error creating goal:", err);
//     }
//   };

//   const updateGoal = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}${id}/`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, user_id: USER_ID }),
//       });
//       if (res.ok) {
//         await fetchGoals();
//         setEditDialogOpen(false);
//         setEditingGoal(null);
//         resetForm();
//         showToast("Goal updated successfully!", "blue");
//       }
//     } catch (err) {
//       console.error("Error updating goal:", err);
//     }
//   };

//   const deleteGoal = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
//       if (res.ok) {
//         setGoals(goals.filter((g) => g.id !== id));
//         showToast("Goal deleted successfully!", "red");
//       }
//     } catch (err) {
//       console.error("Error deleting goal:", err);
//     }
//   };

//   const addContribution = async (goal, amount) => {
//     const newAmount = Number(goal.currentAmount) + amount;
//     const updatedGoal = { ...goal, currentAmount: newAmount, user_id: USER_ID };
//     try {
//       const res = await fetch(`${API_URL}${goal.id}/`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedGoal),
//       });
//       if (res.ok) {
//         await fetchGoals();
//         showToast("Contribution added!", "green");
//       }
//     } catch (err) {
//       console.error("Error adding contribution:", err);
//     }
//   };

//   // -----------------
//   // HELPERS
//   // -----------------
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const resetForm = () =>
//     setFormData({
//       title: "",
//       description: "",
//       targetAmount: "",
//       currentAmount: "",
//       targetDate: "",
//       category: "Emergency",
//       priority: "Medium",
//     });

//   const showToast = (msg, color = "blue") => {
//     const div = document.createElement("div");
//     div.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`;
//     div.innerText = msg;
//     document.body.appendChild(div);
//     setTimeout(() => document.body.removeChild(div), 3000);
//   };

//   const handleSubmit = () => createGoal();
//   const handleEditSubmit = () => updateGoal(editingGoal.id);
//   const handleEdit = (goal) => {
//     setEditingGoal(goal);
//     setFormData({
//       title: goal.title,
//       description: goal.description,
//       targetAmount: goal.targetAmount,
//       currentAmount: goal.currentAmount,
//       targetDate: goal.targetDate?.split("T")[0],
//       category: goal.category,
//       priority: goal.priority,
//     });
//     setEditDialogOpen(true);
//   };

//   const getProgressPercentage = (current, target) => (current / target) * 100;
//   const getDaysRemaining = (targetDate) => {
//     const today = new Date();
//     const target = new Date(targetDate);
//     const diff = target - today;
//     return Math.ceil(diff / (1000 * 60 * 60 * 24));
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "High":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "Medium":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "Low":
//         return "bg-green-100 text-green-800 border-green-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   useEffect(() => {
//     fetchGoals();
//   }, []);
//   // -----------------
//   // RENDER
//   // -----------------
//   // Calculate totals
//   const totalGoals = goals.length;
//   const completedGoals = goals.filter(
//     (goal) => goal.status === "Completed"
//   ).length;
//   const totalTargetAmount = goals.reduce(
//     (sum, goal) => sum + (Number(goal.targetAmount) || 0),
//     0
//   );
//   const totalCurrentAmount = goals.reduce(
//     (sum, goal) => sum + (Number(goal.currentAmount) || 0),
//     0
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
//       {/* Header */}
//       {/* <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Financial Goals
//           </h1>
//           <p className="text-gray-600 mt-2">Set, track, and achieve your financial objectives</p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button variant="outline" onClick={fetchGoals}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//           <Badge variant="secondary" className="px-3 py-1">
//             <Target className="w-4 h-4 mr-1" />
//             {totalGoals} Goals
//           </Badge>
//         </div>
//       </div> */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         {/* Left Section */}
//         <div>
//           <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Financial Goals
//           </h1>
//           <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
//             Set, track, and achieve your financial objectives
//           </p>
//         </div>

//         {/* Right Section */}
//         <div className="flex flex-wrap items-center gap-2">
//           <Button
//             variant="outline"
//             onClick={fetchGoals}
//             className="flex items-center"
//           >
//             <RefreshCw className="w-4 h-4 mr-1" />
//             Refresh
//           </Button>
//           <Badge variant="secondary" className="px-3 py-1 flex items-center">
//             <Target className="w-4 h-4 mr-1" />
//             {totalGoals} Goals
//           </Badge>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Goals</p>
//                 <p className="text-2xl font-bold text-blue-600">{totalGoals}</p>
//                 <p className="text-sm text-gray-500 mt-1">Active goals</p>
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
//                 <p className="text-sm text-gray-500 font-medium">Completed</p>
//                 <p className="text-2xl font-bold text-green-600">
//                   {completedGoals}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalGoals > 0
//                     ? ((completedGoals / totalGoals) * 100).toFixed(0)
//                     : 0}
//                   % success rate
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
//                 <Trophy className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Target Amount
//                 </p>
//                 <p className="text-2xl font-bold text-purple-600">
//                   ₹{totalTargetAmount.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">Total target</p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <Flag className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Saved So Far
//                 </p>
//                 <p className="text-2xl font-bold text-orange-600">
//                   ₹{totalCurrentAmount.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {totalTargetAmount > 0
//                     ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(
//                         1
//                       )
//                     : 0}
//                   % of target
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
//                 <DollarSign className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Goals Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {goals.map((goal, index) => {
//           const progressPercentage = getProgressPercentage(
//             goal.currentAmount,
//             goal.targetAmount
//           );
//           const daysRemaining = getDaysRemaining(goal.targetDate);
//           const isCompleted = goal.status === "Completed";
//           const isOverdue = daysRemaining < 0 && !isCompleted;

//           return (
//             <Card
//               key={goal.id}
//               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className={`w-10 h-10 bg-gradient-to-r ${
//                         goal.color || "from-blue-500 to-blue-600"
//                       } rounded-lg flex items-center justify-center`}
//                     >
//                       {isCompleted ? (
//                         <CheckCircle className="w-5 h-5 text-white" />
//                       ) : (
//                         <Target className="w-5 h-5 text-white" />
//                       )}
//                     </div>
//                     {/* <div>
//                       <CardTitle className="text-lg font-semibold text-gray-900">
//                         {goal.title}
//                       </CardTitle>
//                       <div className="flex items-center space-x-2 mt-1">
//                         <Badge variant="secondary" className="text-xs">
//                           {goal.category}
//                         </Badge>
//                         <Badge
//                           className={`text-xs ${getPriorityColor(
//                             goal.priority
//                           )}`}
//                         >
//                           {goal.priority}
//                         </Badge>
//                       </div>
//                     </div> */}
//                     <div>
//                       <CardTitle className="text-lg font-semibold text-gray-900">
//                         {goal.title}
//                       </CardTitle>
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         <Badge variant="secondary" className="text-xs">
//                           {goal.category}
//                         </Badge>
//                         <Badge
//                           className={`text-xs ${getPriorityColor(
//                             goal.priority
//                           )}`}
//                         >
//                           {goal.priority}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {isCompleted && (
//                       <Star className="w-5 h-5 text-yellow-500" />
//                     )}
//                     {isOverdue && <Clock className="w-5 h-5 text-red-500" />}
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 <p className="text-gray-600 text-sm">{goal.description}</p>

//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">
//                       Saved: ₹{Number(goal.currentAmount).toLocaleString()}
//                     </span>
//                     <span className="text-gray-600">
//                       Target: ₹{Number(goal.targetAmount).toLocaleString()}
//                     </span>
//                   </div>
//                   <Progress
//                     value={Math.min(progressPercentage, 100)}
//                     className={`h-3 ${
//                       isCompleted
//                         ? "[&>div]:bg-green-500"
//                         : "[&>div]:bg-blue-500"
//                     }`}
//                   />
//                   <div className="flex justify-between text-sm">
//                     <span
//                       className={`font-medium ${
//                         isCompleted ? "text-green-600" : "text-blue-600"
//                       }`}
//                     >
//                       {progressPercentage.toFixed(1)}% complete
//                     </span>
//                     <span className="text-gray-500">
//                       ₹
//                       {(
//                         goal.targetAmount - goal.currentAmount
//                       ).toLocaleString()}{" "}
//                       remaining
//                     </span>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-gray-500">Target Date</p>
//                     <p
//                       className={`font-semibold ${
//                         isOverdue ? "text-red-600" : "text-gray-900"
//                       }`}
//                     >
//                       {new Date(goal.targetDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Days Remaining</p>
//                     <p
//                       className={`font-semibold ${
//                         isOverdue
//                           ? "text-red-600"
//                           : isCompleted
//                           ? "text-green-600"
//                           : "text-gray-900"
//                       }`}
//                     >
//                       {isCompleted
//                         ? "Completed!"
//                         : isOverdue
//                         ? `${Math.abs(daysRemaining)} days overdue`
//                         : `${daysRemaining} days`}
//                     </p>
//                   </div>
//                 </div>

//                 {isCompleted && (
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                     <p className="text-green-800 text-sm font-medium flex items-center">
//                       <Trophy className="w-4 h-4 mr-2" />
//                       🎉 Congratulations! Goal achieved!
//                     </p>
//                   </div>
//                 )}

//                 {isOverdue && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                     <p className="text-red-800 text-sm font-medium">
//                       ⚠️ Goal deadline has passed. Consider adjusting your
//                       target date.
//                     </p>
//                   </div>
//                 )}

//                 {/* <div className="flex space-x-2 pt-2">
//                   {!isCompleted && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => addContribution(goal, 5000)}
//                       className="flex-1 bg-transparent hover:bg-green-50"
//                     >
//                       <DollarSign className="w-4 h-4 mr-1" />
//                       Add ₹5K
//                     </Button>
//                   )}
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleEdit(goal)}
//                     className="flex-1 bg-transparent"
//                   >
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   <Button variant="destructive" size="sm" onClick={() => deleteGoal(goal.id)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div> */}
//                 <div className="flex flex-col sm:flex-row gap-2 pt-2">
//                   {!isCompleted && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => addContribution(goal, 5000)}
//                       className="flex-1 bg-transparent hover:bg-green-50"
//                     >
//                       <DollarSign className="w-4 h-4 mr-1" />
//                       Add ₹5K
//                     </Button>
//                   )}
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleEdit(goal)}
//                     className="flex-1 bg-transparent"
//                   >
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => deleteGoal(goal.id)}
//                     className="flex-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}

//         {/* Add New Goal Card */}
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
//               <CardContent className="p-12 text-center">
//                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
//                   <Plus className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Create New Goal
//                 </h3>
//                 <p className="text-gray-600">
//                   Set a new financial goal to work towards
//                 </p>
//               </CardContent>
//             </Card>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center">
//                 <Target className="w-5 h-5 mr-2 text-blue-600" />
//                 Create New Goal
//               </DialogTitle>
//               <p className="text-gray-600">
//                 Set a new financial goal to track your progress
//               </p>
//             </DialogHeader>
//             <div className="space-y-4 mt-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Goal Title</Label>
//                 <Input
//                   id="title"
//                   name="title"
//                   placeholder="e.g., Emergency Fund"
//                   value={formData.title}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   placeholder="Describe your goal..."
//                   value={formData.description}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="targetAmount">Target Amount</Label>
//                   <Input
//                     id="targetAmount"
//                     name="targetAmount"
//                     type="number"
//                     placeholder="100000"
//                     value={formData.targetAmount}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="currentAmount">Current Amount</Label>
//                   <Input
//                     id="currentAmount"
//                     name="currentAmount"
//                     type="number"
//                     placeholder="0"
//                     value={formData.currentAmount}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="targetDate">Target Date</Label>
//                 <Input
//                   id="targetDate"
//                   name="targetDate"
//                   type="date"
//                   value={formData.targetDate}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category</Label>
//                   <Select
//                     value={formData.category}
//                     onValueChange={(value) =>
//                       setFormData({ ...formData, category: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((category) => (
//                         <SelectItem key={category} value={category}>
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="priority">Priority</Label>
//                   <Select
//                     value={formData.priority}
//                     onValueChange={(value) =>
//                       setFormData({ ...formData, priority: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {priorities.map((priority) => (
//                         <SelectItem key={priority} value={priority}>
//                           {priority}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//             <DialogFooter className="mt-6">
//               <Button variant="outline" onClick={() => setDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={createGoal}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//               >
//                 <Plus className="w-4 h-4 mr-2" /> Create Goal
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Edit Goal Dialog */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center">
//               <Edit className="w-5 h-5 mr-2 text-blue-600" />
//               Edit Goal
//             </DialogTitle>
//             <p className="text-gray-600">Update your goal details</p>
//           </DialogHeader>
//           <div className="space-y-4 mt-4">
//             <div className="space-y-2">
//               <Label htmlFor="edit-title">Goal Title</Label>
//               <Input
//                 id="edit-title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="edit-description">Description</Label>
//               <Textarea
//                 id="edit-description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="edit-targetAmount">Target Amount</Label>
//                 <Input
//                   id="edit-targetAmount"
//                   name="targetAmount"
//                   type="number"
//                   value={formData.targetAmount}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="edit-currentAmount">Current Amount</Label>
//                 <Input
//                   id="edit-currentAmount"
//                   name="currentAmount"
//                   type="number"
//                   value={formData.currentAmount}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="edit-targetDate">Target Date</Label>
//               <Input
//                 id="edit-targetDate"
//                 name="targetDate"
//                 type="date"
//                 value={formData.targetDate}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="edit-category">Category</Label>
//                 <Select
//                   value={formData.category}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, category: value })
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
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
//                 <Label htmlFor="edit-priority">Priority</Label>
//                 <Select
//                   value={formData.priority}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, priority: value })
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {priorities.map((priority) => (
//                       <SelectItem key={priority} value={priority}>
//                         {priority}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//           <DialogFooter className="mt-6">
//             <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={() => updateGoal(editingGoal.id)}
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//             >
//               <CheckCircle className="w-4 h-4 mr-2" /> Update Goal
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Empty State */}
//       {goals.length === 0 && (
//         <Card className="border-0 shadow-lg">
//           <CardContent className="p-12 text-center">
//             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Target className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               Set Your First Goal
//             </h3>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               Start your financial journey by setting clear, achievable goals.
//               Track your progress and celebrate your wins!
//             </p>
//             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   size="lg"
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
//                 >
//                   <Plus className="w-5 h-5 mr-2" /> Create Your First Goal
//                 </Button>
//               </DialogTrigger>
//             </Dialog>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default Goals;


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Target, Plus, Edit, Trash2, IndianRupee, CheckCircle, Clock, Star, RefreshCw, Trophy, Flag } from "lucide-react"
import { API_BASE } from "@/lib/api"

const API_URL = `${API_BASE}/goals/`
const USER_ID = localStorage.getItem("userId") // 👈 portfolio jaisa

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    category: "Emergency",
    priority: "Medium",
  })

  const categories = ["Emergency", "Travel", "Transportation", "Housing", "Education", "Investment", "Other"]
  const priorities = ["Low", "Medium", "High"]

  // -----------------
  // API FUNCTIONS
  // -----------------
  const fetchGoals = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}?user_id=${USER_ID}`)
      const data = await res.json()
      setGoals(data)
    } catch (err) {
      console.error("Error fetching goals:", err)
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: USER_ID }),
      })
      if (res.ok) {
        await fetchGoals()
        setDialogOpen(false)
        resetForm()
        showToast("Goal created successfully!", "green")
      }
    } catch (err) {
      console.error("Error creating goal:", err)
    }
  }

  const updateGoal = async (id) => {
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: USER_ID }),
      })
      if (res.ok) {
        await fetchGoals()
        setEditDialogOpen(false)
        setEditingGoal(null)
        resetForm()
        showToast("Goal updated successfully!", "blue")
      }
    } catch (err) {
      console.error("Error updating goal:", err)
    }
  }

  const deleteGoal = async (id) => {
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" })
      if (res.ok) {
        setGoals(goals.filter((g) => g.id !== id))
        showToast("Goal deleted successfully!", "red")
      }
    } catch (err) {
      console.error("Error deleting goal:", err)
    }
  }

  const addContribution = async (goal, amount) => {
    const newAmount = Number(goal.currentAmount) + amount
    const updatedGoal = { ...goal, currentAmount: newAmount, user_id: USER_ID }
    try {
      const res = await fetch(`${API_URL}${goal.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGoal),
      })
      if (res.ok) {
        await fetchGoals()
        showToast("Contribution added!", "green")
      }
    } catch (err) {
      console.error("Error adding contribution:", err)
    }
  }

  // -----------------
  // HELPERS
  // -----------------
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const resetForm = () =>
    setFormData({
      title: "",
      description: "",
      targetAmount: "",
      currentAmount: "",
      targetDate: "",
      category: "Emergency",
      priority: "Medium",
    })

  const showToast = (msg, color = "blue") => {
    const div = document.createElement("div")
    div.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`
    div.innerText = msg
    document.body.appendChild(div)
    setTimeout(() => document.body.removeChild(div), 3000)
  }

  const handleSubmit = () => createGoal()
  const handleEditSubmit = () => updateGoal(editingGoal.id)
  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate?.split("T")[0],
      category: goal.category,
      priority: goal.priority,
    })
    setEditDialogOpen(true)
  }

  const getProgressPercentage = (current, target) => (current / target) * 100
  const getDaysRemaining = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diff = target - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])
  // -----------------
  // RENDER
  // -----------------
  // Calculate totals
  const totalGoals = goals.length
  const completedGoals = goals.filter((goal) => goal.status === "Completed").length
  const totalTargetAmount = goals.reduce((sum, goal) => sum + (Number(goal.targetAmount) || 0), 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + (Number(goal.currentAmount) || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your financial goals...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          {/* <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Goals
              </h1>
              <p className="text-gray-600 mt-2">Set, track, and achieve your financial objectives</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={fetchGoals}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                <Target className="w-4 h-4 mr-1" />
                {totalGoals} Goals
              </Badge>
            </div>
          </div> */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Section */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Goals
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Set, track, and achieve your financial objectives
              </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={fetchGoals} className="flex items-center bg-transparent">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Badge variant="secondary" className="px-3 py-1 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {totalGoals} Goals
              </Badge>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Goals</p>
                    <p className="text-2xl font-bold text-blue-600">{totalGoals}</p>
                    <p className="text-sm text-gray-500 mt-1">Active goals</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : 0}% success rate
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Target Amount</p>
                    <p className="text-2xl font-bold text-purple-600">₹{totalTargetAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Total target</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Flag className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Saved So Far</p>
                    <p className="text-2xl font-bold text-orange-600">₹{totalCurrentAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {totalTargetAmount > 0 ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1) : 0}% of
                      target
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal, index) => {
              const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount)
              const daysRemaining = getDaysRemaining(goal.targetDate)
              const isCompleted = goal.status === "Completed"
              const isOverdue = daysRemaining < 0 && !isCompleted

              return (
                <Card
                  key={goal.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${
                            goal.color || "from-blue-500 to-blue-600"
                          } rounded-lg flex items-center justify-center`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Target className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{goal.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {goal.category}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>{goal.priority}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isCompleted && <Star className="w-5 h-5 text-yellow-500" />}
                        {isOverdue && <Clock className="w-5 h-5 text-red-500" />}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{goal.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Saved: ₹{Number(goal.currentAmount).toLocaleString()}</span>
                        <span className="text-gray-600">Target: ₹{Number(goal.targetAmount).toLocaleString()}</span>
                      </div>
                      <Progress
                        value={Math.min(progressPercentage, 100)}
                        className={`h-3 ${isCompleted ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`}
                      />
                      <div className="flex justify-between text-sm">
                        <span className={`font-medium ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
                          {progressPercentage.toFixed(1)}% complete
                        </span>
                        <span className="text-gray-500">
                          ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Target Date</p>
                        <p className={`font-semibold ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Days Remaining</p>
                        <p
                          className={`font-semibold ${
                            isOverdue ? "text-red-600" : isCompleted ? "text-green-600" : "text-gray-900"
                          }`}
                        >
                          {isCompleted
                            ? "Completed!"
                            : isOverdue
                              ? `${Math.abs(daysRemaining)} days overdue`
                              : `${daysRemaining} days`}
                        </p>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm font-medium flex items-center">
                          <Trophy className="w-4 h-4 mr-2" />🎉 Congratulations! Goal achieved!
                        </p>
                      </div>
                    )}

                    {isOverdue && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 text-sm font-medium">
                          ⚠️ Goal deadline has passed. Consider adjusting your target date.
                        </p>
                      </div>
                    )}

                    {/* <div className="flex space-x-2 pt-2">
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addContribution(goal, 5000)}
                          className="flex-1 bg-transparent hover:bg-green-50"
                        >
                          <IndianRupee className="w-4 h-4 mr-1" />
                          Add ₹5K
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div> */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addContribution(goal, 5000)}
                          className="flex-1 bg-transparent hover:bg-green-50"
                        >
                          <IndianRupee className="w-4 h-4 mr-1" />
                          Add ₹5K
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteGoal(goal.id)} className="flex-1">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Add New Goal Card */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Goal</h3>
                    <p className="text-gray-600">Set a new financial goal to work towards</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Create New Goal
                  </DialogTitle>
                  <p className="text-gray-600">Set a new financial goal to track your progress</p>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Emergency Fund"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your goal..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetAmount">Target Amount</Label>
                      <Input
                        id="targetAmount"
                        name="targetAmount"
                        type="number"
                        placeholder="100000"
                        value={formData.targetAmount}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentAmount">Current Amount</Label>
                      <Input
                        id="currentAmount"
                        name="currentAmount"
                        type="number"
                        placeholder="0"
                        value={formData.currentAmount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      name="targetDate"
                      type="date"
                      value={formData.targetDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
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
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={createGoal}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Goal Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2 text-blue-600" />
                  Edit Goal
                </DialogTitle>
                <p className="text-gray-600">Update your goal details</p>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Goal Title</Label>
                  <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-targetAmount">Target Amount</Label>
                    <Input
                      id="edit-targetAmount"
                      name="targetAmount"
                      type="number"
                      value={formData.targetAmount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-currentAmount">Current Amount</Label>
                    <Input
                      id="edit-currentAmount"
                      name="currentAmount"
                      type="number"
                      value={formData.currentAmount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-targetDate">Target Date</Label>
                  <Input
                    id="edit-targetDate"
                    name="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => updateGoal(editingGoal.id)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Update Goal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Empty State */}
          {goals.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Set Your First Goal</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start your financial journey by setting clear, achievable goals. Track your progress and celebrate
                  your wins!
                </p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
                    >
                      <Plus className="w-5 h-5 mr-2" /> Create Your First Goal
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default Goals
