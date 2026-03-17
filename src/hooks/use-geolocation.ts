"use client";

import { useState, useCallback } from "react";
import type { UserLocation } from "@/lib/types";

interface GeolocationState {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
  requested: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
    requested: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: "Geolocation not supported",
        requested: true,
      }));
      return;
    }

    setState((s) => ({ ...s, loading: true, requested: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
          requested: true,
        });
      },
      (err) => {
        setState({
          location: null,
          error:
            err.code === 1
              ? "Location permission denied"
              : "Could not get location",
          loading: false,
          requested: true,
        });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 }
    );
  }, []);

  return { ...state, requestLocation };
}
