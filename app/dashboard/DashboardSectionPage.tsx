import { notFound } from "next/navigation";
import { requireRole } from "@/lib/authorization";
import { dashboardSections } from "@/lib/dashboard-sections";
import type { UserRole } from "@/lib/roles";

export async function DashboardSectionPage({
  role,
  section,
}: {
  role: UserRole;
  section: string;
}) {
  await requireRole(role);

  const item = dashboardSections[role].find(({ slug }) => slug === section);
  if (!item) notFound();

  return (
    <section className="space-y-2 p-6">
      <h1 className="text-2xl font-semibold">{item.label}</h1>
      <p className="text-sm text-muted-foreground">This section is under development.</p>
    </section>
  );
}
