/** Category validation (SPEC 13장). */
import { z } from "zod";

const NAME_MAX = 100;
const SLUG_MAX = 100;

// lower-case letters, numbers, single hyphens between segments (e.g. "my-post-1")
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "카테고리 이름을 입력해 주세요.")
    .max(NAME_MAX, `카테고리 이름은 ${NAME_MAX}자 이내로 입력해 주세요.`),
  slug: z
    .string()
    .trim()
    .min(1, "슬러그를 입력해 주세요.")
    .max(SLUG_MAX, `슬러그는 ${SLUG_MAX}자 이내로 입력해 주세요.`)
    .regex(SLUG_PATTERN, "슬러그는 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다."),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
