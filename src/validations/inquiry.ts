/** Inquiry validation (SPEC 13장). `privacy_agreed` must be `true` to create. */
import { z } from "zod";
import { INQUIRY_STATUS_VALUES } from "@/types/inquiry";

const NAME_MAX = 100;
const TITLE_MAX = 200;
const PHONE_MAX = 30;

/** Treats an empty string the same as "not provided" (optional field). */
const optionalTrimmedEmail = z
  .string()
  .trim()
  .email("올바른 이메일 형식이 아닙니다.")
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((value) => (value ? value : null));

export const inquiryCreateSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(NAME_MAX, `이름은 ${NAME_MAX}자 이내로 입력해 주세요.`),
  email: optionalTrimmedEmail,
  phone: z.string().trim().max(PHONE_MAX).optional().nullable(),
  title: z.string().trim().min(1, "제목을 입력해 주세요.").max(TITLE_MAX, `제목은 ${TITLE_MAX}자 이내로 입력해 주세요.`),
  content: z.string().trim().min(1, "내용을 입력해 주세요."),
  privacy_agreed: z
    .boolean()
    .refine((value) => value === true, {
      message: "개인정보 수집·이용에 동의해야 문의를 등록할 수 있습니다.",
    }),
});

export const inquiryStatusSchema = z.enum(
  INQUIRY_STATUS_VALUES as [string, ...string[]]
);

export type InquiryCreateInput = z.infer<typeof inquiryCreateSchema>;
