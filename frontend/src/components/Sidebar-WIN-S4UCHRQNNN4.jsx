// "use client";

// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { isLoggedIn, logout } from "@/utils/auth";
// import {
//   LayoutDashboard,
//   CreditCard,
//   Wallet,
//   Briefcase,
//   PiggyBank,
//   TrendingDown,
//   Target,
//   BarChart,
//   BrainCircuit,
//   Cpu,
//   Star,
//   LogOut,
//   User,
//   HelpCircle,
//   TrendingUp,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { cn } from "@/lib/utils";

// const navItems = [
//   { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
//   { name: "Transactions", icon: CreditCard, path: "/transactions" },
//   { name: "Budgets", icon: Wallet, path: "/budgets" },
//   { name: "Portfolio", icon: Briefcase, path: "/portfolio" },
//   { name: "Accounts", icon: PiggyBank, path: "/Accounts" },
//   { name: "Debt Tracker", icon: TrendingDown, path: "/debt" },
//   { name: "Goals", icon: Target, path: "/goals" },
//   { name: "Analytics", icon: BarChart, path: "/analytics" },
//   { name: "AI Insights", icon: BrainCircuit, path: "/ai-insights" },
//   { name: "Simulator", icon: Cpu, path: "/simulator" },
//   { name: "Reviews", icon: Star, path: "/reviews" },
//   { name: "Need Help?", icon: HelpCircle, path: "/help" },
// ];

