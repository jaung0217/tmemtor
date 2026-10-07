"use client";

/**
 * Shared Create/Edit form for Posts (SPEC 15장 pattern: List → Create/Edit →
 * Validation → Server Action → Success/Error → Refresh). Calls the Phase 4
 * `createPost`/`updatePost` Server Actions directly — no new data-layer code
 * here. Zod validation happens server-side inside those actions; this form
 * only does the minimal `required` HTML validation plus surfaces
 * `ActionResult.error` on failure.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/actions/posts";
import type { Post } from "@/types/post";
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

export function PostForm({ categories, post }: { categories: Category[]; post?: Post }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const categoryId = String(formData.get("category_id") ?? "");

    const input = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      thumbnail: String(formData.get("thumbnail") ?? "").trim() || null,
      category_id: categoryId || null,
      is_published: formData.get("is_published") === "on",
    };

    setPending(true);
    const result = post ? await updatePost(post.id, input) : await createPost(input);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div className={fieldClass}>
        <label htmlFor="title" className={labelClass}>
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={post?.title}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="category_id" className={labelClass}>
          카테고리
        </label>
        <select
          id="category_id"
          name="category_id"
          defaultValue={post?.category_id ?? ""}
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
        <label htmlFor="thumbnail" className={labelClass}>
          썸네일 URL
        </label>
        <input
          id="thumbnail"
          name="thumbnail"
          type="text"
          placeholder="/admin/media에서 업로드한 파일의 URL을 붙여넣으세요."
          defaultValue={post?.thumbnail ?? ""}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="content" className={labelClass}>
          내용
        </label>
        <textarea
          id="content"
          name="content"
          required
          defaultValue={post?.content}
          className={textareaClass}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={post?.is_published ?? false}
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
          onClick={() => router.push("/admin/posts")}
          disabled={pending}
          className={buttonSecondaryClass}
        >
          취소
        </button>
      </div>
    </form>
  );
}
