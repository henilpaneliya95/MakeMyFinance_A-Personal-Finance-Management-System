import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { savePendingFlow } from "@/utils/authFlow";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE}/auth/forgot-password/`, { email });
      setMessage(res.data?.message || "If this email exists, an OTP has been sent.");
      savePendingFlow("reset", { email: email.toLowerCase(), purpose: "reset" });
      window.setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email.toLowerCase())}`), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password</CardTitle>
            <p className="text-gray-600 mt-2">Enter your account email to receive a reset OTP.</p>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </p>
                </div>
              )}
              {message && <p className="text-sm text-emerald-700">{message}</p>}

              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={loading}>
                {loading ? "Sending OTP..." : "Send Reset OTP"}
              </Button>
            </form>

            <button onClick={() => navigate("/login")} className="text-sm text-gray-500 hover:text-gray-700 w-full">
              Back to login
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
