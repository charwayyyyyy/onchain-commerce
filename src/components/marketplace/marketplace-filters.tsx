"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All Categories", "Electronics", "Collectibles", "Fashion", "Real Estate", "Services"];
const TOKENS = ["USDC", "ETH", "USDT"];
const CONDITIONS = ["NEW", "LIKE_NEW", "PRE_OWNED", "REFURBISHED"];

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "All Categories";
  const currentToken = searchParams.get("token");
  const currentCondition = searchParams.get("condition");

  const updateFilters = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Categories") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      startTransition(() => {
        router.push(`/marketplace?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground flex items-center gap-2">
          <Filter size={12} /> Categories
        </h3>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              onClick={() => updateFilters("category", cat)}
              className={cn(
                "justify-start text-sm font-bold h-11 rounded-xl px-4 transition-all",
                currentCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-primary/5 hover:text-primary"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>
      <Separator className="opacity-50" />
      <div>
        <h3 className="mb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Payment Token</h3>
        <div className="flex flex-wrap gap-2">
          {TOKENS.map((token) => (
            <Badge
              key={token}
              variant="outline"
              onClick={() => updateFilters("token", currentToken === token ? null : token)}
              className={cn(
                "cursor-pointer px-4 py-2 rounded-xl transition-all border-2 font-bold text-xs",
                currentToken === token ? "bg-primary text-primary-foreground border-primary" : "border-muted hover:bg-primary/5 hover:text-primary"
              )}
            >
              {token}
            </Badge>
          ))}
        </div>
      </div>
      <Separator className="opacity-50" />
      <div>
        <h3 className="mb-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Condition</h3>
        <div className="flex flex-col gap-4 px-1">
          {CONDITIONS.map((cond) => (
            <div
              key={cond}
              onClick={() => updateFilters("condition", currentCondition === cond ? null : cond)}
              className="flex items-center gap-3 text-sm font-bold group cursor-pointer"
            >
              <div className={cn(
                "h-5 w-5 rounded-md border-2 transition-colors flex items-center justify-center",
                currentCondition === cond ? "border-primary bg-primary" : "border-muted group-hover:border-primary"
              )}>
                {currentCondition === cond && <div className="h-2.5 w-2.5 rounded-sm bg-primary-foreground" />}
              </div>
              <label className="cursor-pointer group-hover:text-primary transition-colors">{cond.replace("_", " ")}</label>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          startTransition(() => {
            router.push("/marketplace", { scroll: false });
          });
        }}
        className="mt-4 rounded-xl border-2 font-black uppercase tracking-widest text-[10px]"
      >
        Clear All
      </Button>
    </div>
  );
}
