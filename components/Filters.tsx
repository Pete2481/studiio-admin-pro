"use client";
import { useState } from "react";

export type Filters = { photographers: string[]; clients: string[]; status: string[]; query: string; weekends: boolean; };

export default function Filters({ onChange }: { onChange: (f: Filters) => void }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [weekends, setWeekends] = useState(true);

  function toggleStatus(s: string) {
    setStatus((prev) => {
      const next = prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s];
      onChange({ photographers: [], clients: [], status: next, query: q, weekends });
      return next;
    });
  }

  return (
    <div className="card p-3">
      <div className="text-sm font-semibold mb-2">Filters</div>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); onChange({ photographers: [], clients: [], status, query: e.target.value, weekends });}}
        placeholder="Search bookings…"
        className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm mb-3"
      />
      <div className="flex flex-wrap gap-2 mb-3">
        {["CONFIRMED","TENTATIVE","PENCILED","CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => toggleStatus(s)}
            className={`px-2 py-1 rounded-lg text-xs border ${status.includes(s) ? "bg-[var(--accent)] border-[var(--border)]" : "border-[var(--border)]"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={weekends}
          onChange={(e)=>{ setWeekends(e.target.checked); onChange({ photographers: [], clients: [], status, query: q, weekends: e.target.checked }); }}
        />
        Show weekends
      </label>
    </div>
  );
}
