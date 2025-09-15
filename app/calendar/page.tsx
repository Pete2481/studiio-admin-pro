"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import BusinessHoursModal, { loadBusinessHours, saveBusinessHours, type BusinessHours } from "@/components/BusinessHoursModal";                                                                                         
import { Settings, MoreVertical, Edit, Trash2, Database, CheckCircle, AlertCircle, Ban } from "lucide-react";                                                                                                           
import Filters, { Filters as FiltersType } from "@/components/Filters";
import EventModal from "@/components/EventModal";
import BlockoutModal, { type Blockout } from "@/components/BlockoutModal";
import NotificationSystem from "@/components/NotificationSystem";
import { exportICS, importICS } from "@/lib/ics";
import { type Service } from "@/components/ServiceModal";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { Draggable } from "@fullcalendar/interaction";

// Import the existing Booking type for compatibility
import { Booking, CalendarEvent } from "@/lib/types";
import { getFavoritedServices } from "@/lib/serviceManager";

function statusColor(s: Booking["status"]) {
  switch (s) {
    case "TENTATIVE":
      return "#ef4444"; // red-500
    case "CONFIRMED":
      return "#3b82f6"; // blue-500
    case "PENCILED":
      return "#22c55e"; // green-500
    case "CANCELLED":
      return "#6b7280"; // gray-500
    default:
      return "#6b7280";
  }
}

function statusToDashboardLabel(s: Booking["status"]): "New Request" | "Confirmed" | "Completed" | "Cancelled" {                                                                                                        
  switch (s) {
    case "CONFIRMED":
      return "Confirmed";
    case "PENCILED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "TENTATIVE":
    default:
      return "New Request";
  }
}

