/**
 * `site_settings` row type (supabase/migrations/007_settings.sql, SPEC 6장).
 * `business_info` / `social_links` are stored as `jsonb` — the exact nested
 * schema is not defined by PRD/SPEC yet (OPEN_ISSUES.md #9), so they are kept
 * as loose JSON records here rather than over-specified.
 *
 * Do not add an address field here — business address belongs to `locations`
 * (SPEC 6장).
 */
export interface SiteSettings {
  id: string;
  site_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  business_info: Record<string, unknown> | null;
  social_links: Record<string, unknown> | null;
  seo_title: string | null;
  seo_description: string | null;
  default_og_image: string | null;
  created_at: string;
  updated_at: string;
}
