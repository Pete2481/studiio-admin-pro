"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Building2, User, Calendar, FileText } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: {
    id: string;
    name: string;
  };
  tenantId: string;
  role: string;
  _count?: {
    bookings: number;
    invoices: number;
  };
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [user, setUser] = useState<User | null>(null);
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
      const response = await fetch("/api/auth/client-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check email");
      }

      if (data.clients.length === 0) {
        setError("No client accounts found with this email address");
      } else if (data.clients.length === 1) {
        // Single client - skip selection and send OTP
        setSelectedClient(data.clients[0]);
        setTenant(data.tenant);
        setUser(data.user);
        await sendOTP(cleanEmail);
      } else {
        // Multiple clients - show selection
        setClients(data.clients);
        setTenant(data.tenant);
        setUser(data.user);
        setShowClientSelection(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = async (client: Client) => {
    setSelectedClient(client);
    setShowClientSelection(false);
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
    if (!selectedClient) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          clientId: selectedClient.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to client admin
      router.push("/client-admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e9f9f0' }}>
            <User className="h-6 w-6" style={{ color: '#065f46' }} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {showOtp ? "Enter verification code" : "Client Login"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {showOtp && selectedClient ? (
              <>
                We sent a 6-digit code to <span className="font-medium">{email}</span><br/>
                Signing in to <span className="font-medium">{selectedClient.name}</span>
              </>
            ) : (
              "Enter your email address to access your client account"
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
                    setSelectedClient(null);
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
            Need admin access?{" "}
            <a href="/login" className="font-medium" style={{ color: '#065f46' }}>
              Admin Login
            </a>
          </p>
        </div>
      </div>

      {/* Client Selection Modal */}
      {showClientSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Client Account
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Choose which client account you'd like to access:
            </p>
            <div className="space-y-3">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg transition-colors hover:border-green-200 hover:bg-green-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Building2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{client.name}</div>
                        {client.company && (
                          <div className="text-sm text-gray-500">{client.company.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {client._count && (
                        <>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {client._count.bookings}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {client._count.invoices}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowClientSelection(false)}
              className="mt-6 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
