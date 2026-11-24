"use client"

import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteJob } from "@/lib/actions/jobs"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
type DeleteJobDialogProps = {
  jobId: string
  jobTitle?: string
}

export function DeleteJobDialog({ jobId, jobTitle }: DeleteJobDialogProps) {
  const title = jobTitle?.trim() || "Untitled job"

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDeleteJob() {
    setIsDeleting(true)
    setError(null)

    try {
      const message = await deleteJob(jobId)

      if (message) {
        setError(message)
        return
      }

      setOpen(false)
      toast.error(`“${title}” was deleted.`)
      router.refresh()
    } catch {
      setError("Could not delete the job. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            aria-label={`Delete ${jobTitle || "job"}`}
          >
            <Trash2Icon aria-hidden="true" />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete job post?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete “{title}”?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteJob}
            type="button"
            disabled={isDeleting }
            aria-label={`delete ${title}`}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
