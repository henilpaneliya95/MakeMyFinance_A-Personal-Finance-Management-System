// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   TrendingUp,
//   TrendingDown,
//   Plus,
//   Edit,
//   Trash2,
//   Briefcase,
//   BarChart3,
//   PieChart,
//   RefreshCw,
//   Activity,
// } from "lucide-react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const API_BASE_URL = "http://localhost:8000/api";

// const Portfolio = () => {
//   const [investments, setInvestments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingInvestment, setEditingInvestment] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     symbol: "",
//     type: "Stock",
//     quantity: "",
//     buyPrice: "",
//     currentPrice: "",
//   });

//   const investmentTypes = [
//     "Stock",
//     "ETF",
//     "Crypto",
//     "Bond",
//     "Mutual Fund",
//     "Real Estate",
//   ];

//   const userId = localStorage.getItem("userId");

//   const fetchInvestments = async () => {
//   try {
//     if (!userId) {
//       // If not logged in, just show empty portfolio
//       setInvestments([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     const res = await fetch(`${API_BASE_URL}/portfolios/?user_id=${userId}`);
//     if (!res.ok) throw new Error("Failed to fetch portfolio");
//     const data = await res.json();
//     setInvestments(data);
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchInvestments();
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     const quantity = Number.parseFloat(formData.quantity);
//     const buyPrice = Number.parseFloat(formData.buyPrice);
//     const currentPrice = Number.parseFloat(formData.currentPrice);

//     const payload = {
//       user_id: userId,
//       name: formData.name,
//       symbol: formData.symbol.toUpperCase(),
//       type: formData.type,
//       quantity,
//       buyPrice,
//       currentPrice,
//     };

