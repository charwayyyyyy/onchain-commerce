import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch or create user profile to determine role
  let userProfile = null;
  
  if (prisma && process.env.DATABASE_URL) {
    try {
      userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId: userId },
      });
    } catch (e) {
      console.error("Prisma error during build/runtime:", e);
    }
  }

  if (!userProfile) {
    // This is a placeholder for initial profile creation logic
    // In a real app, this would be handled via a webhook or a separate onboarding step
    userProfile = { role: "BUYER" } as any; 
  }

  const role = userProfile?.role === "SELLER" ? "seller" : "buyer";

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <DashboardSidebar role={role} activeTab="overview" />
      <main className="flex-1 overflow-hidden bg-muted/20">
        <ScrollArea className="h-full">
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
