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
  clearAllPendingFlows,
  clearPendingFlow,
  createResendDeadline,
  getPendingFlow,
  getRemainingSeconds,
  savePendingFlow,
} from "@/utils/authFlow";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const purposeFromQuery = params.get("purpose");
  const emailFromQuery = params.get("email");

  const [purpose, setPurpose] = useState(purposeFromQuery || "registration");
  const [email, setEmail] = useState(emailFromQuery || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendDeadline, setResendDeadline] = useState(() => createResendDeadline(60));
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (emailFromQuery && purposeFromQuery) {
      return;
    }

    const pendingRegistration = getPendingFlow("registration");
    const pendingLogin = getPendingFlow("login");

    if (pendingLogin?.email && pendingLogin?.purpose === "login") {
      setEmail(pendingLogin.email);
      setPurpose("login");
      return;
    }

    if (pendingRegistration?.email) {
      setEmail(pendingRegistration.email);
      setPurpose("registration");
      if (pendingRegistration.otpPreview) {
        setSuccess(`Temporary OTP: ${pendingRegistration.otpPreview}`);
      }
      return;
    }

    navigate("/login");
  }, [emailFromQuery, navigate, purposeFromQuery]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(getRemainingSeconds(resendDeadline));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendDeadline]);

  const storeSessionAndNavigate = (payload) => {
    localStorage.setItem("accessToken", payload.access_token || payload.token);
    localStorage.setItem("userId", payload.user.id);
    localStorage.setItem("username", payload.user.username);
    localStorage.setItem("email", payload.user.email);
    clearAllPendingFlows();
    navigate("/dashboard");
    window.setTimeout(() => window.location.reload(), 50);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (purpose === "login") {
        const res = await axios.post(`${API_BASE}/auth/verify-login-otp/`, {
          email,
          otp,
        });
        storeSessionAndNavigate(res.data);
        return;
      }

      await axios.post(`${API_BASE}/auth/verify-otp/`, {
        email,
        otp,
        purpose,
      });

      clearAllPendingFlows();
      setSuccess("Email verified. Please login.");
      window.setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (secondsLeft > 0) return;
    setResending(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_BASE}/auth/resend-otp/`, { email, purpose });
      setSuccess("A new OTP has been sent.");
      const nextDeadline = createResendDeadline(60);
      setResendDeadline(nextDeadline);

      if (purpose === "login") {
        const pending = getPendingFlow("login") || {};
        savePendingFlow("login", { ...pending, email, purpose, resendDeadline: nextDeadline });
      }
      if (purpose === "registration") {
        const pending = getPendingFlow("registration") || {};
        savePendingFlow("registration", {
          ...pending,
          email,
          purpose,
          resendDeadline: nextDeadline,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-sky-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Verify OTP</CardTitle>
            <p className="text-gray-600 mt-2">We sent a code to {email}</p>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 4-6 digit code"
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

              {success && <p className="text-sm text-emerald-700">{success}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-cyan-700 hover:bg-cyan-800 text-white">
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <button
                type="button"
                disabled={secondsLeft > 0 || resending}
                onClick={onResend}
                className="text-cyan-700 disabled:text-gray-400 font-medium"
              >
                {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : resending ? "Sending..." : "Resend OTP"}
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
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

export default OtpVerification;
