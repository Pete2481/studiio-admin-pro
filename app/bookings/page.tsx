"use client";
import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Edit, Trash2 } from "lucide-react";
import { Booking as BookingModel } from "@/lib/types";
import { useAllAgents } from "@/src/client/api/agents";

type Row = {
  id: string;
  bookingDate: string;
  bookingTime: string;
  agent: string;
  address: string;
  comment: string;
  services: string;
  photographer: string;
  status: "New Request" | "Confirmed" | "Completed" | "Cancelled";
};

const fallbackPhotographers = [
  { id: "photo-1", name: "Will Phillips" },
  { id: "photo-2", name: "Sarah Johnson" },
  { id: "photo-3", name: "Mike Davis" },
  { id: "photo-4", name: "Lisa Wilson" },
  { id: "photo-5", name: "Alex Chen" },
  { id: "photo-6", name: "Emma Rodriguez" }
];

export default function BookingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<BookingModel[]>([]);
  const { agents, fetch } = useAllAgents();
  useEffect(()=>{ fetch("studiio-pro", { isActive: true }); }, [fetch]);
  useEffect(()=>{
    const ensure=()=>{
      try{
        const raw = localStorage.getItem("studiio.events.v2");
        setEvents(raw ? (JSON.parse(raw) as BookingModel[]) : []);
      }catch{ setEvents([]); }
    };
    ensure();
    const onUpdate = () => ensure();
    window.addEventListener("storage", onUpdate);
    window.addEventListener("studiio:eventsUpdated", onUpdate as any);
    return ()=>{
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("studiio:eventsUpdated", onUpdate as any);
    };
  },[]);
  const itemsPerPage = 25;

  const agentIdToName = useMemo(()=>{
    const m: Record<string,string> = {};
    for (const a of agents) m[a.id] = a.name;
    return m;
  },[agents]);

  const photographerIdToName = useMemo(()=>{
    try{
      const raw = localStorage.getItem("studiio.photographers.v1");
      const list: {id:string; name:string}[] = raw ? JSON.parse(raw) : fallbackPhotographers;
      const m: Record<string,string> = {};
      for (const p of list) m[p.id] = p.name;
      return m;
    }catch{
      const m: Record<string,string> = {};
      for (const p of fallbackPhotographers) m[p.id] = p.name;
      return m;
    }
  },[]);

  const serviceIdToName = useMemo(()=>{
    try{
      const raw = localStorage.getItem("studiio.services.v1");
      const list: {id:string; name:string}[] = raw ? JSON.parse(raw) : [];
      const m: Record<string,string> = {};
      for (const s of list) m[s.id] = s.name;
      return m;
    }catch{ return {}; }
  },[]);

  const rows = useMemo(()=>{
    return events.slice().sort((a,b)=> new Date(b.start).getTime()-new Date(a.start).getTime()).map(e=>{
      const s = new Date(e.start); const eend = new Date(e.end);
      const agentNames = Array.isArray(e.client) ? e.client.map(id=>agentIdToName[id]||id).join(", ") : (e.client as any)||"-";
      const photoNames = Array.isArray(e.photographer) ? e.photographer.map(id=>photographerIdToName[id]||id).join(", ") : "-";
      const serviceNames = Array.isArray(e.services) ? e.services.map(id=>serviceIdToName[id]||id).join(", ") : "";
      return {
        id: e.id,
        bookingDate: s.toLocaleDateString("en-AU"),
        bookingTime: `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${eend.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        agent: agentNames,
        address: e.address || "-",
        comment: e.notes || "",
        services: serviceNames,
        photographer: photoNames,
        status: (e.status === "CONFIRMED" ? "Confirmed" : e.status === "TENTATIVE" ? "New Request" : e.status === "CANCELLED" ? "Cancelled" : "Completed") as Row['status']
      } as Row;
    });
  },[events, agentIdToName, photographerIdToName, serviceIdToName]);

  const getStatusColor = (status: any) => {
    switch (status) {
      case "New Request":
        return "bg-red-100 text-red-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditBooking = (bookingId: string) => {
    console.log("Edit booking:", bookingId);
  };

  const handleDeleteBooking = (bookingId: string) => {
    console.log("Delete booking:", bookingId);
  };

  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = rows.slice(startIndex, endIndex);

  return (
    <PageLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bookings</h1>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Photographer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.map((booking, index) => (
                  <tr key={booking.id} className={index % 2 === 0 ? 'bg-white' : 'bg-teal-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.bookingDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.bookingTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{booking.agent}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{booking.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{booking.comment}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{booking.services}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900"><div className="truncate">{booking.photographer}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBooking(booking.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">Showing {startIndex + 1} to {Math.min(endIndex, rows.length)} of {rows.length} results</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
