import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardEntryPage() {
  const userProfile = await getOrCreateUser();

  if (!userProfile) {
    redirect("/sign-in");
  }

  if (userProfile.role === "SELLER") {
    redirect("/dashboard/seller");
  } else {
    redirect("/dashboard/buyer");
  }
}
