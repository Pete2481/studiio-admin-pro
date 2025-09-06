"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AddressComponents } from "@/lib/types";

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSelect?: (data: AddressComponents) => void;
  placeholder?: string;
  className?: string;
  showMap?: boolean;
  initialLocation?: { lat: number; lng: number };
  autoGeocodeWhileTyping?: boolean;
};

// Lazy load Google Maps JS API (Places)
function useGoogle(apiKey?: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).google?.maps?.places) {
      setReady(true);
      return;
    }
    const key = apiKey || (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);
    if (!key) return;
    const existing = document.getElementById("google-maps-script");
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.id = "google-maps-script";
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    s.addEventListener("load", () => setReady(true), { once: true });
    s.addEventListener("error", () => setReady(false), { once: true });
    document.body.appendChild(s);
  }, [apiKey]);

  return ready;
}

function parsePlace(place: any): AddressComponents {
  const components: Record<string, string | undefined> = {};
  for (const c of place.address_components || []) {
    if (c.types.includes("street_number")) components.streetNumber = c.long_name;
    if (c.types.includes("route")) components.streetName = c.long_name;
    if (c.types.includes("locality")) components.suburb = c.long_name;
    if (c.types.includes("administrative_area_level_1")) components.state = c.short_name || c.long_name;
    if (c.types.includes("postal_code")) components.postcode = c.long_name;
    if (c.types.includes("country")) components.country = c.long_name;
  }
  const loc = place.geometry?.location;
  return {
    formatted: place.formatted_address || "",
    streetNumber: components.streetNumber,
    streetName: components.streetName,
    suburb: components.suburb,
    state: components.state,
    postcode: components.postcode,
    country: components.country,
    lat: loc ? loc.lat() : undefined,
    lng: loc ? loc.lng() : undefined,
  };
}

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder, className, showMap, initialLocation, autoGeocodeWhileTyping = true }: Props) {
  const ready = useGoogle();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const [map, setMap] = useState<any>(null);

  const ensureMap = useCallback((location: any) => {
    if (!showMap || !mapRef.current) return;
    const loc = location;
    if (!map) {
      const m = new (window as any).google.maps.Map(mapRef.current!, {
        center: loc,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      setMap(m);
      markerRef.current = new (window as any).google.maps.Marker({ position: loc, map: m });
    } else {
      map.setCenter(loc);
      if (!markerRef.current) {
        markerRef.current = new (window as any).google.maps.Marker({ position: loc, map });
      } else {
        markerRef.current.setPosition(loc);
      }
    }
  }, [map, showMap]);

  useEffect(() => {
    if (!ready || !inputRef.current) return;
    const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current!, {
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["geocode"],
    });
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const parsed = parsePlace(place);
      onChange(parsed.formatted);
      onSelect?.(parsed);
      const location = place.geometry?.location;
      if (location) ensureMap(location);
    });

    return () => listener.remove();
  }, [ready, onChange, onSelect, map, showMap]);

  // Initialize map from saved lat/lng
  useEffect(() => {
    if (!ready || !initialLocation) return;
    ensureMap(initialLocation);
  }, [ready, initialLocation, ensureMap]);

  // Geocode free-typed value on blur or Enter
  const geocodeIfNeeded = useCallback(() => {
    if (!ready || !value || value.trim().length < 4) return;
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: value }, (results: any, status: any) => {
      if (status === "OK" && results && results[0]) {
        const r = results[0];
        const loc = r.geometry.location;
        const parsed = parsePlace(r as any);
        onChange(parsed.formatted || value);
        onSelect?.(parsed);
        if (loc) ensureMap(loc);
      }
    });
  }, [ready, value, onChange, onSelect, ensureMap]);

  const useMyLocation = useCallback(() => {
    if (!ready || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      ensureMap(loc);
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ location: loc }, (results: any, status: any) => {
        if (status === "OK" && results && results[0]) {
          const r = results[0];
          const parsed = parsePlace(r as any);
          onChange(parsed.formatted || value);
          onSelect?.(parsed);
        }
      });
    });
  }, [ready, ensureMap, onChange, onSelect, value]);

  // Debounced geocode while typing to ensure map shows even if user doesn't pick suggestion
  useEffect(() => {
    if (!autoGeocodeWhileTyping) return;
    if (!value || value.trim().length < 4) return;
    const t = setTimeout(() => geocodeIfNeeded(), 900);
    return () => clearTimeout(t);
  }, [value, autoGeocodeWhileTyping, geocodeIfNeeded]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          className={className || "w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm pr-10"}
          placeholder={placeholder || "Start typing an address"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={geocodeIfNeeded}
          onKeyDown={(e)=>{ if (e.key === "Enter") { e.preventDefault(); geocodeIfNeeded(); } }}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          title="Use my location"
          onClick={useMyLocation}
        >📍</button>
      </div>
      {!ready && (
        <div className="text-xs text-gray-500">Loading Google Maps… ensure API key is set.</div>
      )}
      {showMap && ready && (
        <div ref={mapRef} className="w-full h-56 rounded border border-[var(--border)]" />
      )}
    </div>
  );
}


