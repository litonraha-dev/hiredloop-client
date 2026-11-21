import { DashboardSectionPage } from "@/app/dashboard/DashboardSectionPage";
import { USER_ROLES } from "@/lib/roles";

export default function Page() {
  return <DashboardSectionPage role={USER_ROLES.SEEKER} section="billing" />;
}
