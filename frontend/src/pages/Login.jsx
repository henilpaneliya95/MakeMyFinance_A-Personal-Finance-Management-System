import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/api";
import { clearAllPendingFlows, savePendingFlow } from "@/utils/authFlow";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storeSessionAndNavigate = (payload) => {
    const token = payload.access_token || payload.token;
    if (!token || !payload.user) {
      setError("Login response is incomplete.");
      return;
    }

    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", payload.user.id);
    localStorage.setItem("username", payload.user.username);
    localStorage.setItem("email", payload.user.email);
    clearAllPendingFlows();

    navigate("/dashboard");
    window.setTimeout(() => window.location.reload(), 50);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/auth/login/`, form);
      const data = res.data || {};

      if (data.requires_otp) {
        savePendingFlow("login", {
          email: form.email.trim().toLowerCase(),
          purpose: data.purpose || "login",
          createdAt: Date.now(),
        });
        navigate(
          `/verify-otp?purpose=${encodeURIComponent(data.purpose || "login")}&email=${encodeURIComponent(
            form.email.trim().toLowerCase(),
          )}`,
        );
        return;
      }

      storeSessionAndNavigate(data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-4">
            <img src="/MakemyFinancelogo.png" alt="Finance logo" className="h-32 w-[44rem] max-w-full object-contain" />
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <p className="text-gray-600 mt-2">Sign in to continue managing your finances</p>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pr-10 transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:text-blue-700 font-medium"
                type="button"
              >
                Forgot password?
              </button>
              <button onClick={() => navigate("/signup")} className="text-blue-600 hover:text-blue-700 font-medium" type="button">
                Create Account
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <button onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
