/**
 * Shared Server Action result shape (CLAUDE.md / SPEC 14장):
 *
 *   { success: boolean, data?: T, error?: string }
 *
 * Modeled as a discriminated union so callers get type-narrowing
 * (`result.data` is only accessible when `result.success` is `true`) while
 * still satisfying the project-wide shape at the call site.
 */
export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Error classification used across `src/actions/*` (SPEC 22장 Error Handling).
 * User-facing messages are mapped from these in `src/actions/_shared.ts`;
 * raw Database/Storage errors must never be sent to the client as-is.
 */
export type ErrorCode =
  | "AUTH_REQUIRED"
  | "PERMISSION_DENIED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "STORAGE_ERROR"
  | "EXTERNAL_API_ERROR"
  | "UNKNOWN_ERROR";
