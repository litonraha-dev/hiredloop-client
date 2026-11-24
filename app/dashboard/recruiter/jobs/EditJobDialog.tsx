"use client"

import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updateJob } from "@/lib/actions/jobs"
import { Job } from "@/lib/api/jobs"
import JobFormFields from "./JobFormFields"


export function EditJobDialog({ job }: {job:Job}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave(formData: FormData) {
    setSaving(true)
    setError(null)

    try {
      const message = await updateJob(job._id, formData)
      if (message) {
        setError(message)
        return
      }

      setOpen(false)
      router.refresh()
    } catch {
      setError("Could not update the job. Please try again.")
    } finally {
      setSaving(false)
    }
    console.log(job, "from edit page")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (saving) return
        setError(null)
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="border-indigo-400/40 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400 hover:bg-indigo-500/25 hover:text-white"
          />
        }
      >
        <Pencil aria-hidden="true" />
        Update
      </DialogTrigger>

      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl" >
        <DialogHeader>
          <DialogTitle>Edit job</DialogTitle>
          <DialogDescription>
            Update the title of this job post.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSave} className="space-y-4">
          <JobFormFields job={job} disabled={saving}/>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
