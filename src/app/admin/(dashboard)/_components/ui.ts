/**
 * Shared Tailwind class strings for Admin CMS screens (SPEC 15장). Kept as
 * plain constants (no component library is installed) so every entity
 * screen (Posts/Categories/FAQ/Inquiries/Locations/Media/Settings) looks and
 * behaves consistently, matching the style already used by the Phase 3
 * login/forgot-password/reset-password forms.
 */
export const inputClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-400";

export const textareaClass = `${inputClass} min-h-32 resize-y`;

export const selectClass = inputClass;

export const labelClass = "text-sm font-medium text-zinc-700";

export const checkboxClass = "h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500";

export const buttonPrimaryClass =
  "rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60";

export const buttonSecondaryClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 disabled:opacity-60";

export const linkButtonClass =
  "rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800";

export const errorTextClass = "text-sm text-red-600";

export const tableWrapClass = "overflow-x-auto rounded-md border border-zinc-200";

export const tableClass = "w-full min-w-max text-left text-sm";

export const thClass = "border-b border-zinc-200 bg-zinc-50 px-4 py-2 font-medium text-zinc-500";

export const tdClass = "border-b border-zinc-100 px-4 py-2 align-top text-zinc-700";

export const pageHeaderClass = "flex items-center justify-between gap-4";

export const pageTitleClass = "text-lg font-semibold text-zinc-900";

export const formClass = "flex max-w-2xl flex-col gap-4";

export const fieldClass = "flex flex-col gap-1";
