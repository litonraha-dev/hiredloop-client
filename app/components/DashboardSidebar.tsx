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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboardSections } from "@/lib/dashboard-sections";
import { DASHBOARD_PATHS, type UserRole } from "@/lib/roles";

const sectionIcons = {
  jobs: Briefcase,
  saved: Bookmark,
  applications: FileText,
  billing: Wallet,
  settings: Settings,
  company: Building2,
  users: Users,
};

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
          <SidebarMenu>
            {dashboardSections[role].map(({ label, icon, slug }) => {
              const Icon = sectionIcons[icon];
              const href = `${dashboardPath}/${slug}`;
              const isActive = pathname === href;

              return (
                <SidebarMenuItem key={slug}>
                  <SidebarMenuButton
                    isActive={isActive}
                    aria-current={isActive ? "page" : undefined}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
