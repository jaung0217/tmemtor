import type { InquiryStatus } from "@/types/inquiry";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "신규",
  IN_PROGRESS: "처리중",
  ANSWERED: "답변완료",
  CLOSED: "종료",
};

export const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: "text-red-600",
  IN_PROGRESS: "text-amber-600",
  ANSWERED: "text-green-700",
  CLOSED: "text-zinc-400",
};
