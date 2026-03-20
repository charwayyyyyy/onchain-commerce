import React from "react";
import { LucideIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted transition-all",
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-background shadow-xl text-muted-foreground/40">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8 font-medium leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="h-12 px-8 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
