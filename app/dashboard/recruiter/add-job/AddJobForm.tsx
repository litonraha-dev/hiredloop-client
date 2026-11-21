"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createJob } from "@/lib/actions/jobs";

const labelStyle = "block min-w-0 space-y-1 text-sm font-medium";
const controlStyle = "block w-full rounded-lg border border-transparent bg-[#222225] px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-indigo-400";
const sectionStyle = "space-y-4 rounded-xl bg-[#18181a] p-4 sm:p-5";

export function AddJobForm() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true);
    setError("");
    setPublished(false);

    try {
      const message = await createJob(data);
      if (message) {
        setError(message);
      } else {
        form.reset();
        setPublished(true);
      }
    } catch {
      setError("Could not publish the job. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-3">
        <div>
          <p className="text-xs text-zinc-400">
            <Link href="/dashboard/recruiter/jobs" className="hover:text-white">Manage Jobs</Link>
            {" › "}<span className="text-indigo-300">Create New Listing</span>
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Post a New Job</h1>
          <p className="mt-1 text-sm text-zinc-400">Fill in the position details to attract qualified candidates.</p>
        </div>
        <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
          {saving ? "Publishing…" : "Publish Job →"}
        </button>
      </header>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {published && <p role="status" className="text-sm text-emerald-300">Job published.</p>}

      <fieldset disabled={saving} className="min-w-0 space-y-4">
        <section className={sectionStyle}>
          <h2 className="text-sm font-semibold"><span className="text-indigo-400">●</span> 1. Basic Information</h2>
          <label className={labelStyle}>Job Title *<input name="title" required maxLength={120} placeholder="Frontend Developer" className={controlStyle} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelStyle}>Company Name *<input name="company" required maxLength={120} placeholder="Company name" className={controlStyle} /></label>
            <label className={labelStyle}>
              Job Category *
              <select name="category" required defaultValue="" className={controlStyle}>
                <option value="" disabled>Select a category</option>
                {["Engineering & Tech","Design","Sales & Marketing","Operations","Finance","Other"].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Job Type *</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                <label key={type} className="cursor-pointer">
                  <input type="radio" name="employmentType" value={type} defaultChecked={type === "Full-time"} required className="peer sr-only" />
                  <span className="block rounded-lg border border-transparent bg-[#222225] px-2 py-2 text-center text-sm text-zinc-400 peer-checked:border-indigo-500 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400">{type}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className={sectionStyle}>
          <h2 className="text-sm font-semibold"><span className="text-indigo-400">●</span> 2. Location, Compensation & Timeline</h2>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-[#222225] p-3">
            <span>
              <span className="block text-sm font-medium">Remote Work Allowed</span>
              <span className="block text-xs text-zinc-400">Enable applications from remote candidates.</span>
            </span>
            <input type="checkbox" name="remote" role="switch" className="peer sr-only" />
            <span aria-hidden="true" className="relative h-5 w-9 shrink-0 rounded-full bg-zinc-600 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelStyle}>Job Location<input name="location" placeholder="New York, USA" className={controlStyle} /></label>
            <label className={labelStyle}>Application Deadline<input name="deadline" type="date" className={controlStyle} /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelStyle}>Min Salary / Rate<input name="minSalary" type="number" min="0" step="0.01" placeholder="€ 25" className={controlStyle} /></label>
            <label className={labelStyle}>Max Salary / Rate<input name="maxSalary" type="number" min="0" step="0.01" placeholder="€ 40" className={controlStyle} /></label>
            <label className={labelStyle}>
              Frequency
              <select name="frequency" defaultValue="" className={controlStyle}>
                <option value="" >Select a frequency</option>
                {["Per hour","Per month","Per year"].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className={sectionStyle}>
          <h2 className="text-sm font-semibold"><span className="text-indigo-400">●</span> 3. Responsibilities & Requirements</h2>
          <label className={labelStyle}>
            Key Responsibilities *
            <textarea name="responsibilities" rows={4} required className={controlStyle} placeholder="Describe what the candidate will do." />
          </label>
          <label className={labelStyle}>
            Qualifications & Requirements *
            <textarea name="requirements" rows={4} required className={controlStyle} placeholder="List the skills and experience needed." />
          </label>
        </section>
      </fieldset>
    </form>
  );
}
