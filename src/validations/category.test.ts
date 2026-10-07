/**
 * Category validation tests (SPEC 13장): name required/max 100, slug
 * required/valid slug format, sort_order/is_active optional.
 */
import { describe, expect, it } from "vitest";
import { categoryCreateSchema, categoryUpdateSchema } from "./category";

describe("categoryCreateSchema", () => {
  it("accepts a minimal valid category", () => {
    const result = categoryCreateSchema.safeParse({ name: "공지사항", slug: "notice" });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = categoryCreateSchema.safeParse({ slug: "notice" });
    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 100 characters", () => {
    const result = categoryCreateSchema.safeParse({ name: "가".repeat(101), slug: "notice" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing slug", () => {
    const result = categoryCreateSchema.safeParse({ name: "공지사항" });
    expect(result.success).toBe(false);
  });

  it.each(["Notice", "notice_1", "공지사항", "-notice", "notice-", "notice--1"])(
    "rejects an invalid slug format: %s",
    (slug) => {
      const result = categoryCreateSchema.safeParse({ name: "공지사항", slug });
      expect(result.success).toBe(false);
    }
  );

  it.each(["notice", "notice-1", "my-post-1", "a1"])("accepts a valid slug format: %s", (slug) => {
    const result = categoryCreateSchema.safeParse({ name: "공지사항", slug });
    expect(result.success).toBe(true);
  });

  it("trims surrounding whitespace before validating the slug", () => {
    // z.string().trim() runs before the slug regex, so " notice " is
    // equivalent to "notice" (valid), not a validation error.
    const result = categoryCreateSchema.safeParse({ name: "공지사항", slug: " notice " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("notice");
    }
  });

  it("rejects a negative sort_order", () => {
    const result = categoryCreateSchema.safeParse({ name: "공지사항", slug: "notice", sort_order: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer sort_order", () => {
    const result = categoryCreateSchema.safeParse({ name: "공지사항", slug: "notice", sort_order: 1.5 });
    expect(result.success).toBe(false);
  });

  it("accepts sort_order 0 and is_active", () => {
    const result = categoryCreateSchema.safeParse({
      name: "공지사항",
      slug: "notice",
      sort_order: 0,
      is_active: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("categoryUpdateSchema", () => {
  it("accepts an empty object (no changes)", () => {
    const result = categoryUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("still enforces slug format when provided", () => {
    const result = categoryUpdateSchema.safeParse({ slug: "Invalid Slug" });
    expect(result.success).toBe(false);
  });
});
