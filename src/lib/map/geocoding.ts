/**
 * Geocoding entry point (SPEC 17장):
 *
 *   address → Geocoding Provider → latitude/longitude → locations 저장
 *
 * This module is the only place that picks a concrete `GeocodingProvider`
 * (SPEC 18장 Map Provider Adapter). Callers (currently only
 * `src/actions/geocoding.ts`) depend solely on `geocodeAddress` /
 * `GeocodeResult` / `GeocodingError` — switching `MAP_PROVIDER` from "kakao"
 * to "naver" (or adding a third Provider later) never requires touching the
 * `locations` schema or any Business Logic outside this folder.
 */
import "server-only";
import { kakaoGeocodingProvider } from "./providers/kakao";
import { naverGeocodingProvider } from "./providers/naver";
import { GeocodingError, type GeocodeResult, type GeocodingProvider } from "./types";

export type MapProviderName = "kakao" | "naver";

const DEFAULT_PROVIDER: MapProviderName = "kakao";

function resolveProviderName(): MapProviderName {
  const raw = (process.env.MAP_PROVIDER ?? DEFAULT_PROVIDER).trim().toLowerCase();
  if (raw === "kakao" || raw === "naver") return raw;

  throw new GeocodingError(
    `Unknown MAP_PROVIDER "${raw}". Expected "kakao" or "naver".`,
    "지도 서비스 설정이 올바르지 않습니다. 관리자에게 문의해 주세요."
  );
}

function getProvider(): GeocodingProvider {
  const name = resolveProviderName();
  switch (name) {
    case "kakao":
      return kakaoGeocodingProvider;
    case "naver":
      return naverGeocodingProvider;
  }
}

/**
 * Resolves `address` to coordinates using whichever Provider `MAP_PROVIDER`
 * selects. Returns `null` when no match was found; throws `GeocodingError`
 * when the Provider could not be reached/configured correctly.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const provider = getProvider();
  return provider.geocode(address);
}

export { GeocodingError };
export type { GeocodeResult, GeocodingProvider };
