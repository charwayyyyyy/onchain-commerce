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
 * Marks an order as paid.
 * In a real app, this would be triggered by a webhook from a payment provider or blockchain listener.
 */
export async function markOrderPaid(orderId: string, txHash?: string) {
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "CREATED") throw new Error("Order is not in a payable state");

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      escrowStatus: "FUNDS_LOCKED",
      txHash: txHash || order.txHash,
    },
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  return updatedOrder;
}

/**
 * Marks an order as shipped.
 * Only the seller can perform this action.
 */
export async function markOrderShipped(orderId: string, shipmentReference: string) {
  const user = await requireSeller();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.sellerProfileId !== user.sellerProfile!.id) throw new Error("Not authorized");
  if (order.status !== "PAID") throw new Error("Order must be paid before shipping");

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "SHIPPED",
      escrowStatus: "IN_TRANSIT",
      shipmentReference,
      shippedAt: new Date(),
    },
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  return updatedOrder;
}

/**
 * Confirms delivery of an order.
 * Only the buyer can perform this action.
 */
export async function confirmDelivery(orderId: string) {
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.buyerProfileId !== user.id) throw new Error("Not authorized");
  if (order.status !== "SHIPPED") throw new Error("Order must be shipped before confirming delivery");

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "DELIVERED",
      escrowStatus: "AWAITING_CONFIRMATION",
      deliveredAt: new Date(),
    },
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  return updatedOrder;
}

/**
 * Completes an order and releases funds from escrow.
 * Usually happens after buyer confirms delivery or a timeout.
 */
export async function completeOrder(orderId: string) {
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "DELIVERED") throw new Error("Order must be delivered before completion");

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "COMPLETED",
      escrowStatus: "RELEASED",
      completedAt: new Date(),
    },
  });

  // Increment seller's total sales
  await prisma.sellerProfile.update({
    where: { id: order.sellerProfileId },
    data: { totalSales: { increment: 1 } },
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  return updatedOrder;
}

/**
 * Cancels an order.
 * Can be done by buyer if not yet paid, or seller if not yet shipped.
 */
export async function cancelOrder(orderId: string, reason: string) {
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");

  const isBuyer = order.buyerProfileId === user.id;
  const isSeller = user.sellerProfile && order.sellerProfileId === user.sellerProfile.id;

  if (!isBuyer && !isSeller) throw new Error("Not authorized");

  // Logic for cancellation eligibility
  if (order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED") {
    throw new Error("Order cannot be cancelled at this stage");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      escrowStatus: order.status === "PAID" ? "REFUNDED" : "NOT_STARTED",
    },
  });

  // Restock items
  const orderItems = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }

  revalidatePath(`/dashboard/orders/${orderId}`);
  return updatedOrder;
}

/**
 * Opens a dispute for an order.
 */
export async function openDispute(orderId: string, reason: string, description: string) {
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.buyerProfileId !== user.id && (!user.sellerProfile || order.sellerProfileId !== user.sellerProfile.id)) {
    throw new Error("Not authorized");
  }

  const dispute = await prisma.$transaction(async (tx) => {
    const newDispute = await tx.dispute.create({
      data: {
        orderId,
        openedByProfileId: user.id,
        reason,
        description,
        status: "OPEN",
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "DISPUTED",
        escrowStatus: "DISPUTED",
        disputedAt: new Date(),
      },
    });

    return newDispute;
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/disputes");
  
  return dispute;
}
