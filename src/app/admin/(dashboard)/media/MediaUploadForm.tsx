"use client";

/**
 * Upload form for the Admin Media Library (SPEC 15장 `/admin/media`, PRD
 * 2.2 "파일 업로드"). Calls `uploadMedia` (Phase 4, src/actions/media.ts)
 * directly with the selected `File` — MIME/extension/size validation and
 * the Storage/DB write both happen inside that action.
 */
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/actions/media";
import { ALLOWED_MEDIA_EXTENSIONS, MAX_MEDIA_SIZE_BYTES } from "@/validations/media";
import { buttonPrimaryClass, errorTextClass } from "../_components/ui";

const ACCEPT = ALLOWED_MEDIA_EXTENSIONS.map((extension) => `.${extension}`).join(",");
const MAX_MB = Math.floor(MAX_MEDIA_SIZE_BYTES / (1024 * 1024));

export function MediaUploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];

    if (!file) {
      setError("업로드할 파일을 선택해 주세요.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await uploadMedia({ file });
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <input ref={inputRef} type="file" name="file" accept={ACCEPT} className="text-sm text-zinc-700" />
        <button type="submit" disabled={pending} className={buttonPrimaryClass}>
          {pending ? "업로드 중..." : "업로드"}
        </button>
      </div>
      <p className="text-xs text-zinc-400">
        {ALLOWED_MEDIA_EXTENSIONS.join(", ")} 파일만 업로드할 수 있습니다. (최대 {MAX_MB}MB)
      </p>
      {error && (
        <p className={errorTextClass} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
