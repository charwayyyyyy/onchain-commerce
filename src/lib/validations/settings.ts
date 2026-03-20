import * as z from "zod";

export const profileSettingsSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50).optional().nullable(),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").optional().nullable(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  avatarUrl: z.string().optional().nullable().or(z.literal("")), // Removed .url() to allow base64 and internal paths
});

export const notificationSettingsSchema = z.object({
  notificationOrderUpdates: z.boolean(),
  notificationDisputeUpdates: z.boolean(),
  notificationSellerActivity: z.boolean(),
  notificationMarketing: z.boolean(),
  notificationSecurity: z.boolean(),
});

export const paymentSettingsSchema = z.object({
  payoutWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum/Polygon wallet address").optional().nullable(),
  preferredPayoutNetwork: z.string(),
});

export const preferenceSettingsSchema = z.object({
  preferredLanguage: z.string(),
  preferredCurrency: z.string(),
});

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
export type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>;
export type PreferenceSettingsValues = z.infer<typeof preferenceSettingsSchema>;
