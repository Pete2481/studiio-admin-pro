"use client";
import { useEffect, useMemo, useState } from "react";
import { Booking } from "@/lib/types";
import ServiceMultiSelect from "@/components/ServiceMultiSelect";
import MultiAgentDropdown from "@/components/MultiAgentDropdown";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import StatusDropdown from "@/components/StatusDropdown";

export default function ClientBookingModal({
  open, initial, onClose, onSave, onDelete,
}: {
  open: boolean; initial?: Partial<Booking>;
  onClose: () => void; onSave: (b: Booking) => void; onDelete?: (id: string) => void;
}){
  const [draft, setDraft] = useState<Booking>({
    id: initial?.id || crypto.randomUUID(),
    title: initial?.title || "",
    client: initial?.client || [],
    photographer: initial?.photographer || [],
    address: initial?.address,
    notes: initial?.notes,
    start: initial?.start || new Date().toISOString(),
    end: initial?.end || new Date(Date.now()+60*60*1000).toISOString(),
    status: "TENTATIVE", // Client admin always creates tentative requests
    rrule: undefined,
    services: initial?.services || [],
  });

  useEffect(()=>{
    if (!open) return;
    setDraft({
      id: initial?.id || crypto.randomUUID(),
      title: initial?.title || "",
      client: initial?.client || [],
      photographer: initial?.photographer || [],
      address: initial?.address,
      notes: initial?.notes,
      start: initial?.start || new Date().toISOString(),
      end: initial?.end || new Date(Date.now()+60*60*1000).toISOString(),
      status: "TENTATIVE", // Always tentative for client requests
      rrule: initial?.rrule,
      services: initial?.services || [],
    });
  },[open, initial]);

  const startDateLocal = useMemo(() => new Date(draft.start), [draft.start]);
  const endDateLocal = useMemo(() => new Date(draft.end), [draft.end]);

  // Calculate distance/time from business address to job
  useEffect(() => {
    try {
      const raw = localStorage.getItem("studiio.settings.address.components");
      const business = raw ? JSON.parse(raw) : undefined;
      const bizLat = business?.lat;
      const bizLng = business?.lng;
      const jobLat = draft.addressComponents?.lat;
      const jobLng = draft.addressComponents?.lng;
      if (typeof bizLat === "number" && typeof bizLng === "number" && typeof jobLat === "number" && typeof jobLng === "number") {                                                                                       
        const R = 6371; // km
        const toRad = (v:number)=> v*Math.PI/180;
        const dLat = toRad(jobLat - bizLat);
        const dLng = toRad(jobLng - bizLng);
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(bizLat))*Math.cos(toRad(jobLat))*Math.sin(dLng/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distanceKm = R * c;
        // Simple heuristic: average speed 50km/h => minutes = km / 50 * 60
        const travelMinutes = Math.round((distanceKm / 50) * 60);
        setDraft(prev => ({ ...prev, distanceKm: Number(distanceKm.toFixed(1)), travelMinutes } as any));
      }
    } catch {}
  }, [draft.addressComponents]);

  function setDateTime(dateISO: string, time: string, which: "start" | "end") {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(dateISO);
    d.setHours(h || 0, m || 0, 0, 0);
    if (which === "start") {
      const end = new Date(d.getTime() + 60 * 60 * 1000); // default 1 hour
      setDraft({ ...draft, start: d.toISOString(), end: end.toISOString() } as Booking);
    } else {
      setDraft({ ...draft, [which]: d.toISOString() } as Booking);
    }
  }

  // Simple 15-minute time options
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const h = Math.floor(i / 4);
    const m = (i % 4) * 15;
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        <div className="text-lg font-semibold mb-4 text-gray-900">
          {initial?.id ? "Edit Booking Request" : "New Booking Request"}
        </div>

        {/* Client-specific info banner */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-800 font-medium">Booking Request</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            This will be submitted as a booking request. Our team will review and confirm availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm md:col-span-2">
            <div className="mb-1 font-medium text-gray-700">Property Address</div>
            <AddressAutocomplete
              value={draft.address || ""}
              onChange={(text)=>setDraft({ ...draft, address: text })}
              onSelect={(data)=>setDraft({ ...draft, address: data.formatted, addressComponents: data })}
              showMap
            />
          </label>
          
          <label className="text-sm">
            <div className="mb-1 font-medium text-gray-700">Select Agents</div>
            <MultiAgentDropdown
              value={draft.client || []}
              onChange={(ids)=>setDraft({...draft, client: ids})}
            />
          </label>
          
          <label className="text-sm">
            <div className="mb-1 font-medium text-gray-700">Property Access Status *</div>
            <StatusDropdown
              value={(draft as any).propertyAccessStatus || "Tenanted Property"}
              onChange={(status)=>setDraft({...draft, propertyAccessStatus: status} as any)}
              showManagement={false}
            />
            <div className="text-xs text-gray-500 mt-1">How should the photographer access the property?</div>
          </label>
          
          <label className="text-sm">
            <div className="mb-1 font-medium text-gray-700">Booking Status *</div>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  draft.status === "CONFIRMED" ? "bg-green-500" :
                  draft.status === "TENTATIVE" ? "bg-yellow-500" :
                  draft.status === "PENCILED" ? "bg-blue-500" :
                  "bg-gray-500"
                }`}></div>
                <span className="text-sm">
                  {draft.status === "TENTATIVE" && "⏳ TENTATIVE"}
                  {draft.status === "CONFIRMED" && "✅ CONFIRMED"}
                  {draft.status === "PENCILED" && "📝 PENCILED"}
                  {draft.status === "CANCELLED" && "❌ CANCELLED"}
                  {!["TENTATIVE", "CONFIRMED", "PENCILED", "CANCELLED"].includes(draft.status) && draft.status}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Status can only be changed by business admin</div>
          </label>
          
          <label className="text-sm">
            <div className="mb-1 font-medium text-gray-700">Your Assigned Photographers</div>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Unassigned</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Photographers are assigned by business admin</div>
          </label>

          <label className="text-sm md:col-span-2">
            <div className="mb-1 font-medium text-gray-700">Requested Services</div>
            <ServiceMultiSelect
              value={draft.services || []}
              onChange={(ids)=>{
                // Auto-calc duration from selected services
                try {
                  const raw = localStorage.getItem("studiio.services.v1");
                  const all = raw ? (JSON.parse(raw) as any[]) : [];
                  const selected = (all && Array.isArray(all) ? all : []).filter(s=>ids.includes(s.id));
                  const minutes = selected.reduce((sum, s)=> sum + (Number(s.durationMinutes)||0), 0) || 60;
                  const start = new Date(draft.start);
                  const end = new Date(start.getTime() + minutes * 60 * 1000);
                  setDraft({ ...draft, services: ids, end: end.toISOString() } as Booking);
                } catch {
                  setDraft({ ...draft, services: ids } as Booking);
                }
              }}
            />
          </label>

          <div className="text-sm md:col-span-2">
            <div className="mb-1 font-medium text-gray-700">Preferred Date & Time</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label>
                <div className="mb-1 text-xs text-gray-600">Date</div>
                <input 
                  type="date" 
                  className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={startDateLocal.toISOString().slice(0,10)} 
                  onChange={e=>setDateTime(e.target.value, `${String(startDateLocal.getHours()).padStart(2,"0")}:${String(startDateLocal.getMinutes()).padStart(2,"0")}`, "start")}
                />
              </label>
              <label>
                <div className="mb-1 text-xs text-gray-600">Start Time</div>
                <select 
                  className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={`${String(startDateLocal.getHours()).padStart(2,"0")}:${String(startDateLocal.getMinutes()).padStart(2,"0")}`} 
                  onChange={e=>setDateTime(startDateLocal.toISOString().slice(0,10), e.target.value, "start")}
                >  
                  {timeOptions.map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>
                <div className="mb-1 text-xs text-gray-600">Duration</div>
                <input
                  readOnly
                  className="w-full rounded-lg bg-gray-50 border border-gray-300 px-3 py-2 text-sm"
                  value={`${Math.round((new Date(draft.end).getTime() - new Date(draft.start).getTime()) / (1000 * 60))} minutes`}
                />
              </label>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Duration is automatically calculated based on selected services.
            </div>
          </div>

          <label className="text-sm md:col-span-2">
            <div className="mb-1 font-medium text-gray-700">Special Requirements & Notes</div>
            <textarea 
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              rows={4} 
              value={draft.notes||""} 
              onChange={e=>setDraft({...draft, notes:e.target.value})}
              placeholder="Any special requirements, access instructions, or additional notes..."
            />
          </label>
        </div>

        {/* Status indicator for existing bookings */}
        {initial?.id && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">Request Status</div>
                <div className="text-xs text-gray-500">Current status of this booking request</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  draft.status === "CONFIRMED" ? "bg-green-500" :
                  draft.status === "TENTATIVE" ? "bg-yellow-500" :
                  draft.status === "PENCILED" ? "bg-blue-500" :
                  "bg-gray-500"
                }`}></div>
                <span className="text-sm font-medium text-gray-700">{draft.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">Request ID: {draft.id}</div>
          <div className="flex gap-3">
            {initial?.id && onDelete && (
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors" 
                onClick={()=>onDelete(draft.id)}
              >
                Cancel Request
              </button>
            )}
            <button 
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors" 
              onClick={()=>onSave(draft)}
            >
              {initial?.id ? "Update Request" : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



