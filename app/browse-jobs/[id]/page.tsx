"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesColumnIncreasing,
  Clock3,
  MapPin,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { getJobs, type Job } from "@/lib/api/jobs"
import { CompanyImage } from "../company-image"
import { JobBookmark } from "../job-bookmark"

const panel = "rounded-xl border border-white/[.06] bg-[#151518]"
const money = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
})

function externalUrl(value?: string) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    if (url.protocol === "https:" || url.protocol === "http:") return url.href
  } catch {
    return undefined
  }
}

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="min-h-svh bg-[#0a0a0b] text-zinc-100">
      <Navbar compact />
      <main className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6">
        <JobDetails key={id} id={id} />
      </main>
    </div>
  )
}

function JobDetails({ id }: { id: string }) {
  const [job, setJob] = useState<Job | null | undefined>()
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    getJobs()
      .then((jobs) => {
        if (active) setJob(jobs.find((item) => item._id === id) ?? null)
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => {
      active = false
    }
  }, [id])

  if (!job) {
    return (
      <div className={panel + " space-y-3 p-6"}>
        <p role={error ? "alert" : "status"}>
          {error
            ? "Could not load job details."
            : job === null
              ? "Job not found."
              : "Loading job details…"}
        </p>
        <Link
          href="/browse-jobs"
          className="text-sm text-indigo-300 hover:underline"
        >
          Back to Browse Jobs
        </Link>
      </div>
    )
  }

  const title = job.title || "Untitled job"
  const salary = [...new Set([job.minSalary, job.maxSalary])]
    .filter(
      (amount): amount is number =>
        typeof amount === "number" && Number.isFinite(amount)
    )
    .map((amount) => "$" + money.format(amount))
    .join(" – ")
  const location = [job.location, job.remoteAllowed && "Remote"]
    .filter(Boolean)
    .join(" · ")
  const applyUrl = externalUrl(job.applicationUrl)
  const website = externalUrl(job.companyWebsite)
  const facts = [
    {
      label: "Salary range",
      value:
        salary &&
        [salary, job.frequency?.toLowerCase()].filter(Boolean).join(" "),
      icon: Banknote,
    },
    { label: "Location", value: location, icon: MapPin },
    { label: "Job type", value: job.employmentType, icon: Clock3 },
    {
      label: job.experience ? "Experience" : "Category",
      value: job.experience || job.category,
      icon: ChartNoAxesColumnIncreasing,
    },
  ]
  const sections = [
    { label: "Job Description", text: job.description },
    { label: "Responsibilities", text: job.responsibilities },
    { label: "Requirements", text: job.requirements },
  ].filter(({ text }) => text?.trim())
  const companyFacts = [
    { label: "Size", value: job.companySize },
    {
      label: job.industry ? "Industry" : "Category",
      value: job.industry || job.category,
    },
    { label: "Location", value: location },
  ].filter(({ value }) => value)

  return (
    <article className="space-y-5">
      <header
        className={
          panel +
          " flex flex-wrap items-center gap-4 bg-linear-to-br from-[#19191d] to-[#111114] p-5 sm:p-6"
        }
      >
        <div className="grid size-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#101012]">
          <BriefcaseBusiness
            aria-hidden="true"
            className="size-6 text-zinc-300"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {(job.company || job.verifiedEmployer) && (
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-300">
              {job.company}
              {job.verifiedEmployer && (
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <BadgeCheck aria-hidden="true" className="size-4" /> Verified
                  Employer
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[.04]">
            <JobBookmark id={job._id} title={title} />
          </div>
          {applyUrl ? (
            <a
              href={applyUrl}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Apply Now
            </a>
          ) : (
            <span className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-400">
              Applications unavailable
            </span>
          )}
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(({ label, value, icon: Icon }) => (
              <div key={label} className={panel + " min-w-0 p-4"}>
                <Icon
                  aria-hidden="true"
                  className="mb-2 size-4 text-zinc-300"
                />
                <dt className="text-xs tracking-wide text-zinc-400 uppercase">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium wrap-break-word">
                  {value || "Unspecified"}
                </dd>
              </div>
            ))}
          </dl>

          <div className={panel + " divide-y divide-white/[.06] px-5 sm:px-6"}>
            {sections.map(({ label, text }) => (
              <section key={label} className="py-5">
                <h2 className="text-lg font-semibold">{label}</h2>
                <p className="mt-3 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-400">
                  {text}
                </p>
              </section>
            ))}
            {!!job.benefits?.length && (
              <section className="py-5">
                <h2 className="text-lg font-semibold">Benefits</h2>
                <ul className="mt-3 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <BadgeCheck
                        aria-hidden="true"
                        className="size-5 shrink-0 text-zinc-400"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!sections.length && !job.benefits?.length && (
              <p className="py-5 text-sm text-zinc-400">
                No further details provided.
              </p>
            )}
          </div>
        </div>

        <aside aria-labelledby="company-heading" className={panel + " p-5"}>
          <h2 id="company-heading" className="text-lg font-semibold">
            Company Overview
          </h2>
          <div
            className="relative mt-4 grid aspect-video overflow-hidden place-items-center rounded-lg border border-white/[.06] bg-[radial-gradient(ellipse_at_center,#244547_0%,#101c20_48%,#0b1012_80%)]"
          >
            <CompanyImage
              url={job.companyImageUrl}
              alt={job.company ? job.company + " company image" : "Company image"}
              fallback={<Building2 aria-hidden="true" className="size-14 text-teal-100/60" strokeWidth={1} />}
            />
          </div>
          {job.company && (
            <p className="mt-4 font-medium wrap-break-word">{job.company}</p>
          )}
          <dl className="mt-2 divide-y divide-white/[.06]">
            {companyFacts.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-3 py-3"
              >
                <dt className="text-xs tracking-wide text-zinc-400 uppercase">
                  {label}
                </dt>
                <dd className="text-right text-sm wrap-break-word">{value}</dd>
              </div>
            ))}
          </dl>
          {website && (
            <a
              href={website}
              className="mt-3 block rounded-lg border border-white/10 bg-white/[.04] px-4 py-2 text-center text-sm hover:bg-white/10"
            >
              Visit Website
            </a>
          )}
        </aside>
      </div>

      <Link
        href="/browse-jobs"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to Browse Jobs
      </Link>
    </article>
  )
}
