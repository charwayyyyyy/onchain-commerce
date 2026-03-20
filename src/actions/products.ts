"use server";

import prisma from "@/lib/prisma";
import { requireSeller, requireUser } from "@/lib/auth";
import { productSchema, ProductFormValues } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductStatus } from "@prisma/client";

/**
 * Creates a new product for the authenticated seller.
 */
export async function createProduct(formData: ProductFormValues) {
  const user = await requireSeller();

  // Validate the form data
  const validatedData = productSchema.parse(formData);

  // Generate a unique slug for the product
  const slug = `${validatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

  // Create the product in the database
  const product = await prisma.product.create({
    data: {
      sellerProfileId: user.sellerProfile!.id,
      categoryId: validatedData.categoryId,
      title: validatedData.title,
      slug: slug,
      shortDescription: validatedData.shortDescription,
      description: validatedData.description,
      price: validatedData.price,
      paymentToken: validatedData.paymentToken,
      stock: validatedData.stock,
      condition: validatedData.condition,
      status: "PUBLISHED",
      deliveryEstimate: validatedData.deliveryEstimate,
      shippingRegions: validatedData.shippingRegions,
    },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/seller");
  revalidatePath("/dashboard/products");

  return product;
}

/**
 * Updates an existing product's information.
 */
export async function updateProduct(productId: string, formData: Partial<ProductFormValues>) {
  const user = await requireSeller();

  // Verify the product belongs to this seller
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct || existingProduct.sellerProfileId !== user.sellerProfile!.id) {
    throw new Error("Forbidden: You do not have permission to update this product.");
  }

  // Update the product
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...formData,
    },
  });

  revalidatePath(`/marketplace/${product.id}`);
  revalidatePath("/dashboard/seller");
  revalidatePath("/dashboard/products");
  revalidatePath(`/marketplace/product/${product.slug}`);

  return product;
}

/**
 * Deactivates a product (sets status to DRAFT).
 */
export async function deactivateProduct(productId: string) {
  const user = await requireSeller();

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct || existingProduct.sellerProfileId !== user.sellerProfile!.id) {
    throw new Error("Forbidden: You do not have permission to update this product.");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: { status: "DRAFT" },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/products");

  return product;
}

/**
 * Archives a product (sets status to ARCHIVED).
 */
export async function archiveProduct(productId: string) {
  const user = await requireSeller();

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct || existingProduct.sellerProfileId !== user.sellerProfile!.id) {
    throw new Error("Forbidden: You do not have permission to archive this product.");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/seller");
  revalidatePath("/dashboard/products");

  return product;
}

/**
 * Updates stock levels for a product.
 */
export async function updateStock(productId: string, newStock: number) {
  const user = await requireSeller();

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct || existingProduct.sellerProfileId !== user.sellerProfile!.id) {
    throw new Error("Forbidden: You do not have permission to update stock for this product.");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });

  revalidatePath(`/marketplace/${productId}`);
  revalidatePath("/dashboard/products");

  return product;
}

/**
 * Fetches all published products from the marketplace.
 */
export async function getMarketplaceProducts() {
  return await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      sellerProfile: true,
      category: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Fetches a single product's details by its ID.
 */
export async function getProductById(productId: string) {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      sellerProfile: {
        include: {
          userProfile: true,
        },
      },
      category: true,
      images: true,
      reviews: {
        include: {
          buyerProfile: true,
        },
      },
    },
  });
}

/**
 * Fetches products belonging to the current authenticated seller.
 */
export async function getSellerProducts() {
  const user = await requireSeller();

  return await prisma.product.findMany({
    where: { sellerProfileId: user.sellerProfile!.id },
    include: {
      category: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Adds a product to the user's wishlist.
 */
export async function addToWishlist(productId: string) {
  const user = await requireUser();

  // Rule: Product must exist and be published to be added to wishlist
  const product = await prisma.product.findUnique({
    where: { id: productId, status: "PUBLISHED" },
  });

  if (!product) {
    throw new Error("Product not found or no longer available.");
  }

  const existingWishlist = await prisma.wishlist.findUnique({
    where: { userProfileId: user.id },
  });

  // Rule: Prevent duplicates
  if (existingWishlist?.productIds.includes(productId)) {
    return existingWishlist;
  }

  const wishlist = await prisma.wishlist.upsert({
    where: { userProfileId: user.id },
    update: {
      productIds: {
        push: productId,
      },
    },
    create: {
      userProfileId: user.id,
      productIds: [productId],
    },
  });

  revalidatePath("/dashboard/wishlist");
  return wishlist;
}

/**
 * Removes a product from the user's wishlist.
 */
export async function removeFromWishlist(productId: string) {
  const user = await requireUser();

  const wishlist = await prisma.wishlist.findUnique({
    where: { userProfileId: user.id },
  });

  if (!wishlist) return null;

  const updatedWishlist = await prisma.wishlist.update({
    where: { userProfileId: user.id },
    data: {
      productIds: {
        set: wishlist.productIds.filter((id) => id !== productId),
      },
    },
  });

  revalidatePath("/dashboard/wishlist");
  return updatedWishlist;
}

/**
 * Fetches all products in the user's wishlist.
 */
export async function getWishlistProducts() {
  const user = await requireUser();

  const wishlist = await prisma.wishlist.findUnique({
    where: { userProfileId: user.id },
  });

  if (!wishlist || wishlist.productIds.length === 0) return [];

  return await prisma.product.findMany({
    where: {
      id: { in: wishlist.productIds },
      status: "PUBLISHED",
    },
    include: {
      images: true,
      sellerProfile: true,
    },
  });
}
