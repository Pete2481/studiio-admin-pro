"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Building2 } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showTenantSelection, setShowTenantSelection] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Clean the email input
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter an email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check email");
      }

      if (data.tenants.length === 0) {
        setError("No accounts found with this email address");
      } else if (data.tenants.length === 1) {
        // Single tenant - skip selection and send OTP
        setSelectedTenant(data.tenants[0]);
        await sendOTP(cleanEmail);
      } else {
        // Multiple tenants - show selection
        setTenants(data.tenants);
        setShowTenantSelection(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleTenantSelect = async (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowTenantSelection(false);
    await sendOTP(email);
  };

  const sendOTP = async (email: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpSent(true);
      setShowOtp(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          tenantId: selectedTenant.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to appropriate dashboard
      if (selectedTenant.role === "ADMIN") {
        router.push(`/t/${selectedTenant.slug}/admin`);
      } else if (selectedTenant.role === "CLIENT") {
        router.push(`/client-admin`);
      } else {
        router.push(`/t/${selectedTenant.slug}/admin`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "👑";
      case "CLIENT":
        return "👤";
      case "AGENT":
        return "🏢";
      default:
        return "👤";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "CLIENT":
        return "Client";
      case "AGENT":
        return "Agent";
      default:
        return "User";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e9f9f0' }}>
            <Building2 className="h-6 w-6" style={{ color: '#065f46' }} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {showOtp ? "Enter verification code" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {showOtp && selectedTenant ? (
              <>
                We sent a 6-digit code to <span className="font-medium">{email}</span><br/>
                Signing in to <span className="font-medium">{selectedTenant.name}</span> as{" "}
                <span className="font-medium">{getRoleLabel(selectedTenant.role)}</span>
              </>
            ) : (
              "Enter your email address to continue"
            )}
          </p>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {!showOtp ? (
            // Email Form
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-300"
                    style={{ '--tw-ring-color': '#e9f9f0' } as React.CSSProperties}
                    placeholder="Enter your email"
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => setEmail("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#e9f9f0',
                  color: '#065f46',
                  '--tw-ring-color': '#e9f9f0'
                } as React.CSSProperties}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            // OTP Form
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Verification code
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-300 text-center text-lg tracking-widest"
                    style={{ '--tw-ring-color': '#e9f9f0' } as React.CSSProperties}
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={() => sendOTP(email)}
                    className="font-medium"
                    style={{ color: '#065f46' }}
                  >
                    Resend
                  </button>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtp(false);
                    setSelectedTenant(null);
                    setOtp("");
                    setOtpSent(false);
                    setError("");
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ '--tw-ring-color': '#e9f9f0' } as React.CSSProperties}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: '#e9f9f0',
                    color: '#065f46',
                    '--tw-ring-color': '#e9f9f0'
                  } as React.CSSProperties}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="font-medium" style={{ color: '#065f46' }}>
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Tenant Selection Modal */}
      {showTenantSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select an account
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Choose which account you'd like to sign in to:
            </p>
            <div className="space-y-3">
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => handleTenantSelect(tenant)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg transition-colors"
                  style={{ 
                    '--hover-border-color': '#e9f9f0',
                    '--hover-bg-color': '#e9f9f0'
                  } as React.CSSProperties}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getRoleIcon(tenant.role)}</span>
                    <div>
                      <div className="font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{getRoleLabel(tenant.role)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTenantSelection(false)}
              className="mt-6 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              style={{ '--tw-ring-color': '#e9f9f0' } as React.CSSProperties}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}