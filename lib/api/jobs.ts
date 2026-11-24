export type Job = {
  _id: string;
  title?: string;
  company?: string;
  category?: string;
  location?: string;
  remoteAllowed?: boolean;
  employmentType?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  frequency?: string;
  applicantCount?: number;
  deadline?: string | null;
   responsibilities?: string;
 requirements?: string;
};
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getJobs(query=''): Promise<Job[]> {
  const res = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Could not load jobs");
  }

  return res.json();
}