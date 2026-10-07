/**
 * Kakao Local API — address search (Geocoding).
 * https://developers.kakao.com/docs/latest/en/local/dev-guide#address-coord
 *
 * GET https://dapi.kakao.com/v2/local/search/address.json?query={address}
 * Header: Authorization: KakaoAK {REST API key}
 *
 * `KAKAO_MAP_API_KEY` is the Kakao Developers "REST API key" for the app —
 * it must stay server-only (never `NEXT_PUBLIC_`), since this endpoint is
 * called from the server, not the browser.
 */
import "server-only";
import { GeocodingError, type GeocodeResult, type GeocodingProvider } from "../types";

const KAKAO_GEOCODE_URL = "https://dapi.kakao.com/v2/local/search/address.json";

interface KakaoAddressSearchResponse {
  documents: Array<{
    // Kakao returns coordinates as strings: x = longitude, y = latitude.
    x: string;
    y: string;
  }>;
  meta: { total_count: number };
}

export const kakaoGeocodingProvider: GeocodingProvider = {
  async geocode(address: string): Promise<GeocodeResult | null> {
    const apiKey = process.env.KAKAO_MAP_API_KEY;
    if (!apiKey) {
      throw new GeocodingError(
        "KAKAO_MAP_API_KEY is not set.",
        "카카오 지도 API 키가 설정되지 않았습니다. 관리자에게 문의해 주세요."
      );
    }

    const url = `${KAKAO_GEOCODE_URL}?query=${encodeURIComponent(address)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Authorization: `KakaoAK ${apiKey}` },
        cache: "no-store",
      });
    } catch (cause) {
      throw new GeocodingError(`Kakao geocoding request failed: ${String(cause)}`);
    }

    if (!response.ok) {
      throw new GeocodingError(
        `Kakao geocoding API returned HTTP ${response.status}: ${await safeText(response)}`
      );
    }

    let body: KakaoAddressSearchResponse;
    try {
      body = (await response.json()) as KakaoAddressSearchResponse;
    } catch (cause) {
      throw new GeocodingError(`Kakao geocoding API returned invalid JSON: ${String(cause)}`);
    }

    const first = body.documents?.[0];
    if (!first) return null;

    const latitude = Number(first.y);
    const longitude = Number(first.x);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new GeocodingError("Kakao geocoding API returned a non-numeric coordinate.");
    }

    return { latitude, longitude };
  },
};

async function safeText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
