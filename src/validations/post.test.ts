/**
 * Post validation tests (SPEC 13장): title required/max 200, content required,
 * thumbnail/category_id optional.
 */
import { describe, expect, it } from "vitest";
import { postCreateSchema, postUpdateSchema } from "./post";

describe("postCreateSchema", () => {
  it("accepts a minimal valid post", () => {
    const result = postCreateSchema.safeParse({ title: "제목", content: "내용" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = postCreateSchema.safeParse({ title: "", content: "내용" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing title", () => {
    const result = postCreateSchema.safeParse({ content: "내용" });
    expect(result.success).toBe(false);
  });

  it("rejects a title longer than 200 characters", () => {
    const result = postCreateSchema.safeParse({ title: "가".repeat(201), content: "내용" });
    expect(result.success).toBe(false);
  });

  it("accepts a title exactly 200 characters long", () => {
    const result = postCreateSchema.safeParse({ title: "가".repeat(200), content: "내용" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty content", () => {
    const result = postCreateSchema.safeParse({ title: "제목", content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing content", () => {
    const result = postCreateSchema.safeParse({ title: "제목" });
    expect(result.success).toBe(false);
  });

  it("accepts an optional thumbnail and category_id", () => {
    const result = postCreateSchema.safeParse({
      title: "제목",
      content: "내용",
      thumbnail: "https://example.com/a.png",
      category_id: "123e4567-e89b-12d3-a456-426614174000",
      is_published: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a category_id that is not a valid uuid", () => {
    const result = postCreateSchema.safeParse({ title: "제목", content: "내용", category_id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("accepts a null category_id / thumbnail", () => {
    const result = postCreateSchema.safeParse({
      title: "제목",
      content: "내용",
      thumbnail: null,
      category_id: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("postUpdateSchema", () => {
  it("accepts a partial update with only is_published", () => {
    const result = postUpdateSchema.safeParse({ is_published: false });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (no changes)", () => {
    const result = postUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("still enforces max length on title when provided", () => {
    const result = postUpdateSchema.safeParse({ title: "가".repeat(201) });
    expect(result.success).toBe(false);
  });
});
