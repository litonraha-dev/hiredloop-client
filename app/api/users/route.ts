import { db } from "@/lib/auth";
import { getSession } from "@/lib/authorization";
import { USER_ROLES } from "@/lib/roles";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Sign-in required" }, { status: 401 });
  }
  if (session.user.role !== USER_ROLES.ADMIN) {
    return Response.json({ error: "Access denied" }, { status: 403 });
  }

  const users = await db.collection("user").find(
    {},
    { projection: { name: 1, email: 1, role: 1 } },
  ).toArray();

  return Response.json(users, { headers: { "Cache-Control": "private, no-store" } });
}
