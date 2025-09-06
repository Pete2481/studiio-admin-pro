"use client";

import { useState, useEffect } from "react";
import { X, Clock, Calendar, Trash2 } from "lucide-react";

export interface Blockout {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  color: string;
  isBlockout: true;
}

interface BlockoutModalProps {
  open: boolean;
  initial?: Partial<Blockout>;
  onClose: () => void;
  onSave: (blockout: Blockout) => void;
  onDelete?: (id: string) => void;
}

export default function BlockoutModal({ open, initial, onClose, onSave, onDelete }: BlockoutModalProps) {
  const [title, setTitle] = useState(initial?.title || "NO AVAILABILITY");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    if (initial?.start) {
      const start = new Date(initial.start);
      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
    } else {
      const now = new Date();
      setStartDate(now.toISOString().split('T')[0]);
      setStartTime(now.toTimeString().slice(0, 5));
    }

    if (initial?.end) {
      const end = new Date(initial.end);
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0, 5));
    } else {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setEndDate(oneHourLater.toISOString().split('T')[0]);
      setEndTime(oneHourLater.toTimeString().slice(0, 5));
    }
  }, [initial]);

  const handleSave = () => {
    if (!startDate || !endDate || !startTime || !endTime) return;

    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    if (startDateTime >= endDateTime) {
      alert("End time must be after start time");
      return;
    }

    const blockout: Blockout = {
      id: initial?.id || crypto.randomUUID(),
      title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      color: "#ef4444", // red-500
      isBlockout: true,
    };

    onSave(blockout);
  };

  const handleDelete = () => {
    if (initial?.id && onDelete) {
      if (confirm("Are you sure you want to delete this blockout?")) {
        onDelete(initial.id);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} className="text-red-500" />
            Block Out Time
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blockout Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="NO AVAILABILITY"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <Clock size={16} className="text-red-500" />
            <span className="text-sm text-red-700">
              This will block out the selected time period and prevent client bookings.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {initial?.id && onDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {initial?.id ? 'Update Blockout' : 'Block Out Time'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
