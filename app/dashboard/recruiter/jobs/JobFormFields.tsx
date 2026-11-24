import type { Job } from "@/lib/api/jobs"

type JobFormFieldsProps = {
  job?: Job
  disabled?: boolean
}
const labelStyle = "block min-w-0 space-y-1 text-sm font-medium"
const controlStyle =
  "block w-full rounded-lg border border-transparent bg-[#222225] px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-indigo-400"
const sectionStyle = "space-y-4 rounded-xl bg-[#18181a] p-4 sm:p-5"

export default function JobFormFields({
  job,
  disabled = false,
}: JobFormFieldsProps) {
  console.log(job, "from update")
  return (
   
    <fieldset disabled={disabled} className="min-w-0 space-y-4 text-gray-300">
      <section className={sectionStyle}>
        <h2 className="text-sm font-semibold">
          <span className="text-indigo-400">●</span> 1. Basic Information
        </h2>
        <label className={labelStyle}>
          Job Title *
          <input
            name="title"
            defaultValue={job?.title ?? ""}
            required
            maxLength={120}
            placeholder="Frontend Developer"
            className={controlStyle}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelStyle}>
            Company Name *
            <input
              name="company"
              defaultValue={job?.company ?? ""}
              required
              maxLength={120}
              placeholder="Company name"
              className={controlStyle}
            />
          </label>
          <label className={labelStyle}>
            Job Category *
            <select
              name="category"
              defaultValue={job?.category ?? ""}
              className={controlStyle}
            >
              <option value="" disabled>
                Select a category
              </option>
              {[
                "Engineering & Tech",
                "Design",
                "Sales & Marketing",
                "Operations",
                "Finance",
                "Other",
              ].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Job Type *</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Full-time", "Part-time", "Contract", "Internship"].map(
              (type) => (
                <label key={type} className="cursor-pointer">
                  <input
                    type="radio"
                    name="employmentType"
                    value={type}
                    defaultChecked={
                      type === (job?.employmentType ?? "Full-time")
                    }
                    required
                    className="peer sr-only"
                  />
                  <span className="block rounded-lg border border-transparent bg-[#222225] px-2 py-2 text-center text-sm text-zinc-400 peer-checked:border-indigo-500 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400">
                    {type}
                  </span>
                </label>
              )
            )}
          </div>
        </fieldset>
      </section>

      <section className={sectionStyle}>
        <h2 className="text-sm font-semibold">
          <span className="text-indigo-400">●</span> 2. Location, Compensation &
          Timeline
        </h2>
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-[#222225] p-3">
          <span>
            <span className="block text-sm font-medium">
              Remote Work Allowed
            </span>
            <span className="block text-xs text-zinc-400">
              Enable applications from remote candidates.
            </span>
          </span>
          <input
            type="checkbox"
            name="remote"
            role="switch"
            className="peer sr-only"
            defaultChecked={job?.remoteAllowed ?? false}
          />
          <span
            aria-hidden="true"
            className="relative h-5 w-9 shrink-0 rounded-full bg-zinc-600 peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white peer-checked:after:translate-x-4"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelStyle}>
            Job Location
            <input
              name="location"
              placeholder="New York, USA"
              className={controlStyle}
            />
          </label>
          <label className={labelStyle}>
            Application Deadline
            <input
              name="deadline"
              type="date"
              className={controlStyle}
              defaultValue={job?.deadline?.slice(0, 10) ?? ""}
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelStyle}>
            Min Salary / Rate
            <input
              name="minSalary"
              defaultValue={job?.minSalary ?? ""}
              type="number"
              min="0"
              step="0.01"
              placeholder="€ 25"
              className={controlStyle}
            />
          </label>
          <label className={labelStyle}>
            Max Salary / Rate
            <input
              name="maxSalary"
              defaultValue={job?.maxSalary ?? ""}
              type="number"
              min="0"
              step="0.01"
              placeholder="€ 40"
              className={controlStyle}
            />
          </label>
          <label className={labelStyle}>
            Frequency
            <select
              name="frequency"
              defaultValue={job?.frequency ?? ""}
              className={controlStyle}
            >
              <option value="">Select a frequency</option>
              {["Per hour", "Per month", "Per year"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className={sectionStyle}>
        <h2 className="text-sm font-semibold">
          <span className="text-indigo-400">●</span> 3. Responsibilities &
          Requirements
        </h2>
        <label className={labelStyle}>
          Key Responsibilities *
          <textarea
            name="responsibilities"
            rows={4}
            required
            className={controlStyle}
            defaultValue={job?.responsibilities ?? ""}
            placeholder="Describe what the candidate will do."
          />
        </label>
        <label className={labelStyle}>
          Qualifications & Requirements *
          <textarea
            name="requirements"
            defaultValue={job?.requirements ?? ""}
            rows={4}
            required
            className={controlStyle}
            placeholder="List the skills and experience needed."
          />
        </label>
      </section>
    </fieldset>
  )
}
