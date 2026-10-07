/** `inquiries.status` enum (supabase/migrations/005_inquiries.sql, SPEC 4.4). */
export type InquiryStatus = "NEW" | "IN_PROGRESS" | "ANSWERED" | "CLOSED";

export const INQUIRY_STATUS_VALUES: readonly InquiryStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "ANSWERED",
  "CLOSED",
];

/** `inquiries` row type (supabase/migrations/005_inquiries.sql, SPEC 4.4). */
export interface Inquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string;
  content: string;
  privacy_agreed: boolean;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}
