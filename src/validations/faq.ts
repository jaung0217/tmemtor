/** FAQ validation (SPEC 13장). */
import { z } from "zod";

export const faqCreateSchema = z.object({
  question: z.string().trim().min(1, "질문을 입력해 주세요."),
  answer: z.string().trim().min(1, "답변을 입력해 주세요."),
  category_id: z.string().uuid("카테고리를 다시 선택해 주세요.").optional().nullable(),
  is_published: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export const faqUpdateSchema = faqCreateSchema.partial();

export type FaqCreateInput = z.infer<typeof faqCreateSchema>;
export type FaqUpdateInput = z.infer<typeof faqUpdateSchema>;
