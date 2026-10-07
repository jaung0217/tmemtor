/**
 * Naver Cloud Platform Maps — Geocoding.
 * https://api.ncloud-docs.com/docs/ai-naver-mapsgeocoding
 *
 * GET https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query={address}
 * Headers:
 *   x-ncp-apigw-api-key-id: {NAVER_MAP_CLIENT_ID}
 *   x-ncp-apigw-api-key:    {NAVER_MAP_CLIENT_SECRET}
 *
 * Both `NAVER_MAP_CLIENT_ID` and `NAVER_MAP_CLIENT_SECRET` are the Naver
 * Cloud Platform application's credentials and must stay server-only.
 */
import "server-only";
import { GeocodingError, type GeocodeResult, type GeocodingProvider } from "../types";

const NAVER_GEOCODE_URL = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";

interface NaverGeocodeResponse {
  status: string;
  addresses: Array<{
    // Naver returns coordinates as strings: x = longitude, y = latitude.
    x: string;
    y: string;
  }>;
}

export const naverGeocodingProvider: GeocodingProvider = {
  async geocode(address: string): Promise<GeocodeResult | null> {
    const clientId = process.env.NAVER_MAP_CLIENT_ID;
    const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new GeocodingError(
        "NAVER_MAP_CLIENT_ID / NAVER_MAP_CLIENT_SECRET is not set.",
        "네이버 지도 API 키가 설정되지 않았습니다. 관리자에게 문의해 주세요."
      );
    }

    const url = `${NAVER_GEOCODE_URL}?query=${encodeURIComponent(address)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          "x-ncp-apigw-api-key-id": clientId,
          "x-ncp-apigw-api-key": clientSecret,
          Accept: "application/json",
        },
        cache: "no-store",
      });
    } catch (cause) {
      throw new GeocodingError(`Naver geocoding request failed: ${String(cause)}`);
    }

    if (!response.ok) {
      throw new GeocodingError(
        `Naver geocoding API returned HTTP ${response.status}: ${await safeText(response)}`
      );
    }

    let body: NaverGeocodeResponse;
    try {
      body = (await response.json()) as NaverGeocodeResponse;
    } catch (cause) {
      throw new GeocodingError(`Naver geocoding API returned invalid JSON: ${String(cause)}`);
    }

    if (body.status !== "OK") {
      throw new GeocodingError(`Naver geocoding API returned status "${body.status}".`);
    }

    const first = body.addresses?.[0];
    if (!first) return null;

    const latitude = Number(first.y);
    const longitude = Number(first.x);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new GeocodingError("Naver geocoding API returned a non-numeric coordinate.");
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
