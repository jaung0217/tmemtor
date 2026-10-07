/**
 * Media upload validation (SPEC 19장).
 *
 * Order mandated by SPEC 19장: MIME Type 검증 → 확장자 검증 → 파일 크기 검증
 * → Storage 업로드 → DB 기록. This module only implements the first three
 * (pure, framework-agnostic) checks; the Storage/DB steps live in
 * `src/actions/media.ts`.
 *
 * Plain TS (not zod) is used here because the input is a `File`/Blob-like
 * object, which zod has no first-class support for.
 */
export const ALLOWED_MEDIA_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg", "pdf"] as const;
export type AllowedMediaExtension = (typeof ALLOWED_MEDIA_EXTENSIONS)[number];

/** Extension -> acceptable MIME type(s). Used to cross-check MIME against extension (anti-spoofing). */
export const ALLOWED_MEDIA_MIME_TYPES: Record<AllowedMediaExtension, readonly string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
  svg: ["image/svg+xml"],
  pdf: ["application/pdf"],
};

export const MAX_MEDIA_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface MediaFileLike {
  name: string;
  type: string;
  size: number;
}

export interface MediaFileValidationError {
  message: string;
}

export function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx <= 0 || idx === filename.length - 1) return "";
  return filename.slice(idx + 1).toLowerCase();
}

function isAllowedExtension(extension: string): extension is AllowedMediaExtension {
  return (ALLOWED_MEDIA_EXTENSIONS as readonly string[]).includes(extension);
}

/**
 * Runs the three client-independent checks from SPEC 19장 in order.
 * Returns `null` when the file passes all of them.
 */
export function validateMediaFile(file: MediaFileLike | null | undefined): MediaFileValidationError | null {
  if (!file || !file.name) {
    return { message: "업로드할 파일을 선택해 주세요." };
  }

  // 1) MIME Type 검증
  const knownMimeTypes = Object.values(ALLOWED_MEDIA_MIME_TYPES).flat();
  if (!file.type || !knownMimeTypes.includes(file.type)) {
    return { message: "허용되지 않는 파일 형식입니다." };
  }

  // 2) 확장자 검증
  const extension = getFileExtension(file.name);
  if (!isAllowedExtension(extension)) {
    return {
      message: "허용되지 않는 파일 확장자입니다. (jpg, jpeg, png, webp, svg, pdf만 업로드할 수 있습니다.)",
    };
  }

  // MIME과 확장자 불일치 방지 (예: .png 확장자에 image/svg+xml MIME 위장)
  if (!ALLOWED_MEDIA_MIME_TYPES[extension].includes(file.type)) {
    return { message: "파일 형식과 확장자가 일치하지 않습니다." };
  }

  // 3) 파일 크기 검증
  if (file.size <= 0) {
    return { message: "빈 파일은 업로드할 수 없습니다." };
  }
  if (file.size > MAX_MEDIA_SIZE_BYTES) {
    return {
      message: `파일 크기는 ${Math.floor(MAX_MEDIA_SIZE_BYTES / (1024 * 1024))}MB를 초과할 수 없습니다.`,
    };
  }

  return null;
}
