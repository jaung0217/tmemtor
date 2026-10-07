"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/actions/inquiries";
import { INQUIRY_STATUS_VALUES, type Inquiry } from "@/types/inquiry";
import { buttonPrimaryClass, errorTextClass, selectClass } from "../_components/ui";
import { INQUIRY_STATUS_LABELS } from "./statusLabels";

export function InquiryStatusForm({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [status, setStatus] = useState(inquiry.status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const result = await updateInquiryStatus(inquiry.id, status);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium text-zinc-700">
          상태
        </label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as Inquiry["status"])}
          className={selectClass}
        >
          {INQUIRY_STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {INQUIRY_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClass}>
        {pending ? "변경 중..." : "상태 변경"}
      </button>
      {error && (
        <p className={errorTextClass} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
