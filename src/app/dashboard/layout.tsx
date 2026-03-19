import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileHeader } from "@/components/dashboard/mobile-header";

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
      <MobileHeader role={role} />

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