// export function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <>
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={cn(
//           "fixed lg:static inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl lg:shadow-lg transform transition-all duration-300 ease-out",
//           sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//           isCollapsed ? "w-20" : "w-80"
//         )}
//       >
//         <div className="flex flex-col h-full">
//           <div className="px-6 py-5 border-b border-slate-100/80">
//             <div className="flex items-center justify-between">
//               <div
//                 className={cn(
//                   "flex items-center transition-all duration-300",
//                   isCollapsed ? "justify-center w-full" : "gap-3"
//                 )}
//               >
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 </div>
//                 {!isCollapsed && (
//                   <div className="flex flex-col">
//                     <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
//                       this platform
//                     </span>
//                     <span className="text-xs font-medium text-slate-500 -mt-0.5">
//                       Smarter Money Decisions
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {!isCollapsed && (
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
//                     onClick={() => setIsCollapsed(!isCollapsed)}
//                   >
//                     <ChevronLeft className="w-4 h-4 text-slate-600" />
//                   </Button>

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setSidebarOpen(false)}
//                     className="lg:hidden h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
//                   >
//                     <X className="w-4 h-4 text-slate-600" />
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {isCollapsed && (
//               <div className="flex justify-center mt-3">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
//                   onClick={() => setIsCollapsed(!isCollapsed)}
//                 >
//                   <ChevronRight className="w-4 h-4 text-slate-600" />
//                 </Button>
//               </div>
//             )}
//           </div>

//           <ScrollArea className="flex-1 px-3 py-4">
//             <nav className="space-y-1">
//               {navItems.map(({ name, icon: Icon, path }) => {
//                 const isActive = currentPath === path;
//                 return (
//                   <Link
//                     to={path}
//                     key={name}
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     <Button
//                       variant="ghost"
//                       className={cn(
//                         "w-full justify-start h-11 px-3 rounded-xl font-medium transition-all duration-200 group relative overflow-hidden",
//                         isActive
//                           ? "bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-100/50"
//                           : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm"
//                       )}
//                     >
//                       <Icon
//                         className={cn(
//                           "w-5 h-5 transition-colors flex-shrink-0",
//                           isCollapsed ? "mr-0" : "mr-3",
//                           isActive
//                             ? "text-blue-600"
//                             : "text-slate-500 group-hover:text-slate-700"
//                         )}
//                       />
//                       {!isCollapsed && (
//                         <span className="truncate text-sm">{name}</span>
//                       )}
//                       {isActive && (
//                         <div className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
//                       )}
//                     </Button>
//                   </Link>
//                 );
//               })}
//             </nav>
//           </ScrollArea>

//           <div className="p-4 border-t border-slate-100/80">
//             <div
//               className={cn(
//                 "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 shadow-sm",
//                 isCollapsed && "justify-center"
//               )}
//             >
//               <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
//                 <User className="w-5 h-5 text-white" />
//               </div>
//               {!isCollapsed && (
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-slate-900 truncate">
//                     {localStorage.getItem("username") || "User"}
//                   </p>
//                   <div className="flex items-center gap-1 mt-0.5">
//                     <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                     <p className="text-xs font-medium text-emerald-600">
//                       Premium Member
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="mt-1">
//               {isLoggedIn() ? (
//                 <Button
//                   onClick={logout}
//                   variant="outline"
//                   className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 bg-transparent"
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   <span>Logout</span>
//                 </Button>
//               ) : (
//                 <Link to="/login">
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200 bg-transparent"
//                   >
//                     <User className="w-4 h-4 mr-2" />
//                     <span>Login</span>
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { isLoggedIn, logout } from "@/utils/auth";
// import {
//   LayoutDashboard,
//   CreditCard,
//   Wallet,
//   Briefcase,
//   PiggyBank,
//   TrendingDown,
//   Target,
//   BarChart,
//   BrainCircuit,
//   Cpu,
//   Star,
//   LogOut,
//   User,
//   HelpCircle,
//   TrendingUp,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { cn } from "@/lib/utils";

// const navItems = [
//   { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
//   { name: "Transactions", icon: CreditCard, path: "/transactions" },
//   { name: "Budgets", icon: Wallet, path: "/budgets" },
//   { name: "Portfolio", icon: Briefcase, path: "/portfolio" },
//   { name: "Accounts", icon: PiggyBank, path: "/Accounts" },
//   { name: "Debt Tracker", icon: TrendingDown, path: "/debt" },
//   { name: "Goals", icon: Target, path: "/goals" },
//   { name: "Analytics", icon: BarChart, path: "/analytics" },
//   { name: "AI Insights", icon: BrainCircuit, path: "/ai-insights" },
//   { name: "Simulator", icon: Cpu, path: "/simulator" },
//   { name: "Reviews", icon: Star, path: "/reviews" },
//   { name: "Need Help?", icon: HelpCircle, path: "/help" },
// ];

// export function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <>
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={cn(
//           "fixed lg:static inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl lg:shadow-lg transform transition-all duration-300 ease-out",
//           sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//           isCollapsed ? "w-20" : "w-80"
//         )}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="px-6 py-5 border-b border-slate-100/80">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center w-full">
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 </div>
//                 <div
//                   className={cn(
//                     "flex flex-col overflow-hidden transition-all duration-300",
//                     isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto ml-3"
//                   )}
//                 >
//                   <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
//                     this platform
//                   </span>
//                   <span className="text-xs font-medium text-slate-500 -mt-0.5 whitespace-nowrap">
//                     Smarter Money Decisions
//                   </span>
//                 </div>
//               </div>

//               {/* Collapse + Close buttons */}
//               {!isCollapsed && (
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
//                     onClick={() => setIsCollapsed(!isCollapsed)}
//                   >
//                     <ChevronLeft className="w-4 h-4 text-slate-600" />
//                   </Button>

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setSidebarOpen(false)}
//                     className="lg:hidden h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
//                   >
//                     <X className="w-4 h-4 text-slate-600" />
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* Expand button (when collapsed) */}
//             {isCollapsed && (
//               <div className="flex justify-center mt-3">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
//                   onClick={() => setIsCollapsed(!isCollapsed)}
//                 >
//                   <ChevronRight className="w-4 h-4 text-slate-600" />
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Navigation */}
//           <ScrollArea className="flex-1 px-3 py-4">
//             <nav className="space-y-1">
//               {navItems.map(({ name, icon: Icon, path }) => {
//                 const isActive = currentPath === path;
//                 return (
//                   <Link
//                     to={path}
//                     key={name}
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     <Button
//                       variant="ghost"
//                       className={cn(
//                         "w-full justify-start h-11 px-3 rounded-xl font-medium transition-all duration-200 group relative overflow-hidden",
//                         isActive
//                           ? "bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-100/50"
//                           : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm"
//                       )}
//                     >
//                       <Icon
//                         className={cn(
//                           "w-5 h-5 transition-colors flex-shrink-0",
//                           isCollapsed ? "mr-0" : "mr-3",
//                           isActive
//                             ? "text-blue-600"
//                             : "text-slate-500 group-hover:text-slate-700"
//                         )}
//                       />
//                       <span
//                         className={cn(
//                           "truncate text-sm transition-all duration-300",
//                           isCollapsed
//                             ? "opacity-0 w-0"
//                             : "opacity-100 w-auto"
//                         )}
//                       >
//                         {name}
//                       </span>
//                       {isActive && (
//                         <div className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
//                       )}
//                     </Button>
//                   </Link>
//                 );
//               })}
//             </nav>
//           </ScrollArea>

//           {/* Profile */}
//           <div className="p-4 border-t border-slate-100/80">
//             <div
//               className={cn(
//                 "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 shadow-sm",
//                 isCollapsed && "justify-center"
//               )}
//             >
//               <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
//                 <User className="w-5 h-5 text-white" />
//               </div>
//               <div
//                 className={cn(
//                   "flex-1 min-w-0 overflow-hidden transition-all duration-300",
//                   isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
//                 )}
//               >
//                 <p className="text-sm font-semibold text-slate-900 truncate">
//                   {localStorage.getItem("username") || "User"}
//                 </p>
//                 <div className="flex items-center gap-1 mt-0.5">
//                   <h6 className="text-xs font-medium text-black/80 text-black opacity-50">
//                     {localStorage.getItem("email") || "email"}
//                   </h6>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-3">
//               {isLoggedIn() ? (
//                 <Button
//                   onClick={logout}
//                   variant="outline"
//                   className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 bg-transparent"
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   <span>Logout</span>
//                 </Button>
//               ) : (
//                 <Link to="/login">
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200 bg-transparent"
//                   >
//                     <User className="w-4 h-4 mr-2" />
//                     <span>Login</span>
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isLoggedIn, logout } from "@/utils/auth";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Briefcase,
  PiggyBank,
  TrendingDown,
  Target,
  BarChart,
  BrainCircuit,
  Cpu,
  Star,
  LogOut,
  User,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Transactions", icon: CreditCard, path: "/transactions" },
  { name: "Budgets", icon: Wallet, path: "/budgets" },
  { name: "Portfolio", icon: Briefcase, path: "/portfolio" },
  { name: "Accounts", icon: PiggyBank, path: "/Accounts" },
  { name: "Debt Tracker", icon: TrendingDown, path: "/debt" },
  { name: "Goals", icon: Target, path: "/goals" },
  { name: "Analytics", icon: BarChart, path: "/analytics" },
  { name: "AI Insights", icon: BrainCircuit, path: "/ai-insights" },
  { name: "Simulator", icon: Cpu, path: "/simulator" },
  { name: "Reviews", icon: Star, path: "/reviews" },
  { name: "Need Help?", icon: HelpCircle, path: "/help" },
];

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl lg:shadow-lg transform transition-all duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-80"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center w-full">
                <img
                  src="/MakemyFinancelogo.png"
                  alt="Finance logo"
                  className={cn(
                    "rounded-xl object-contain flex-shrink-0",
                    isCollapsed ? "w-16 h-16" : "w-72 h-24"
                  )}
                />
              </div>

              {/* Collapse + Close buttons */}
              {!isCollapsed && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </Button>
                </div>
              )}
            </div>

            {/* Expand button (when collapsed) */}
            {isCollapsed && (
              <div className="flex justify-center mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map(({ name, icon: Icon, path }) => {
                const isActive = currentPath === path;
                return (
                  <Link
                    to={path}
                    key={name}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-11 px-3 rounded-xl font-medium transition-all duration-200 group relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-100/50"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-colors flex-shrink-0",
                          isCollapsed ? "mr-0" : "mr-3",
                          isActive
                            ? "text-blue-600"
                            : "text-slate-500 group-hover:text-slate-700"
                        )}
                      />
                      <span
                        className={cn(
                          "truncate text-sm transition-all duration-300",
                          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        )}
                      >
                        {name}
                      </span>
                      {isActive && (
                        <div className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Profile */}
          <div className="p-4 border-t border-slate-100/80">
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 shadow-sm",
                isCollapsed && "justify-center"
              )}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div
                className={cn(
                  "flex-1 min-w-0 overflow-hidden transition-all duration-300",
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                )}
              >
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {localStorage.getItem("username") || "User"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <h6 className="text-xs font-medium text-black/80 text-black opacity-50">
                    {localStorage.getItem("email") || "email"}
                  </h6>
                </div>
              </div>
            </div>

            {/* Login / Logout */}
            <div className="mt-3">
              {isLoggedIn() ? (
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 bg-transparent"
                >
                  <LogOut
                    className={cn("w-4 h-4", isCollapsed ? "mr-0" : "mr-2")}
                  />
                  {!isCollapsed && <span>Logout</span>}
                </Button>
              ) : (
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200 bg-transparent"
                  >
                    <User
                      className={cn("w-4 h-4", isCollapsed ? "mr-0" : "mr-2")}
                    />
                    {!isCollapsed && <span>Login</span>}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
