import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto max-w-lg space-y-4 px-6 py-12">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p>Your account does not have access to this page.</p>
      <Link href="/" className="underline">Back to home</Link>
    </main>
  );
}
