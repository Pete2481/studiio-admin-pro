import ICAL from "ical.js";
import { Booking } from "./types";

export function exportICS(bookings: Booking[]): string {
  const comp = new ICAL.Component(['vcalendar', [], []]);
  comp.updatePropertyWithValue('prodid', '-//Studiio Admin//Calendar//EN');
  comp.updatePropertyWithValue('version', '2.0');
  bookings.forEach((b) => {
    const vevent = new ICAL.Component('vevent');
    const event = new ICAL.Event(vevent);
    event.summary = b.title;
    event.description = [b.client, b.photographer, b.address, b.notes].filter(Boolean).join(" | ");
    event.startDate = ICAL.Time.fromJSDate(new Date(b.start), true);
    event.endDate = ICAL.Time.fromJSDate(new Date(b.end), true);
    vevent.addPropertyWithValue('uid', b.id + '@studiio');
    if (b.rrule) {
      vevent.addPropertyWithValue('rrule', b.rrule);
    }
    comp.addSubcomponent(vevent);
  });
  return comp.toString();
}

export async function importICS(file: File): Promise<Booking[]> {
  const text = await file.text();
  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);
  const events = comp.getAllSubcomponents('vevent');
  return events.map((ve) => {
    const ev = new ICAL.Event(ve);
    const rruleProp = ve.getFirstPropertyValue('rrule') as unknown;
    const rruleString = rruleProp
      ? (typeof rruleProp === 'string'
          ? rruleProp
          : (rruleProp as { toString?: () => string }).toString?.())
      : undefined;
    return {
      id: ev.uid || crypto.randomUUID(),
      title: ev.summary || "Imported Event",
      client: undefined,
      photographer: undefined,
      address: undefined,
      notes: ev.description || undefined,
      start: ev.startDate.toJSDate().toISOString(),
      end: ev.endDate.toJSDate().toISOString(),
      status: "CONFIRMED",
      rrule: rruleString,
    };
  });
}
