/** FAQ validation tests (SPEC 13장): question required, answer required. */
import { describe, expect, it } from "vitest";
import { faqCreateSchema, faqUpdateSchema } from "./faq";

describe("faqCreateSchema", () => {
  it("accepts a minimal valid faq", () => {
    const result = faqCreateSchema.safeParse({ question: "질문", answer: "답변" });
    expect(result.success).toBe(true);
  });

  it("rejects a missing question", () => {
    const result = faqCreateSchema.safeParse({ answer: "답변" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty question", () => {
    const result = faqCreateSchema.safeParse({ question: "", answer: "답변" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing answer", () => {
    const result = faqCreateSchema.safeParse({ question: "질문" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty answer", () => {
    const result = faqCreateSchema.safeParse({ question: "질문", answer: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative sort_order", () => {
    const result = faqCreateSchema.safeParse({ question: "질문", answer: "답변", sort_order: -1 });
    expect(result.success).toBe(false);
  });

  it("accepts optional category_id, is_published, sort_order", () => {
    const result = faqCreateSchema.safeParse({
      question: "질문",
      answer: "답변",
      category_id: "123e4567-e89b-12d3-a456-426614174000",
      is_published: true,
      sort_order: 2,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid category_id", () => {
    const result = faqCreateSchema.safeParse({ question: "질문", answer: "답변", category_id: "bad" });
    expect(result.success).toBe(false);
  });
});

describe("faqUpdateSchema", () => {
  it("accepts an empty object (no changes)", () => {
    const result = faqUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a partial update with only is_published", () => {
    const result = faqUpdateSchema.safeParse({ is_published: false });
    expect(result.success).toBe(true);
  });
});
