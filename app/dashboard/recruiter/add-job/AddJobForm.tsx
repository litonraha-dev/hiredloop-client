"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createJob } from "@/lib/actions/jobs";
import JobFormFields from "../jobs/JobFormFields";


export function AddJobForm() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const form = event.currentTarget;
    const job = new FormData(form);
    setSaving(true);
    setError("");
    setPublished(false);

    try {
      const message = await createJob(job);
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
      <JobFormFields  disabled={saving} />
    </form>
  );
}
