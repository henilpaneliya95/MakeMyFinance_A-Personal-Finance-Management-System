// import { useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { TrendingUp, Eye, EyeOff, AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   console.log(localStorage.getItem("userId"));
//   console.log(localStorage.getItem("username"));
//   console.log(localStorage.getItem("email"));
//   console.log(localStorage.getItem("accessToken"));

//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.post(
//         "http://localhost:8000/api/users/login/",
//         form
//       );
//       const token = res.data.token;
//       const decoded = jwtDecode(token);

//       localStorage.setItem("accessToken", token);
//       localStorage.setItem("userId", decoded.user_id);
//       localStorage.setItem("username", decoded.username);
//       localStorage.setItem("email", decoded.email);
//       console.log("Decoded JWT:", decoded);

//       console.log(localStorage.getItem("userId"));
//       console.log(localStorage.getItem("username"));
//       console.log(localStorage.getItem("email"));
//       console.log(localStorage.getItem("accessToken"));

//       // Success animation
//       const successDiv = document.createElement("div");
//       successDiv.className =
//         "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right";
//       successDiv.innerHTML = `
//         <div class="flex items-center space-x-2">
//           <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//           </svg>
//           <span>Welcome back!</span>
//         </div>
//       `;
//       document.body.appendChild(successDiv);

//       setTimeout(() => {
//         document.body.removeChild(successDiv);
//         navigate("/dashboard");
//       }, 1500);
//     } catch (err) {
//       setError("Invalid credentials. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center space-x-2 mb-4">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <TrendingUp className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               this platform
//             </span>
//           </div>
//         </div>

//         <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//           <CardHeader className="text-center pb-2">
//             <CardTitle className="text-2xl font-bold text-gray-900">
//               Welcome Back
//             </CardTitle>
//             <p className="text-gray-600 mt-2">
//               Sign in to continue managing your finances
//             </p>
//           </CardHeader>

//           <CardContent className="space-y-6 p-6">
//             <form onSubmit={handleLogin} className="space-y-4">
//               {/* Username Field */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="username"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="Enter your username"
//                   value={form.username}
//                   onChange={(e) =>
//                     setForm({ ...form, username: e.target.value })
//                   }
//                   className="transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="password"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={form.password}
//                     onChange={(e) =>
//                       setForm({ ...form, password: e.target.value })
//                     }
//                     className="pr-10 transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-4 h-4" />
//                     ) : (
//                       <Eye className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                   <p className="text-red-600 text-sm flex items-center space-x-1">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>{error}</span>
//                   </p>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {loading ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Signing In...</span>
//                   </div>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </form>

//             {/* Signup Link */}
//             <div className="text-center pt-4 border-t border-gray-200">
//               <p className="text-gray-600">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
//                 >
//                   Create Account
//                 </button>
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Back to Home */}
//         <div className="text-center mt-6">
//           <button
//             onClick={() => navigate("/")}
//             className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
//           >
//             ← Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
"use client";

import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/api";

const Login = () => {
  console.log(localStorage.getItem("userId"));
  console.log(localStorage.getItem("username"));
  console.log(localStorage.getItem("email"));
  console.log(localStorage.getItem("accessToken"));

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAndSetDefaultAccount = async (userId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/accounts/?user_id=${userId}`
      );

      if (res.data && res.data.length > 0) {
        const firstAccount = res.data[0];
        const accountId = firstAccount._id || firstAccount.id;
        localStorage.setItem("selectedAccountId", accountId);
        console.log("Default account set:", accountId);
      }
    } catch (err) {
      console.error("Failed to fetch accounts for default selection:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE}/users/login/`,
        form
      );
      const token = res.data.token;
      const decoded = jwtDecode(token);

      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", decoded.user_id);
      localStorage.setItem("username", decoded.username);
      localStorage.setItem("email", decoded.email);
      console.log("Decoded JWT:", decoded);

      await fetchAndSetDefaultAccount(decoded.user_id);

      console.log(localStorage.getItem("userId"));
      console.log(localStorage.getItem("username"));
      console.log(localStorage.getItem("email"));
      console.log(localStorage.getItem("accessToken"));

      // Success animation
      const successDiv = document.createElement("div");
      successDiv.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right";
      successDiv.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span>Welcome back!</span>
        </div>
      `;
      document.body.appendChild(successDiv);

      setTimeout(() => {
        document.body.removeChild(successDiv);
        navigate("/dashboard");

        // reload page after navigation
        setTimeout(() => {
          window.location.reload();
        }, 1);
      }, 10);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-4">
            <img
              src="/MakemyFinancelogo.png"
              alt="Finance logo"
              className="h-32 w-[44rem] max-w-full object-contain"
            />
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to continue managing your finances
            </p>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="pr-10 transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                >
                  Create Account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
