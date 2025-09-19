"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import type { AddressComponents } from "@/lib/types";

type Tab = "profile" | "smtp" | "subscription" | "banking" | "password" | "connections" | "gallery-layouts";

export default function Page(){
  const params = useParams();
  const tenantSlug = params.tenantId as string;
  const [tab, setTab] = useState<Tab>("profile");
  const [actualTenantId, setActualTenantId] = useState<string>("");

  useEffect(() => {
    async function fetchTenantId() {
      try {
        const response = await fetch(`/api/get-tenant-id?slug=${tenantSlug}`);
        const data = await response.json();
        if (data.success && data.tenant) {
          setActualTenantId(data.tenant.id);
        }
      } catch (error) {
        console.error('Failed to fetch tenant ID:', error);
      }
    }
    fetchTenantId();
  }, [tenantSlug]);

  return (
    <>
      <Sidebar />
      <PageLayout className="bg-gray-50">
      <div className="container mx-auto p-6">
    <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4">
            <div className="flex gap-2">
              {(
                [
                  { id: "profile", label: "Profile" },
                  { id: "smtp", label: "SMTP Setting" },
                  { id: "subscription", label: "Subscription Setting" },
                  { id: "banking", label: "Banking" },
                  { id: "password", label: "Password" },
                  { id: "connections", label: "Connections" },
                  { id: "gallery-layouts", label: "Gallery Layouts" },
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
            {tab === "profile" && <ProfileSection />}
            {tab === "smtp" && <SmtpSection tenantId={actualTenantId} />}
            {tab === "subscription" && <SubscriptionSection />}
            {tab === "banking" && <BankingSection />}
            {tab === "password" && <PasswordSection />}
            {tab === "connections" && <ConnectionsSection />}
            {tab === "gallery-layouts" && <GalleryLayoutsSection />}
          </div>
        </div>
      </div>
      </PageLayout>
    </>
  );
}

function getAllTimeZones(): string[] {
  try {
    // Modern browsers/node provide the complete IANA list
    // @ts-ignore - supportedValuesOf might not be typed depending on TS lib
    if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
      // @ts-ignore
      const values = Intl.supportedValuesOf("timeZone");
      if (Array.isArray(values) && values.length > 0) return values as string[];
    }
  } catch {}
  // Fallback: concise coverage across regions
  return [
    "Pacific/Honolulu","America/Anchorage","America/Los_Angeles","America/Denver","America/Chicago","America/New_York",
    "America/Sao_Paulo","Atlantic/Azores","Europe/London","Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/Rome",
    "Europe/Athens","Africa/Cairo","Africa/Johannesburg","Asia/Jerusalem","Asia/Dubai","Asia/Karachi","Asia/Kolkata",
    "Asia/Bangkok","Asia/Singapore","Asia/Hong_Kong","Asia/Tokyo","Asia/Seoul","Australia/Perth","Australia/Adelaide",
    "Australia/Sydney","Pacific/Auckland","Pacific/Fiji"
  ];
}

function ProfileSection(){
  const [timezone, setTimezone] = useState<string>("Australia/Sydney");
  const [address, setAddress] = useState<string>("");
  const [addressComponents, setAddressComponents] = useState<AddressComponents|undefined>(undefined);
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    try {
      const tz = localStorage.getItem("studiio.settings.timezone");
      if (tz) setTimezone(tz);
      const addr = localStorage.getItem("studiio.settings.address");
      if (addr) setAddress(addr);
      const comp = localStorage.getItem("studiio.settings.address.components");
      if (comp) setAddressComponents(JSON.parse(comp));
    } catch {}
  }, []);

  // Fetch tenant info
  useEffect(() => {
    async function fetchTenantInfo() {
      try {
        const response = await fetch('/api/get-tenant-id?slug=business-media-drive');
        const data = await response.json();
        if (data.success && data.tenant) {
          setTenantInfo(data.tenant);
        }
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    }
    fetchTenantInfo();
  }, []);

  const zones = useMemo(() => getAllTimeZones(), []);

  function saveProfile(){
    try {
      localStorage.setItem("studiio.settings.timezone", timezone);
      localStorage.setItem("studiio.settings.address", address);
      if (addressComponents) localStorage.setItem("studiio.settings.address.components", JSON.stringify(addressComponents));
    } catch {}
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="text-sm">
        <div className="mb-1">Name</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="Team Studiio"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Status</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="Active"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">E-mail</div>
        <input className="w-full rounded-lg bg-gray-100 border border-[var(--border)] px-3 py-2 text-sm" defaultValue="team@studiio.au" readOnly/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Business Name</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue={tenantInfo?.name || "Business Media Drive"}/>
      </label>
      <label className="text-sm">
        <div className="mb-1">TAX</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="GST"/>
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
        <div className="mb-1">Business Address</div>
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

function SmtpSection({ tenantId }: { tenantId: string }){
  const [settings, setSettings] = useState({
    host: '',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    },
    fromEmail: '',
    active: false
  });
  
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (tenantId) {
      loadSettings();
    }
  }, [tenantId]);

  const loadSettings = async () => {
    if (!tenantId) return;
    
    try {
      const response = await fetch(`/api/tenant/smtp-settings?tenantId=${tenantId}`);
      const data = await response.json();
      
      if (data.success && data.smtpSettings) {
        setSettings(data.smtpSettings);
      }
    } catch (error) {
      console.error('Error loading SMTP settings:', error);
    }
  };

  const handleSave = async () => {
    if (!tenantId) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/tenant/smtp-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, smtpSettings: settings })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'SMTP settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!tenantId || !testEmail) {
      setMessage({ type: 'error', text: 'Please enter a recipient email address' });
      return;
    }
    
    setTesting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/tenant/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, to: testEmail })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Test email sent successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send test email' });
    } finally {
      setTesting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.startsWith('auth.')) {
      const authField = field.split('.')[1];
      setSettings(prev => ({
        ...prev,
        auth: {
          ...prev.auth,
          [authField]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Email Notifications</h3>
          <p className="text-sm text-gray-600">Enable or disable email sending</p>
        </div>
        <button
          onClick={() => handleInputChange('active', !settings.active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.active ? 'bg-teal-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* SMTP Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          <div className="mb-1">SMTP Host Address</div>
          <input 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            value={settings.host}
            onChange={(e) => handleInputChange('host', e.target.value)}
            placeholder="mail.yourdomain.com"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">SMTP Port Number</div>
          <input 
            type="number"
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            value={settings.port}
            onChange={(e) => handleInputChange('port', parseInt(e.target.value))}
            placeholder="587"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">SMTP Username</div>
          <input 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            value={settings.auth.user}
            onChange={(e) => handleInputChange('auth.user', e.target.value)}
            placeholder="info@yourdomain.com"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">SMTP Email Password</div>
          <input 
            type="password" 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            value={settings.auth.pass}
            onChange={(e) => handleInputChange('auth.pass', e.target.value)}
            placeholder="Your email password"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">From Email Address</div>
          <input 
            type="email"
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            value={settings.fromEmail}
            onChange={(e) => handleInputChange('fromEmail', e.target.value)}
            placeholder="noreply@yourdomain.com"
          />
        </label>
      </div>

      {/* Security Option */}
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.secure}
            onChange={(e) => handleInputChange('secure', e.target.checked)}
            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Use SSL/TLS (recommended for port 465)
          </span>
        </label>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <p className={`text-sm ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Settings must be saved before you can send a test email.
          Make sure your email provider allows SMTP access and that you're using the correct credentials.
        </p>
      </div>

      {/* Test Email Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Test Email Configuration</h3>
        <div className="flex gap-4">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter email address to test"
            className="flex-1 rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
          />
          <button 
            onClick={handleTest}
            disabled={testing || !settings.active || !testEmail}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? 'Testing...' : 'Send Test Email'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function SubscriptionSection(){
  return (
    <div className="space-y-3">
      <div className="text-gray-600">You have not subscribed yet</div>
      <button className="btn">Subscribe Now</button>
    </div>
  );
}

function BankingSection(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="text-sm">
        <div className="mb-1">Account Name</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="Media Drive Systems"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Account Number</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="461217149 ( Reference Invoice No ONLY )"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">ABN/ACN Number</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="72600082460"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">BSB Number</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="012554"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Account Email</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="pete@mediadrive.com.au"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Country</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="Australia"/>
      </label>
      <label className="text-sm md:col-span-2">
        <div className="mb-1">Address</div>
        <AddressAutocomplete value={""} onChange={()=>{}} placeholder="Start typing address" />
      </label>
      <label className="text-sm">
        <div className="mb-1">City</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="Byron Bay"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Postal Code</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="2481"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Phone</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="0413979054"/>
      </label>
      <label className="text-sm md:col-span-2">
        <div className="mb-1">Website</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="www.mediadrive.com.au"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Tax Rate (%)</div>
        <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" defaultValue="10"/>
      </label>
      <div className="md:col-span-2">
        <button className="btn">Save Changes</button>
      </div>
    </div>
  );
}

function PasswordSection(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <label className="text-sm">
        <div className="mb-1">Old Password</div>
        <input type="password" className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">New Password</div>
        <input type="password" className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"/>
      </label>
      <label className="text-sm">
        <div className="mb-1">Confirm Password</div>
        <input type="password" className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"/>
      </label>
      <div className="md:col-span-3">
        <button className="btn">Change Password</button>
      </div>
    </div>
  );
}

function ConnectionsSection(){
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Connect your Studiio account to external services for seamless integration.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          <div className="mb-1">Link to Dropbox</div>
          <input 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            placeholder="Enter Dropbox account email or username"
          />
        </label>
        
        <label className="text-sm">
          <div className="mb-1">Link to Google Drive</div>
          <input 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            placeholder="Enter Google account email"
          />
        </label>
        
        <label className="text-sm">
          <div className="mb-1">Link to Quickbooks</div>
          <input 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            placeholder="Enter Quickbooks account email"
          />
        </label>
        
        <label className="text-sm">
          <div className="mb-1">Link to Zero</div>
          <input 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            placeholder="Enter Zero account email"
          />
        </label>
        
        <label className="text-sm">
          <div className="mb-1">Link to Agentbox</div>
          <input 
            className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
            placeholder="Enter Agentbox account email"
          />
        </label>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button className="btn">Connect Accounts</button>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
          Test Connections
        </button>
      </div>
    </div>
  );
}

function GalleryLayoutsSection(){
  const [selectedLayout, setSelectedLayout] = useState("single-template"); // Default to single template
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load saved layout from localStorage
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem("studiio.settings.galleryLayout");
      if (savedLayout) {
        setSelectedLayout(savedLayout);
      }
    } catch (error) {
      console.error("Failed to load saved layout:", error);
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = () => {
    try {
      localStorage.setItem("studiio.settings.galleryLayout", selectedLayout);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Failed to save layout:", error);
    }
  };

  const layouts = [
    {
      id: "single-template",
      name: "Professional Gallery",
      description: "Clean, modern gallery layout with hero banner and infinite scrolling",
      premium: false,
      background: "white"
    },
    {
      id: "3x-layout",
      name: "3x Layout",
      description: "Same as Professional Gallery but with 3 images across, full size, no cropping, and scroll feature",
      premium: false,
      background: "white"
    },
    {
      id: "2x-layout",
      name: "2x Layout",
      description: "Same as Professional Gallery but with 2 images across, full size, no cropping, and scroll feature",
      premium: false,
      background: "white"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Choose how your gallery images will be displayed. Select a layout that best showcases your content.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedLayout === layout.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedLayout(layout.id)}
          >
            {/* Premium Badge */}
            {layout.premium && (
              <div className="absolute -top-2 -right-2 bg-gray-800 text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                👑
              </div>
            )}
            
            {/* Layout Preview */}
            <div className="mb-4">
              {layout.id === "layout-1" && (
                <div className={`w-full h-32 rounded border border-gray-300 p-2 ${layout.background === 'black' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-4 grid-rows-4 gap-0.5 h-full">
                    {Array.from({ length: 16 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`border rounded overflow-hidden bg-white ${
                          i === 3 || i === 7 || i === 11 || i === 15 ? 'col-span-2' : ''
                        }`}
                      >
                        <div className={`w-full h-full bg-gradient-to-br ${
                          i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          i % 7 === 1 ? 'from-green-100 to-blue-100' :
                          i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          i % 7 === 3 ? 'from-pink-100 to-red-100' :
                          i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          i % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {layout.id === "layout-2" && (
                <div className={`w-full h-32 rounded border border-gray-300 p-2 ${layout.background === 'black' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="relative h-full">
                    <div className="absolute top-0 left-0 right-0 h-1/2 border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'absolute top-0 left-0 right-0 h-1/2 border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'absolute bottom-0 left-0 right-0 h-1/2 border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border rounded-full overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border rounded-full bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {layout.id === "layout-3" && (
                <div className={`w-full h-32 rounded border border-gray-300 p-2 ${layout.background === 'black' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-5 grid-rows-3 gap-1 h-full">
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden col-span-3">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden col-span-3">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {layout.id === "layout-4" && (
                <div className={`w-full h-32 rounded border border-gray-300 p-2 ${layout.background === 'black' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-2 gap-1 h-full auto-rows-min">
                    <div className="space-y-1">
                      <div className="h-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded mb-1"></div>
                      <div className="h-5 bg-gradient-to-r from-green-100 to-blue-100 rounded mb-1"></div>
                      <div className="h-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded mb-1"></div>
                      <div className="h-6 bg-gradient-to-r from-pink-100 to-red-100 rounded mb-1"></div>
                      <div className="h-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded mb-1"></div>
                      <div className="h-5 bg-gradient-to-r from-teal-100 to-green-100 rounded mb-1"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded mb-1"></div>
                      <div className="h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded mb-1"></div>
                      <div className="h-3 bg-gradient-to-r from-green-100 to-blue-100 rounded mb-1"></div>
                      <div className="h-5 bg-gradient-to-r from-yellow-100 to-orange-100 rounded mb-1"></div>
                      <div className="h-4 bg-gradient-to-r from-pink-100 to-red-100 rounded mb-1"></div>
                      <div className="h-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded mb-1"></div>
                    </div>
                  </div>
                </div>
              )}

              {layout.id === "layout-5" && (
                <div className={`w-full h-32 rounded border border-gray-300 p-2 ${layout.background === 'black' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="h-full flex gap-1">
                    <div className="flex-1 border rounded overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'flex-1 border rounded bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="w-1/3 space-y-1">
                      <div className="h-1/2 border rounded overflow-hidden">
                        <img 
                          src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                          alt="Gallery Image" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.className = 'h-1/2 border rounded bg-gray-200 flex items-center justify-center text-xs';
                            e.currentTarget.parentElement!.textContent = '🏠';
                          }}
                        />
                      </div>
                      <div className="h-1/2 border rounded overflow-hidden">
                        <img 
                          src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                          alt="Gallery Image" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.className = 'h-1/2 border rounded bg-gray-200 flex items-center justify-center text-xs';
                            e.currentTarget.parentElement!.textContent = '🏠';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {layout.id === "layout-6" && (
                <div className={`w-full h-32 rounded border border-gray-300 p-2 ${layout.background === 'black' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-4 gap-0.5 h-full">
                    {/* Top row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          i % 7 === 1 ? 'from-green-100 to-blue-100' :
                          i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          i % 7 === 3 ? 'from-pink-100 to-red-100' :
                          i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          i % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 1}
                        </div>
                      </div>
                    ))}
                    
                    {/* Second row - 1 image, video (2x2), 1 image */}
                    <div className="border rounded overflow-hidden bg-white">
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-xs font-bold">5</div>
                    </div>
                    
                    {/* Video Placeholder - 2x2 grid space */}
                    <div className="col-span-2 row-span-2 border-2 border-dashed border-blue-400 rounded bg-blue-50 flex items-center justify-center relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-blue-600 text-lg mb-1">▶️</div>
                          <div className="text-blue-600 text-xs font-medium">VIDEO</div>
                          <div className="text-blue-500 text-xs">16:9</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded overflow-hidden bg-white">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-xs font-bold">6</div>
                    </div>
                    
                    {/* Third row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 7} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 7) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 7) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 7) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 7) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 7) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 7) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 7}
                        </div>
                      </div>
                    ))}
                    
                    {/* Fourth row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 11} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 11) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 11) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 11) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 11) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 11) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 11) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 11}
                        </div>
                      </div>
                    ))}
                    
                    {/* Fifth row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 15} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 15) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 15) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 15) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 15) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 15) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 15) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 15}
                        </div>
                      </div>
                    ))}
                    
                    {/* Sixth row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 19} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 19) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 19) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 19) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 19) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 19) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 19) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 19}
                        </div>
                      </div>
                    ))}
                    
                    {/* Seventh row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 23} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 23) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 23) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 23) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 23) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 23) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 23) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 23}
                        </div>
                      </div>
                    ))}
                    
                    {/* Eighth row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 27} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 27) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 27) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 27) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 27) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 27) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 27) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 27}
                        </div>
                      </div>
                    ))}
                    
                    {/* Ninth row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 31} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 31) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 31) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 31) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 31) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 31) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 31) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 31}
                        </div>
                      </div>
                    ))}
                    
                    {/* Tenth row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 35} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 35) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 35) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 35) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 35) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 35) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 35) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 35}
                        </div>
                      </div>
                    ))}
                    
                    {/* Eleventh row - 4 images */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 39} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 39) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 39) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 39) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 39) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 39) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 39) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 39}
                        </div>
                      </div>
                    ))}
                    
                    {/* Twelfth row - remaining images to fill the grid */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i + 43} className="border rounded overflow-hidden bg-white">
                        <div className={`w-full h-full bg-gradient-to-br ${
                          (i + 43) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                          (i + 43) % 7 === 1 ? 'from-green-100 to-blue-100' :
                          (i + 43) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                          (i + 43) % 7 === 3 ? 'from-pink-100 to-red-100' :
                          (i + 43) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                          (i + 43) % 7 === 5 ? 'from-teal-100 to-green-100' :
                          'from-orange-100 to-yellow-100'
                        } flex items-center justify-center text-xs font-bold`}>
                          {i + 43}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {layout.id === "layout-7" && (
                <div className={`w-full h-32 rounded border border-gray-300 p-2 ${layout.background === 'black' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex gap-1 h-full overflow-hidden">
                    <div className="w-20 border rounded flex-shrink-0 overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'w-20 border rounded flex-shrink-0 bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="w-20 border rounded flex-shrink-0 overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'w-20 border rounded flex-shrink-0 bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="w-20 border rounded flex-shrink-0 overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'w-20 border rounded flex-shrink-0 bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="w-20 border rounded flex-shrink-0 overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'w-20 border rounded flex-shrink-0 bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                    <div className="w-20 border rounded flex-shrink-0 overflow-hidden">
                      <img 
                        src="https://dl.dropboxusercontent.com/scl/fi/t2efk2fhfhcogyuymhnxy/AEhgQHMT8Ycj_UHaurJwRJA?rlkey=lpmyst3nrcfqljibfjvs0zc4n&dl=1&raw=1" 
                        alt="Gallery Image" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'w-20 border rounded flex-shrink-0 bg-gray-200 flex items-center justify-center text-xs';
                          e.currentTarget.parentElement!.textContent = '🏠';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Layout Info */}
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-1">{layout.name}</h3>
              <p className="text-xs text-gray-600 mb-1">{layout.description}</p>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                layout.background === 'black' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {layout.background === 'black' ? 'Dark Theme' : 'Light Theme'}
              </div>
            </div>
            
            {/* Selection Indicator */}
            {selectedLayout === layout.id && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 pt-4">
        <button 
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Preview Layout
        </button>
        <button 
          onClick={saveLayout}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Save Layout
        </button>
      </div>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Gallery layout saved successfully!</span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        <p>• Layout changes will apply to all new galleries</p>
        <p>• Existing galleries will maintain their current layout</p>
        <p>• Premium layouts offer enhanced visual appeal</p>
      </div>

      {/* Layout Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Layout Preview: {layouts.find(l => l.id === selectedLayout)?.name}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {layouts.find(l => l.id === selectedLayout)?.description}
              </p>
            </div>
            
            <div className="p-6 h-full overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {/* Large Layout Preview with 40+ image placeholders */}
                {selectedLayout === "layout-1" && (
                  <div className="w-full h-96 rounded border border-gray-300 p-4 bg-gray-100">
                    <div className="grid grid-cols-8 grid-rows-5 gap-1 h-full">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div 
                          key={i} 
                          className={`border rounded overflow-hidden bg-white ${
                            i === 3 || i === 6 || i === 9 || i === 12 || i === 15 || i === 18 || i === 21 || i === 24 || i === 27 || i === 30 || i === 33 || i === 36 || i === 39 ? 'col-span-2' : ''
                          }`}
                        >
                          <div className={`w-full h-full bg-gradient-to-br ${
                            i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            i % 7 === 1 ? 'from-green-100 to-blue-100' :
                            i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            i % 7 === 3 ? 'from-pink-100 to-red-100' :
                            i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            i % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLayout === "layout-2" && (
                  <div className="w-full h-96 rounded border border-gray-300 p-4 bg-gray-100">
                    <div className="relative h-full">
                      {/* Top section with multiple images */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 border rounded overflow-hidden">
                        <div className="grid grid-cols-6 grid-rows-2 gap-1 h-full p-2">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="border rounded overflow-hidden bg-white">
                              <div className={`w-full h-full bg-gradient-to-br ${
                                i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                                i % 7 === 1 ? 'from-green-100 to-blue-100' :
                                i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                                i % 7 === 3 ? 'from-pink-100 to-red-100' :
                                i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                                i % 7 === 5 ? 'from-teal-100 to-green-100' :
                                'from-orange-100 to-yellow-100'
                              } flex items-center justify-center text-xs font-bold`}>
                                {i + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bottom section with multiple images */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 border rounded overflow-hidden">
                        <div className="grid grid-cols-6 grid-rows-2 gap-1 h-full p-2">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="border rounded overflow-hidden bg-white">
                              <div className={`w-full h-full bg-gradient-to-br ${
                                (i + 12) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                                (i + 12) % 7 === 1 ? 'from-green-100 to-blue-100' :
                                (i + 12) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                                (i + 12) % 7 === 3 ? 'from-pink-100 to-red-100' :
                                (i + 12) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                                (i + 12) % 7 === 5 ? 'from-teal-100 to-green-100' :
                                'from-orange-100 to-yellow-100'
                              } flex items-center justify-center text-xs font-bold`}>
                                {i + 13}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Central circular focus with multiple small images */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border rounded-full overflow-hidden bg-white shadow-lg">
                        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 h-full p-1">
                          {Array.from({ length: 9 }, (_, i) => (
                            <div key={i} className="border rounded overflow-hidden">
                              <div className={`w-full h-full bg-gradient-to-br ${
                                (i + 25) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                                (i + 25) % 7 === 1 ? 'from-green-100 to-blue-100' :
                                (i + 25) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                                (i + 25) % 7 === 3 ? 'from-pink-100 to-red-100' :
                                (i + 25) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                                (i + 25) % 7 === 5 ? 'from-teal-100 to-green-100' :
                                'from-orange-100 to-yellow-100'
                              } flex items-center justify-center text-xs font-bold`}>
                                {i + 25}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedLayout === "layout-3" && (
                  <div className="w-full h-96 rounded border border-gray-300 p-4 bg-gray-100">
                    <div className="grid grid-cols-10 grid-rows-4 gap-1 h-full">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div 
                          key={i} 
                          className={`border rounded overflow-hidden bg-white ${
                            i === 1 || i === 8 || i === 15 || i === 22 || i === 29 || i === 36 ? 'col-span-3' : ''
                          }`}
                        >
                          <div className={`w-full h-full bg-gradient-to-br ${
                            i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            i % 7 === 1 ? 'from-green-100 to-blue-100' :
                            i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            i % 7 === 3 ? 'from-pink-100 to-red-100' :
                            i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            i % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLayout === "layout-4" && (
                  <div className="w-full h-96 rounded border border-gray-300 p-4 bg-gray-100 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3 auto-rows-min">
                      {Array.from({ length: 60 }, (_, index) => (
                        <div key={index} className="w-full">
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className={`w-full bg-gradient-to-br ${
                              index % 7 === 0 ? 'from-blue-100 to-purple-100' :
                              index % 7 === 1 ? 'from-green-100 to-blue-100' :
                              index % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                              index % 7 === 3 ? 'from-pink-100 to-red-100' :
                              index % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                              index % 7 === 5 ? 'from-teal-100 to-green-100' :
                              'from-orange-100 to-yellow-100'
                            } flex items-center justify-center text-xs font-bold`}
                            style={{
                              height: `${120 + (index % 7) * 50}px`
                            }}>
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLayout === "layout-5" && (
                  <div className="w-full h-96 rounded border border-gray-300 p-4 bg-gray-100">
                    <div className="h-full flex gap-2">
                      {/* Large featured image */}
                      <div className="flex-1 border rounded overflow-hidden bg-white">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl font-bold">
                          🏠
                        </div>
                      </div>
                      
                      {/* Thumbnails grid */}
                      <div className="w-1/3 space-y-1">
                        <div className="grid grid-cols-2 gap-1">
                          {Array.from({ length: 40 }, (_, i) => (
                            <div key={i} className="border rounded overflow-hidden bg-white aspect-square">
                              <div className={`w-full h-full bg-gradient-to-br ${
                                i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                                i % 7 === 1 ? 'from-green-100 to-blue-100' :
                                i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                                i % 7 === 3 ? 'from-pink-100 to-red-100' :
                                i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                                i % 7 === 5 ? 'from-teal-100 to-green-100' :
                                'from-orange-100 to-yellow-100'
                              } flex items-center justify-center text-xs font-bold`}>
                                {i + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedLayout === "layout-6" && (
                  <div className="w-full h-96 rounded border border-gray-300 p-4 bg-gray-100">
                    <div className="grid grid-cols-4 gap-1 h-full">
                      {/* Top row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            i % 7 === 1 ? 'from-green-100 to-blue-100' :
                            i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            i % 7 === 3 ? 'from-pink-100 to-red-100' :
                            i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            i % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 1}
                          </div>
                        </div>
                      ))}
                      
                      {/* Second row - 1 image, video (2x2), 1 image */}
                      <div className="border rounded overflow-hidden bg-white">
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-xs font-bold">5</div>
                      </div>
                      
                      {/* Video Placeholder - 2x2 grid space */}
                      <div className="col-span-2 row-span-2 border-2 border-dashed border-blue-400 rounded bg-blue-50 flex items-center justify-center relative">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-blue-600 text-2xl mb-1">▶️</div>
                            <div className="text-blue-600 text-sm font-medium">VIDEO</div>
                            <div className="text-blue-500 text-xs">16:9</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded overflow-hidden bg-white">
                        <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-xs font-bold">6</div>
                      </div>
                      
                      {/* Third row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 7} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 7) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 7) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 7) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 7) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 7) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 7) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 7}
                          </div>
                        </div>
                      ))}
                      
                      {/* Fourth row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 11} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 11) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 11) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 11) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 11) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 11) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 11) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 11}
                          </div>
                        </div>
                      ))}
                      
                      {/* Fifth row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 15} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 15) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 15) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 15) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 15) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 15) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 15) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 15}
                          </div>
                        </div>
                      ))}
                      
                      {/* Sixth row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 19} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 19) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 19) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 19) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 19) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 19) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 19) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 19}
                          </div>
                        </div>
                      ))}
                      
                      {/* Seventh row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 23} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 23) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 23) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 23) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 23) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 23) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 23) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 23}
                          </div>
                        </div>
                      ))}
                      
                      {/* Eighth row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 27} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 27) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 27) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 27) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 27) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 27) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 27) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 27}
                          </div>
                        </div>
                      ))}
                      
                      {/* Ninth row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 31} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 31) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 31) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 31) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 31) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 31) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 31) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 31}
                          </div>
                        </div>
                      ))}
                      
                      {/* Tenth row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 35} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 35) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 35) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 35) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 35) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 35) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 35) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 35}
                          </div>
                        </div>
                      ))}
                      
                      {/* Eleventh row - 4 images */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 39} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 39) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 39) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 39) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 39) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 39) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 39) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 39}
                          </div>
                        </div>
                      ))}
                      
                      {/* Twelfth row - remaining images to fill the grid */}
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i + 43} className="border rounded overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            (i + 43) % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            (i + 43) % 7 === 1 ? 'from-green-100 to-blue-100' :
                            (i + 43) % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            (i + 43) % 7 === 3 ? 'from-pink-100 to-red-100' :
                            (i + 43) % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            (i + 43) % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 43}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLayout === "layout-7" && (
                  <div className="w-full h-96 rounded border border-gray-300 p-4 bg-gray-100">
                    <div className="flex gap-2 h-full overflow-x-auto">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div key={i} className="w-24 border rounded flex-shrink-0 overflow-hidden bg-white">
                          <div className={`w-full h-full bg-gradient-to-br ${
                            i % 7 === 0 ? 'from-blue-100 to-purple-100' :
                            i % 7 === 1 ? 'from-green-100 to-blue-100' :
                            i % 7 === 2 ? 'from-yellow-100 to-orange-100' :
                            i % 7 === 3 ? 'from-pink-100 to-red-100' :
                            i % 7 === 4 ? 'from-indigo-100 to-purple-100' :
                            i % 7 === 5 ? 'from-teal-100 to-green-100' :
                            'from-orange-100 to-yellow-100'
                          } flex items-center justify-center text-xs font-bold`}>
                            {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

