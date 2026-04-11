import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { UserRole } from "@prisma/client";
import { cache } from "react";

/**
 * Gets the current user's profile from the database,
 * or creates it if it doesn't exist yet (syncing with Clerk).
 * Cached per request to prevent duplicate DB calls.
 */
export const getOrCreateUser = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Check if UserProfile exists in Prisma
  let userProfile = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      sellerProfile: true,
    },
  });

  // If not, create one
  if (!userProfile) {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const displayName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const username = clerkUser.username || `user_${userId.substring(0, 8)}`;
    const avatarUrl = clerkUser.imageUrl;

    userProfile = await prisma.userProfile.create({
      data: {
        clerkUserId: userId,
        email: email,
        displayName: displayName,
        username: username,
        avatarUrl: avatarUrl,
        role: "BUYER",
      },
      include: {
        sellerProfile: true,
      },
    });
  }

  return userProfile;
});

/**
 * Returns the current authenticated user's profile.
 * Does not create one if it doesn't exist.
 * Cached per request to prevent duplicate DB calls.
 */
export const getCurrentUserProfile = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      sellerProfile: true,
    },
  });
});

/**
 * Requires an authenticated user and returns their profile.
 * Throws an error if the user is not authenticated.
 */
export async function requireUser() {
  const user = await getOrCreateUser();

  if (!user) {
    throw new Error("Unauthorized: You must be signed in to perform this action.");
  }

  return user;
}

/**
 * Requires the user to have a seller role and profile.
 */
export async function requireSeller() {
  const user = await requireUser();

  if (user.role !== "SELLER" || !user.sellerProfile) {
    throw new Error("Forbidden: You must have a seller profile to perform this action.");
  }

  return user;
}

/**
 * Verifies if the current user owns a specific resource.
 * Returns the user profile if ownership is verified.
 */
export async function requireOwnership(resourceSellerProfileId: string) {
  const user = await requireSeller();

  if (user.sellerProfile?.id !== resourceSellerProfileId) {
    throw new Error("Forbidden: You do not own this resource.");
  }

  return user;
}

/**
 * Checks if a user is signed in and has a profile.
 * Redirects to sign-in if not.
 */
export async function protectRoute() {
  const { userId } = await auth();
  
  if (!userId) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  const user = await getOrCreateUser();
  if (!user) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return user;
}
