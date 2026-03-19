"use client";

import React from "react";
import Link from "next/link";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

interface MobileHeaderProps {
  role: "buyer" | "seller";
}

export function MobileHeader({ role }: MobileHeaderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b bg-background h-14">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck size={16} />
          </div>
          <span className="text-lg font-bold tracking-tight">TrustBay</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:hidden items-center justify-between px-4 py-3 border-b bg-background">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck size={16} />
        </div>
        <span className="text-lg font-bold tracking-tight">TrustBay</span>
      </Link>
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          }
        />
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <DashboardSidebar role={role} activeTab="overview" isMobile />
        </SheetContent>
      </Sheet>
    </div>
  );
}
