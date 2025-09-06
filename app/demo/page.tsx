"use client";

import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import Link from "next/link";
import { Building, Users, Calendar, Images, CreditCard, Settings, Shield } from "lucide-react";

export default function DemoPage() {
  const { data: session, status } = useSession();
  const { currentTenant, availableTenants, switchTenant } = useTenant();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to Studiio
          </h2>
          <p className="text-gray-600">
            Multi-Tenant RBAC System Demo
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Studiio Multi-Tenant RBAC
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name || session.user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tenant Selection */}
        {availableTenants.length > 1 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Switch Tenant
            </h3>
            <div className="flex space-x-2">
              {availableTenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => switchTenant(tenant.slug)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentTenant?.id === tenant.id
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tenant.name} ({tenant.role})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Tenant Info */}
        {currentTenant && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentTenant.name}
                </h2>
                <p className="text-gray-600">
                  Role: <span className="font-medium">{currentTenant.role}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-teal-600" />
                <span className="text-sm text-gray-600">Active Tenant</span>
              </div>
            </div>
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tenant Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-teal-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Tenant Management
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage multiple tenants with complete data isolation and role-based access control.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Multi-tenant architecture
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Role-based permissions
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Tenant switching
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                User Management
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Invite users, assign roles, and manage permissions across multiple tenants.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Email invitations
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Role assignment
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Permission control
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Authentication
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Secure passwordless authentication with email magic links and session management.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Magic link auth
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Secure sessions
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Multi-tenant sessions
              </div>
            </div>
          </div>

          {/* Business Features */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Business Features
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Complete business management with bookings, galleries, invoices, and services.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Booking management
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Gallery system
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Invoice processing
              </div>
            </div>
          </div>

          {/* API & Integration */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-8 w-8 text-orange-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                API & Integration
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              RESTful APIs and integration capabilities for external systems and services.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                RESTful APIs
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Webhook support
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Third-party integrations
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Security
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Enterprise-grade security with data encryption, audit logs, and compliance features.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Data encryption
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Audit logging
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                GDPR compliance
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/tenant-select"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              Access Dashboard
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign In
            </Link>
            <a
              href="https://github.com/your-repo/studiio-admin-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
