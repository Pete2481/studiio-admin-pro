"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "Active" | "Inactive";
  cost: string;
  date: string;
  imageQuotaEnabled?: boolean;
  imageQuota?: number;
  displayPrice?: boolean;
  active?: boolean;
  durationMinutes?: number; // service duration in minutes
  favorite?: boolean; // for quick booking in calendar
};

export default function ServiceModal({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial?: Partial<Service>;
  onClose: () => void;
  onSave: (svc: Service) => void;
  onDelete?: (id: string) => void;
}){
  const [draft, setDraft] = useState<Service>({
    id: initial?.id || crypto.randomUUID(),
    name: initial?.name || "",
    description: initial?.description || "",
    icon: initial?.icon || "📸",
    status: (initial?.status as any) || "Active",
    cost: initial?.cost || "0",
    date: initial?.date || new Date().toDateString(),
    imageQuotaEnabled: initial?.imageQuotaEnabled || false,
    imageQuota: initial?.imageQuota || 0,
    displayPrice: initial?.displayPrice || false,
    active: initial?.active ?? true,
    durationMinutes: initial?.durationMinutes || 60,
    favorite: initial?.favorite || false,
  });

  useEffect(() => {
    if (!open) return;
    setDraft({
      id: initial?.id || crypto.randomUUID(),
      name: initial?.name || "",
      description: initial?.description || "",
      icon: initial?.icon || "📸",
      status: (initial?.status as any) || "Active",
      cost: initial?.cost || "0",
      date: initial?.date || new Date().toDateString(),
      imageQuotaEnabled: initial?.imageQuotaEnabled || false,
      imageQuota: initial?.imageQuota || 0,
      displayPrice: initial?.displayPrice || false,
      active: initial?.active ?? true,
      durationMinutes: initial?.durationMinutes || 60,
      favorite: initial?.favorite || false,
    });
  }, [open, initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-xl card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">{initial?.id ? "Update Service" : "Add Service"}</div>
          <button
            onClick={() => setDraft({...draft, favorite: !draft.favorite})}
            className={`p-2 rounded-lg transition-colors ${
              draft.favorite 
                ? 'text-red-500 hover:text-red-600 bg-red-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={draft.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} className={draft.favorite ? 'fill-current' : ''} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm col-span-2">
            <div className="mb-1">Service Name</div>
            <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})}/>
          </label>
          <label className="text-sm col-span-2">
            <div className="mb-1">Service Description</div>
            <textarea className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" rows={4} value={draft.description} onChange={e=>setDraft({...draft, description:e.target.value})}/>
          </label>
          <label className="text-sm">
            <div className="mb-1">Icon</div>
            <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={draft.icon} onChange={e=>setDraft({...draft, icon:e.target.value})}/>
          </label>
          <label className="text-sm">
            <div className="mb-1">Service Price</div>
            <input type="number" className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={draft.cost} onChange={e=>setDraft({...draft, cost:e.target.value})}/>
          </label>
          <label className="text-sm">
            <div className="mb-1">Duration</div>
            <select
              className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
              value={draft.durationMinutes || 60}
              onChange={e=>setDraft({...draft, durationMinutes: parseInt(e.target.value)})}
            >
              {Array.from({ length: 20 }, (_, i) => (i + 1) * 30).map(m => (
                <option key={m} value={m}>{`${Math.floor(m/60) ? Math.floor(m/60)+"h " : ""}${m%60 ? (m%60)+"m" : ""}`.trim()}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <div className="mb-1">Status</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status-toggle"
                  checked={draft.status === "Active"}
                  onChange={(e) => setDraft({...draft, status: e.target.checked ? "Active" : "Inactive"})}
                  className="sr-only"
                />
                <label
                  htmlFor="status-toggle"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    draft.status === "Active" ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      draft.status === "Active" ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </label>
              </div>
              <span className="text-sm font-medium">
                {draft.status === "Active" ? "Active" : "Inactive"}
              </span>
            </div>
          </label>
          <div className="text-sm col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span>Display Price to clients</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="display-price-toggle"
                    checked={!!draft.displayPrice}
                    onChange={(e) => setDraft({...draft, displayPrice: e.target.checked})}
                    className="sr-only"
                  />
                  <label
                    htmlFor="display-price-toggle"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      draft.displayPrice ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        draft.displayPrice ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </label>
                </div>
                <span className="text-sm font-medium">
                  {draft.displayPrice ? "Yes" : "No"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Product Active</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="product-active-toggle"
                    checked={!!draft.active}
                    onChange={(e) => setDraft({...draft, active: e.target.checked})}
                    className="sr-only"
                  />
                  <label
                    htmlFor="product-active-toggle"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      draft.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        draft.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </label>
                </div>
                <span className="text-sm font-medium">
                  {draft.active ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-2 border-t border-[var(--border)] pt-3 mt-1"/>
          <div className="col-span-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={!!draft.imageQuotaEnabled} onChange={e=>setDraft({...draft, imageQuotaEnabled: e.target.checked})}/>
              Enable Image Quota
            </label>
          </div>
          <label className="text-sm col-span-2">
            <div className="mb-1">Image Quota</div>
            <input type="number" className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={draft.imageQuota || 0} onChange={e=>setDraft({...draft, imageQuota: Number(e.target.value)})} disabled={!draft.imageQuotaEnabled}/>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">ID: {draft.id}</div>
          <div className="flex gap-2">
            {initial?.id && onDelete && (
              <button className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm" onClick={()=>onDelete(draft.id)}>Delete</button>
            )}
            <button className="btn" onClick={onClose}>Close</button>
            <button className="btn" onClick={()=>onSave(draft)}>Update Service</button>
          </div>
        </div>
      </div>
    </div>
  );
}


