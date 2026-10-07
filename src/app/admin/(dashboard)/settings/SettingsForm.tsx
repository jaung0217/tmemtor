"use client";

/**
 * Single-row Site Settings form (SPEC 15장 `/admin/settings`, PRD 2.2). Calls
 * `updateSiteSettings` (Phase 4), which upserts the one `site_settings` row.
 *
 * `business_info`/`social_links` are `jsonb` with no defined nested schema
 * yet (OPEN_ISSUES.md #9 — pending team decision), so they are edited here as
 * raw JSON text rather than guessing at specific field names.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings } from "@/actions/settings";
import type { SiteSettings } from "@/types/site-settings";
import {
  buttonPrimaryClass,
  errorTextClass,
  fieldClass,
  formClass,
  inputClass,
  labelClass,
  textareaClass,
} from "../_components/ui";

function toJsonText(value: Record<string, unknown> | null): string {
  if (!value) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

/** Parses a JSON object textarea. Empty input -> null. Throws with a Korean message on invalid JSON. */
function parseJsonObjectField(raw: string, fieldLabel: string): Record<string, unknown> | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(`${fieldLabel}에 올바른 JSON을 입력해 주세요.`);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${fieldLabel}은(는) JSON 객체({ }) 형식이어야 합니다.`);
  }

  return parsed as Record<string, unknown>;
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    let businessInfo: Record<string, unknown> | null;
    let socialLinks: Record<string, unknown> | null;
    try {
      businessInfo = parseJsonObjectField(String(formData.get("business_info") ?? ""), "사업자 정보");
      socialLinks = parseJsonObjectField(String(formData.get("social_links") ?? ""), "SNS");
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "입력값을 다시 확인해 주세요.");
      return;
    }

    const input = {
      site_name: String(formData.get("site_name") ?? "").trim() || null,
      logo_url: String(formData.get("logo_url") ?? "").trim() || null,
      favicon_url: String(formData.get("favicon_url") ?? "").trim() || null,
      contact_email: String(formData.get("contact_email") ?? "").trim() || null,
      contact_phone: String(formData.get("contact_phone") ?? "").trim() || null,
      business_info: businessInfo,
      social_links: socialLinks,
      seo_title: String(formData.get("seo_title") ?? "").trim() || null,
      seo_description: String(formData.get("seo_description") ?? "").trim() || null,
      default_og_image: String(formData.get("default_og_image") ?? "").trim() || null,
    };

    setPending(true);
    const result = await updateSiteSettings(input);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div className={fieldClass}>
        <label htmlFor="site_name" className={labelClass}>
          사이트 이름
        </label>
        <input
          id="site_name"
          name="site_name"
          type="text"
          maxLength={200}
          defaultValue={settings?.site_name ?? ""}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="logo_url" className={labelClass}>
          로고 URL
        </label>
        <input
          id="logo_url"
          name="logo_url"
          type="text"
          placeholder="/admin/media에서 업로드한 파일의 URL을 붙여넣으세요."
          defaultValue={settings?.logo_url ?? ""}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="favicon_url" className={labelClass}>
          Favicon URL
        </label>
        <input
          id="favicon_url"
          name="favicon_url"
          type="text"
          defaultValue={settings?.favicon_url ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={fieldClass}>
          <label htmlFor="contact_email" className={labelClass}>
            대표 이메일
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={settings?.contact_email ?? ""}
            className={inputClass}
          />
        </div>

        <div className={fieldClass}>
          <label htmlFor="contact_phone" className={labelClass}>
            대표 연락처
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            type="text"
            maxLength={30}
            defaultValue={settings?.contact_phone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className={fieldClass}>
        <label htmlFor="business_info" className={labelClass}>
          사업자 정보 (JSON)
        </label>
        <textarea
          id="business_info"
          name="business_info"
          placeholder={'{\n  "상호명": "...",\n  "대표자": "...",\n  "사업자등록번호": "..."\n}'}
          defaultValue={toJsonText(settings?.business_info ?? null)}
          className={`${textareaClass} font-mono`}
        />
        <p className="text-xs text-zinc-400">
          정해진 항목이 없어 JSON 객체로 자유롭게 입력합니다. 비워두면 저장하지 않습니다.
        </p>
      </div>

      <div className={fieldClass}>
        <label htmlFor="social_links" className={labelClass}>
          SNS 링크 (JSON)
        </label>
        <textarea
          id="social_links"
          name="social_links"
          placeholder={'{\n  "instagram": "https://...",\n  "youtube": "https://..."\n}'}
          defaultValue={toJsonText(settings?.social_links ?? null)}
          className={`${textareaClass} font-mono`}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="seo_title" className={labelClass}>
          SEO 제목
        </label>
        <input
          id="seo_title"
          name="seo_title"
          type="text"
          maxLength={200}
          defaultValue={settings?.seo_title ?? ""}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="seo_description" className={labelClass}>
          SEO 설명
        </label>
        <textarea
          id="seo_description"
          name="seo_description"
          maxLength={500}
          defaultValue={settings?.seo_description ?? ""}
          className={textareaClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="default_og_image" className={labelClass}>
          기본 OG 이미지 URL
        </label>
        <input
          id="default_og_image"
          name="default_og_image"
          type="text"
          defaultValue={settings?.default_og_image ?? ""}
          className={inputClass}
        />
      </div>

      {error && (
        <p className={errorTextClass} role="alert">
          {error}
        </p>
      )}
      {success && !error && <p className="text-sm text-green-700">저장되었습니다.</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={buttonPrimaryClass}>
          {pending ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
