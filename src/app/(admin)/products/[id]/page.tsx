import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { RouteFallback } from "@/components/route-fallback";

export const instant = false;

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<RouteFallback label="Loading product details" />}>
      <ProductById params={params} />
    </Suspense>
  );
}

async function ProductById({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId < 1) notFound();
  return <ProductDetail id={productId} />;
}
