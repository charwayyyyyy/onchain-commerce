"use server";

import prisma from "@/lib/prisma";
import { requireUser, requireSeller } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus, EscrowStatus } from "@prisma/client";

/**
 * Creates a new order for a product.
 * Simulated escrow funds locked.
 */
export async function createOrder(productId: string, quantity: number, shippingAddress: any) {
  const user = await requireUser();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { sellerProfile: true },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock.");
  }

  const subtotal = product.price * quantity;
  const platformFee = subtotal * 0.02; // 2% fee
  const total = subtotal + platformFee;

  // Create order in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // 1. Create the order
    const newOrder = await tx.order.create({
      data: {
        buyerProfileId: user.id,
        sellerProfileId: product.sellerProfileId,
        status: "PAID", // Simulated payment success
        escrowStatus: "FUNDS_LOCKED", // Simulated funds locked in contract
        subtotal: subtotal,
        platformFee: platformFee,
        total: total,
        paymentToken: product.paymentToken,
        shippingAddressSnapshot: shippingAddress,
        items: {
          create: {
            productId: product.id,
            titleSnapshot: product.title,
            quantity: quantity,
            unitPrice: product.price,
          },
        },
      },
    });

    // 2. Update product stock
    await tx.product.update({
      where: { id: product.id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return newOrder;
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
  revalidatePath(`/marketplace/${productId}`);

  return order;
}

/**
 * Fetches orders for the current authenticated buyer.
 */
export async function getBuyerOrders() {
  const user = await requireUser();

  return await prisma.order.findMany({
    where: { buyerProfileId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      sellerProfile: true,
      buyerProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Fetches orders for the current authenticated seller.
 */
export async function getSellerOrders() {
  const user = await requireSeller();

  return await prisma.order.findMany({
    where: { sellerProfileId: user.sellerProfile!.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      buyerProfile: true,
      sellerProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Updates order status (e.g., mark as shipped).
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  // Permission checks would go here based on status change
  // For example, only seller can mark as SHIPPED

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { 
      status,
      // Update escrow status based on order status
      escrowStatus: status === "SHIPPED" ? "IN_TRANSIT" : undefined,
    },
  });

  revalidatePath("/dashboard/orders");
  return updatedOrder;
}
