import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isUserRole, type UserRole } from "@/lib/roles";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireRole(expectedRole?: UserRole): Promise<UserRole> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const role = session.user.role;
  if (!isUserRole(role) || (expectedRole && role !== expectedRole)) {
    redirect("/unauthorized");
  }

  return role;
}
