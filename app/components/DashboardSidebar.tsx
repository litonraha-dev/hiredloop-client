"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_PATHS, USER_ROLES, type UserRole } from "@/lib/roles";

const upcomingItemsByRole = {
  [USER_ROLES.SEEKER]: [
    { label: "Jobs", Icon: Briefcase },
    { label: "Saved Jobs", Icon: Bookmark },
    { label: "Applications", Icon: FileText },
    { label: "Billing", Icon: Wallet },
    { label: "Settings", Icon: Settings },
  ],
  [USER_ROLES.RECRUITER]: [
    { label: "My Company", Icon: Building2 },
    { label: "Manage Jobs", Icon: Briefcase },
    { label: "Applications", Icon: FileText },
    { label: "Settings", Icon: Settings },
  ],
  [USER_ROLES.ADMIN]: [
    { label: "Users", Icon: Users },
    { label: "Companies", Icon: Building2 },
    { label: "Jobs", Icon: Briefcase },
    { label: "Payments", Icon: Wallet },
    { label: "Settings", Icon: Settings },
  ],
} satisfies Record<UserRole, { label: string; Icon: LucideIcon }[]>;

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const dashboardPath = DASHBOARD_PATHS[role];
  const isDashboardActive = pathname === dashboardPath;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isDashboardActive}
                aria-current={isDashboardActive ? "page" : undefined}
                render={<Link href={dashboardPath} />}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Coming soon</SidebarGroupLabel> */}
          <SidebarMenu>
            {upcomingItemsByRole[role].map(({ label, Icon }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton disabled>
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
