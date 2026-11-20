import { redirect } from "next/navigation";
import { requireRole } from "@/lib/authorization";
import { DASHBOARD_PATHS } from "@/lib/roles";

export default async function DashboardPage() {
  const role = await requireRole();
  redirect(DASHBOARD_PATHS[role]);
}
