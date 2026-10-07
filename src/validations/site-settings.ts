/**
 * Site Settings validation. SPEC 6장/13장 do not define explicit length
 * limits for these fields; the limits below are reasonable, conservatively
 * chosen defaults (kept as named constants per SPEC 13장's closing note).
 */
import { z } from "zod";

const SITE_NAME_MAX = 200;
const URL_MAX = 2048;
const PHONE_MAX = 30;
const SEO_TITLE_MAX = 200;
const SEO_DESCRIPTION_MAX = 500;

const optionalTrimmedEmail = z
  .string()
  .trim()
  .email("올바른 이메일 형식이 아닙니다.")
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((value) => (value ? value : null));

export const siteSettingsUpdateSchema = z.object({
  site_name: z.string().trim().max(SITE_NAME_MAX).optional().nullable(),
  logo_url: z.string().trim().max(URL_MAX).optional().nullable(),
  favicon_url: z.string().trim().max(URL_MAX).optional().nullable(),
  contact_email: optionalTrimmedEmail,
  contact_phone: z.string().trim().max(PHONE_MAX).optional().nullable(),
  business_info: z.record(z.string(), z.unknown()).optional().nullable(),
  social_links: z.record(z.string(), z.unknown()).optional().nullable(),
  seo_title: z.string().trim().max(SEO_TITLE_MAX).optional().nullable(),
  seo_description: z.string().trim().max(SEO_DESCRIPTION_MAX).optional().nullable(),
  default_og_image: z.string().trim().max(URL_MAX).optional().nullable(),
});

export type SiteSettingsUpdateInput = z.infer<typeof siteSettingsUpdateSchema>;
