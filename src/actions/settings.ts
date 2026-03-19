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

/**
 * Updates the user's public profile settings.
 */
export async function updateProfileSettings(values: ProfileSettingsValues) {
  const user = await requireUser();
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

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/profile");
  return { success: true, user: updatedUser };
}

/**
 * Updates the user's notification preferences.
 */
export async function updateNotificationSettings(values: NotificationSettingsValues) {
  const user = await requireUser();
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

  revalidatePath("/dashboard/settings");
  return { success: true, user: updatedUser };
}

/**
 * Updates the user's payment settings (Seller Payout Wallet).
 */
export async function updatePaymentSettings(values: PaymentSettingsValues) {
  const user = await requireUser();
  
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

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/seller");
  return { success: true, seller: updatedSeller };
}

/**
 * Updates general user preferences (language, currency).
 */
export async function updatePreferenceSettings(values: PreferenceSettingsValues) {
  const user = await requireUser();
  const validatedData = preferenceSettingsSchema.parse(values);

  const updatedUser = await prisma.userProfile.update({
    where: { id: user.id },
    data: {
      preferredLanguage: validatedData.preferredLanguage,
      preferredCurrency: validatedData.preferredCurrency,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true, user: updatedUser };
}
