"use server";

import { getSession, requireRole } from "@/lib/authorization";
import { USER_ROLES } from "@/lib/roles";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function createJob(formData: FormData) {
  await requireRole(USER_ROLES.RECRUITER);
  const session = await getSession();
  if (!session) throw new Error("Sign in again.");

  const job = {
    title: String(formData.get("title") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    category: formData.get("category"),
    employmentType: formData.get("employmentType"),
    remoteAllowed: formData.has("remote"),
    location: formData.get("location"),
    deadline: formData.get("deadline") || null,
    minSalary: formData.get("minSalary"),
    maxSalary: formData.get("maxSalary"),
    frequency: formData.get("frequency"),
    responsibilities: String(formData.get("responsibilities") ?? "").trim(),
    requirements: String(formData.get("requirements") ?? "").trim(),
    companyImageUrl: String(formData.get("companyImageUrl") ?? "").trim(),
    recruiterId: session.user.id,
    createdAt: new Date().toISOString(),
  };

  if (!job.title || !job.company || !job.category || !job.employmentType ||
      !job.responsibilities || !job.requirements) {
    return "Fill in all required fields.";
  }

  const min = job.minSalary ? Number(job.minSalary) : null;
  const max = job.maxSalary ? Number(job.maxSalary) : null;
  if ((min !== null && (!Number.isFinite(min) || min < 0)) ||
      (max !== null && (!Number.isFinite(max) || max < 0)) ||
      (min !== null && max !== null && min > max)) {
    return "Enter a valid salary range.";
  }

  const response = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...job, minSalary: min, maxSalary: max }),
  });

  if (!response.ok) return "Could not publish the job. Please try again.";
  const result = await response.json();
  return result.acknowledged ? null : "The job could not be saved.";
}

export const deleteJob  = async (jobId:string)=>{
  const res= await fetch(`${BASE_URL}/jobs/${jobId}`,{
    method:"DELETE"
  })

if (!res.ok) {
  return "Could not delete this job.";
}

if (res.status === 204) {
  return null;
}

const { deletedCount } = await res.json();
return deletedCount === 1 ? null : "This job was not found.";
}

export async function updateJob(
  jobId: string,
  formData: FormData,
): Promise<string | null> {
  await requireRole(USER_ROLES.RECRUITER);

  const session = await getSession();
 
  if (!session) return "Job updates are unavailable.";

 const read = (name: string) => String(formData.get(name) ?? "").trim();

const minSalary = read("minSalary");
const maxSalary = read("maxSalary");

const fields = {
  title: read("title"),
  company: read("company"),
  category: read("category"),
  employmentType: read("employmentType"),
  remoteAllowed: formData.has("remote"),
  location: read("location"),
  deadline: read("deadline") || null,
  minSalary: minSalary === "" ? null : Number(minSalary),
  maxSalary: maxSalary === "" ? null : Number(maxSalary),
  frequency: read("frequency"),
  responsibilities: read("responsibilities"),
  requirements: read("requirements"),
  ...(formData.has("companyImageUrl") && { companyImageUrl: read("companyImageUrl") }),
};

  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(jobId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
   
      "X-Recruiter-Id": session.user.id,
    },
    body: JSON.stringify(fields ),
  });

  if (res.status === 204) return null;
  if (res.status === 404) return "This job was not found in your account.";
  return "Could not update the job. Please try again.";
}