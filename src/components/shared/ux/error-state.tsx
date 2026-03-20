import React from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while processing your request.",
  error,
  reset,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center bg-destructive/5 rounded-[3rem] border-2 border-destructive/10 transition-all",
        className
      )}
    >
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-destructive text-destructive-foreground shadow-2xl shadow-destructive/20 animate-in zoom-in duration-300">
        <AlertCircle size={48} strokeWidth={1.5} />
      </div>
      
      <h2 className="text-3xl font-black tracking-tight mb-3 uppercase tracking-tighter">
        {title}
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-4 font-medium leading-relaxed">
        {description}
      </p>

      {error && (
        <div className="mb-10 p-4 bg-muted/50 rounded-2xl border border-muted-foreground/10 max-w-lg">
          <p className="text-[10px] font-mono text-muted-foreground break-all uppercase tracking-widest mb-1 opacity-50">
            Error Digest: {error.digest || "N/A"}
          </p>
          <p className="text-xs font-bold text-destructive/80 italic">
            {error.message || "Unknown technical failure."}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        {reset && (
          <Button 
            onClick={reset}
            className="flex-1 h-14 gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-destructive/20 transition-all active:scale-95"
          >
            <RotateCcw size={16} /> Retry
          </Button>
        )}
        <Link href="/" className="flex-1">
          <Button 
            variant="outline"
            className="w-full h-14 gap-2 font-black uppercase tracking-widest text-xs rounded-2xl border-2 hover:bg-muted transition-all active:scale-95"
          >
            <Home size={16} /> Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