//     try {
//       let res, updatedInv;
//       if (editingInvestment) {
//         // Update
//         res = await fetch(
//           `${API_BASE_URL}/portfolios/${editingInvestment.id}/`,
//           {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           }
//         );
//         if (!res.ok) throw new Error("Failed to update investment");
//         updatedInv = await res.json();
//         setInvestments((prev) =>
//           prev.map((inv) => (inv.id === updatedInv.id ? updatedInv : inv))
//         );
//       } else {
//         // Create
//         res = await fetch(`${API_BASE_URL}/portfolios/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//         if (!res.ok) throw new Error("Failed to add investment");
//         updatedInv = await res.json();
//         setInvestments((prev) => [...prev, updatedInv]);
//       }
//       setDialogOpen(false);
//       setEditingInvestment(null);
//       setFormData({
//         name: "",
//         symbol: "",
//         type: "Stock",
//         quantity: "",
//         buyPrice: "",
//         currentPrice: "",
//       });
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleEdit = (investment) => {
//     setEditingInvestment(investment);
//     setFormData({
//       name: investment.name,
//       symbol: investment.symbol,
//       type: investment.type,
//       quantity: investment.quantity,
//       buyPrice: investment.buyPrice,
//       currentPrice: investment.currentPrice,
//     });
//     setDialogOpen(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/portfolios/${id}/`, {
//         method: "DELETE",
//       });
//       if (res.status !== 204) throw new Error("Failed to delete");
//       setInvestments((prev) => prev.filter((inv) => inv.id !== id));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
//   const totalGainLoss = investments.reduce((sum, inv) => sum + inv.gainLoss, 0);
//   const totalGainLossPercent =
//     totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

//   const allocationData = {
//     labels: [...new Set(investments.map((inv) => inv.type))],
//     datasets: [
//       {
//         data: [...new Set(investments.map((inv) => inv.type))].map((type) =>
//           investments
//             .filter((inv) => inv.type === type)
//             .reduce((sum, inv) => sum + inv.totalValue, 0)
//         ),
//         backgroundColor: [
//           "#3b82f6",
//           "#10b981",
//           "#f59e0b",
//           "#ef4444",
//           "#8b5cf6",
//           "#06b6d4",
//         ],
//         borderWidth: 0,
//       },
//     ],
//   };

//   if (loading) {
//     return <div className="p-6">Loading portfolio...</div>;
//   }
//   if (error) {
//     return <div className="p-6 text-red-600">Error: {error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Investment Portfolio
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Track your investments and monitor portfolio performance
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button variant="outline" onClick={fetchInvestments}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh Prices
//           </Button>
//           <Badge variant="secondary" className="px-3 py-1">
//             <Briefcase className="w-4 h-4 mr-1" />
//             {investments.length} Holdings
//           </Badge>
//         </div>
//       </div>

//       {/* Portfolio Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Total Portfolio Value
//                 </p>
//                 <p className="text-2xl font-bold text-blue-600">
//                   ₹{totalValue.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Current market value
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                 <Briefcase className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Total Gain/Loss
//                 </p>
//                 <p
//                   className={`text-2xl font-bold ${
//                     totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {totalGainLoss >= 0 ? "+" : ""}₹
//                   {totalGainLoss.toLocaleString()}
//                 </p>
//                 <p
//                   className={`text-sm font-medium ${
//                     totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {totalGainLoss >= 0 ? "+" : ""}
//                   {totalGainLossPercent.toFixed(2)}%
//                 </p>
//               </div>
//               <div
//                 className={`w-12 h-12 bg-gradient-to-r ${
//                   totalGainLoss >= 0
//                     ? "from-green-500 to-green-600"
//                     : "from-red-500 to-red-600"
//                 } rounded-lg flex items-center justify-center`}
//               >
//                 {totalGainLoss >= 0 ? (
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 ) : (
//                   <TrendingDown className="w-6 h-6 text-white" />
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Active Investments
//                 </p>
//                 <p className="text-2xl font-bold text-purple-600">
//                   {investments.length}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">Different holdings</p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <Activity className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Portfolio Allocation Chart */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-1 border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <PieChart className="w-5 h-5 mr-2 text-blue-600" />
//               Portfolio Allocation
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-64">
//               <Pie
//                 data={allocationData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: {
//                       position: "bottom",
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Top Performers */}
//         <Card className="lg:col-span-2 border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
//               Top Performers
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {investments
//                 .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
//                 .slice(0, 3)
//                 .map((investment) => (
//                   <div
//                     key={investment.id}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
//                         <span className="text-white font-bold text-sm">
//                           {investment.symbol.charAt(0)}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {investment.name}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {investment.symbol}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p
//                         className={`font-bold ${
//                           investment.gainLoss >= 0
//                             ? "text-green-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {investment.gainLoss >= 0 ? "+" : ""}
//                         {investment.gainLossPercent.toFixed(2)}%
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         ₹{investment.totalValue.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Holdings Table */}
//       <Card className="border-0 shadow-lg">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-xl font-semibold">Your Holdings</CardTitle>
//           <Dialog
//             open={dialogOpen}
//             onOpenChange={(o) => {
//               if (!o) setEditingInvestment(null);
//               setDialogOpen(o);
//             }}
//           >
//             <DialogTrigger asChild>
//               <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Investment
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center">
//                   {editingInvestment ? (
//                     <>
//                       <Edit className="w-5 h-5 mr-2 text-blue-600" />
//                       Edit Investment
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="w-5 h-5 mr-2 text-blue-600" />
//                       Add New Investment
//                     </>
//                   )}
//                 </DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4 mt-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Investment Name</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="symbol">Symbol</Label>
//                   <Input
//                     id="symbol"
//                     name="symbol"
//                     value={formData.symbol}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="type">Type</Label>
//                   <Select
//                     value={formData.type}
//                     onValueChange={(value) =>
//                       setFormData({ ...formData, type: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {investmentTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="quantity">Quantity</Label>
//                     <Input
//                       id="quantity"
//                       name="quantity"
//                       type="number"
//                       value={formData.quantity}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="buyPrice">Buy Price</Label>
//                     <Input
//                       id="buyPrice"
//                       name="buyPrice"
//                       type="number"
//                       value={formData.buyPrice}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="currentPrice">Current Price</Label>
//                   <Input
//                     id="currentPrice"
//                     name="currentPrice"
//                     type="number"
//                     value={formData.currentPrice}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <DialogFooter className="mt-6">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setDialogOpen(false);
//                     setEditingInvestment(null);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//                 >
//                   {editingInvestment ? "Update Investment" : "Add Investment"}
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4">Investment</th>
//                   <th className="text-left py-3 px-4">Type</th>
//                   <th className="text-right py-3 px-4">Quantity</th>
//                   <th className="text-right py-3 px-4">Buy Price</th>
//                   <th className="text-right py-3 px-4">Current Price</th>
//                   <th className="text-right py-3 px-4">Total Value</th>
//                   <th className="text-right py-3 px-4">Gain/Loss</th>
//                   <th className="text-center py-3 px-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {investments.map((investment) => (
//                   <tr key={investment.id} className="border-b border-gray-100">
//                     <td className="py-3 px-4">{investment.name}</td>
//                     <td className="py-3 px-4">
//                       <Badge variant="secondary">{investment.type}</Badge>
//                     </td>
//                     <td className="py-3 px-4 text-right">
//                       {investment.quantity}
//                     </td>
//                     <td className="py-3 px-4 text-right">
//                       ₹{investment.buyPrice}
//                     </td>
//                     <td className="py-3 px-4 text-right">
//                       ₹{investment.currentPrice}
//                     </td>
//                     <td className="py-3 px-4 text-right">
//                       ₹{investment.totalValue}
//                     </td>
//                     <td className="py-3 px-4 text-right">
//                       <span
//                         className={
//                           investment.gainLoss >= 0
//                             ? "text-green-600"
//                             : "text-red-600"
//                         }
//                       >
//                         {investment.gainLoss >= 0 ? "+" : ""}₹
//                         {investment.gainLoss}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEdit(investment)}
//                       >
//                         <Edit className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => handleDelete(investment.id)}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Portfolio;



"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Briefcase,
  BarChart3,
  PieChart,
  RefreshCw,
  Activity,
} from "lucide-react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { API_BASE } from "@/lib/api"

