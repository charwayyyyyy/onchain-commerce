"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";

export function MarketplaceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    startTransition(() => {
      router.push(`/marketplace?${createQueryString("q", term)}`, { scroll: false });
    });
  }, 300);

  return (
    <div className="relative flex-1 md:w-80 group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        placeholder="Search products..."
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-12 h-14 rounded-2xl border-2 border-transparent bg-muted/30 focus:bg-background focus:border-primary transition-all font-bold text-base shadow-sm"
      />
      {searchParams.get("q") && (
        <button
          onClick={() => {
            router.push(`/marketplace?${createQueryString("q", "")}`, { scroll: false });
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
