"use client";

import { ErrorState } from "@/components/shared/ux/error-state";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-12 px-4 flex items-center justify-center min-h-[50vh]">
      <ErrorState 
        title="Dashboard Error"
        description="We encountered an issue loading your dashboard data. This might be a temporary connectivity problem."
        error={error}
        reset={reset}
        className="max-w-2xl w-full"
      />
    </div>
  );
}
