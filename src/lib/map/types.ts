/**
 * Map Provider Adapter contract (SPEC 18장 "Map Provider 추상화").
 *
 *   Location Data → Map Provider Adapter → Kakao / Naver
 *
 * Nothing outside `src/lib/map/` (and the thin `src/actions/geocoding.ts`
 * Server Action that calls it) should know whether Kakao or Naver is in use,
 * what their request/response shapes look like, or which env vars they read.
 * Swapping `MAP_PROVIDER` must never require changes to the `locations`
 * schema (`src/types/location.ts`) or to Server Actions in
 * `src/actions/locations.ts`.
 */
import "server-only";

export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

export interface GeocodingProvider {
  /**
   * Resolves an address to coordinates.
   *
   * Returns `null` when the Provider successfully answered but found no
   * matching address (not an error — the caller should tell the admin the
   * address could not be found). Throws `GeocodingError` for anything else
   * that prevents getting an answer (missing API key, network failure,
   * unexpected HTTP status/response shape).
   */
  geocode(address: string): Promise<GeocodeResult | null>;
}

/**
 * Raised by a `GeocodingProvider` implementation. `userMessage`, when set, is
 * safe to show to an admin as-is (e.g. "API key not configured"); callers
 * should fall back to the generic `EXTERNAL_API_ERROR` message otherwise —
 * never surface `message` (which may include raw provider/HTTP details)
 * directly to the client.
 */
export class GeocodingError extends Error {
  readonly userMessage?: string;

  constructor(message: string, userMessage?: string) {
    super(message);
    this.name = "GeocodingError";
    this.userMessage = userMessage;
  }
}
