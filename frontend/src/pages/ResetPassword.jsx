import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { API_BASE } from "@/lib/api";
import {
  clearPendingFlow,
  createResendDeadline,
  getPendingFlow,
  getRemainingSeconds,
} from "@/utils/authFlow";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [email, setEmail] = useState(params.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deadline, setDeadline] = useState(createResendDeadline(60));
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!email) {
      const pending = getPendingFlow("reset");
      if (pending?.email) {
        setEmail(pending.email);
      }
    }
  }, [email]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(getRemainingSeconds(deadline));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/reset-password/`, {
        email,
        otp,
        new_password: newPassword,
      });
      setMessage(res.data?.message || "Password reset successful.");
      clearPendingFlow("reset");
      window.setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (secondsLeft > 0 || !email) return;
    setResending(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/auth/resend-otp/`, {
        email,
        purpose: "reset",
      });
      setMessage(res.data?.message || "OTP sent successfully.");
      setDeadline(createResendDeadline(60));
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
            <p className="text-gray-600 mt-2">Enter the reset OTP and your new password.</p>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter OTP"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
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
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <button
                type="button"
                disabled={secondsLeft > 0 || resending}
                onClick={resend}
                className="text-emerald-700 disabled:text-gray-400 font-medium"
              >
                {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : resending ? "Sending..." : "Resend OTP"}
              </button>
              <div>
                <button onClick={() => navigate("/login")} className="text-sm text-gray-500 hover:text-gray-700">
                  Back to login
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
