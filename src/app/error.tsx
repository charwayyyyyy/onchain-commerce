"use client";

import { ErrorState } from "@/components/shared/ux/error-state";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-24 px-4 flex items-center justify-center min-h-[60vh]">
      <ErrorState 
        title="Global Error"
        description="A critical error occurred at the application level. Our team has been notified."
        error={error}
        reset={reset}
        className="max-w-2xl w-full"
      />
    </div>
  );
}
