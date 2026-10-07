/** Post validation (SPEC 13장). */
import { z } from "zod";

const TITLE_MAX = 200;

export const postCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(TITLE_MAX, `제목은 ${TITLE_MAX}자 이내로 입력해 주세요.`),
  content: z.string().trim().min(1, "내용을 입력해 주세요."),
  thumbnail: z.string().trim().max(2048).optional().nullable(),
  category_id: z.string().uuid("카테고리를 다시 선택해 주세요.").optional().nullable(),
  is_published: z.boolean().optional(),
});

export const postUpdateSchema = postCreateSchema.partial();

export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
