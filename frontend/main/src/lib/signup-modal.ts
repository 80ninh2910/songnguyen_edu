export const SIGNUP_MODAL_EVENT = "sne:open-signup";

export const SIGNUP_TYPES = [
  "parent",
  "center",
  "tutor-free",
  "tutor-trained",
] as const;

export type SignupType = (typeof SIGNUP_TYPES)[number];

export function isSignupType(value: unknown): value is SignupType {
  return SIGNUP_TYPES.some((type) => type === value);
}
