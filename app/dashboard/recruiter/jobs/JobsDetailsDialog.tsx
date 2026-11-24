import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Job } from "@/lib/api/jobs";


export function JobDetailsDialog({ job }: { job: Job }) {
  const title = job.title?.trim() || "Untitled job";

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`View details for ${title}`}
          >
            <Eye aria-hidden="true" />
          </Button>
        }
      />


      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Job post details</DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium">Company</dt>
            <dd>{job.company || "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Category</dt>
            <dd>{job.category || "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Location</dt>
            <dd>
              {[job.remoteAllowed ? "Remote" : "", job.location]
                .filter(Boolean)
                .join(" · ") || "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Employment type</dt>
            <dd>{job.employmentType || "—"}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium">Responsibilities</dt>
            <dd className="whitespace-pre-wrap">
              {job.responsibilities || "—"}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium">Requirements</dt>
            <dd className="whitespace-pre-wrap">
              {job.requirements || "—"}
            </dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}