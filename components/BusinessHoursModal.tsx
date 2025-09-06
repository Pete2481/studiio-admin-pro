"use client";
import { useEffect, useState } from "react";

type DayConfig = {
  enabled: boolean;
  start: string; // HH:MM
  end: string;   // HH:MM
};

export type BusinessHours = {
  sunday: DayConfig;
  monday: DayConfig;
  tuesday: DayConfig;
  wednesday: DayConfig;
  thursday: DayConfig;
  friday: DayConfig;
  saturday: DayConfig;
};

const defaultHours: BusinessHours = {
  sunday:    { enabled: false, start: "08:00", end: "18:30" },
  monday:    { enabled: true,  start: "08:00", end: "18:30" },
  tuesday:   { enabled: true,  start: "08:00", end: "18:30" },
  wednesday: { enabled: true,  start: "08:00", end: "18:30" },
  thursday:  { enabled: true,  start: "08:00", end: "18:30" },
  friday:    { enabled: true,  start: "08:00", end: "18:30" },
  saturday:  { enabled: false, start: "08:00", end: "18:30" },
};

export default function BusinessHoursModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: BusinessHours;
  onClose: () => void;
  onSave: (h: BusinessHours) => void;
}){
  const [hours, setHours] = useState<BusinessHours>(initial || defaultHours);

  useEffect(() => {
    if (!open) return;
    setHours(initial || defaultHours);
  }, [open, initial]);

  if (!open) return null;
  const DayRow = ({ keyName, label }: { keyName: keyof BusinessHours; label: string }) => {
    const cfg = hours[keyName];
    return (
      <div className="flex items-center gap-3 py-2">
        <label className="inline-flex items-center gap-2 w-28">
          <input type="checkbox" checked={cfg.enabled} onChange={(e)=>setHours({ ...hours, [keyName]: { ...cfg, enabled: e.target.checked } })}/>
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          <input type="time" value={cfg.start} onChange={(e)=>setHours({ ...hours, [keyName]: { ...cfg, start: e.target.value } })} className="rounded-lg bg-white border border-[var(--border)] px-2 py-1 text-sm"/>
          <span>-</span>
          <input type="time" value={cfg.end} onChange={(e)=>setHours({ ...hours, [keyName]: { ...cfg, end: e.target.value } })} className="rounded-lg bg-white border border-[var(--border)] px-2 py-1 text-sm"/>
        </div>
        <div className="ml-auto">
          {!cfg.enabled && <span className="text-xs px-2 py-1 rounded bg-[var(--accent-hover)]">Closed</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-2xl card p-4">
        <div className="text-lg font-semibold mb-3">Business Hours</div>
        <div className="divide-y divide-[var(--border)]">
          <DayRow keyName="sunday" label="Sunday"/>
          <DayRow keyName="monday" label="Monday"/>
          <DayRow keyName="tuesday" label="Tuesday"/>
          <DayRow keyName="wednesday" label="Wednesday"/>
          <DayRow keyName="thursday" label="Thursday"/>
          <DayRow keyName="friday" label="Friday"/>
          <DayRow keyName="saturday" label="Saturday"/>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={()=>onSave(hours)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export function loadBusinessHours(): BusinessHours {
  try {
    const raw = localStorage.getItem("studiio.businessHours.v1");
    if (raw) return { ...defaultHours, ...JSON.parse(raw) } as BusinessHours;
  } catch {}
  return defaultHours;
}

export function saveBusinessHours(h: BusinessHours) {
  localStorage.setItem("studiio.businessHours.v1", JSON.stringify(h));
}


