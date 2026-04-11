"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export function MarketplaceSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "latest";
  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Latest";

  const handleSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "latest") {
        params.set("sort", value);
      } else {
        params.delete("sort");
      }
      startTransition(() => {
        router.push(`/marketplace?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-primary/5 transition-all">
          Sort: {currentSortLabel} <ChevronDown className="h-4 w-4" />   
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-2 p-2 min-w-[180px]">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSort(option.value)}
            className="rounded-xl font-bold text-xs uppercase tracking-widest p-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-all"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
