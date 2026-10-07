/**
 * Location validation tests (SPEC 13장): name required/max 100, description
 * optional/max 1000, address required/max 300, detail_address/zip_code/
 * phone/latitude/longitude optional, sort_order integer >= 0.
 */
import { describe, expect, it } from "vitest";
import { locationCreateSchema, locationUpdateSchema } from "./location";

const base = {
  name: "본점",
  address: "서울특별시 강남구 테헤란로 1",
};

describe("locationCreateSchema", () => {
  it("accepts a minimal valid location", () => {
    const result = locationCreateSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const { name, ...rest } = base;
    const result = locationCreateSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 100 characters", () => {
    const result = locationCreateSchema.safeParse({ ...base, name: "가".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects a missing address", () => {
    const { address, ...rest } = base;
    const result = locationCreateSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an address longer than 300 characters", () => {
    const result = locationCreateSchema.safeParse({ ...base, address: "가".repeat(301) });
    expect(result.success).toBe(false);
  });

  it("rejects a description longer than 1000 characters", () => {
    const result = locationCreateSchema.safeParse({ ...base, description: "가".repeat(1001) });
    expect(result.success).toBe(false);
  });

  it("accepts a description at exactly 1000 characters", () => {
    const result = locationCreateSchema.safeParse({ ...base, description: "가".repeat(1000) });
    expect(result.success).toBe(true);
  });

  it("stores a valid address (saved as-is; geocoding is Phase 6 scope)", () => {
    const result = locationCreateSchema.safeParse({ ...base, address: "부산광역시 해운대구 센텀로 99" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.address).toBe("부산광역시 해운대구 센텀로 99");
    }
  });

  it("accepts and stores valid latitude/longitude coordinates", () => {
    const result = locationCreateSchema.safeParse({ ...base, latitude: 37.5665, longitude: 126.978 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.latitude).toBe(37.5665);
      expect(result.data.longitude).toBe(126.978);
    }
  });

  it("rejects an out-of-range latitude", () => {
    const result = locationCreateSchema.safeParse({ ...base, latitude: 90.1 });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range longitude", () => {
    const result = locationCreateSchema.safeParse({ ...base, longitude: -180.1 });
    expect(result.success).toBe(false);
  });

  it("rejects a negative sort_order", () => {
    const result = locationCreateSchema.safeParse({ ...base, sort_order: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer sort_order", () => {
    const result = locationCreateSchema.safeParse({ ...base, sort_order: 1.2 });
    expect(result.success).toBe(false);
  });

  it("accepts sort_order 0 and is_active toggle (노출 여부)", () => {
    const result = locationCreateSchema.safeParse({ ...base, sort_order: 0, is_active: false });
    expect(result.success).toBe(true);
  });
});

describe("locationUpdateSchema", () => {
  it("accepts an empty object (no changes)", () => {
    const result = locationUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts updating only sort_order (순서 변경)", () => {
    const result = locationUpdateSchema.safeParse({ sort_order: 3 });
    expect(result.success).toBe(true);
  });

  it("still rejects a negative sort_order on update", () => {
    const result = locationUpdateSchema.safeParse({ sort_order: -5 });
    expect(result.success).toBe(false);
  });

  it("accepts updating only is_active (노출 여부 변경)", () => {
    const result = locationUpdateSchema.safeParse({ is_active: false });
    expect(result.success).toBe(true);
  });
});
