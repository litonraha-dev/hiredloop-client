import Link from "next/link";
import { Briefcase, MapPin, Pencil, Plus, Users } from "lucide-react";
import { getJobs } from "@/lib/api/jobs";
import { requireRole } from "@/lib/authorization";
import { USER_ROLES } from "@/lib/roles";
import { DeleteJobDialog } from "./DeleteJobDIalog";
import { JobDetailsDialog } from "./JobsDetailsDialog";
import { EditJobDialog } from "./EditJobDialog";
const headings = [
  "Job title",
  "Company & location",
  "Type",
  "Compensation",
  "Applicants",
  "Status",
  "Deadline",
];

const cell = "px-4 py-3.5 align-middle first:pl-5 last:pr-5";
const secondary = "mt-1 text-xs text-zinc-400";

export default async function ManageJobsPage() {
  await requireRole(USER_ROLES.RECRUITER);
  const jobs = await getJobs();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <section className="min-h-screen min-w-0 bg-[#141416] px-4 py-6 text-zinc-100 sm:px-7 sm:py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Manage Jobs</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {jobs.length} {jobs.length === 1 ? "job post" : "job posts"}
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/add-job"
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Job Post
        </Link>
      </header>

      {jobs.length === 0 ? (
        <p className="rounded-xl border border-zinc-800 bg-[#18181a] p-5 text-sm text-zinc-400">
          No jobs yet. Select New Job Post to create your first listing.
        </p>
      ) : (
        <div
          role="region"
          aria-label="Job listings"
          tabIndex={0}
          className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#19191b] focus-visible:outline-2 focus-visible:outline-indigo-400"
        >
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-zinc-900/80 text-xs text-zinc-400">
              <tr>
                {headings.map((heading) => (
                  <th key={heading} scope="col" className={`${cell} whitespace-nowrap font-medium`}>
                    {heading}
                  </th>
                ))}
                <th scope="col" className={`${cell} text-right font-medium`}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => {
                const salary = [job.minSalary, job.maxSalary]
                  .filter((amount) => typeof amount === "number")
                  .map((amount) => `€${amount}`)
                  .join(" – ");

                const location = [
                  job.remoteAllowed ? "Remote" : "",
                  job.location,
                ].filter(Boolean).join(" · ");

                const deadline = job.deadline?.slice(0, 10);
                const expired = Boolean(deadline && deadline < today);

                return (
                  <tr
                    key={job._id}
                    className="border-t border-zinc-800 transition-colors hover:bg-zinc-800/40 focus-within:bg-zinc-800/40"
                  >
                    <th scope="row" className={`${cell} min-w-44 font-medium break-words`}>
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-500/15 text-indigo-300">
                          <Briefcase className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          {job.title || "Untitled job"}
                          {job.category && (
                            <div className="mt-1 text-xs text-indigo-300">
                              {job.category}
                            </div>
                          )}
                        </div>
                      </div>
                    </th>

                    <td className={`${cell} min-w-36 break-words`}>
                      {job.company || "—"}
                      {location && (
                        <div className={`${secondary} flex items-center gap-1`}>
                          <MapPin className="size-3 shrink-0" aria-hidden="true" />
                          {location}
                        </div>
                      )}
                    </td>

                    <td className={cell}>
                      <span className="whitespace-nowrap rounded-full bg-zinc-800 px-2 py-1 text-xs">
                        {job.employmentType || "—"}
                      </span>
                    </td>

                    <td className={`${cell} whitespace-nowrap tabular-nums`}>
                      {salary || "—"}
                      {salary && job.frequency ? ` · ${job.frequency}` : ""}
                    </td>

                    <td className={cell}>
                      {typeof job.applicantCount === "number" ? (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <Users className="size-4 text-indigo-300" aria-hidden="true" />
                          {job.applicantCount} candidates
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className={cell}>
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${
                          expired
                            ? "bg-zinc-800 text-zinc-400"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                        {expired ? "Expired" : "Active"}
                      </span>
                    </td>

                    <td className={`${cell} whitespace-nowrap tabular-nums`}>
                      {deadline || "—"}
                    </td>
                    <td className={cell}>
                      <div className="flex items-center justify-end gap-2">
                        {/* <button
                          type="button"
                          disabled
                          className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md border border-zinc-700 px-2 text-xs text-zinc-400 disabled:opacity-60"
                        >
                          <Pencil className="size-3" aria-hidden="true" />
                          Update
                        </button> */}
                        <EditJobDialog job={job}  />
                          <JobDetailsDialog job={job} />
                        <DeleteJobDialog jobTitle={job.title} jobId={job._id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
