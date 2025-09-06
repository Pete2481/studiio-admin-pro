export type BookingStatus = "CONFIRMED" | "TENTATIVE" | "PENCILED" | "CANCELLED";
export type AddressComponents = {
  formatted: string;
  streetNumber?: string;
  streetName?: string;
  suburb?: string; // city/locality
  state?: string;  // administrative area
  postcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
};
export type Booking = {
  id: string;
  title: string;
  client?: string[]; // Always use arrays for multiple agents
  photographer?: string[]; // Always use arrays for multiple photographers
  address?: string;
  addressComponents?: AddressComponents;
  distanceKm?: number; // distance from business to job in kilometers
  travelMinutes?: number; // estimated driving time in minutes
  notes?: string;
  start: string; // ISO
  end: string;   // ISO
  status: BookingStatus;
  rrule?: string; // optional RRULE
  color?: string;
  services?: string[]; // ids of selected services
};

export type Blockout = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  color: string;
  isBlockout: true;
};

// Union type for calendar events (bookings or blockouts)
export type CalendarEvent = Booking | Blockout;
