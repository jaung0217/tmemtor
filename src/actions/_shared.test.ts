/**
 * Tests for the pure error-mapping helpers used by every Server Action
 * (SPEC 22장: never leak raw Supabase/Postgres errors to the client).
 */
import { describe, expect, it, vi } from "vitest";
import { errorMessage, firstValidationError, logAndMapDbError } from "./_shared";
import type { ErrorCode } from "@/types/common";

describe("errorMessage", () => {
  it("returns the default Korean message for a known error code", () => {
    expect(errorMessage("AUTH_REQUIRED")).toBe("로그인이 필요합니다.");
    expect(errorMessage("PERMISSION_DENIED")).toBe("권한이 없습니다.");
    expect(errorMessage("VALIDATION_ERROR")).toBe("입력값을 다시 확인해 주세요.");
    expect(errorMessage("NOT_FOUND")).toBe("요청한 데이터를 찾을 수 없습니다.");
    expect(errorMessage("STORAGE_ERROR")).toBe("파일 처리 중 오류가 발생했습니다.");
  });

  it("returns a caller-provided detail instead of the default when given", () => {
    expect(errorMessage("VALIDATION_ERROR", "커스텀 메시지")).toBe("커스텀 메시지");
  });

  it("has a default message for every ErrorCode (no gaps in the map)", () => {
    const codes: ErrorCode[] = [
      "AUTH_REQUIRED",
      "PERMISSION_DENIED",
      "VALIDATION_ERROR",
      "NOT_FOUND",
      "DATABASE_ERROR",
      "STORAGE_ERROR",
      "EXTERNAL_API_ERROR",
      "UNKNOWN_ERROR",
    ];
    for (const code of codes) {
      expect(errorMessage(code)).toBeTruthy();
    }
  });
});

describe("logAndMapDbError", () => {
  it("never leaks the raw Postgres error message/code to the returned string", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const raw = { message: "duplicate key value violates unique constraint", code: "23505" };

    const result = logAndMapDbError("createPost", raw);

    expect(result).toBe("처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    expect(result).not.toContain("23505");
    expect(result).not.toContain("constraint");
    spy.mockRestore();
  });

  it("logs the raw error server-side with the given context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const raw = { message: "boom", code: "XX000" };

    logAndMapDbError("deleteLocation", raw);

    expect(spy).toHaveBeenCalledWith("[action:deleteLocation]", raw);
    spy.mockRestore();
  });

  it("still returns the safe DATABASE_ERROR message when error is null (no crash)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(logAndMapDbError("noop", null)).toBe("처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("firstValidationError", () => {
  it("returns the first issue's message", () => {
    expect(firstValidationError([{ message: "첫 번째 오류" }, { message: "두 번째 오류" }])).toBe(
      "첫 번째 오류"
    );
  });

  it("falls back to the generic VALIDATION_ERROR message when there are no issues", () => {
    expect(firstValidationError([])).toBe("입력값을 다시 확인해 주세요.");
  });
});
