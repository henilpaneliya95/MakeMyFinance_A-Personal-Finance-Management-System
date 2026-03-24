import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Trash2,
  Edit,
  Calendar,
  IndianRupee,
  Tag,
  RefreshCw,
  Upload,
  Camera,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_BASE } from "@/lib/api";


// Initialize Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// Initialize Gemini with API key (use env in production)
const genAI = new GoogleGenerativeAI("AIzaSyDeOoiV-SulexvHIJZh5yH6m4gBdg5hHMg"); // Note: Hardcoded API key, consider environment variables for production.

// Helper function to scan receipt
async function scanReceipt(file) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const arrayBuffer = await file.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const prompt = `
    Analyze this receipt image and extract the following information in JSON format:
    - Total amount (just the number)
    - Date (in ISO format) /2025-07-15T18:30:00.000+00:00 this format
    - Description or items purchased (brief summary)
    - type / income or expense
    - Suggested category / CATEGORY_CHOICES = [ # Income Categories
    "salary", "freelance", "business", "investment", "rental_income",
    "gift", "cashback", "bonus", "commission", "other_income",

    # Expense Categories
    "groceries", "rent", "utilities", "internet", "transportation",
    "education", "health", "shopping", "travel", "other_expense",
    
    # other
    "other"
]

    Only respond with valid JSON in this exact format:
    {
      "amount": number,
      "type": "string", /income or expense
      "date": "ISO date string", /2025-07-15T18:30:00.000+00:00
      "description": "string",
      "category": "string", 
    }

    If it's not a receipt, return an empty object.
  `;

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64String,
        mimeType: file.type,
      },
    },
    prompt,
  ]);

  const response = await result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  try {
    const data = JSON.parse(cleanedText);
    
    // Parse amount - extract first number if it's a range like "₹800 - ₹3200"
    let amount = data.amount;
    if (typeof amount === 'string') {
      // Extract first number from strings like "₹800 - ₹3200" or "800.50"
      const match = amount.match(/[\d.]+/);
      amount = match ? Number.parseFloat(match[0]) : 0;
    } else {
      amount = Number.parseFloat(amount);
    }
    
    return {
      amount: amount,
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      type: data.type,
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to parse scanned data");
  }
}

