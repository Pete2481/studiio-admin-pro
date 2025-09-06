"use client";
import { Plus, Upload, Download } from "lucide-react";

export default function Topbar({ 
  title = "Calendar", 
  onNew, 
  onExport, 
  showImportExport = true 
}: { 
  title?: string; 
  onNew?: () => void; 
  onExport?: () => void; 
  showImportExport?: boolean;
}) {
  return (
    <div className="sticky top-0 z-10 bg-[var(--card)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="container flex items-center justify-between h-14">
        <div className="font-semibold">{title}</div>
        {showImportExport && onNew && onExport && (
          <div className="flex items-center gap-2">
            <button onClick={onNew} className="btn"><Plus className="inline mr-1" size={16}/>New Booking</button>
            <label className="btn cursor-pointer">
              <Upload className="inline mr-1" size={16}/> Import .ics
              <input type="file" accept=".ics,text/calendar" className="hidden" id="ics-input" />
            </label>
            <button onClick={onExport} className="btn"><Download className="inline mr-1" size={16}/>Export .ics</button>
          </div>
        )}
      </div>
    </div>
  );
}
