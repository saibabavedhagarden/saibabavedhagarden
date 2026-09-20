"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Lock,
  LogOut,
  Download,
  Search,
  Filter,
  RefreshCw,
  HeartHandshake,
  DollarSign,
  Users,
  RotateCcw,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface DonationRecord {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  mobile_number: string;
  amount: number;
  seva_category: string;
  payment_id: string;
  order_id: string;
  status: string;
  refund_amount?: number;
  refunded_at?: string;
}

interface ContactRecord {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface LoyalDonor {
  name: string;
  email: string;
  phone: string;
  count: number;
  totalAmount: number;
  categories: string;
  lastDonated: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loyalDonors, setLoyalDonors] = useState<LoyalDonor[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "donations" | "loyal" | "contacts">("overview");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const checkAuthAndFetchData = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setDonations(data.donations || []);
        setContacts(data.contacts || []);
        setLoyalDonors(data.loyalDonors || []);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Google sign-in failed");
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    const checkSupabaseAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) {
          const res = await fetch("/api/admin/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.user.email }),
          });
          const resData = await res.json();
          if (res.ok) {
            setIsAuthenticated(true);
            await checkAuthAndFetchData();
            return;
          } else {
            setLoginError(resData.error || "Google email not authorized.");
          }
        }
      } catch (err) {
        console.error("Google auth check error:", err);
      }
      await checkAuthAndFetchData();
    };

    checkSupabaseAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setIsAuthenticated(true);
      setPassword("");
      await checkAuthAndFetchData();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Supabase signOut error:", e);
    }
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  const handleToggleRefund = async (
    id: number | string,
    currentStatus: string,
    amount: number,
    paymentId?: string
  ) => {
    const isCurrentlyRefunded = currentStatus === "refunded";
    const newStatus = isCurrentlyRefunded ? "success" : "refunded";
    const refundAmt = isCurrentlyRefunded ? 0 : amount;

    const confirmMsg = isCurrentlyRefunded
      ? "Revert this donation to SUCCESS status?"
      : `Mark this donation of ₹${amount} as REFUNDED?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          payment_id: paymentId,
          status: newStatus,
          refund_amount: refundAmt,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        await checkAuthAndFetchData();
      } else {
        alert(
          `Failed to update donation status: ${data.error || res.statusText || "Unknown error"}`
        );
      }
    } catch (err) {
      alert("Error updating donation status: Network error.");
    }
  };

  // List of available years & categories for dropdowns
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    donations.forEach((d) => {
      if (d.created_at) {
        years.add(new Date(d.created_at).getFullYear().toString());
      }
    });
    return Array.from(years).sort().reverse();
  }, [donations]);

  const sevaCategoryList = [
    "General Donation",
    "Annadhanaman",
    "Festival Support",
    "Pooja Services",
    "Temple Development",
    "Goshala Maintenance and Development",
  ];

  // Filtered Donations logic
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const matchesSearch =
        !searchTerm ||
        (d.full_name && d.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.mobile_number && d.mobile_number.includes(searchTerm)) ||
        (d.payment_id && d.payment_id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        (d.seva_category && d.seva_category.toLowerCase().includes(selectedCategory.toLowerCase()));

      const matchesStatus =
        selectedStatus === "all" || d.status === selectedStatus;

      const dateObj = d.created_at ? new Date(d.created_at) : null;
      const matchesYear =
        selectedYear === "all" || (dateObj && dateObj.getFullYear().toString() === selectedYear);

      const monthStr = dateObj ? (dateObj.getMonth() + 1).toString().padStart(2, "0") : "";
      const matchesMonth =
        selectedMonth === "all" || monthStr === selectedMonth;

      return matchesSearch && matchesCategory && matchesStatus && matchesYear && matchesMonth;
    });
  }, [donations, searchTerm, selectedCategory, selectedStatus, selectedYear, selectedMonth]);

  // Overall Financial Metrics
  const metrics = useMemo(() => {
    let gross = 0;
    let refunds = 0;
    let successfulCount = 0;
    let refundedCount = 0;

    filteredDonations.forEach((d) => {
      const amt = Number(d.amount) || 0;
      const refAmt = Number(d.refund_amount) || (d.status === "refunded" ? amt : 0);

      gross += amt;

      if (d.status === "refunded") {
        refunds += refAmt;
        refundedCount++;
      } else {
        successfulCount++;
      }
    });

    const net = Math.max(0, gross - refunds);

    return {
      gross,
      refunds,
      net,
      successfulCount,
      refundedCount,
    };
  }, [filteredDonations]);

  // Category Breakdown Calculations
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { count: number; gross: number; refunds: number; net: number }> = {};

    filteredDonations.forEach((d) => {
      const cat = d.seva_category || "General Donation";
      const amt = Number(d.amount) || 0;
      const refAmt = Number(d.refund_amount) || (d.status === "refunded" ? amt : 0);

      if (!map[cat]) {
        map[cat] = { count: 0, gross: 0, refunds: 0, net: 0 };
      }

      map[cat].gross += amt;

      if (d.status === "refunded") {
        map[cat].refunds += refAmt;
      } else {
        map[cat].count += 1;
      }
      map[cat].net = Math.max(0, map[cat].gross - map[cat].refunds);
    });

    return Object.entries(map).map(([category, stats]) => ({
      category,
      ...stats,
    }));
  }, [filteredDonations]);

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredDonations.length === 0) {
      alert("No donation records match the selected filters.");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Full Name",
      "Email",
      "Mobile Number",
      "Seva Category",
      "Amount (₹)",
      "Status",
      "Refund Amount (₹)",
      "Payment ID",
      "Order ID",
    ];

    const rows = filteredDonations.map((d) => [
      d.id,
      d.created_at ? new Date(d.created_at).toLocaleString() : "",
      `"${(d.full_name || "").replace(/"/g, '""')}"`,
      `"${(d.email || "").replace(/"/g, '""')}"`,
      `"${(d.mobile_number || "").replace(/"/g, '""')}"`,
      `"${(d.seva_category || "").replace(/"/g, '""')}"`,
      d.amount,
      d.status || "success",
      d.refund_amount || 0,
      `"${(d.payment_id || "").replace(/"/g, '""')}"`,
      `"${(d.order_id || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Saibaba_Donations_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white shadow-xl border border-amber-200/60 rounded-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-3">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Portal Login</h1>
            <p className="text-sm text-gray-600 mt-1">Sri Shirdi Saibaba Religious Trust</p>
          </div>

          <div className="space-y-5">
            {loginError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-base border-2 border-gray-200 shadow-sm flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs font-bold text-gray-400 uppercase">Or use Passcode</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Security Passcode
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none text-gray-800"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-base shadow-md"
              >
                {isLoggingIn ? "Authenticating..." : "Unlock Dashboard"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ॐ
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Trust Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">Sri Shirdi Saibaba Religious Trust</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={checkAuthAndFetchData}
              disabled={isLoadingData}
              className="flex items-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 flex gap-2 border-t border-gray-100 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-amber-600 text-amber-600 bg-amber-50/60 rounded-t-lg"
                : "border-transparent text-gray-600 hover:text-amber-600"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview & Analytics
          </button>

          <button
            onClick={() => setActiveTab("donations")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "donations"
                ? "border-amber-600 text-amber-600 bg-amber-50/60 rounded-t-lg"
                : "border-transparent text-gray-600 hover:text-amber-600"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            Donations ({filteredDonations.length})
          </button>

          <button
            onClick={() => setActiveTab("loyal")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "loyal"
                ? "border-amber-600 text-amber-600 bg-amber-50/60 rounded-t-lg"
                : "border-transparent text-gray-600 hover:text-amber-600"
            }`}
          >
            <Users className="w-4 h-4" />
            Loyal Donors ({loyalDonors.length})
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "contacts"
                ? "border-amber-600 text-amber-600 bg-amber-50/60 rounded-t-lg"
                : "border-transparent text-gray-600 hover:text-amber-600"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Contact Messages ({contacts.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        {/* Global Filter Bar */}
        <Card className="p-4 mb-6 bg-white shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
              <Filter className="w-4 h-4 text-amber-600" />
              Filter Records:
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donor name, email, phone, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Seva Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Seva Categories</option>
                {sevaCategoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="success">Successful</option>
                <option value="refunded">Refunded</option>
              </select>

              {/* Year Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>

              {/* Month Dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Months</option>
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Aug</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
              </select>

              {/* Export Button */}
              <Button
                onClick={exportToCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 py-2 text-sm rounded-lg shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card className="p-5 bg-white border border-amber-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Net Collection
                  </span>
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-amber-600">
                  ₹{metrics.net.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Collected: ₹{metrics.gross.toLocaleString()} - Refunds: ₹{metrics.refunds.toLocaleString()}
                </p>
              </Card>

              <Card className="p-5 bg-white border border-emerald-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total Donation Count
                  </span>
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-emerald-700">
                  {metrics.successfulCount}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Completed payment transactions
                </p>
              </Card>

              <Card className="p-5 bg-white border border-red-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total Refunds
                  </span>
                  <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-red-600">
                  ₹{metrics.refunds.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.refundedCount} refunded transaction(s)
                </p>
              </Card>
            </div>

            {/* Seva Category Breakdown */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-600" />
                Collection by Seva Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryBreakdown.map((item) => (
                  <Card
                    key={item.category}
                    className="p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-gray-800 truncate">
                        {item.category}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {item.count} donation{item.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-amber-600 mb-1">
                      ₹{item.net.toLocaleString()}
                      <span className="text-xs font-normal text-gray-500 ml-1.5">(Net)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-2.5 mt-2">
                      <span className="text-emerald-700 font-semibold">
                        Collected: ₹{item.gross.toLocaleString()}
                      </span>
                      {item.refunds > 0 ? (
                        <span className="text-red-600 font-semibold">
                          Refunded: ₹{item.refunds.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Refunded: ₹0
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL DONATIONS TABLE & FILTERS */}
        {activeTab === "donations" && (
          <Card className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 text-lg">
                Donation Transactions ({filteredDonations.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Donor Name</th>
                    <th className="p-3.5">Seva Category</th>
                    <th className="p-3.5">Amount (₹)</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Payment ID</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        No donation records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-3.5 whitespace-nowrap text-gray-600">
                          {d.created_at ? new Date(d.created_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="p-3.5 font-bold text-gray-800 whitespace-nowrap">
                          {d.full_name || "Anonymous"}
                        </td>
                        <td className="p-3.5 font-semibold text-amber-700 whitespace-nowrap">
                          {d.seva_category || "General"}
                        </td>
                        <td className="p-3.5 font-bold text-gray-900 whitespace-nowrap text-base">
                          ₹{(Number(d.amount) || 0).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-xs text-gray-600 leading-tight whitespace-nowrap">
                          <div>{d.email}</div>
                          <div>{d.mobile_number}</div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          {d.status === "refunded" ? (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-100 text-red-700">
                              REFUNDED (₹{d.refund_amount || d.amount})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800">
                              SUCCESSFUL
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-xs font-mono text-gray-500 whitespace-nowrap">
                          {d.payment_id || "-"}
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <Button
                            size="sm"
                            variant={d.status === "refunded" ? "outline" : "default"}
                            onClick={() => handleToggleRefund(d.id, d.status, d.amount, d.payment_id)}
                            className="text-xs py-1 px-2.5 bg-red-600 hover:bg-red-700 text-white"
                          >
                            {d.status === "refunded" ? "Mark Success" : "Mark Refund"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 3: LOYAL / REPEAT DONORS */}
        {activeTab === "loyal" && (
          <Card className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-amber-50 border-b border-amber-200">
              <h2 className="font-bold text-amber-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Loyal & Repeat Donors ({loyalDonors.length})
              </h2>
              <p className="text-xs text-amber-700 mt-1">
                Donors who have contributed multiple times or contributed ₹5,000+ total.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Donor Name</th>
                    <th className="p-3.5">Total Contributed (₹)</th>
                    <th className="p-3.5">Donation Count</th>
                    <th className="p-3.5">Preferred Seva Categories</th>
                    <th className="p-3.5">Email / Mobile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loyalDonors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No repeat or loyal donors recorded yet.
                      </td>
                    </tr>
                  ) : (
                    loyalDonors.map((donor, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-3.5 font-bold text-gray-800 whitespace-nowrap">
                          {donor.name}
                        </td>
                        <td className="p-3.5 font-bold text-amber-600 text-base whitespace-nowrap">
                          ₹{donor.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-3.5 font-semibold text-purple-700 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-purple-100 rounded-full text-xs font-bold">
                            {donor.count} Donations
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-gray-700 font-medium">
                          {donor.categories}
                        </td>
                        <td className="p-3.5 text-xs text-gray-600 leading-tight whitespace-nowrap">
                          <div>{donor.email}</div>
                          <div>{donor.phone}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 4: CONTACT FORM MESSAGES */}
        {activeTab === "contacts" && (
          <Card className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 text-lg">
                Contact Messages (&quot;Send Us a Message&quot;) ({contacts.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Sender Name</th>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5">Message Content</th>
                    <th className="p-3.5">Contact Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No contact submissions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-3.5 whitespace-nowrap text-gray-500 text-xs">
                          {c.created_at ? new Date(c.created_at).toLocaleString() : "-"}
                        </td>
                        <td className="p-3.5 font-bold text-gray-800 whitespace-nowrap">
                          {c.full_name}
                        </td>
                        <td className="p-3.5 font-semibold text-amber-700 whitespace-nowrap">
                          {c.subject || "General Inquiry"}
                        </td>
                        <td className="p-3.5 text-xs text-gray-700 max-w-md leading-relaxed">
                          {c.message}
                        </td>
                        <td className="p-3.5 text-xs text-gray-600 leading-tight whitespace-nowrap">
                          <div>{c.email}</div>
                          <div>{c.phone}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
