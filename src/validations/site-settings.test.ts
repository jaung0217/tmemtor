/** Site settings validation tests: all fields optional, email format checked when provided. */
import { describe, expect, it } from "vitest";
import { siteSettingsUpdateSchema } from "./site-settings";

describe("siteSettingsUpdateSchema", () => {
  it("accepts an empty object (all fields optional)", () => {
    const result = siteSettingsUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a valid contact_email", () => {
    const result = siteSettingsUpdateSchema.safeParse({ contact_email: "contact@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid contact_email format", () => {
    const result = siteSettingsUpdateSchema.safeParse({ contact_email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("treats an empty-string contact_email as not provided", () => {
    const result = siteSettingsUpdateSchema.safeParse({ contact_email: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.contact_email).toBeNull();
    }
  });

  it("rejects a site_name longer than 200 characters", () => {
    const result = siteSettingsUpdateSchema.safeParse({ site_name: "가".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("accepts business_info / social_links as arbitrary JSON objects", () => {
    const result = siteSettingsUpdateSchema.safeParse({
      business_info: { registrationNumber: "123-45-67890" },
      social_links: { instagram: "https://instagram.com/example" },
    });
    expect(result.success).toBe(true);
  });
});
