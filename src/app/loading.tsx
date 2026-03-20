import { ProductGridSkeleton } from "@/components/shared/ux/skeletons";

export default function Loading() {
  return (
    <div className="container mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-muted rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded-lg animate-pulse" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
