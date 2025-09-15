"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import { useClientAdmin } from "@/components/ClientAdminProvider";
import ClientPageLayout from "@/components/ClientPageLayout";
import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";
import BusinessHoursModal, { loadBusinessHours, saveBusinessHours, type BusinessHours } from "@/components/BusinessHoursModal";
import { Settings, MoreVertical, Edit, Trash2, Database, CheckCircle, AlertCircle, Ban, X } from "lucide-react";
import Filters, { Filters as FiltersType } from "@/components/Filters";
import ClientBookingModal from "@/components/ClientBookingModal";
import BlockoutModal, { type Blockout } from "@/components/BlockoutModal";
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

// Import database hooks
import { useBookings } from "@/src/client/api/bookings";
import { useBlockouts } from "@/src/client/api/blockouts";

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

export default function ClientAdminBookingsPage() {
  const { data: session } = useSession();
  const { currentTenant } = useTenant();
  const { currentClient } = useClientAdmin();
  
  // Get tenant ID and user ID for database operations
  const tenantId = currentTenant?.id || "cmfkr33ls000113jn88rtdaih"; // fallback to business-media-drive
  const userId = session?.user?.id || "default-user-id"; // fallback for testing
  
  // Use database hooks instead of localStorage
  const { 
    bookings: dbBookings, 
    loading: bookingsLoading, 
    error: bookingsError,
    addBooking,
    updateBooking,
    deleteBooking,
    clearAll: clearAllBookings
  } = useBookings(tenantId);
  
  const { 
    blockouts: dbBlockouts, 
    loading: blockoutsLoading, 
    error: blockoutsError,
    addBlockout,
    updateBlockout,
    deleteBlockout,
    clearAll: clearAllBlockouts
  } = useBlockouts(tenantId);
  
  // Convert database bookings to legacy format for compatibility
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

  // Convert database bookings to legacy format for compatibility
  useEffect(() => {
    if (!bookingsLoading && !blockoutsLoading) {
      // Convert database bookings to legacy format
      const legacyBookings: Booking[] = dbBookings.map(booking => ({
        id: booking.id,
        title: booking.title,
        start: booking.start.toISOString(),
        end: booking.end.toISOString(),
        status: booking.status as any,
        client: booking.client ? [booking.client.name] : [],
        photographer: booking.photographer ? [booking.photographer.name] : [],
        address: booking.address || "",
        notes: booking.notes || "",
        services: booking.services ? JSON.parse(booking.services) : [],
      }));
      
      // Convert database blockouts to legacy format
      const legacyBlockouts: Blockout[] = dbBlockouts.map(blockout => ({
        id: blockout.id,
        title: blockout.title,
        start: blockout.start.toISOString(),
        end: blockout.end.toISOString(),
        type: blockout.type,
        notes: blockout.notes || "",
        isAllDay: blockout.isAllDay,
        color: "#ff6b6b", // Default blockout color
        isBlockout: true,
      }));
      
      setEvents(legacyBookings);
      setBlockouts(legacyBlockouts);
      
      // Update status
      if (bookingsError || blockoutsError) {
        setDbStatus("error");
      } else {
        setDbStatus("connected");
      }
    }
  }, [dbBookings, dbBlockouts, bookingsLoading, blockoutsLoading, bookingsError, blockoutsError]);

  // Load favorited services
  useEffect(() => {
    const favorited = getFavoritedServices();
    setFavoritedServices(favorited);
  }, []);

  // Listen for service updates
  useEffect(() => {
    const handleServicesUpdate = () => {
      console.log("Client Admin Bookings: Received servicesUpdated event");
      const favorited = getFavoritedServices();
      console.log("Client Admin Bookings: Updated favorited services:", favorited);
      setFavoritedServices(favorited);
    };
    
    console.log("Client Admin Bookings: Setting up event listener");
    window.addEventListener("studiio:servicesUpdated", handleServicesUpdate);
    return () => {
      console.log("Client Admin Bookings: Cleaning up event listener");
      window.removeEventListener("studiio:servicesUpdated", handleServicesUpdate);
    };
  }, []);

  // Database loading is now handled by the useBookings and useBlockouts hooks

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
      status: "TENTATIVE", // Client admin creates tentative bookings by default
    } as Booking);
    setModalOpen(true);
  }

  async function onEventDrop(changeInfo: any) {
    const { id } = changeInfo.event;
    const start = changeInfo.event.start?.toISOString() || "";
    const end = changeInfo.event.end?.toISOString() || start;
    const eventType = changeInfo.event.extendedProps?.type;
    
    if (eventType === 'blockout') {
      // Update blockout in database
      const blockout = blockouts.find((b) => b.id === id);
      if (blockout) {
        await updateBlockout(id, {
          start: new Date(start),
          end: new Date(end),
        });
      }
      console.log("Client Admin: Blockout dropped and saved to database:", { id, start, end });
    } else {
      // Update booking in database
      const booking = events.find((e) => e.id === id);
      if (booking) {
        await updateBooking(id, {
          start: new Date(start),
          end: new Date(end),
        });
      }
      console.log("Client Admin: Event dropped and saved to database:", { id, start, end });
    }
  }

  async function onEventResize(changeInfo: any) {
    const { id } = changeInfo.event;
    const start = changeInfo.event.start?.toISOString() || "";
    const end = changeInfo.event.end?.toISOString() || start;
    const eventType = changeInfo.event.extendedProps?.type;
    
    if (eventType === 'blockout') {
      // Update blockout in database
      const blockout = blockouts.find((b) => b.id === id);
      if (blockout) {
        await updateBlockout(id, {
          start: new Date(start),
          end: new Date(end),
        });
      }
      console.log("Client Admin: Blockout resized and saved to database:", { id, start, end });
    } else {
      // Update booking in database
      const booking = events.find((e) => e.id === id);
      if (booking) {
        await updateBooking(id, {
          start: new Date(start),
          end: new Date(end),
        });
      }
      console.log("Client Admin: Event resized and saved to database:", { id, start, end });
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

  async function saveBooking(b: Booking) {
    console.log("💾 Client Admin: Saving booking to database:", b.title || 'Untitled');
    
    try {
      // Convert legacy booking format to database format
      const bookingData = {
        title: b.title,
        start: new Date(b.start),
        end: new Date(b.end),
        status: b.status,
        clientId: currentClient?.id,
        agentId: undefined, // Will be set by business admin
        photographerId: undefined, // Will be set by business admin
        address: b.address,
        notes: b.notes,
        durationM: 60, // Default duration
        services: b.services ? JSON.stringify(b.services) : undefined,
        tenantId: tenantId,
        createdBy: userId,
      };

      if (b.id && events.some((x) => x.id === b.id)) {
        // Update existing booking
        const result = await updateBooking(b.id, bookingData);
        if (!result.success) {
          console.error("Failed to update booking:", result.error);
          return;
        }
      } else {
        // Create new booking
        const result = await addBooking(bookingData);
        if (!result.success) {
          console.error("Failed to create booking:", result.error);
          return;
        }
      }
      
      setModalOpen(false);
      console.log("✅ Client Admin: Booking save complete");
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  }

  async function deleteBookingById(id: string) {
    try {
      const result = await deleteBooking(id);
      if (!result.success) {
        console.error("Failed to delete booking:", result.error);
        return;
      }
      
      setModalOpen(false);
      console.log("Client Admin: Booking deleted from database:", id);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  }


  async function saveBlockout(b: Blockout) {
    console.log("💾 Client Admin: Saving blockout to database:", b.title || 'Untitled');
    
    try {
      // Convert legacy blockout format to database format
      const blockoutData = {
        title: b.title,
        start: new Date(b.start),
        end: new Date(b.end),
        notes: "",
        isAllDay: false,
        tenantId: tenantId,
        createdBy: userId,
      };

      if (b.id && blockouts.some((x) => x.id === b.id)) {
        // Update existing blockout
        const result = await updateBlockout(b.id, blockoutData);
        if (!result.success) {
          console.error("Failed to update blockout:", result.error);
          return;
        }
      } else {
        // Create new blockout
        const result = await addBlockout(blockoutData);
        if (!result.success) {
          console.error("Failed to create blockout:", result.error);
          return;
        }
      }
      
      setBlockoutModalOpen(false);
      setEditingBlockout(undefined);
      console.log("✅ Client Admin: Blockout save complete");
    } catch (error) {
      console.error("Error saving blockout:", error);
    }
  }

  async function deleteBlockoutById(id: string) {
    try {
      const result = await deleteBlockout(id);
      if (!result.success) {
        console.error("Failed to delete blockout:", result.error);
        return;
      }
      
      setBlockoutModalOpen(false);
      setEditingBlockout(undefined);
      console.log("Client Admin: Blockout deleted from database:", id);
    } catch (error) {
      console.error("Error deleting blockout:", error);
    }
  }

  async function clearAllBookingsData(){
    try {
      const bookingResult = await clearAllBookings();
      const blockoutResult = await clearAllBlockouts();
      
      if (!bookingResult.success) {
        console.error("Failed to clear bookings:", bookingResult.error);
      }
      if (!blockoutResult.success) {
        console.error("Failed to clear blockouts:", blockoutResult.error);
      }
      
      console.log("🧹 Client Admin: All bookings and blockouts cleared from database");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }

  // Export ICS
  async function handleExportICS() {
    const blob = new Blob([exportICS(filtered())], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studiio-calendar-client.ics";
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
        const status = (el.getAttribute("data-status") || "TENTATIVE") as Booking["status"]; // Client admin creates tentative by default
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
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      <Topbar 
        title="Client Admin Bookings"
        showImportExport={false}
        showAdminToggle={false}
      />
      
      <ClientPageLayout>
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
                 ? "✅ Client Admin Bookings Ready - Connected to database" 
                  : dbStatus === "error" 
                 ? "❌ Error loading bookings from database" 
                 : "⏳ Loading calendar from database..."}
              </span>
            </div>
            </div>

        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Client Admin Bookings</h1>
          </div>
        </div>

        <div className="px-6 py-4">
          {/* Quick booking tray - exact business admin design */}
          <div className="flex gap-4 mb-6" id="quick-tray">
            {favoritedServices.slice(0, 6).map((service) => {
              const durationHours = Math.floor((service.durationMinutes || 60) / 60);
              const durationMinutes = (service.durationMinutes || 60) % 60;
              const durationString = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`;
              
              return (
                <div
                  key={service.id}
                  data-event
                  data-title={service.name}
                  data-duration={durationString}
                  data-status="TENTATIVE"
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
        </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Timezone: Australia/Sydney • Drag to create • Drag/resize to adjust
                  </div>
            </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: '#b7e7cc' }}
                      onClick={() => {
                        setEditing(undefined);
                        setModalOpen(true);
                      }}
                    >
                      New Booking Request
                    </button>
                    <button
                      className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                      style={{ backgroundColor: '#dc2626' }}
                      onClick={clearAllBookingsData}
                      title="Clear all bookings and blockouts"
                    >
                      <X size={16} />
                      Clear All
                    </button>
                  </div>
              <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setHoursOpen(true)}
                    title="Settings"
              >
                    <Settings size={20} />
              </button>
                </div>
            </div>
          </div>

            {/* Calendar */}
            <div className="p-4">
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
                    // Handle booking drop - Client admin creates tentative bookings
                    const quickTitle = info.event.title || "Booking Request";
                    const status = "TENTATIVE" as Booking["status"];
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
        </div>

        {/* Recent Bookings Section */}
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Booking Requests</h2>
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
                                onClick={() => deleteBookingById(booking.id)}
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
      </ClientPageLayout>

      <ClientBookingModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={saveBooking}
        onDelete={deleteBookingById}
      />

      <BlockoutModal
        open={blockoutModalOpen}
        initial={editingBlockout}
        onClose={() => {
          setBlockoutModalOpen(false);
          setEditingBlockout(undefined);
        }}
        onSave={saveBlockout}
        onDelete={deleteBlockoutById}
      />

      <BusinessHoursModal
        open={hoursOpen}
        initial={hours}
        onClose={()=>setHoursOpen(false)}
        onSave={(h)=>{ setHours(h); saveBusinessHours(h); setHoursOpen(false); }}
      />
    </div>
  );
}
