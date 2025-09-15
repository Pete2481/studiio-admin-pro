"use client";
import { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

export type Photographer = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  company: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  location?: string;
  permissions: {
    viewCalendar: boolean;
    viewBlankedBookings: boolean;
    viewAllBookings: boolean;
    viewInvoice: boolean;
    deleteGallery: boolean;
    viewAllGallery: boolean;
    viewService: boolean;
    addGalleries: boolean;
    viewClients: boolean;
  };
};

export default function PhotographerModal({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
  tenantId,
  uploadedBy,
}: {
  open: boolean;
  initial?: Partial<Photographer>;
  onClose: () => void;
  onSave: (photographer: Photographer) => void;
  onDelete?: (id: string) => void;
  tenantId?: string;
  uploadedBy?: string;
}) {
  const [draft, setDraft] = useState<Photographer>({
    id: initial?.id || crypto.randomUUID(),
    name: initial?.name || "",
    status: initial?.status || "Active",
    company: initial?.company || "",
    role: initial?.role || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    avatar: initial?.avatar || "👤",
    location: initial?.location || "",
    permissions: initial?.permissions || {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    setDraft({
      id: initial?.id || crypto.randomUUID(),
      name: initial?.name || "",
      status: initial?.status || "Active",
      company: initial?.company || "",
      role: initial?.role || "",
      email: initial?.email || "",
      phone: initial?.phone || "",
      avatar: initial?.avatar || "👤",
      location: initial?.location || "",
      permissions: initial?.permissions || {
        viewCalendar: true,
        viewBlankedBookings: true,
        viewAllBookings: true,
        viewInvoice: true,
        deleteGallery: true,
        viewAllGallery: true,
        viewService: true,
        addGalleries: true,
        viewClients: true,
      },
    });
  }, [open, initial]);

  const handlePermissionChange = (permission: keyof Photographer['permissions']) => {
    setDraft({
      ...draft,
      permissions: {
        ...draft.permissions,
        [permission]: !draft.permissions[permission],
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-2xl card p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {initial?.id ? "Edit Photographer" : "Add Photographer"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Photo Upload Section */}
        <div className="mb-6">
          <ProfilePhotoUpload
            currentPhoto={draft.avatar.startsWith('http') || draft.avatar.startsWith('/') ? draft.avatar : undefined}
            onPhotoChange={(photoUrl) => setDraft({ ...draft, avatar: photoUrl || "👤" })}
            tenantId={tenantId || "business-media-drive"}
            uploadedBy={uploadedBy || "admin"}
          />
        </div>

        {/* Personal Details - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select Role</option>
              <option value="Senior Photographer">Senior Photographer</option>
              <option value="Lead Photographer">Lead Photographer</option>
              <option value="Property Specialist">Property Specialist</option>
              <option value="Aerial Specialist">Aerial Specialist</option>
              <option value="Studio Manager">Studio Manager</option>
              <option value="Creative Director">Creative Director</option>
              <option value="Marketing Director">Marketing Director</option>
              <option value="Operations Manager">Operations Manager</option>
              <option value="IT Specialist">IT Specialist</option>
              <option value="Financial Manager">Financial Manager</option>
              <option value="Hospitality Specialist">Hospitality Specialist</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <input
              type="text"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as "Active" | "Inactive" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Active"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={draft.company}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="Company name"
            />
            <p className="text-xs text-gray-500 mt-1">Company assignment cannot be changed here</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Permissions Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission (All ACCESS)</h3>
          <div className="space-y-3">
            {Object.entries(draft.permissions).map(([permission, value]) => (
              <div key={permission} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`permission-${permission}`}
                    checked={value}
                    onChange={() => handlePermissionChange(permission as keyof Photographer['permissions'])}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`permission-${permission}`}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      value ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">ID: {draft.id}</div>
          <div className="flex gap-3">
            {initial?.id && onDelete && (
              <button
                onClick={() => onDelete(draft.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onSave(draft)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {initial?.id ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