const Transactions = () => {
  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(
    localStorage.getItem("selectedAccountId") || ""
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  // Receipt scanner state
  const [scanFile, setScanFile] = useState(null);
  const [scanPreview, setScanPreview] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    id: "",
    user_id: localStorage.getItem("userId"),
    account_id: selectedAccountId,
    category: "",
    amount: "",
    date: "",
    type: "expense",
    description: "",
  });

  // Fetch transactions
  const getTransactions = async () => {
    try {
      const accountId = selectedAccountId || localStorage.getItem("selectedAccountId");

      // 🚨 Agar account nahi hai toh empty transactions set karo
      if (!accountId || accountId === "null") {
        setTransactions([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE}/transactions/accounts/${accountId}`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts
  const getAccounts = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await axios.get(`${API_BASE}/accounts/?user_id=${userId}`);
      setAccounts(res.data);

      // If no account is selected but we have accounts, select the first one
      if ((!selectedAccountId || selectedAccountId === "null") && res.data.length > 0) {
        const firstAccountId = res.data[0].id;
        setSelectedAccountId(firstAccountId);
        localStorage.setItem("selectedAccountId", firstAccountId);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    getTransactions();
    setFormData((prev) => ({ ...prev, account_id: selectedAccountId }));
  }, [selectedAccountId]);

  // Handle form input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle file selection for receipt scanning
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setScanFile(selectedFile);
    setScanError(null);
    setScannedData(null);

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setScanPreview(previewUrl);
  };

  // Process receipt scanning
  const handleScanReceipt = async () => {
    if (!scanFile) return;

    setScanLoading(true);
    setScanProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const result = await scanReceipt(scanFile);
      clearInterval(progressInterval);
      setScanProgress(100);

      setScannedData(result);

      // Update form with scanned data
      setFormData({
        ...formData,
        amount: result.amount.toString(),
        date: new Date(result.date).toISOString().split("T")[0],
        description: result.description,
        category: result.category,
        type: result.type || "expense",
      });

      // Show success notification
      showNotification("Receipt scanned successfully!", "success");
    } catch (error) {
      setScanError("Failed to scan receipt. Please try again.");
      showNotification("Failed to scan receipt", "error");
    } finally {
      setScanLoading(false);
    }
  };

  // Use scanned data to create transaction
  const useScannedData = () => {
    if (!scannedData) return;

    setActiveTab("manual");
    // Form data is already updated when scanning succeeds
  };

  // Add or edit transaction
  const handleAddEdit = async (e) => {
    e.preventDefault();

    // Validate that account_id is not empty
    const accountId = formData.account_id || selectedAccountId || localStorage.getItem("selectedAccountId");
    if (!accountId || accountId === "null" || accountId === "") {
      showNotification("Please select an account first", "error");
      console.error("Account ID validation failed:", { 
        formDataAccountId: formData.account_id,
        selectedAccountId: selectedAccountId,
        localStorageAccountId: localStorage.getItem("selectedAccountId")
      });
      return;
    }

    // Validate amount
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    try {
      // Format date properly - if formData.date is a string, convert to ISO format
      let dateValue = formData.date;
      if (dateValue && !dateValue.includes('T')) {
        // If it's just a date string (YYYY-MM-DD), add time
        dateValue = `${dateValue}T00:00:00Z`;
      } else if (!dateValue) {
        // If no date provided, use current date
        dateValue = new Date().toISOString();
      }

      const dataToSend = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        user_id: localStorage.getItem("userId"),
        account_id: accountId,
        date: dateValue,
      };

      console.log("Sending transaction data:", dataToSend);

      if (formData.id) {
        await axios.put(
          `${API_BASE}/transactions/${formData.id}/update/`,
          dataToSend
        );
      } else {
        await axios.post(`${API_BASE}/transactions/`, dataToSend);
      }

      await getTransactions();
      resetForm();
      setShowAddForm(false);

      // Show success notification
      showNotification(
        `Transaction ${formData.id ? "updated" : "added"} successfully!`,
        "success"
      );
    } catch (err) {
      console.error("Error adding/updating transaction:", err);
      // Show detailed error message from backend if available
      const errorMsg = err.response?.data?.account_id?.[0] || 
                       err.response?.data?.user_id?.[0] ||
                       err.response?.data?.error ||
                       "Error saving transaction";
      showNotification(errorMsg, "error");
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      id: "",
      user_id: localStorage.getItem("userId"),
      account_id: selectedAccountId,
      category: "",
      amount: "",
      type: "expense",
      description: "",
      date: "",
    });
    setScanFile(null);
    setScanPreview(null);
    setScannedData(null);
    setScanError(null);
    setScanProgress(0);
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    const notificationDiv = document.createElement("div");
    notificationDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`;

    notificationDiv.innerHTML = `
      <div class="flex items-center space-x-2">
        ${
          type === "success"
            ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>'
            : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>'
        }
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notificationDiv);

    // Add exit animation
    setTimeout(() => {
      notificationDiv.classList.remove("animate-slide-in-right");
      notificationDiv.classList.add("animate-fade-out");

      setTimeout(() => {
        document.body.removeChild(notificationDiv);
      }, 500);
    }, 3000);
  };

  // Edit transaction
  const handleEdit = (txn) => {
    setFormData({ ...txn });
    setShowAddForm(true);
    setActiveTab("manual");
  };

  // Delete transaction
  const handleDelete = async (txn) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmed) {
      try {
        await axios.delete(
          `${API_BASE}/transactions/${txn.id}/delete/`
        );
        await getTransactions();
        showNotification("Transaction deleted successfully", "success");
      } catch (error) {
        showNotification("Error deleting transaction", "error");
      }
    }
  };

  // Row selection handlers
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map((txn) => txn.id));
    }
    setSelectAll(!selectAll);
  };

  // Delete selected transactions
  const handleDeleteSelected = async () => {
    const confirmed = window.confirm(
      `Delete ${selectedRows.length} selected transactions?`
    );
    if (confirmed) {
      try {
        await Promise.all(
          selectedRows.map((id) =>
            axios.delete(`${API_BASE}/transactions/${id}/delete/`)
          )
        );
        setSelectedRows([]);
        setSelectAll(false);
        await getTransactions();
        showNotification("Selected transactions deleted", "success");
      } catch (error) {
        showNotification("Error deleting transactions", "error");
      }
    }
  };

  // Table columns definition
  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
        ),
        Cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.includes(row.original.id)}
            onCheckedChange={() => handleSelectRow(row.original.id)}
          />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => (
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{value}</span>
          </div>
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value, row }) => (
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-gray-500" />
            <span
              className={`font-bold ${
                row.original.type === "income"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {row.original.type === "income" ? "+" : "-"}₹
              {Number(value).toLocaleString()}
            </span>
          </div>
        ),
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: ({ value }) => (
          <Badge
            variant={value === "income" ? "default" : "destructive"}
            className="capitalize"
          >
            {value === "income" ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {value}
          </Badge>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              {new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(row.original)}
              className="transition-all hover:scale-105"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(row.original)}
              className="transition-all hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [selectedRows, selectAll]
  );

  // React Table setup
  const data = React.useMemo(() => transactions, [transactions]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    state,
    previousPage,
    nextPage,
    pageCount,
    canNextPage,
    canPreviousPage,
    gotoPage,
  } = useTable(
    { columns, data, initialState: { pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  // Chart data
  const chartData = {
    labels: [...new Set(transactions.map((t) => t.category))],
    datasets: [
      {
        label: "Amount",
        data: [...new Set(transactions.map((t) => t.category))].map(
          (category) =>
            transactions
              .filter((t) => t.category === category)
              .reduce((sum, t) => sum + Number(t.amount), 0)
        ),
        backgroundColor: transactions.map((t) =>
          t.type === "income" ? "#22c55e" : "#ef4444"
        ),
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4 pt-2">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Transactions
          </h1>
          <p className="text-gray-600 mt-2">Manage your income and expenses</p>
        </div>
        <div className="flex items-center space-x-3 flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Account Selector */}
          {accountsLoading ? (
            <div className="text-sm text-gray-500">Loading accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="text-sm text-red-500">No accounts found. Please create one.</div>
          ) : (
            <Select value={selectedAccountId} onValueChange={(value) => {
              setSelectedAccountId(value);
              localStorage.setItem("selectedAccountId", value);
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.account_name} ({acc.account_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            onClick={getTransactions}
            className="transition-all hover:scale-105 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showAddForm} onOpenChange={(open) => {
            setShowAddForm(open);
            if (open && !formData.id) {
              resetForm(); // Reset form when opening dialog for new transaction
            }
          }}>
            <DialogTrigger asChild>
              <Button
                disabled={!selectedAccountId}
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {formData.id ? "Edit Transaction" : "Add New Transaction"}
                </DialogTitle>
                <DialogDescription>
                  {formData.id ? "Update the transaction details below" : "Create a new transaction by entering the details below"}
                </DialogDescription>
              </DialogHeader>

              <Tabs
                defaultValue="manual"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-4"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger
                    value="manual"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="scan" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Scan Receipt
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual">
                  <form
                    onSubmit={handleAddEdit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
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
                          ].map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 space-y-2">
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Transaction description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 flex items-center space-x-3">
                      <Button
                        type="submit"
                        disabled={!formData.category || !formData.amount || !formData.date || !formData.type}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formData.id ? "Update Transaction" : "Add Transaction"}
                      </Button>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="scan">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 transition-all hover:border-blue-400">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="receipt-upload"
                      />

                      {!scanPreview ? (
                        <label
                          htmlFor="receipt-upload"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-600 font-medium">
                            Upload receipt image
                          </p>
                          <p className="text-gray-400 text-sm">
                            Click or drag and drop
                          </p>
                        </label>
                      ) : (
                        <div className="w-full">
                          <div className="relative w-full max-w-md mx-auto mb-4">
                            <img
                              src={scanPreview || "/placeholder.svg"}
                              alt="Receipt preview"
                              className="w-full h-auto max-h-64 object-contain rounded-lg shadow-md"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full"
                              onClick={() => {
                                setScanPreview(null);
                                setScanFile(null);
                              }}
                            >
                              ×
                            </Button>
                          </div>

                          {scanLoading ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                  Scanning receipt...
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                  {scanProgress}%
                                </span>
                              </div>
                              <Progress value={scanProgress} className="h-2" />
                            </div>
                          ) : scannedData ? (
                            <div className="p-4 border rounded-lg bg-green-50 shadow-sm animate-fade-in">
                              <div className="flex items-center mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                                <h3 className="font-semibold text-green-700">
                                  Receipt Scanned Successfully
                                </h3>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium">Amount:</span> ₹
                                  {scannedData.amount}
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span>{" "}
                                  {new Date(
                                    scannedData.date
                                  ).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Type:</span>{" "}
                                  {scannedData.type}
                                </div>
                                <div>
                                  <span className="font-medium">Category:</span>{" "}
                                  {scannedData.category}
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium">
                                    Description:
                                  </span>{" "}
                                  {scannedData.description}
                                </div>
                              </div>
                              <Button
                                className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600"
                                onClick={useScannedData}
                              >
                                Use This Data
                              </Button>
                            </div>
                          ) : scanError ? (
                            <div className="p-4 border rounded-lg bg-red-50 shadow-sm animate-fade-in">
                              <div className="flex items-center mb-2">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                <h3 className="font-semibold text-red-700">
                                  Scanning Failed
                                </h3>
                              </div>
                              <p className="text-sm text-red-600 mb-3">
                                {scanError}
                              </p>
                              <Button
                                className="w-full bg-transparent"
                                variant="outline"
                                onClick={() => {
                                  setScanError(null);
                                  setScanFile(null);
                                  setScanPreview(null);
                                }}
                              >
                                Try Again
                              </Button>
                            </div>
                          ) : (
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                              onClick={handleScanReceipt}
                              disabled={!scanFile}
                            >
                              {scanLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Scanning...
                                </>
                              ) : (
                                <>
                                  <Camera className="w-4 h-4 mr-2" />
                                  Scan Receipt
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{totalExpenses.toLocaleString()}
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
                <p className="text-sm text-gray-500 font-medium">Net Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    netBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{netBalance.toLocaleString()}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${
                  netBalance >= 0
                    ? "from-blue-500 to-blue-600"
                    : "from-orange-500 to-orange-600"
                } rounded-lg flex items-center justify-center`}
              >
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Transaction Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                animation: {
                  duration: 1000,
                  easing: "easeOutQuart",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search transactions..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedRows.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="animate-pulse-subtle"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedRows.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table {...getTableProps()}>
              <TableHeader>
                {headerGroups.map((headerGroup, index) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                      <TableHead
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        key={index}
                        className="transition-colors hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.render("Header")}</span>
                          {column.isSorted && (
                            <span className="text-blue-600">
                              {column.isSortedDesc ? " 🔽" : " 🔼"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody {...getTableBodyProps()}>
                {page.length > 0 ? (
                  page.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                      <TableRow
                        {...row.getRowProps()}
                        key={rowIndex}
                        className="transition-colors hover:bg-gray-50 animate-fade-in"
                        style={{ animationDelay: `${rowIndex * 50}ms` }}
                      >
                        {row.cells.map((cell, index) => (
                          <TableCell {...cell.getCellProps()} key={index}>
                            {cell.render("Cell")}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-8"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText className="w-12 h-12 mb-2 opacity-30" />
                        <p className="text-lg font-medium">
                          No transactions found
                        </p>
                        <p className="text-sm">
                          Add a new transaction to get started
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {/* <div>
{transactions.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  variant="outline"
                  className="transition-all hover:bg-gray-100"
                >
                  First
                </Button>
                <Button
                  onClick={previousPage}
                  disabled={!canPreviousPage}
                  variant="outline"
                  className="transition-all hover:bg-gray-100 bg-transparent"
                >
                  Previous
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                Page {pageIndex + 1} of {pageCount} ({transactions.length} total
                transactions)
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={nextPage}
                  disabled={!canNextPage}
                  variant="outline"
                  className="transition-all hover:bg-gray-100 bg-transparent"
                >
                  Next
                </Button>
                <Button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  variant="outline"
                  className="transition-all hover:bg-gray-100"
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div> */}
      <div>
        {transactions.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left Controls */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    variant="outline"
                    className="transition-all hover:bg-gray-100 w-full sm:w-auto"
                  >
                    First
                  </Button>
                  <Button
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                    variant="outline"
                    className="transition-all hover:bg-gray-100 bg-transparent w-full sm:w-auto"
                  >
                    Previous
                  </Button>
                </div>

                {/* Page Info */}
                <span className="text-sm text-gray-600 text-center">
                  Page {pageIndex + 1} of {pageCount} ({transactions.length}{" "}
                  total transactions)
                </span>

                {/* Right Controls */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                  <Button
                    onClick={nextPage}
                    disabled={!canNextPage}
                    variant="outline"
                    className="transition-all hover:bg-gray-100 bg-transparent w-full sm:w-auto"
                  >
                    Next
                  </Button>
                  <Button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    variant="outline"
                    className="transition-all hover:bg-gray-100 w-full sm:w-auto"
                  >
                    Last
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Transactions;
