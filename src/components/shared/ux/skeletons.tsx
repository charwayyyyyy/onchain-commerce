import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-40 rounded-2xl" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-3xl">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-muted/30">
            <Skeleton className="h-6 w-48 rounded-lg" />
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-3 w-2/3 rounded-lg" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-muted/30">
            <Skeleton className="h-6 w-32 rounded-lg" />
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card key={i} className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2rem]">
          <Skeleton className="aspect-[4/3] w-full" />
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-8 w-1/3 rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
