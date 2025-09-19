"use client";

import { useEffect, useMemo, useState } from "react";
import { useClientAdmin } from "@/components/ClientAdminProvider";
import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import type { AddressComponents } from "@/lib/types";

type Tab = "profile" | "password" | "notifications" | "preferences";

export default function ClientSettingsPage() {
  const { currentClient } = useClientAdmin();
  const [tab, setTab] = useState<Tab>("profile");
  const [userInfo, setUserInfo] = useState<any>(null);

  // Fetch current user info
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        // Get user info from cookies or API
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      <Topbar 
        title="Settings"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4">
            <div className="flex gap-2">
              {(
                [
                  { id: "profile", label: "Profile" },
                  { id: "password", label: "Password" },
                  { id: "notifications", label: "Notifications" },
                  { id: "preferences", label: "Preferences" },
                ] as { id: Tab; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-2 text-sm border-b-2 -mb-px ${
                    tab === t.id ? "border-teal-600 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {tab === "profile" && <ClientProfileSection userInfo={userInfo} currentClient={currentClient} />}
            {tab === "password" && <ClientPasswordSection />}
            {tab === "notifications" && <ClientNotificationsSection />}
            {tab === "preferences" && <ClientPreferencesSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

function getAllTimeZones(): string[] {
  try {
    if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
      const values = Intl.supportedValuesOf("timeZone");
      if (Array.isArray(values) && values.length > 0) return values as string[];
    }
  } catch {}
  return [
    "Pacific/Honolulu","America/Anchorage","America/Los_Angeles","America/Denver","America/Chicago","America/New_York",
    "America/Sao_Paulo","Atlantic/Azores","Europe/London","Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/Rome",
    "Europe/Athens","Africa/Cairo","Africa/Johannesburg","Asia/Jerusalem","Asia/Dubai","Asia/Karachi","Asia/Kolkata",
    "Asia/Bangkok","Asia/Singapore","Asia/Hong_Kong","Asia/Tokyo","Asia/Seoul","Australia/Perth","Australia/Adelaide",
    "Australia/Sydney","Pacific/Auckland","Pacific/Fiji"
  ];
}

function ClientProfileSection({ userInfo, currentClient }: { userInfo: any, currentClient: any }) {
  const [timezone, setTimezone] = useState<string>("Australia/Sydney");
  const [address, setAddress] = useState<string>("");
  const [addressComponents, setAddressComponents] = useState<AddressComponents|undefined>(undefined);
  const [profileData, setProfileData] = useState({
    name: userInfo?.name || currentClient?.name || "",
    email: userInfo?.email || "",
    phone: currentClient?.phone || "",
    company: currentClient?.company || "",
    position: "",
    website: ""
  });

  useEffect(() => {
    try {
      const tz = localStorage.getItem("client.settings.timezone");
      if (tz) setTimezone(tz);
      const addr = localStorage.getItem("client.settings.address");
      if (addr) setAddress(addr);
      const comp = localStorage.getItem("client.settings.address.components");
      if (comp) setAddressComponents(JSON.parse(comp));
    } catch {}
  }, []);

  const zones = useMemo(() => getAllTimeZones(), []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  function saveProfile() {
    try {
      localStorage.setItem("client.settings.timezone", timezone);
      localStorage.setItem("client.settings.address", address);
      if (addressComponents) localStorage.setItem("client.settings.address.components", JSON.stringify(addressComponents));
      // TODO: Save profile data to API
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="text-sm">
        <div className="mb-1">Full Name</div>
        <input 
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
          value={profileData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </label>
      <label className="text-sm">
        <div className="mb-1">Email Address</div>
        <input 
          className="w-full rounded-lg bg-gray-100 border border-[var(--border)] px-3 py-2 text-sm" 
          value={profileData.email}
          readOnly
        />
      </label>
      <label className="text-sm">
        <div className="mb-1">Phone Number</div>
        <input 
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
          value={profileData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+61 4XX XXX XXX"
        />
      </label>
      <label className="text-sm">
        <div className="mb-1">Company</div>
        <input 
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
          value={profileData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
        />
      </label>
      <label className="text-sm">
        <div className="mb-1">Position</div>
        <input 
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
          value={profileData.position}
          onChange={(e) => handleInputChange('position', e.target.value)}
          placeholder="e.g., Marketing Manager"
        />
      </label>
      <label className="text-sm">
        <div className="mb-1">Website</div>
        <input 
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
          value={profileData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          placeholder="https://yourcompany.com"
        />
      </label>
      <label className="text-sm">
        <div className="mb-1">Timezone</div>
        <select
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
          value={timezone}
          onChange={(e)=>setTimezone(e.target.value)}
        >
          {zones.map(z=> (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        <div className="mb-1">Address</div>
        <AddressAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={(data)=>{ setAddress(data.formatted); setAddressComponents(data); }}
          showMap
          initialLocation={addressComponents?.lat && addressComponents?.lng ? { lat: addressComponents.lat, lng: addressComponents.lng } : undefined}
        />
      </label>
      <div className="md:col-span-2">
        <button className="btn" onClick={saveProfile}>Save Changes</button>
      </div>
    </div>
  );
}

function ClientPasswordSection() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.new.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // TODO: Implement password change API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-sm">
          <div className="mb-1">Current Password</div>
          <input 
            type="password" 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
            value={passwords.current}
            onChange={(e) => handleInputChange('current', e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">New Password</div>
          <input 
            type="password" 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
            value={passwords.new}
            onChange={(e) => handleInputChange('new', e.target.value)}
            required
            minLength={8}
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">Confirm New Password</div>
          <input 
            type="password" 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
            value={passwords.confirm}
            onChange={(e) => handleInputChange('confirm', e.target.value)}
            required
            minLength={8}
          />
        </label>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="btn w-full"
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

function ClientNotificationsSection() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    invoiceAlerts: true,
    marketingEmails: false,
    weeklyReports: true
  });

  const handleToggle = (field: string) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const saveNotifications = () => {
    try {
      localStorage.setItem("client.notifications", JSON.stringify(notifications));
      alert("Notification preferences saved!");
    } catch (error) {
      console.error("Failed to save notifications:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Choose how you'd like to receive notifications about your bookings and account.
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email' },
          { key: 'smsNotifications', label: 'SMS Notifications', description: 'Get text messages for urgent updates' },
          { key: 'bookingReminders', label: 'Booking Reminders', description: 'Reminders about upcoming bookings' },
          { key: 'invoiceAlerts', label: 'Invoice Alerts', description: 'Notifications when new invoices are available' },
          { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional content and tips' },
          { key: 'weeklyReports', label: 'Weekly Reports', description: 'Summary of your weekly activity' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{item.label}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[item.key as keyof typeof notifications] ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button className="btn" onClick={saveNotifications}>
        Save Notification Preferences
      </button>
    </div>
  );
}

function ClientPreferencesSection() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light',
    defaultView: 'calendar'
  });

  const handleSelectChange = (field: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savePreferences = () => {
    try {
      localStorage.setItem("client.preferences", JSON.stringify(preferences));
      alert("Preferences saved!");
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <label className="text-sm">
        <div className="mb-1">Language</div>
        <select
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
          value={preferences.language}
          onChange={(e) => handleSelectChange('language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </label>
      
      <label className="text-sm">
        <div className="mb-1">Date Format</div>
        <select
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
          value={preferences.dateFormat}
          onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </label>
      
      <label className="text-sm">
        <div className="mb-1">Time Format</div>
        <select
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
          value={preferences.timeFormat}
          onChange={(e) => handleSelectChange('timeFormat', e.target.value)}
        >
          <option value="24h">24 Hour (14:30)</option>
          <option value="12h">12 Hour (2:30 PM)</option>
        </select>
      </label>
      
      <label className="text-sm">
        <div className="mb-1">Theme</div>
        <select
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
          value={preferences.theme}
          onChange={(e) => handleSelectChange('theme', e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </label>
      
      <label className="text-sm">
        <div className="mb-1">Default View</div>
        <select
          className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
          value={preferences.defaultView}
          onChange={(e) => handleSelectChange('defaultView', e.target.value)}
        >
          <option value="calendar">Calendar</option>
          <option value="list">List</option>
          <option value="dashboard">Dashboard</option>
        </select>
      </label>

      <div className="md:col-span-2">
        <button className="btn" onClick={savePreferences}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}
