"use client";
import { useEffect, useMemo, useState } from "react";
import { Booking } from "@/lib/types";
import ServiceMultiSelect from "@/components/ServiceMultiSelect";
import MultiAgentDropdown from "@/components/MultiAgentDropdown";
import MultiPhotographerDropdown from "@/components/MultiPhotographerDropdown";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function EventModal({
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
    status: (initial?.status as any) || "CONFIRMED",
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
      status: (initial?.status as any) || "CONFIRMED",
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
      <div className="w-full max-w-2xl card p-5">
        <div className="text-lg font-semibold mb-4">{initial?.id ? "Edit Booking" : "New Booking"}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm md:col-span-2">
            <div className="mb-1">Booking Address</div>
            <AddressAutocomplete
              value={draft.address || ""}
              onChange={(text)=>setDraft({ ...draft, address: text })}
              onSelect={(data)=>setDraft({ ...draft, address: data.formatted, addressComponents: data })}
              showMap
            />
          </label>
          <label className="text-sm">
            <div className="mb-1">Select Agents</div>
            <MultiAgentDropdown
              value={draft.client || []}
              onChange={(ids)=>setDraft({...draft, client: ids})}
            />
          </label>
          <label className="text-sm">
            <div className="mb-1">Photographers</div>
            <MultiPhotographerDropdown
              value={draft.photographer || []}
              onChange={(ids)=>setDraft({...draft, photographer: ids})}
            />
          </label>

          <label className="text-sm md:col-span-2">
            <div className="mb-1">Select Services</div>
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
            <div className="mb-1">Date / Time</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label>
                <div className="mb-1 text-xs">Date</div>
                <input type="date" className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={startDateLocal.toISOString().slice(0,10)} onChange={e=>setDateTime(e.target.value, `${String(startDateLocal.getHours()).padStart(2,"0")}:${String(startDateLocal.getMinutes()).padStart(2,"0")}`, "start")}/>
              </label>
              <label>
                <div className="mb-1 text-xs">Start Time</div>
                <select className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={`${String(startDateLocal.getHours()).padStart(2,"0")}:${String(startDateLocal.getMinutes()).padStart(2,"0")}`} onChange={e=>setDateTime(startDateLocal.toISOString().slice(0,10), e.target.value, "start")}>
                  {timeOptions.map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="relative">
                <div className="mb-1 text-xs">Distance to Job</div>
                <input
                  readOnly
                  placeholder="Auto"
                  className="w-full rounded-lg bg-gray-50 border border-[var(--border)] px-3 py-2 pr-10 text-sm"
                  value={typeof draft.distanceKm === 'number' ? draft.distanceKm.toFixed(1) : ''}
                />
                <span className="absolute right-3 top-[30px] text-xs text-gray-500">km</span>
              </label>
              <label className="relative">
                <div className="mb-1 text-xs">Estimated Travel Time</div>
                <input
                  readOnly
                  placeholder="Auto"
                  className="w-full rounded-lg bg-gray-50 border border-[var(--border)] px-3 py-2 pr-10 text-sm"
                  value={typeof draft.travelMinutes === 'number' ? draft.travelMinutes : ''}
                />
                <span className="absolute right-3 top-[30px] text-xs text-gray-500">min</span>
              </label>
            </div>
            <div className="text-xs text-slate-500 mt-1">Duration defaults to 1 hour. Distance and travel time auto-calculate from Business and job addresses.</div>
          </div>

          <label className="text-sm">
            <div className="mb-1">Status</div>
            <select className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={draft.status} onChange={e=>setDraft({...draft, status:e.target.value as any})}>
              <option>CONFIRMED</option>
              <option>TENTATIVE</option>
              <option>PENCILED</option>
              <option>CANCELLED</option>
            </select>
          </label>
          <div />

          <label className="text-sm md:col-span-2">
            <div className="mb-1">Comments</div>
            <textarea className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" rows={4} value={draft.notes||""} onChange={e=>setDraft({...draft, notes:e.target.value})}/>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-slate-500">ID: {draft.id}</div>
          <div className="flex gap-2">
            {initial?.id && onDelete && (
              <button className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm" onClick={()=>onDelete(draft.id)}>Delete</button>
            )}
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn" onClick={()=>onSave(draft)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
