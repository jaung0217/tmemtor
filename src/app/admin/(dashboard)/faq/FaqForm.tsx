"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFaq, updateFaq } from "@/actions/faq";
import type { Faq } from "@/types/faq";
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
  selectClass,
  textareaClass,
} from "../_components/ui";

export function FaqForm({ categories, faq }: { categories: Category[]; faq?: Faq }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const categoryId = String(formData.get("category_id") ?? "");
    const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();

    const input = {
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      category_id: categoryId || null,
      sort_order: sortOrderRaw ? Number(sortOrderRaw) : 0,
      is_published: formData.get("is_published") === "on",
    };

    setPending(true);
    const result = faq ? await updateFaq(faq.id, input) : await createFaq(input);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/faq");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div className={fieldClass}>
        <label htmlFor="question" className={labelClass}>
          질문
        </label>
        <input
          id="question"
          name="question"
          type="text"
          required
          defaultValue={faq?.question}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="answer" className={labelClass}>
          답변
        </label>
        <textarea id="answer" name="answer" required defaultValue={faq?.answer} className={textareaClass} />
      </div>

      <div className={fieldClass}>
        <label htmlFor="category_id" className={labelClass}>
          카테고리
        </label>
        <select
          id="category_id"
          name="category_id"
          defaultValue={faq?.category_id ?? ""}
          className={selectClass}
        >
          <option value="">선택 안 함</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
          defaultValue={faq?.sort_order ?? 0}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={faq?.is_published ?? false}
          className={checkboxClass}
        />
        <span className={labelClass}>공개</span>
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
          onClick={() => router.push("/admin/faq")}
          disabled={pending}
          className={buttonSecondaryClass}
        >
          취소
        </button>
      </div>
    </form>
  );
}
