import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UserDetail } from "@/components/user-detail";
import { RouteFallback } from "@/components/route-fallback";

export const instant = false;

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<RouteFallback label="Loading user profile" />}>
      <UserById params={params} />
    </Suspense>
  );
}

async function UserById({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) notFound();
  return <UserDetail id={userId} />;
}
