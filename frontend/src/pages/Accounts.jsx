import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PiggyBank,
  TrendingUp,
  Plus,
  RefreshCw,
  Edit,
  Star,
  Target,
  Calendar,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Wallet,
  Trash2,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

const user_id =
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;

const Accounts = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    account_name: "",
    total_balance: "",
    account_type: "",
    description: "",
  });

  const [editFormData, setEditFormData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/accounts/?user_id=${user_id}`
      );
      const transformed = res.data.map((acc) => ({
        id: acc._id || acc.id,
        account_name: acc.account_name,
        account_type: acc.account_type,
        total_balance: acc.total_balance,
        description: acc.description || "",
        savings_rate: acc.savings_rate,
      }));

      setAccounts(transformed);

      const storedId =
        typeof window !== "undefined"
          ? localStorage.getItem("selectedAccountId")
          : null;

      if (!storedId && transformed.length > 0) {
        const firstId = transformed[0].id;
        setSelectedAccountId(firstId);
        if (typeof window !== "undefined")
          localStorage.setItem("selectedAccountId", firstId);
      } else {
        setSelectedAccountId(storedId);
      }
    } catch (err) {
      console.error("❌ Failed to load accounts:", err);
      setError("Failed to load accounts");
    }
  };

  const fetchTransactions = async () => {
    try {
      if (!user_id) return;
      const res = await axios.get(
        `${API_BASE}/transactions/?user_id=${user_id}`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Failed to load transactions:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAccounts();
        await fetchTransactions();
      } catch (err) {
        console.error("❌ Error loading data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user_id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleEditChange = (e) =>
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

  const showToast = (bgClass, text) => {
    const successDiv = document.createElement("div");
    successDiv.className = `fixed top-4 right-4 ${bgClass} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right`;
    successDiv.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span>${text}</span>
      </div>`;
    document.body.appendChild(successDiv);
    setTimeout(() => document.body.removeChild(successDiv), 3000);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE}/accounts/`, {
        user_id: user_id,
        account_name: formData.account_name,
        total_balance: Number.parseFloat(formData.total_balance || 0),
        account_type: formData.account_type,
        description: formData.description,
      });

      setDialogOpen(false);
      setFormData({
        account_name: "",
        total_balance: "",
        account_type: "",
        description: "",
      });
      await fetchAccounts();

      showToast("bg-green-500", "Savings account created successfully!");
    } catch (err) {
      console.error("❌ Failed to create account:", err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `${API_BASE}/accounts/${editFormData.id}/update/`,
        {
          user_id: user_id,
          account_name: editFormData.account_name,
          account_type: editFormData.account_type,
          description: editFormData.description,
        }
      );

      setEditDialogOpen(false);
      await fetchAccounts();

      showToast("bg-blue-500", "Account updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update account:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(
        `${API_BASE}/accounts/${deleteTarget.id}/delete/`
      );
      setDeleteDialogOpen(false);
      // If we deleted the current main account, clear or switch selection
      if (String(selectedAccountId) === String(deleteTarget.id)) {
        const remaining = accounts.filter(
          (a) => String(a.id) !== String(deleteTarget.id)
        );
        const nextId = remaining.length ? remaining[0].id : null;
        setSelectedAccountId(nextId);
        if (typeof window !== "undefined") {
          if (nextId) localStorage.setItem("selectedAccountId", nextId);
          else localStorage.removeItem("selectedAccountId");
        }
      }
      await fetchAccounts();
      showToast("bg-red-500", "Account deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete account:", err);
    }
  };

  const handleSelectMainAccount = (id) => {
    if (!id) return;
    setSelectedAccountId(id);
    if (typeof window !== "undefined")
      localStorage.setItem("selectedAccountId", id);
  };

  // ✅ Prevent crash when no account selected
  const getFilteredTransactions = (accountId) => {
    if (!accountId) return [];
    return transactions.filter(
      (txn) => String(txn.account_id) === String(accountId)
    );
  };


  // Totals (✅ totalAccounts defined here and used below)
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.total_balance || 0),
    0
  );
  const totalAccounts = accounts.length;
  const averageSavingRate =
    accounts.length > 0
      ? accounts.reduce((sum, acc) => sum + Number(acc.savings_rate || 0), 0) /
        accounts.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your savings accounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Left Section - Title + Subtitle */}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Saving Accounts
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your savings goals and track your financial progress
          </p>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={async () => {
              setLoading(true);
              await fetchAccounts();
              await fetchTransactions();
              setLoading(false);
            }}
            className="w-full sm:w-auto flex justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Badge
            variant="secondary"
            className="w-full sm:w-auto flex justify-center px-3 py-1 text-sm"
          >
            <PiggyBank className="w-4 h-4 mr-1" />
            {totalAccounts} Accounts
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
                  Total Savings
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalBalance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Across {totalAccounts} accounts
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Active Accounts
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalAccounts}
                </p>
                <p className="text-sm text-gray-500 mt-1">Savings accounts</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Avg. Savings Rate
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {averageSavingRate.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Annual percentage</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Percent className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================================================ */}

      {/* Savings Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => (
          <Card
            key={account.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {account.account_name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {account.description || "Savings Account"}
                    </p>
                  </div>
                </div>
                {selectedAccountId === account.id && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Star className="w-3 h-3 mr-1" />
                    Main
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{Number(account.total_balance).toLocaleString()}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 flex items-center">
                    <Percent className="w-4 h-4 mr-1" />
                    Savings Rate
                  </p>
                  <p className="font-semibold text-blue-600">
                    {account.savings_rate || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Account Type
                  </p>
                  <p className="font-semibold text-gray-700">
                    {account.account_type}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                {/* Make Main - always first line */}
                {selectedAccountId !== account.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectMainAccount(account.id)}
                    className="w-full sm:w-auto bg-transparent hover:bg-blue-50"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Make Main
                  </Button>
                )}

                {/* Edit + Delete - second line, side by side */}
                <div className="flex flex-row gap-2">
                  {/* Edit */}
                  <Dialog
                    open={editDialogOpen && editFormData?.id === account.id}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditFormData(account);
                          setEditDialogOpen(true);
                        }}
                        className="flex-1 bg-transparent hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Edit className="w-5 h-5 mr-2 text-blue-600" />
                          Edit Savings Account
                        </DialogTitle>
                        <p className="text-gray-600">
                          Update your account details and settings
                        </p>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-account_name">
                            Account Name
                          </Label>
                          <Input
                            id="edit-account_name"
                            name="account_name"
                            value={editFormData?.account_name || ""}
                            onChange={handleEditChange}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-accountType">Account Type</Label>
                          <select
                            id="edit-accountType"
                            name="account_type"
                            value={editFormData?.account_type || ""}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select account type</option>
                            <option value="bank">Bank</option>
                            <option value="wallet">Wallet</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="cash">Cash</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Input
                            id="edit-description"
                            name="description"
                            type="text"
                            value={editFormData?.description || ""}
                            onChange={handleEditChange}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Update Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <Dialog
                    open={deleteDialogOpen && deleteTarget?.id === account.id}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteTarget(account);
                          setDeleteDialogOpen(true);
                        }}
                        className="flex-1 bg-transparent hover:bg-red-50 text-red-600 border-red-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                          Delete Savings Account
                        </DialogTitle>
                        <p className="text-gray-600">
                          Are you sure you want to delete{" "}
                          <span className="font-semibold">
                            {deleteTarget?.account_name}
                          </span>
                          ? This action cannot be undone.
                        </p>
                      </DialogHeader>
                      <DialogFooter className="mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDelete}
                          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* ============================================================================== */}

        {/* Add New Account Card */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add New Account
                </h3>
                <p className="text-gray-600">
                  Create a new savings account to track your goals
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <PiggyBank className="w-5 h-5 mr-2 text-blue-600" />
                Create Savings Account
              </DialogTitle>
              <p className="text-gray-600">
                Add a new savings account to track your financial goals
              </p>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  name="account_name"
                  placeholder="e.g., Emergency Fund, Vacation Savings"
                  value={formData.account_name}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <select
                  id="accountType"
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled hidden>
                    Select account type
                  </option>
                  <option value="bank">Bank</option>
                  <option value="wallet">Wallet</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_balance">Initial Balance</Label>
                <Input
                  id="initialBalance"
                  name="total_balance"
                  type="number"
                  placeholder="0"
                  value={formData.total_balance}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the purpose of this savings account"
                  value={formData.description}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
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
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Accounts;
