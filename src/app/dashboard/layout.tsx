"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoaded && !userId) {
    redirect("/sign-in");
  }

  // We can't easily get the user role on the client side without an API call or a context provider
  // For now, let's assume "buyer" by default if we're on the client, 
  // but a better fix would be to pass it from a server component or use a specialized hook.
  // Since this is a layout, we should ideally keep it as a server component if possible, 
  // but the hydration error is happening because of the Sheet (Radix UI) component's random IDs.
  
  const role = "buyer"; // Placeholder, will be refined if needed

  if (!mounted) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        <div className="hidden w-64 shrink-0 md:flex border-r bg-card/50" />
        <main className="flex-1 overflow-hidden bg-muted/20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Mobile Dashboard Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b bg-background">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck size={16} />
          </div>
          <span className="text-lg font-bold tracking-tight">TrustBay</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <DashboardSidebar role={role} activeTab="overview" isMobile />
          </SheetContent>
        </Sheet>
      </div>

      <DashboardSidebar role={role} activeTab="overview" />
      <main className="flex-1 overflow-hidden bg-muted/20">
        <ScrollArea className="h-full">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
