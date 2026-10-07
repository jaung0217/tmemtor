import { getMediaList } from "@/queries/media";
import { deleteMedia } from "@/actions/media";
import { ConfirmDeleteButton } from "../_components/ConfirmDeleteButton";
import { EmptyState } from "../_components/EmptyState";
import { formatBytes, formatDateTime } from "../_components/format";
import { pageTitleClass } from "../_components/ui";
import { MediaUploadForm } from "./MediaUploadForm";

export default async function AdminMediaPage() {
  const mediaList = await getMediaList();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>미디어</h1>

      <div className="rounded-md border border-zinc-200 px-5 py-5">
        <MediaUploadForm />
      </div>

      {mediaList.length === 0 ? (
        <EmptyState message="업로드된 파일이 없습니다." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {mediaList.map((media) => (
            <div key={media.id} className="flex flex-col gap-2 rounded-md border border-zinc-200 p-3">
              <div className="flex h-32 items-center justify-center overflow-hidden rounded bg-zinc-50">
                {media.mime_type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-only preview, arbitrary Storage host
                  <img src={media.url} alt={media.filename} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-zinc-400">{media.mime_type}</span>
                )}
              </div>

              <p className="truncate text-sm font-medium text-zinc-900" title={media.filename}>
                {media.filename}
              </p>
              <p className="text-xs text-zinc-400">
                {formatBytes(media.size)} · {formatDateTime(media.created_at)}
              </p>

              <div className="flex items-center justify-between gap-2">
                <a
                  href={media.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-zinc-500 underline underline-offset-2"
                >
                  URL 복사/보기
                </a>
                <ConfirmDeleteButton id={media.id} action={deleteMedia} label="삭제" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
