import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardEntryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

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
    // Initial redirect for new users to complete profile or just default to buyer
    redirect("/dashboard/buyer");
  }

  if (userProfile.role === "SELLER") {
    redirect("/dashboard/seller");
  } else {
    redirect("/dashboard/buyer");
  }
}
