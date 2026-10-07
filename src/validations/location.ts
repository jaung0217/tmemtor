/** Location validation (SPEC 13장). No hierarchy fields (SPEC 5장) — see src/types/location.ts. */
import { z } from "zod";

const NAME_MAX = 100;
const DESCRIPTION_MAX = 1000;
const ADDRESS_MAX = 300;
const DETAIL_ADDRESS_MAX = 300;
const ZIP_CODE_MAX = 20;
const PHONE_MAX = 30;

export const locationCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "장소 이름을 입력해 주세요.")
    .max(NAME_MAX, `장소 이름은 ${NAME_MAX}자 이내로 입력해 주세요.`),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, `설명은 ${DESCRIPTION_MAX}자 이내로 입력해 주세요.`)
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .min(1, "주소를 입력해 주세요.")
    .max(ADDRESS_MAX, `주소는 ${ADDRESS_MAX}자 이내로 입력해 주세요.`),
  detail_address: z.string().trim().max(DETAIL_ADDRESS_MAX).optional().nullable(),
  zip_code: z.string().trim().max(ZIP_CODE_MAX).optional().nullable(),
  phone: z.string().trim().max(PHONE_MAX).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export const locationUpdateSchema = locationCreateSchema.partial();

export type LocationCreateInput = z.infer<typeof locationCreateSchema>;
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;
