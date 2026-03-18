import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = await getOrCreateUser();

  if (!userProfile) {
    redirect("/sign-in");
  }

  const role = userProfile.role === "SELLER" ? "seller" : "buyer";

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
          <SheetTrigger>
            <Menu className="h-5 w-5" />
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
