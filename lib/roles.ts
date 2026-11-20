export const USER_ROLES = {
  SEEKER: "seeker",
  RECRUITER: "recruiter",
  ADMIN: "admin",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const DASHBOARD_PATHS = {
  [USER_ROLES.SEEKER]: "/dashboard/seeker",
  [USER_ROLES.RECRUITER]: "/dashboard/recruiter",
  [USER_ROLES.ADMIN]: "/dashboard/admin",
} satisfies Record<UserRole, string>;

export function isUserRole(role: unknown): role is UserRole {
  return Object.values(USER_ROLES).some((value) => value === role);
}
