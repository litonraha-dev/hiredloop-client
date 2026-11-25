import Link from "next/link"
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Search,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { getJobs, type Job } from "@/lib/api/jobs"
import { CompanyImage } from "./company-image"
import { JobBookmark } from "./job-bookmark"

const path = "/browse-jobs"
const pageSize = 4
const panel = "rounded-xl border border-white/[.06] bg-[#151518]"
const jobTypes = [
  "Full-time",
  "Contract",
  "Freelance",
  "Part-time",
  "Internship",
]
const categories = [
  "Engineering & Tech",
  "Design",
  "Sales & Marketing",
  "Operations",
  "Finance",
  "Other",
]
const remoteOptions = [
  { value: "true", label: "Remote allowed" },
  { value: "false", label: "Remote not allowed" },
]
const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "title", label: "Job Title" },
]

type SearchParams = Record<string, string | string[] | undefined>

function selectedValues(value: SearchParams[string]) {
  return [
    ...new Set([value].flat().filter((item): item is string => Boolean(item))),
  ]
}

const salaryFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
})

function salaryLabel(job: Job) {
  const amounts = [job.minSalary, job.maxSalary].filter(
    (amount): amount is number =>
      typeof amount === "number" && Number.isFinite(amount)
  )
  return [...new Set(amounts)]
    .map((amount) => "$" + salaryFormat.format(amount))
    .join(" – ")
}

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const keyword = typeof params.search === "string" ? params.search.trim() : ""
  const selectedTypes = selectedValues(params.jobType)
  const selectedCategories = selectedValues(params.category)
  const selectedRemote: string[] = selectedValues(params.remoteAllowed).filter(
    (value) => value === "true" || value === "false"
  )
  const sort =
    sortOptions.find((option) => option.value === params.sort) ?? sortOptions[0]

  const apiQuery = new URLSearchParams()
  if (keyword) apiQuery.set("search", keyword)

  const jobs = await getJobs(apiQuery.toString()).catch((error: unknown) => {
    console.error("Could not load browse jobs", error)
    return null
  })

  const typeCounts = new Map<string, number>()
  for (const job of jobs ?? []) {
    if (job.employmentType) {
      typeCounts.set(
        job.employmentType,
        (typeCounts.get(job.employmentType) ?? 0) + 1
      )
    }
  }

  const availableCategories = new Set([...categories, ...selectedCategories])
  for (const job of jobs ?? []) {
    if (job.category) availableCategories.add(job.category)
  }
  const matches = (jobs ?? [])
    .filter(
      (job) =>
        (!selectedTypes.length ||
          selectedTypes.includes(job.employmentType ?? "")) &&
        (!selectedCategories.length ||
          selectedCategories.includes(job.category ?? "")) &&
        (!selectedRemote.length ||
          selectedRemote.includes(String(job.remoteAllowed === true)))
    )
    .sort((a, b) =>
      sort.value === "title"
        ? (a.title ?? "").localeCompare(b.title ?? "") ||
          b._id.localeCompare(a._id)
        : (b.createdAt ?? "").localeCompare(a.createdAt ?? "") ||
          b._id.localeCompare(a._id)
    )
  const lastPage = Math.max(1, Math.ceil(matches.length / pageSize))
  const requestedPage =
    typeof params.page === "string" ? Number(params.page) : 1
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(lastPage, Math.max(1, requestedPage))
    : 1
  const visibleJobs = matches.slice((page - 1) * pageSize, page * pageSize)
  const pageLinks = [...new Set([1, page - 1, page, page + 1, lastPage])]
    .filter((number) => number >= 1 && number <= lastPage)
    .sort((a, b) => a - b)

  function pageUrl({ order = sort.value, number = 1 } = {}) {
    const query = new URLSearchParams(apiQuery)
    for (const type of selectedTypes) query.append("jobType", type)
    for (const category of selectedCategories)
      query.append("category", category)
    for (const remote of selectedRemote) query.append("remoteAllowed", remote)
    if (order !== "recent") query.set("sort", order)
    if (number > 1) query.set("page", String(number))
    return query.size ? path + "?" + query.toString() : path
  }

  const pageButton =
    "grid size-8 place-items-center rounded-lg border border-white/10 text-xs text-zinc-300 transition hover:bg-white/10"

  return (
    <div className="min-h-svh bg-[#0a0a0b] text-zinc-100 [color-scheme:dark]">
      <Navbar compact />
      <main className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6">
        <h1 className="sr-only">Browse Jobs</h1>
        <form
          action={path}
          method="get"
          key={keyword}
          className={panel + " mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:p-5"}
        >
          {selectedTypes.map((type) => (
            <input key={type} type="hidden" name="jobType" value={type} />
          ))}
          {sort.value !== "recent" && (
            <input type="hidden" name="sort" value={sort.value} />
          )}
          {selectedCategories.map((category) => (
            <input
              key={category}
              type="hidden"
              name="category"
              value={category}
            />
          ))}
          {selectedRemote.map((remote) => (
            <input
              key={remote}
              type="hidden"
              name="remoteAllowed"
              value={remote}
            />
          ))}
          <label className="relative flex min-w-0 flex-1">
            <span className="sr-only">Search by job title</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400"
            />
            <input
              name="search"
              type="search"
              defaultValue={keyword}
              placeholder="Search by job title, keywords..."
              className="h-12 w-full rounded-lg border border-white/[.08] bg-[#1a1a1e] pr-4 pl-11 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
          </label>
          <button
            type="submit"
            className="h-12 rounded-lg bg-white px-6 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Search Jobs
          </button>
        </form>

        <div className="grid items-start gap-5 md:grid-cols-[minmax(180px,23%)_minmax(0,1fr)] lg:gap-7">
          <aside className={panel + " p-5"} aria-labelledby="filters-title">
            <div className="flex items-center justify-between gap-2">
              <h2 id="filters-title" className="text-lg font-semibold">
                Filters
              </h2>
              {Boolean(
                keyword ||
                selectedTypes.length ||
                selectedCategories.length ||
                selectedRemote.length
              ) && (
                <Link
                  href={path}
                  className="text-xs text-indigo-300 hover:underline"
                >
                  Clear all
                </Link>
              )}
            </div>
            <form
              action={path}
              method="get"
              key={pageUrl()}
              className="mt-5 space-y-5"
            >
              {keyword && <input type="hidden" name="search" value={keyword} />}
              {sort.value !== "recent" && (
                <input type="hidden" name="sort" value={sort.value} />
              )}
              <fieldset className="space-y-2">
                <legend className="mb-2 text-sm font-medium">Job Type</legend>
                {[
                  ...new Set([
                    ...jobTypes,
                    ...typeCounts.keys(),
                    ...selectedTypes,
                  ]),
                ].map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300 hover:text-white"
                  >
                    <input
                      type="checkbox"
                      name="jobType"
                      value={type}
                      defaultChecked={selectedTypes.includes(type)}
                      className="size-4 shrink-0 accent-indigo-500"
                    />
                    <span>{type}</span>
                    {jobs && (
                      <span className="ml-auto text-xs text-zinc-400">
                        {(typeCounts.get(type) ?? 0).toLocaleString("en")}
                      </span>
                    )}
                  </label>
                ))}
              </fieldset>
              <fieldset className="space-y-2 border-t border-white/10 pt-3">
                <legend className="pr-2 text-sm font-medium">Category</legend>
                {[...availableCategories].map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300 hover:text-white"
                  >
                    <input
                      type="checkbox"
                      name="category"
                      value={category}
                      defaultChecked={selectedCategories.includes(category)}
                      className="size-4 shrink-0 accent-indigo-500"
                    />
                    {category}
                  </label>
                ))}
              </fieldset>
              <fieldset className="space-y-2 border-t border-white/10 pt-3">
                <legend className="pr-2 text-sm font-medium">
                  Remote Work
                </legend>
                {remoteOptions.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300 hover:text-white"
                  >
                    <input
                      type="checkbox"
                      name="remoteAllowed"
                      value={value}
                      defaultChecked={selectedRemote.includes(value)}
                      className="size-4 shrink-0 accent-indigo-500"
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-700"
              >
                Apply filters
              </button>
            </form>
          </aside>

          <section aria-labelledby="results-title" className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="results-title" className="text-lg font-semibold">
                {jobs
                  ? "Found " +
                    matches.length.toLocaleString("en") +
                    (matches.length === 1
                      ? " Professional Job"
                      : " Professional Jobs")
                  : "Job openings"}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Sort by:</span>
                <details className="group relative">
                  <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg border border-white/10 bg-[#101012] px-3 py-2 text-zinc-200 [&::-webkit-details-marker]:hidden">
                    {sort.label}
                    <ChevronDown aria-hidden="true" className="size-3.5" />
                  </summary>
                  <ul className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-white/10 bg-[#1a1a1e] p-1 shadow-lg">
                    {sortOptions.map((option) => (
                      <li key={option.value}>
                        <Link
                          href={pageUrl({ order: option.value })}
                          className="block rounded px-2 py-2 hover:bg-white/10"
                        >
                          {option.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>

            {visibleJobs.length ? (
              <ul className="grid gap-2.5">
                {visibleJobs.map((job) => {
                  const salary = salaryLabel(job)
                  const location = [
                    job.company,
                    job.location &&
                      job.location + (job.remoteAllowed ? " (Remote)" : ""),
                    !job.location && job.remoteAllowed && "Remote",
                  ]
                    .filter(Boolean)
                    .join(" · ")
                  return (
                    <li
                      key={job._id}
                      className={
                        panel +
                        " relative grid min-h-[140px] grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 p-4 sm:gap-4 sm:p-5"
                      }
                    >
                      <span className="relative grid size-11 place-items-center overflow-hidden rounded-lg bg-[#242429] sm:size-13">
                        <CompanyImage
                          url={job.companyImageUrl}
                          alt=""
                          fallback={
                            <BriefcaseBusiness
                              aria-hidden="true"
                              className="size-7 rounded-sm bg-[#111719] p-1.5 text-teal-300/70 sm:size-9"
                            />
                          }
                        />
                      </span>
                      <div className="min-w-0 wrap-break-word">
                        <h3 className="text-base font-semibold sm:text-lg">
                          <Link
  href={`/browse-jobs/${job._id}`}
  className="after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-indigo-400"
>
  {job.title || "Untitled job"}
</Link>
                        </h3>
                        {location && (
                          <p className="mt-1 text-sm text-zinc-400">
                            {location}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
                          {salary && (
                            <span className="flex items-center gap-1.5 rounded-md border border-white/[.08] bg-white/[.04] px-2 py-1">
                              <CircleDollarSign
                                aria-hidden="true"
                                className="size-3.5"
                              />
                              {salary}
                              {job.frequency &&
                                " " + job.frequency.toLowerCase()}
                            </span>
                          )}
                          {job.employmentType && (
                            <span className="rounded-md border border-white/[.08] bg-white/[.04] px-2 py-1">
                              {job.employmentType}
                            </span>
                          )}
                          {job.remoteAllowed && (
                            <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-emerald-300">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="relative z-10">
  <JobBookmark id={job._id} title={job.title ?? "job"} />
</div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className={panel + " p-8 text-center"}>
                <h3 className="font-semibold">
                  {jobs ? "No jobs found" : "Jobs couldn’t load"}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {jobs
                    ? "Try another keyword or clear your filters."
                    : "Submit your search again to retry."}
                </p>
              </div>
            )}

            {lastPage > 1 && (
              <nav
                aria-label="Job results pages"
                className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
              >
                {page > 1 && (
                  <Link
                    href={pageUrl({ number: page - 1 })}
                    aria-label="Previous page"
                    className={pageButton}
                  >
                    <ChevronLeft className="size-4" />
                  </Link>
                )}
                {pageLinks.map((number, index) => (
                  <span key={number} className="flex items-center gap-1.5">
                    {index > 0 && number - pageLinks[index - 1] > 1 && (
                      <span className="px-1 text-xs text-zinc-400">…</span>
                    )}
                    <Link
                      href={pageUrl({ number })}
                      aria-current={number === page ? "page" : undefined}
                      aria-label={"Page " + number}
                      className={
                        number === page
                          ? "grid size-8 place-items-center rounded-lg bg-white text-xs font-semibold text-black"
                          : pageButton
                      }
                    >
                      {number}
                    </Link>
                  </span>
                ))}
                {page < lastPage && (
                  <Link
                    href={pageUrl({ number: page + 1 })}
                    aria-label="Next page"
                    className={pageButton}
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                )}
              </nav>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
