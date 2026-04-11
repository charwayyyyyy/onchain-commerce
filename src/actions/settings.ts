"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { 
  profileSettingsSchema, 
  notificationSettingsSchema, 
  paymentSettingsSchema, 
  preferenceSettingsSchema,
  ProfileSettingsValues,
  NotificationSettingsValues,
  PaymentSettingsValues,
  PreferenceSettingsValues
} from "@/lib/validations/settings";
import { revalidatePath } from "next/cache";

import { handleActionError, actionSuccess, ActionResponse } from "@/lib/utils";
import { UserProfile, SellerProfile } from "@prisma/client";

/**
 * Updates the user's public profile settings.
 */
export async function updateProfileSettings(values: ProfileSettingsValues): Promise<ActionResponse<UserProfile>> {
  const user = await requireUser();
  try {
    const validatedData = profileSettingsSchema.parse(values);

    // Check username uniqueness if it's being changed
    if (validatedData.username && validatedData.username !== user.username) {
      const existing = await prisma.userProfile.findUnique({
        where: { username: validatedData.username },
      });
      if (existing) {
        throw new Error("Username is already taken.");
      }
    }

    const updatedUser = await prisma.userProfile.update({
      where: { id: user.id },
      data: {
        displayName: validatedData.displayName,
        username: validatedData.username,
        bio: validatedData.bio,
        avatarUrl: validatedData.avatarUrl,
      },
    });

    // Round-trip verification: refetch to ensure it's in the DB
    const verifiedUser = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    if (!verifiedUser) throw new Error("Failed to verify update");

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/profile");
    return actionSuccess(verifiedUser, "Profile updated successfully");
  } catch (error) {
    return handleActionError(error, "updateProfileSettings", user.id);
  }
}

/**
 * Updates the user's notification preferences.
 */
export async function updateNotificationSettings(values: NotificationSettingsValues): Promise<ActionResponse<UserProfile>> {
  const user = await requireUser();
  try {
    const validatedData = notificationSettingsSchema.parse(values);

    const updatedUser = await prisma.userProfile.update({
      where: { id: user.id },
      data: {
        notificationOrderUpdates: validatedData.notificationOrderUpdates,
        notificationDisputeUpdates: validatedData.notificationDisputeUpdates,
        notificationSellerActivity: validatedData.notificationSellerActivity,
        notificationMarketing: validatedData.notificationMarketing,
        notificationSecurity: validatedData.notificationSecurity,
      },
    });

    // Round-trip verification
    const verifiedUser = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    if (!verifiedUser) throw new Error("Failed to verify notification update");

    revalidatePath("/dashboard/settings");
    return actionSuccess(verifiedUser, "Notification preferences saved");
  } catch (error) {
    return handleActionError(error, "updateNotificationSettings", user.id);
  }
}

/**
 * Updates the user's payment settings (Seller Payout Wallet).
 */
export async function updatePaymentSettings(values: PaymentSettingsValues): Promise<ActionResponse<SellerProfile>> {
  const user = await requireUser();
  
  try {
    if (user.role !== "SELLER" || !user.sellerProfile) {
      throw new Error("You must have a seller profile to update payout settings.");
    }

    const validatedData = paymentSettingsSchema.parse(values);

    const updatedSeller = await prisma.sellerProfile.update({
      where: { id: user.sellerProfile.id },
      data: {
        payoutWalletAddress: validatedData.payoutWalletAddress,
        preferredPayoutNetwork: validatedData.preferredPayoutNetwork,
      },
    });

    // Round-trip verification
    const verifiedSeller = await prisma.sellerProfile.findUnique({
      where: { id: user.sellerProfile.id },
    });

    if (!verifiedSeller) throw new Error("Failed to verify payment update");

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/seller");
    return actionSuccess(verifiedSeller, "Payout settings verified and saved");
  } catch (error) {
    return handleActionError(error, "updatePaymentSettings", user.id);
  }
}

/**
 * Updates general user preferences (language, currency).
 */
export async function updatePreferenceSettings(values: PreferenceSettingsValues): Promise<ActionResponse<UserProfile>> {
  const user = await requireUser();
  try {
    const validatedData = preferenceSettingsSchema.parse(values);

    const updatedUser = await prisma.userProfile.update({
      where: { id: user.id },
      data: {
        preferredLanguage: validatedData.preferredLanguage,
        preferredCurrency: validatedData.preferredCurrency,
      },
    });

    // Round-trip verification
    const verifiedUser = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    if (!verifiedUser) throw new Error("Failed to verify preference update");

    revalidatePath("/dashboard/settings");
    return actionSuccess(verifiedUser, "Preferences updated");
  } catch (error) {
    return handleActionError(error, "updatePreferenceSettings", user.id);
  }
}
