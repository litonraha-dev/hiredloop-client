import { requireRole } from "@/lib/authorization";
import { USER_ROLES } from "@/lib/roles";
import { AddJobForm } from "./AddJobForm";

export default async function AddJobPage() {
  await requireRole(USER_ROLES.RECRUITER);

  return (
    <div className="min-h-full bg-[#141416] p-4 text-zinc-100 [color-scheme:dark] sm:p-7">
      <AddJobForm />
    </div>
  );
}