function dashboardPillClass(label: ReturnType<typeof statusToDashboardLabel>) {
  switch (label) {
    case "New Request":
      return "bg-red-100 text-red-800";
    case "Confirmed":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function CalendarPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string || "business-media-drive"; // Default for Business Media Drive

  const [events, setEvents] = useState<Booking[]>([]);
  const [blockouts, setBlockouts] = useState<Blockout[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    photographers: [],
    clients: [],
    status: [],
    query: "",
    weekends: true,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | undefined>(undefined);
  const [blockoutModalOpen, setBlockoutModalOpen] = useState(false);
  const [editingBlockout, setEditingBlockout] = useState<Blockout | undefined>(undefined);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [hours, setHours] = useState<BusinessHours>(loadBusinessHours());
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [favoritedServices, setFavoritedServices] = useState<Service[]>([]);
  const [dbStatus, setDbStatus] = useState<"loading" | "connected" | "error">("loading");

  // Load favorited services
  useEffect(() => {
    const favorited = getFavoritedServices();
    setFavoritedServices(favorited);
  }, []);

  // Listen for service updates
  useEffect(() => {
    const handleServicesUpdate = () => {
      console.log("Calendar page: Received servicesUpdated event");
      const favorited = getFavoritedServices();
      console.log("Calendar page: Updated favorited services:", favorited);
      setFavoritedServices(favorited);
    };

    console.log("Calendar page: Setting up event listener");
    window.addEventListener("studiio:servicesUpdated", handleServicesUpdate);
    return () => {
      console.log("Calendar page: Cleaning up event listener");
      window.removeEventListener("studiio:servicesUpdated", handleServicesUpdate);
    };
  }, []);

  // Test database connection and load events
  useEffect(() => {
    // Load events from localStorage
    try {
      const savedEvents = localStorage.getItem("studiio.events.v2");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents) as Booking[];
        setEvents(parsedEvents);
        console.log(`Loaded ${parsedEvents.length} bookings from localStorage`);
      } else {
        setEvents([]);
        console.log("No saved bookings found - starting fresh");
      }

      // Load blockouts from localStorage
      const savedBlockouts = localStorage.getItem("studiio.blockouts.v1");
      if (savedBlockouts) {
        const parsedBlockouts = JSON.parse(savedBlockouts) as Blockout[];
        setBlockouts(parsedBlockouts);
        console.log(`Loaded ${parsedBlockouts.length} blockouts from localStorage`);
      } else {
        setBlockouts([]);
        console.log("No saved blockouts found - starting fresh");
      }
      
      setDbStatus("connected");
      console.log("Calendar ready - using localStorage for bookings and blockouts");
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setEvents([]);
      setBlockouts([]);
      setDbStatus("error");
    }
  }, []);

  function filtered() {
    return events
      .filter((e) => {
        if (filters.status.length && !filters.status.includes(e.status)) return false;
        const q = filters.query.toLowerCase();
        if (
          q &&
          ![
            e.title,
            Array.isArray(e.client) ? e.client.join(" ") : e.client,
            Array.isArray(e.photographer) ? e.photographer.join(" ") : e.photographer,
            e.address,
            e.notes,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
          return false;
        return true;
      })
      .map((e) => ({ ...e, color: statusColor(e.status) }));
  }

  // Calendar handlers
  function onSelect(selectInfo: any) {
    setEditing({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      id: crypto.randomUUID(),
      title: "",
      status: "CONFIRMED",
    } as Booking);
    setModalOpen(true);
  }

  function onEventDrop(changeInfo: any) {
    const { id } = changeInfo.event;
    const start = changeInfo.event.start?.toISOString() || "";
    const end = changeInfo.event.end?.toISOString() || start;
    const eventType = changeInfo.event.extendedProps?.type;
    
    if (eventType === 'blockout') {
      setBlockouts((prev) => {
        const updatedBlockouts = prev.map((b) => (b.id === id ? { ...b, start, end } : b));
        localStorage.setItem("studiio.blockouts.v1", JSON.stringify(updatedBlockouts));
        window.dispatchEvent(new Event("studiio:blockoutsUpdated"));
        return updatedBlockouts;
      });
      console.log("Blockout dropped and saved:", { id, start, end });
    } else {
      setEvents((prev) => {
        const updatedEvents = prev.map((e) => (e.id === id ? { ...e, start, end } : e));
        localStorage.setItem("studiio.events.v2", JSON.stringify(updatedEvents));
        window.dispatchEvent(new Event("studiio:eventsUpdated"));
        return updatedEvents;
      });
      console.log("Event dropped and saved:", { id, start, end });
    }
  }

  function onEventResize(changeInfo: any) {
    const { id } = changeInfo.event;
    const start = changeInfo.event.start?.toISOString() || "";
    const end = changeInfo.event.end?.toISOString() || start;
    const eventType = changeInfo.event.extendedProps?.type;
    
    if (eventType === 'blockout') {
      setBlockouts((prev) => {
        const updatedBlockouts = prev.map((b) => (b.id === id ? { ...b, start, end } : b));
        localStorage.setItem("studiio.blockouts.v1", JSON.stringify(updatedBlockouts));
        window.dispatchEvent(new Event("studiio:blockoutsUpdated"));
        return updatedBlockouts;
      });
      console.log("Blockout resized and saved:", { id, start, end });
    } else {
      setEvents((prev) => {
        const updatedEvents = prev.map((e) => (e.id === id ? { ...e, start, end } : e));
        localStorage.setItem("studiio.events.v2", JSON.stringify(updatedEvents));
        console.log("Event resized and saved:", { id, start, end });
        return updatedEvents;
      });
    }
  }

  function onEventClick(clickInfo: any) {
    const id = clickInfo.event.id;
    const eventType = clickInfo.event.extendedProps?.type;
    
    if (eventType === 'blockout') {
      const found = blockouts.find((b) => b.id === id);
      if (found) {
        setEditingBlockout(found);
        setBlockoutModalOpen(true);
      }
    } else {
      const found = events.find((e) => e.id === id);
      if (found) {
        setEditing(found);
        setModalOpen(true);
      }
    }
  }

  function saveBooking(b: Booking) {
    // Save to local state and localStorage for now
    setEvents((prev) => {
      const exists = prev.some((x) => x.id === b.id);
      const updatedEvents = exists 
        ? prev.map((x) => (x.id === b.id ? b : x))
        : [...prev, b];
      
      // Save to localStorage
      localStorage.setItem("studiio.events.v2", JSON.stringify(updatedEvents));
      window.dispatchEvent(new Event("studiio:eventsUpdated"));
      
      return updatedEvents;
    });
    
    setModalOpen(false);
    console.log("Booking saved to localStorage:", b);
  }

  function deleteBooking(id: string) {
    // Delete from local state and localStorage
    setEvents((prev) => {
      const updatedEvents = prev.filter((x) => x.id !== id);
      localStorage.setItem("studiio.events.v2", JSON.stringify(updatedEvents));
      window.dispatchEvent(new Event("studiio:eventsUpdated"));
      return updatedEvents;
    });
    
    setModalOpen(false);
    console.log("Booking deleted from localStorage:", id);
  }

  function saveBlockout(b: Blockout) {
    // Save to local state and localStorage
    setBlockouts((prev) => {
      const exists = prev.some((x) => x.id === b.id);
      const updatedBlockouts = exists 
        ? prev.map((x) => (x.id === b.id ? b : x))
        : [...prev, b];
      
      // Save to localStorage
      localStorage.setItem("studiio.blockouts.v1", JSON.stringify(updatedBlockouts));
      window.dispatchEvent(new Event("studiio:blockoutsUpdated"));
      
      return updatedBlockouts;
    });
    
    setBlockoutModalOpen(false);
    setEditingBlockout(undefined);
    console.log("Blockout saved to localStorage:", b);
  }

  function deleteBlockout(id: string) {
    // Delete from local state and localStorage
    setBlockouts((prev) => {
      const updatedBlockouts = prev.filter((x) => x.id !== id);
      localStorage.setItem("studiio.blockouts.v1", JSON.stringify(updatedBlockouts));
      window.dispatchEvent(new Event("studiio:blockoutsUpdated"));
      return updatedBlockouts;
    });
    
    setBlockoutModalOpen(false);
    setEditingBlockout(undefined);
    console.log("Blockout deleted from localStorage:", id);
  }

  function clearAllBookings(){
    try {
      setEvents([]);
      setBlockouts([]);
      localStorage.removeItem("studiio.events.v2");
      localStorage.removeItem("studiio.blockouts.v1");
      window.dispatchEvent(new Event("studiio:eventsUpdated"));
      window.dispatchEvent(new Event("studiio:blockoutsUpdated"));
      console.log("All bookings and blockouts cleared");
    } catch (e) {
      console.error("Failed to clear data", e);
    }
  }

  // Export ICS
  async function handleExportICS() {
    const blob = new Blob([exportICS(filtered())], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studiio-calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import ICS (guard possible null)
  useEffect(() => {
    const input = document.getElementById("ics-input") as HTMLInputElement | null;
    if (!input) return;

    const handler = () => {
      const file = input.files?.[0];
      if (!file) return;
      importICS(file).then((items) => {
        setEvents((prev) => [...prev, ...items]);
        input.value = "";
      });
    };

    input.addEventListener("change", handler);
    return () => input.removeEventListener("change", handler);
  }, []);

  const fcEvents = [
    ...filtered().map((e) => ({
      id: e.id,
      title: `${e.title}${e.client ? " • " + (Array.isArray(e.client) ? e.client.join(", ") : e.client) : ""}`,                                                                                                         
      start: e.start,
      end: e.end,
      backgroundColor: e.color,
      borderColor: e.color,
      extendedProps: { type: 'booking', data: e }
    })),
    ...blockouts.map((b) => ({
      id: b.id,
      title: b.title,
      start: b.start,
      end: b.end,
      backgroundColor: b.color,
      borderColor: b.color,
      textColor: '#ffffff',
      extendedProps: { type: 'blockout', data: b }
    }))
  ];

  // Setup external drag sources once mounted
  useEffect(() => {
    const container = document.getElementById("quick-tray");
    if (!container) return;
    new Draggable(container, {
      itemSelector: "[data-event]",
      eventData: (el) => {
        const title = el.getAttribute("data-title") || "Quick Booking";
        const duration = el.getAttribute("data-duration") || "01:00"; // HH:MM
        const status = (el.getAttribute("data-status") || "CONFIRMED") as Booking["status"];
        const type = el.getAttribute("data-type") || "booking";
        return {
          title,
          duration,
          extendedProps: { status, type },
        } as any;
      },
    });
  }, []);

  return (
    <>
      <PageLayout>
        {/* Database Status Banner */}
        <div className={`p-3 border-b ${dbStatus === "connected" ? "bg-green-50 border-green-200" : dbStatus === "error" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>                            
          <div className="flex items-center space-x-2">
            {dbStatus === "connected" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : dbStatus === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <Database className="h-4 w-4 text-yellow-600" />
            )}
                         <span className={`text-sm font-medium ${dbStatus === "connected" ? "text-green-800" : dbStatus === "error" ? "text-red-800" : "text-yellow-800"}`}>                                            
               {dbStatus === "connected" 
                 ? "✅ Calendar Ready - Bookings saved to localStorage (ready for real bookings)" 
                 : dbStatus === "error" 
                 ? "❌ Error loading bookings" 
                 : "⏳ Loading calendar..."}
             </span>
          </div>
        </div>

        {/* Custom toolbar matching screenshot */}
        <div className="sticky top-0 z-10 bg-[var(--card)]/95 backdrop-blur border-b border-[var(--border)]">                                                                                                           
          <div className="container flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <button
                className="btn"
                onClick={() => {
                  setEditing(undefined);
                  setModalOpen(true);
                }}
              style={{ backgroundColor: '#b7e7cc' }}
              >New Booking</button>
              <div
                className="btn bg-red-600 hover:bg-red-700 text-white cursor-grab active:cursor-grabbing"
                data-event
                data-title="NO AVAILABILITY"
                data-duration="01:00"
                data-status="BLOCKOUT"
                data-type="blockout"
                onClick={() => {
                  setEditingBlockout(undefined);
                  setBlockoutModalOpen(true);
                }}
              >
                <Ban size={16} className="inline mr-1"/> BLOCKOUT
              </div>
              <label className="btn cursor-pointer">
                Import .ics
                <input type="file" accept=".ics,text/calendar" className="hidden" id="ics-input" />
              </label>
              <button className="btn" onClick={handleExportICS}>Export .ics</button>
              <button className="btn" onClick={clearAllBookings}>Clear All</button>
            </div>
            <div className="font-semibold">Calendar</div>
            <div>
              <button className="btn" aria-label="Settings" title="Business Hours" onClick={()=>setHoursOpen(true)}>                                                                                                    
                <Settings size={16} className="inline mr-1"/> Settings
              </button>
            </div>
          </div>
        </div>

        <div className="container grid grid-cols-1 gap-4 py-4">
          {/* Quick booking tray */}
          <div className="grid grid-cols-6 gap-3" id="quick-tray">
            {favoritedServices.map((service) => {
              const durationHours = Math.floor((service.durationMinutes || 60) / 60);
              const durationMinutes = (service.durationMinutes || 60) % 60;
              const durationString = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`;                                                                                     
              
              return (
                <div
                  key={service.id}
                  data-event
                  data-title={service.name}
                  data-duration={durationString}
                  data-status="CONFIRMED"
                  data-address="Address"
                  data-agent="Agent"
                  className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm shadow-sm cursor-grab active:cursor-grabbing select-none"                                                              
                >
                  <div className="font-medium">Quick Booking</div>
                  <div className="mt-1 text-xs rounded-lg bg-[var(--accent-hover)] px-2 py-1 inline-block">
                    {service.icon} {service.name}
                  </div>
                </div>
              );
            })}
            
            {/* Blockout button */}
            <div
              data-event
              data-title="NO AVAILABILITY"
              data-duration="01:00"
              data-status="BLOCKOUT"
              data-type="blockout"
              className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm shadow-sm cursor-grab active:cursor-grabbing select-none"                                                                         
            >
              <div className="font-medium text-red-700">Blockout</div>
              <div className="mt-1 text-xs rounded-lg bg-red-100 text-red-700 px-2 py-1 inline-block">
                🚫 NO AVAILABILITY
              </div>
            </div>
          </div>

          <div className="card p-2 overflow-hidden">
            <div className="px-2 pt-2 text-xs text-slate-500">
              Timezone: Australia/Sydney • Drag to create • Drag/resize to adjust
            </div>
            <div className="p-2">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, rrulePlugin]}
                initialView="timeGridWeek"
                height="auto"
                nowIndicator={true}
                selectable={true}
                selectMirror={true}
                editable={true}
                droppable={true}
                timeZone="Australia/Sydney"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                slotMinTime={`${Math.min(...Object.values(hours).map(h=>parseInt(h.start.split(":")[0])||6))}:00:00`}                                                                                                   
                slotMaxTime={`${Math.max(...Object.values(hours).map(h=>parseInt(h.end.split(":")[0])||18))+1}:00:00`}                                                                                                  
                weekends={hours.sunday.enabled || hours.saturday.enabled}
                hiddenDays={[
                  !hours.sunday.enabled && 0,
                  !hours.monday.enabled && 1,
                  !hours.tuesday.enabled && 2,
                  !hours.wednesday.enabled && 3,
                  !hours.thursday.enabled && 4,
                  !hours.friday.enabled && 5,
                  !hours.saturday.enabled && 6,
                ].filter(day => day !== false) as number[]}
                businessHours={[
                  { daysOfWeek: [0], startTime: hours.sunday.start, endTime: hours.sunday.end },
                  { daysOfWeek: [1], startTime: hours.monday.start, endTime: hours.monday.end },
                  { daysOfWeek: [2], startTime: hours.tuesday.start, endTime: hours.tuesday.end },
                  { daysOfWeek: [3], startTime: hours.wednesday.start, endTime: hours.wednesday.end },
                  { daysOfWeek: [4], startTime: hours.thursday.start, endTime: hours.thursday.end },
                  { daysOfWeek: [5], startTime: hours.friday.start, endTime: hours.friday.end },
                  { daysOfWeek: [6], startTime: hours.saturday.start, endTime: hours.saturday.end },
                ].filter((_, idx) => Object.values(hours)[idx].enabled)}
                events={fcEvents}
                select={onSelect}
                eventReceive={(info: any) => {
                  // Dropped from external tray
                  const start = info.event.start as Date;
                  const end = info.event.end as Date | null;
                  const durationMs = end ? end.getTime() - start.getTime() : 60 * 60 * 1000;
                  const eventType = info.event.extendedProps?.type || info.event.extendedProps?.dataType;
                  
                  if (eventType === 'blockout') {
                    // Handle blockout drop
                    const blockout: Blockout = {
                      id: crypto.randomUUID(),
                      title: "NO AVAILABILITY",
                      start: start.toISOString(),
                      end: new Date(start.getTime() + durationMs).toISOString(),
                      color: "#ef4444", // red-500
                      isBlockout: true,
                    };
                    // Remove temp event
                    info.event.remove();
                    setEditingBlockout(blockout);
                    setBlockoutModalOpen(true);
                  } else {
                    // Handle booking drop
                    const quickTitle = info.event.title || "Quick Booking";
                    const status = (info.event.extendedProps?.status as Booking["status"]) || "CONFIRMED";
                    const booking: Booking = {
                      id: crypto.randomUUID(),
                      title: quickTitle,
                      start: start.toISOString(),
                      end: new Date(start.getTime() + durationMs).toISOString(),
                      status,
                    } as Booking;
                    // Remove temp event
                    info.event.remove();
                    setEditing(booking);
                    setModalOpen(true);
                  }
                }}
                eventDrop={onEventDrop}
                eventResize={onEventResize}
                eventClick={onEventClick}
              />
            </div>
          </div>

          {/* Recent Bookings - Dashboard-matched table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Booking Date</th>                                                                                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Time</th>                                                                                            
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Client</th>                                                                                          
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Address</th>                                                                                         
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Comment</th>                                                                                         
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Services</th>                                                                                        
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Photographer</th>                                                                                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Status</th>                                                                                          
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Action</th>                                                                                          
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events
                    .slice()
                    .sort((a,b)=> new Date(b.start).getTime()-new Date(a.start).getTime())
                    .slice(0,25)
                    .map((booking, index) => {
                      const s = new Date(booking.start);
                      const e = new Date(booking.end);
                      const dateStr = s.toLocaleDateString('en-AU');
                      const timeStr = `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;                                      
                      const label = statusToDashboardLabel(booking.status);
                      const pill = dashboardPillClass(label);
                      return (
                        <tr key={booking.id} className={index % 2 === 0 ? 'bg-white' : 'bg-teal-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dateStr}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timeStr}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs"><div className="truncate">{Array.isArray(booking.client) ? booking.client.join(', ') : (booking.client || '-') }</div></td>          
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs"><div className="truncate">{booking.address || '-'}</div></td>                                                                        
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs"><div className="truncate">{booking.notes || ''}</div></td>                                                                           
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs"><div className="truncate">{Array.isArray(booking.services) ? booking.services.join(', ') : '-'}</div></td>                           
                          <td className="px-6 py-4 text-sm text-gray-900">{Array.isArray(booking.photographer) ? booking.photographer.join(', ') : '-'}</td>                                                            
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${pill}`}>{label}</span>                                                                                         
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setEditing(booking); setModalOpen(true); }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"                                                                                     
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => deleteBooking(booking.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"                                                                                       
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageLayout>

      <EventModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={saveBooking}
        onDelete={deleteBooking}
      />

      <BlockoutModal
        open={blockoutModalOpen}
        initial={editingBlockout}
        onClose={() => {
          setBlockoutModalOpen(false);
          setEditingBlockout(undefined);
        }}
        onSave={saveBlockout}
        onDelete={deleteBlockout}
      />

      <BusinessHoursModal
        open={hoursOpen}
        initial={hours}
        onClose={()=>setHoursOpen(false)}
        onSave={(h)=>{ setHours(h); saveBusinessHours(h); setHoursOpen(false); }}
      />

      {/* Notification System */}
      <NotificationSystem showTestButton={true} />
    </>
  );
}

