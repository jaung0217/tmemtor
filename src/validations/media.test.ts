/**
 * Media file validation tests (SPEC 19장): MIME → extension → size checks,
 * run in that order. This is the "허용되지 않은 파일 차단" part of SPEC 24장
 * Storage testing that does not require a live Supabase Storage bucket.
 */
import { describe, expect, it } from "vitest";
import {
  MAX_MEDIA_SIZE_BYTES,
  getFileExtension,
  validateMediaFile,
  type MediaFileLike,
} from "./media";

function file(overrides: Partial<MediaFileLike>): MediaFileLike {
  return { name: "photo.png", type: "image/png", size: 1024, ...overrides };
}

describe("getFileExtension", () => {
  it("returns the lower-cased extension", () => {
    expect(getFileExtension("Photo.PNG")).toBe("png");
  });

  it("returns an empty string when there is no extension", () => {
    expect(getFileExtension("noextension")).toBe("");
  });

  it("returns an empty string for a dotfile with no extension (e.g. '.env')", () => {
    expect(getFileExtension(".env")).toBe("");
  });

  it("returns an empty string when the dot is the last character", () => {
    expect(getFileExtension("file.")).toBe("");
  });
});

describe("validateMediaFile", () => {
  it("accepts an allowed file (png)", () => {
    expect(validateMediaFile(file({}))).toBeNull();
  });

  it.each([
    ["jpg", "image/jpeg"],
    ["jpeg", "image/jpeg"],
    ["png", "image/png"],
    ["webp", "image/webp"],
    ["svg", "image/svg+xml"],
    ["pdf", "application/pdf"],
  ])("accepts an allowed .%s file", (ext, mime) => {
    expect(validateMediaFile(file({ name: `f.${ext}`, type: mime }))).toBeNull();
  });

  it("rejects a missing file", () => {
    expect(validateMediaFile(null)).not.toBeNull();
    expect(validateMediaFile(undefined)).not.toBeNull();
  });

  it("rejects a disallowed MIME type (e.g. executable)", () => {
    const error = validateMediaFile(file({ name: "app.exe", type: "application/x-msdownload" }));
    expect(error).not.toBeNull();
  });

  it("rejects a disallowed extension even with a spoofed known MIME type", () => {
    // .exe is not in ALLOWED_MEDIA_EXTENSIONS regardless of the MIME type claimed.
    const error = validateMediaFile(file({ name: "app.exe", type: "image/png" }));
    expect(error).not.toBeNull();
  });

  it("rejects when the extension does not match the MIME type (spoofing)", () => {
    // .png filename but svg MIME type -- anti-spoofing cross-check.
    const error = validateMediaFile(file({ name: "photo.png", type: "image/svg+xml" }));
    expect(error).not.toBeNull();
  });

  it("rejects an empty (zero-byte) file", () => {
    const error = validateMediaFile(file({ size: 0 }));
    expect(error).not.toBeNull();
  });

  it("rejects a file exceeding the 10MB size limit", () => {
    const error = validateMediaFile(file({ size: MAX_MEDIA_SIZE_BYTES + 1 }));
    expect(error).not.toBeNull();
  });

  it("accepts a file exactly at the 10MB size limit", () => {
    const error = validateMediaFile(file({ size: MAX_MEDIA_SIZE_BYTES }));
    expect(error).toBeNull();
  });

  it("rejects a script file disguised with an image MIME type header", () => {
    const error = validateMediaFile(file({ name: "malware.js", type: "image/png" }));
    expect(error).not.toBeNull();
  });
});
