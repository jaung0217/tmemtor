/**
 * `locations` row type (supabase/migrations/008_locations.sql, SPEC 5장).
 *
 * IMPORTANT: Locations have no hierarchy. Do not add `type` / `location_type` /
 * `branch_type` / `parent_location_id` / `is_branch` / `is_main` fields here —
 * the meaning of a place is expressed only through `name` (SPEC 5장, CLAUDE.md).
 */
export interface Location {
  id: string;
  name: string;
  description: string | null;
  address: string;
  detail_address: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