ChartJS.register(ArcElement, Tooltip, Legend)



const Portfolio = () => {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    type: "Stock",
    quantity: "",
    buyPrice: "",
    currentPrice: "",
  })

  const investmentTypes = ["Stock", "ETF", "Crypto", "Bond", "Mutual Fund", "Real Estate"]

  const userId = localStorage.getItem("userId")

  const fetchInvestments = async () => {
    try {
      if (!userId) {
        // If not logged in, just show empty portfolio
        setInvestments([])
        setLoading(false)
        return
      }

      setLoading(true)
      const res = await fetch(`${API_BASE}/portfolios/?user_id=${userId}`)
      if (!res.ok) throw new Error("Failed to fetch portfolio")
      const data = await res.json()
      setInvestments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    const quantity = Number.parseFloat(formData.quantity)
    const buyPrice = Number.parseFloat(formData.buyPrice)
    const currentPrice = Number.parseFloat(formData.currentPrice)

    const payload = {
      user_id: userId,
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      quantity,
      buyPrice,
      currentPrice,
    }

    try {
      let res, updatedInv
      if (editingInvestment) {
        // Update
        res = await fetch(`${API_BASE}/portfolios/${editingInvestment.id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update investment")
        updatedInv = await res.json()
        setInvestments((prev) => prev.map((inv) => (inv.id === updatedInv.id ? updatedInv : inv)))
      } else {
        // Create
        res = await fetch(`${API_BASE}/portfolios/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to add investment")
        updatedInv = await res.json()
        setInvestments((prev) => [...prev, updatedInv])
      }
      setDialogOpen(false)
      setEditingInvestment(null)
      setFormData({
        name: "",
        symbol: "",
        type: "Stock",
        quantity: "",
        buyPrice: "",
        currentPrice: "",
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (investment) => {
    setEditingInvestment(investment)
    setFormData({
      name: investment.name,
      symbol: investment.symbol,
      type: investment.type,
      quantity: investment.quantity,
      buyPrice: investment.buyPrice,
      currentPrice: investment.currentPrice,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/portfolios/${id}/`, {
        method: "DELETE",
      })
      if (res.status !== 204) throw new Error("Failed to delete")
      setInvestments((prev) => prev.filter((inv) => inv.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0)
  const totalGainLoss = investments.reduce((sum, inv) => sum + inv.gainLoss, 0)
  const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0

  const allocationData = {
    labels: [...new Set(investments.map((inv) => inv.type))],
    datasets: [
      {
        data: [...new Set(investments.map((inv) => inv.type))].map((type) =>
          investments.filter((inv) => inv.type === type).reduce((sum, inv) => sum + inv.totalValue, 0),
        ),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
        borderWidth: 0,
      },
    ],
  }

  if (loading) {
    return <div className="p-6">Loading portfolio...</div>
  }
  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Investment Portfolio
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Track your investments and monitor portfolio performance
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" onClick={fetchInvestments} size="sm" className="flex-shrink-0 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Refresh Prices</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
            <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {investments.length} Holdings
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Portfolio Value</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 truncate">
                    ₹{totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current market value</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Gain/Loss</p>
                  <p
                    className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${
                      totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {totalGainLoss >= 0 ? "+" : ""}₹{totalGainLoss.toLocaleString()}
                  </p>
                  <p className={`text-xs font-medium ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {totalGainLoss >= 0 ? "+" : ""}
                    {totalGainLossPercent.toFixed(2)}%
                  </p>
                </div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${
                    totalGainLoss >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600"
                  } rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  {totalGainLoss >= 0 ? (
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Active Investments</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 truncate">
                    {investments.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Different holdings</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-1 border-0 shadow-lg">
            <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
              <CardTitle className="flex items-center text-lg sm:text-xl font-semibold">
                <PieChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="truncate">Portfolio Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="h-48 sm:h-64">
                <Pie
                  data={allocationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          boxWidth: 12,
                          font: {
                            size: 11,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
              <CardTitle className="flex items-center text-lg sm:text-xl font-semibold">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="truncate">Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {investments
                  .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
                  .slice(0, 3)
                  .map((investment) => (
                    <div
                      key={investment.id}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">{investment.symbol.charAt(0)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{investment.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{investment.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p
                          className={`font-bold text-sm sm:text-base ${
                            investment.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {investment.gainLoss >= 0 ? "+" : ""}
                          {investment.gainLossPercent.toFixed(2)}%
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">₹{investment.totalValue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-lg sm:text-xl font-semibold">Your Holdings</CardTitle>
            <Dialog
              open={dialogOpen}
              onOpenChange={(o) => {
                if (!o) setEditingInvestment(null)
                setDialogOpen(o)
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Investment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    {editingInvestment ? (
                      <>
                        <Edit className="w-5 h-5 mr-2 text-blue-600" />
                        Edit Investment
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2 text-blue-600" />
                        Add New Investment
                      </>
                    )}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Investment Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input id="symbol" name="symbol" value={formData.symbol} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyPrice">Buy Price</Label>
                      <Input
                        id="buyPrice"
                        name="buyPrice"
                        type="number"
                        value={formData.buyPrice}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPrice">Current Price</Label>
                    <Input
                      id="currentPrice"
                      name="currentPrice"
                      type="number"
                      value={formData.currentPrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false)
                      setEditingInvestment(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {editingInvestment ? "Update Investment" : "Add Investment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {" "}
                {/* Minimum width for table content */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Investment</th>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Type</th>
                      <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Quantity</th>
                      <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Buy Price</th>
                      <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Current Price</th>
                      <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Total Value</th>
                      <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Gain/Loss</th>
                      <th className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment) => (
                      <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium">{investment.name}</td>
                        <td className="py-3 px-3 sm:px-4">
                          <Badge variant="secondary" className="text-xs">
                            {investment.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm">{investment.quantity}</td>
                        <td className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm">₹{investment.buyPrice}</td>
                        <td className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm">₹{investment.currentPrice}</td>
                        <td className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm font-medium">
                          ₹{investment.totalValue}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right">
                          <span
                            className={`text-xs sm:text-sm font-medium ${
                              investment.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {investment.gainLoss >= 0 ? "+" : ""}₹{investment.gainLoss}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(investment)}
                              className="p-1 h-8 w-8"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(investment.id)}
                              className="p-1 h-8 w-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Portfolio
