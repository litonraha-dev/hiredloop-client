export const USER_ROLES = {
  SEEKER: "seeker",
  RECRUITER: "recruiter",
  ADMIN: "admin",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];