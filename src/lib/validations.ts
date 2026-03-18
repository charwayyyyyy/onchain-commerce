import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  paymentToken: z.enum(["USDC", "ETH", "USDT"]),
  stock: z.coerce.number().int().min(1, "Stock must be at least 1"),
  categoryId: z.string().min(1, "Please select a category"),
  condition: z.enum(["NEW", "LIKE_NEW", "PRE_OWNED", "REFURBISHED"]),
  shippingRegions: z.array(z.string()).min(1, "Select at least one shipping region"),
  deliveryEstimate: z.string().min(1, "Provide a delivery estimate"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const userProfileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
  role: z.enum(["BUYER", "SELLER"]),
});

export const sellerProfileSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  payoutWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  bannerImage: z.string().url("Invalid banner image URL").optional(),
});
