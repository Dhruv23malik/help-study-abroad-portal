import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin-shell";
import { RouteFallback } from "@/components/route-fallback";

export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<RouteFallback label="Checking admin access" />}>
      <ProtectedAdmin>{children}</ProtectedAdmin>
    </Suspense>
  );
}

async function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <AdminShell>{children}</AdminShell>;
}
