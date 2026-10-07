import "server-only";

import type { ErrorCode } from "@/types/common";

/**
 * User-facing messages for each SPEC 22장 error type. Never surface a raw
 * Supabase/Postgres error message to the client — map it to one of these.
 */
const DEFAULT_MESSAGES: Record<ErrorCode, string> = {
  AUTH_REQUIRED: "로그인이 필요합니다.",
  PERMISSION_DENIED: "권한이 없습니다.",
  VALIDATION_ERROR: "입력값을 다시 확인해 주세요.",
  NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",
  DATABASE_ERROR: "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  STORAGE_ERROR: "파일 처리 중 오류가 발생했습니다.",
  EXTERNAL_API_ERROR: "외부 서비스 처리 중 오류가 발생했습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
};

export function errorMessage(code: ErrorCode, detail?: string): string {
  return detail ?? DEFAULT_MESSAGES[code];
}

/**
 * Logs a raw Supabase/Postgres error server-side only (SPEC 22장: never
 * expose DB internals to the client) and returns the safe, user-facing
 * `DATABASE_ERROR` message for the Action Result.
 */
export function logAndMapDbError(
  context: string,
  error: { message?: string; code?: string; details?: string } | null
): string {
  if (error) {
    console.error(`[action:${context}]`, error);
  }
  return errorMessage("DATABASE_ERROR");
}

/** First Zod issue message, falling back to the generic VALIDATION_ERROR message. */
export function firstValidationError(issues: { message: string }[]): string {
  return issues[0]?.message ?? errorMessage("VALIDATION_ERROR");
}
