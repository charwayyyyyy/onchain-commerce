"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { sellerProfileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Onboards the current user as a seller.
 */
export async function onboardAsSeller(formData: {
  storeName: string;
  bio?: string;
  payoutWalletAddress: string;
  bannerImage?: string;
}) {
  const user = await requireUser();

  // Validate the form data
  const validatedData = sellerProfileSchema.parse(formData);

  // Check if the user is already a seller
  if (user.role === "SELLER") {
    throw new Error("Bad Request: You are already a seller on TrustBay.");
  }

  // Create the SellerProfile and update the UserProfile in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.sellerProfile.create({
      data: {
        userProfileId: user.id,
        storeName: validatedData.storeName,
        bio: validatedData.bio,
        payoutWalletAddress: validatedData.payoutWalletAddress,
        bannerImage: validatedData.bannerImage,
      },
    });

    await tx.userProfile.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/seller");
  revalidatePath("/dashboard/profile");

  redirect("/dashboard/seller");
}
