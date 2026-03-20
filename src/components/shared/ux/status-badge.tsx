import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = 
  | "CREATED" | "PAID" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "DISPUTED" | "REFUNDED" | "CANCELLED"
  | "NOT_STARTED" | "FUNDS_LOCKED" | "AWAITING_SHIPMENT" | "IN_TRANSIT" | "AWAITING_CONFIRMATION" | "RELEASED"
  | "OPEN" | "RESOLVED" | "UNDER_REVIEW" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusMap: Record<StatusType, { label: string; color: string }> = {
  // Order Statuses
  CREATED: { label: "Created", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  PAID: { label: "Paid", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  SHIPPED: { label: "Shipped", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  DELIVERED: { label: "Delivered", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  DISPUTED: { label: "Disputed", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  REFUNDED: { label: "Refunded", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  CANCELLED: { label: "Cancelled", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },

  // Escrow Statuses
  NOT_STARTED: { label: "Not Started", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  FUNDS_LOCKED: { label: "Funds Locked", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  AWAITING_SHIPMENT: { label: "Awaiting Shipment", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  IN_TRANSIT: { label: "In Transit", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  AWAITING_CONFIRMATION: { label: "Awaiting Confirmation", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  RELEASED: { label: "Released", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },

  // Dispute Statuses
  OPEN: { label: "Open", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  UNDER_REVIEW: { label: "Under Review", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  RESOLVED: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },

  // Product Statuses
  DRAFT: { label: "Draft", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  PUBLISHED: { label: "Published", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  ARCHIVED: { label: "Archived", color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status as StatusType] || { label: status, color: "bg-muted text-muted-foreground" };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full border transition-all shadow-sm",
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
