import { USER_ROLES, type UserRole } from "@/lib/roles";

type DashboardSection = {
  slug: string;
  label: string;
  icon: "jobs" | "saved" | "applications" | "billing" | "settings" | "company" | "users";
};

export const dashboardSections = {
  [USER_ROLES.SEEKER]: [
    { slug: "jobs", label: "Jobs", icon: "jobs" },
    { slug: "saved-jobs", label: "Saved Jobs", icon: "saved" },
    { slug: "applications", label: "Applications", icon: "applications" },
    { slug: "billing", label: "Billing", icon: "billing" },
    { slug: "settings", label: "Settings", icon: "settings" },
  ],
  [USER_ROLES.RECRUITER]: [
    { slug: "company", label: "My Company", icon: "company" },
    { slug: "add-job", label: "Add Job", icon: "jobs" },
    { slug: "jobs", label: "Manage Jobs", icon: "jobs" },
    { slug: "applications", label: "Applications", icon: "applications" },
    { slug: "settings", label: "Settings", icon: "settings" },
  ],
  [USER_ROLES.ADMIN]: [
    { slug: "users", label: "Users", icon: "users" },
    { slug: "companies", label: "Companies", icon: "company" },
    { slug: "jobs", label: "Jobs", icon: "jobs" },
    { slug: "payments", label: "Payments", icon: "billing" },
    { slug: "settings", label: "Settings", icon: "settings" },
  ],
} satisfies Record<UserRole, DashboardSection[]>;
