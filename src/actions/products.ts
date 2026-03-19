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

  // If title is changing, we might want to update slug, but usually it's better to keep it stable
  // For now, let's just update the fields provided
  
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
 * Deactivates a product (sets status to SOLD_OUT or similar, or just DRAFT).
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
