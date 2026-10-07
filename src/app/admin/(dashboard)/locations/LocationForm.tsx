"use client";

/**
 * Shared Create/Edit form for Locations (SPEC 16장). All 10 fields listed by
 * SPEC 16장 are present: 이름/설명/주소/상세주소/우편번호/전화번호/위도/경도/
 * 노출여부/노출순서.
 *
 * Geocoding integration (Phase 6, SPEC 17~18장): `latitude`/`longitude`
 * remain plain, manually-editable number inputs, but "주소로 좌표 자동 조회"
 * calls the `geocodeLocationAddress` Server Action (`src/actions/geocoding.ts`)
 * with the current `address` state and, on success, overwrites
 * `latitude`/`longitude` with the returned coordinates. This Client Component
 * never talks to Kakao/Naver directly — the Server Action is the only thing
 * it calls, keeping Provider API keys server-only.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLocation, updateLocation } from "@/actions/locations";
import { geocodeLocationAddress } from "@/actions/geocoding";
import type { Location } from "@/types/location";
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  checkboxClass,
  errorTextClass,
  fieldClass,
  formClass,
  inputClass,
  labelClass,
  textareaClass,
} from "../_components/ui";

export function LocationForm({ location }: { location?: Location }) {
  const router = useRouter();
  const [address, setAddress] = useState(location?.address ?? "");
  const [latitude, setLatitude] = useState(location?.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(location?.longitude?.toString() ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  async function handleGeocodeClick() {
    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      setGeocodeError("주소를 입력한 뒤 좌표를 조회해 주세요.");
      return;
    }

    setGeocodeError(null);
    setGeocoding(true);
    const result = await geocodeLocationAddress(trimmedAddress);
    setGeocoding(false);

    if (!result.success) {
      setGeocodeError(result.error);
      return;
    }

    setLatitude(result.data.latitude.toString());
    setLongitude(result.data.longitude.toString());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
    const latRaw = latitude.trim();
    const lngRaw = longitude.trim();

    const input = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? "").trim() || null,
      address,
      detail_address: String(formData.get("detail_address") ?? "").trim() || null,
      zip_code: String(formData.get("zip_code") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      latitude: latRaw ? Number(latRaw) : null,
      longitude: lngRaw ? Number(lngRaw) : null,
      sort_order: sortOrderRaw ? Number(sortOrderRaw) : 0,
      is_active: formData.get("is_active") === "on",
    };

    setPending(true);
    const result = location ? await updateLocation(location.id, input) : await createLocation(input);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/locations");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div className={fieldClass}>
        <label htmlFor="name" className={labelClass}>
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={location?.name}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="description" className={labelClass}>
          설명
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={1000}
          defaultValue={location?.description ?? ""}
          className={textareaClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="address" className={labelClass}>
          주소
        </label>
        <div className="flex gap-2">
          <input
            id="address"
            name="address"
            type="text"
            required
            maxLength={300}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={handleGeocodeClick}
            disabled={geocoding || !address.trim()}
            className="shrink-0 rounded-md border border-zinc-300 px-3 py-2 text-xs text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {geocoding ? "조회 중..." : "주소로 좌표 자동 조회"}
          </button>
        </div>
        {geocodeError && (
          <p className={errorTextClass} role="alert">
            {geocodeError}
          </p>
        )}
      </div>

      <div className={fieldClass}>
        <label htmlFor="detail_address" className={labelClass}>
          상세 주소
        </label>
        <input
          id="detail_address"
          name="detail_address"
          type="text"
          maxLength={300}
          defaultValue={location?.detail_address ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={fieldClass}>
          <label htmlFor="zip_code" className={labelClass}>
            우편번호
          </label>
          <input
            id="zip_code"
            name="zip_code"
            type="text"
            maxLength={20}
            defaultValue={location?.zip_code ?? ""}
            className={inputClass}
          />
        </div>

        <div className={fieldClass}>
          <label htmlFor="phone" className={labelClass}>
            전화번호
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            maxLength={30}
            defaultValue={location?.phone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={fieldClass}>
          <label htmlFor="latitude" className={labelClass}>
            위도
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            min={-90}
            max={90}
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className={fieldClass}>
          <label htmlFor="longitude" className={labelClass}>
            경도
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            min={-180}
            max={180}
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className={fieldClass}>
        <label htmlFor="sort_order" className={labelClass}>
          노출 순서
        </label>
        <input
          id="sort_order"
          name="sort_order"
          type="number"
          min={0}
          step={1}
          defaultValue={location?.sort_order ?? 0}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={location?.is_active ?? true}
          className={checkboxClass}
        />
        <span className={labelClass}>노출</span>
      </label>

      {error && (
        <p className={errorTextClass} role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={buttonPrimaryClass}>
          {pending ? "저장 중..." : "저장"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/locations")}
          disabled={pending}
          className={buttonSecondaryClass}
        >
          취소
        </button>
      </div>
    </form>
  );
}
