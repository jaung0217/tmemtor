"use client";

import { useRouter } from "next/navigation";
import { deleteInquiry } from "@/actions/inquiries";
import { ConfirmDeleteButton } from "../_components/ConfirmDeleteButton";

/** Detail-page delete: navigates back to the list instead of just refreshing in place. */
export function InquiryDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <ConfirmDeleteButton
      id={id}
      action={deleteInquiry}
      onDeleted={() => router.push("/admin/inquiries")}
    />
  );
}
