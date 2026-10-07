"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/actions/categories";
import type { Category } from "@/types/category";
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  checkboxClass,
  errorTextClass,
  fieldClass,
  formClass,
  inputClass,
  labelClass,
} from "../_components/ui";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();

    const input = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      sort_order: sortOrderRaw ? Number(sortOrderRaw) : 0,
      is_active: formData.get("is_active") === "on",
    };

    setPending(true);
    const result = category ? await updateCategory(category.id, input) : await createCategory(input);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div className={fieldClass}>
        <label htmlFor="name" className={labelClass}>
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={category?.name}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="slug" className={labelClass}>
          슬러그
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          maxLength={100}
          placeholder="my-category-1"
          defaultValue={category?.slug}
          className={inputClass}
        />
        <p className="text-xs text-zinc-400">소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.</p>
      </div>

      <div className={fieldClass}>
        <label htmlFor="sort_order" className={labelClass}>
          노출 순서
        </label>
        <input
          id="sort_order"
          name="sort_order"
          type="number"
          min={0}
          step={1}
          defaultValue={category?.sort_order ?? 0}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={category?.is_active ?? true}
          className={checkboxClass}
        />
        <span className={labelClass}>노출</span>
      </label>

      {error && (
        <p className={errorTextClass} role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={buttonPrimaryClass}>
          {pending ? "저장 중..." : "저장"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          disabled={pending}
          className={buttonSecondaryClass}
        >
          취소
        </button>
      </div>
    </form>
  );
}
