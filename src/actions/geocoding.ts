"use server";

/**
 * Geocoding Server Action (SPEC 17장, 18장).
 *
 * Client Components (e.g. `LocationForm`) must never call Kakao/Naver
 * directly: Provider API keys (`KAKAO_MAP_API_KEY`, `NAVER_MAP_CLIENT_ID`,
 * `NAVER_MAP_CLIENT_SECRET`) are server-only secrets, and Kakao/Naver's
 * Geocoding REST APIs are meant to be called server-side. This Action is the
 * single entry point the Admin UI uses; it delegates to the Map Provider
 * Adapter in `src/lib/map/`, which is the only layer that knows about
 * Kakao/Naver request/response formats (SPEC 18장 "Location Data → Map
 * Provider Adapter → Kakao/Naver").
 *
 * This does not persist anything by itself — `LocationForm` copies the
 * returned coordinates into its `latitude`/`longitude` fields and saves them
 * through the existing `createLocation`/`updateLocation` Server Actions in
 * `src/actions/locations.ts`, so Location schema/business logic stay
 * untouched by which Map Provider is configured (per SPEC 18장 and this
 * project's "no new public REST endpoints" rule — this is a Server Action,
 * not a route handler).
 *
 * Processing order (SPEC 14장): Authentication → Input Validation →
 * Business Rule Validation (n/a here) → external call → Result.
 */
import { requireAdmin } from "@/lib/supabase/auth";
import { GeocodingError, geocodeAddress } from "@/lib/map/geocoding";
import type { ActionResult } from "@/types/common";
import { errorMessage } from "./_shared";

const ADDRESS_MAX = 300;

export interface GeocodeAddressResult {
  latitude: number;
  longitude: number;
}

export async function geocodeLocationAddress(
  address: string
): Promise<ActionResult<GeocodeAddressResult>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  const trimmed = (address ?? "").trim();
  if (!trimmed) {
    return { success: false, error: errorMessage("VALIDATION_ERROR", "주소를 입력해 주세요.") };
  }
  if (trimmed.length > ADDRESS_MAX) {
    return { success: false, error: errorMessage("VALIDATION_ERROR") };
  }

  try {
    const result = await geocodeAddress(trimmed);
    if (!result) {
      return {
        success: false,
        error: errorMessage(
          "EXTERNAL_API_ERROR",
          "입력한 주소로 좌표를 찾을 수 없습니다. 주소를 다시 확인해 주세요."
        ),
      };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("[action:geocodeLocationAddress]", error);
    const detail = error instanceof GeocodingError ? error.userMessage : undefined;
    return { success: false, error: errorMessage("EXTERNAL_API_ERROR", detail) };
  }
}
