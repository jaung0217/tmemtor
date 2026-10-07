/**
 * Inquiry validation tests (SPEC 13장): name required, email optional but
 * valid format when provided, title required, content required,
 * privacy_agreed must be `true`.
 */
import { describe, expect, it } from "vitest";
import { inquiryCreateSchema, inquiryStatusSchema } from "./inquiry";

const base = {
  name: "홍길동",
  title: "문의 제목",
  content: "문의 내용",
  privacy_agreed: true,
};

describe("inquiryCreateSchema", () => {
  it("accepts a minimal valid inquiry (no email/phone)", () => {
    const result = inquiryCreateSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const { name, ...rest } = base;
    const result = inquiryCreateSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = inquiryCreateSchema.safeParse({ ...base, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing title", () => {
    const { title, ...rest } = base;
    const result = inquiryCreateSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a missing content", () => {
    const { content, ...rest } = base;
    const result = inquiryCreateSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts a valid email", () => {
    const result = inquiryCreateSchema.safeParse({ ...base, email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email format", () => {
    const result = inquiryCreateSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("treats an empty-string email as not provided", () => {
    const result = inquiryCreateSchema.safeParse({ ...base, email: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBeNull();
    }
  });

  // Core SPEC 13장/4.4 rule: privacy_agreed must be `true` to register an inquiry.
  it("rejects privacy_agreed = false", () => {
    const result = inquiryCreateSchema.safeParse({ ...base, privacy_agreed: false });
    expect(result.success).toBe(false);
  });

  it("rejects a missing privacy_agreed", () => {
    const { privacy_agreed, ...rest } = base;
    const result = inquiryCreateSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a non-boolean privacy_agreed", () => {
    const result = inquiryCreateSchema.safeParse({ ...base, privacy_agreed: "true" });
    expect(result.success).toBe(false);
  });

  it("accepts privacy_agreed = true explicitly", () => {
    const result = inquiryCreateSchema.safeParse({ ...base, privacy_agreed: true });
    expect(result.success).toBe(true);
  });
});

describe("inquiryStatusSchema", () => {
  it.each(["NEW", "IN_PROGRESS", "ANSWERED", "CLOSED"])("accepts the valid status: %s", (status) => {
    const result = inquiryStatusSchema.safeParse(status);
    expect(result.success).toBe(true);
  });

  it("rejects an unknown status value", () => {
    const result = inquiryStatusSchema.safeParse("DONE");
    expect(result.success).toBe(false);
  });

  it("rejects a lowercase status value", () => {
    const result = inquiryStatusSchema.safeParse("new");
    expect(result.success).toBe(false);
  });
});
