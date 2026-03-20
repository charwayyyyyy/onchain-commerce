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

  // Create order in a transaction to ensure stock safety and atomicity
  const order = await prisma.$transaction(async (tx) => {
    // 1. Re-fetch product inside transaction to get latest stock and ensure it's still available
    const product = await tx.product.findUnique({
      where: { id: productId },
      include: { sellerProfile: true },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (product.status !== "PUBLISHED") {
      throw new Error("This product is no longer available for purchase.");
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Only ${product.stock} items remaining.`);
    }

    const subtotal = product.price * quantity;
    const platformFee = subtotal * 0.02; // 2% fee
    const total = subtotal + platformFee;

    // 2. Create the order
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

    // 3. Update product stock (decrement)
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
  
  // Rule: Only the buyer of the order can initiate payment marking (in this simulated flow)
  if (order.buyerProfileId !== user.id) throw new Error("Unauthorized: Only the buyer can pay for this order");
  
  // Rule: Order must be in CREATED state to move to PAID
  if (order.status !== "CREATED") {
    throw new Error(`Invalid transition: Cannot pay for an order in ${order.status} state`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      escrowStatus: "FUNDS_LOCKED",
      txHash: txHash || order.txHash,
    },
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
  return updatedOrder;
}

/**
 * Marks an order as shipped.
 * Only the seller can perform this action.
 */
export async function markOrderShipped(orderId: string, shipmentReference: string) {
  const user = await requireSeller();

  if (!shipmentReference || shipmentReference.trim().length < 3) {
    throw new Error("Invalid shipment reference: Please provide a valid tracking number or reference.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.sellerProfileId !== user.sellerProfile!.id) throw new Error("Unauthorized: Only the seller can mark this order as shipped");
  
  // Idempotency Guard: If already shipped, return success early
  if (order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED") {
    return order;
  }

  // Rule: Order must be PAID before it can be SHIPPED
  if (order.status !== "PAID") {
    throw new Error(`Invalid transition: Order must be PAID before shipping. Current status: ${order.status}`);
  }

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
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
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
  if (order.buyerProfileId !== user.id) throw new Error("Unauthorized: Only the buyer can confirm delivery");
  
  // Idempotency Guard: If already delivered or completed, return early
  if (order.status === "DELIVERED" || order.status === "COMPLETED") {
    return order;
  }

  // Rule: Order must be SHIPPED before delivery can be confirmed
  if (order.status !== "SHIPPED") {
    throw new Error(`Invalid transition: Order must be SHIPPED before confirming delivery. Current status: ${order.status}`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "DELIVERED",
      escrowStatus: "AWAITING_CONFIRMATION",
      deliveredAt: new Date(),
    },
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
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
  
  // Idempotency Guard: If already completed, return early
  if (order.status === "COMPLETED") {
    return order;
  }

  // Rule: Only the buyer can finalize and release funds (or system timeout)
  if (order.buyerProfileId !== user.id) throw new Error("Unauthorized: Only the buyer can finalize the order and release funds");

  // Rule: Order must be DELIVERED before completion
  if (order.status !== "DELIVERED") {
    throw new Error(`Invalid transition: Order must be DELIVERED before completion. Current status: ${order.status}`);
  }

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
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
  return updatedOrder;
}

/**
 * Cancels an order.
 * Can be done by buyer if not yet paid, or seller if not yet shipped.
 */
export async function cancelOrder(orderId: string, reason: string) {
  const user = await requireUser();

  if (!reason || reason.trim().length < 5) {
    throw new Error("Cancellation reason required: Please provide a brief explanation (min 5 chars).");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");

  const isBuyer = order.buyerProfileId === user.id;
  const isSeller = user.sellerProfile && order.sellerProfileId === user.sellerProfile.id;

  if (!isBuyer && !isSeller) throw new Error("Unauthorized: You do not have permission to cancel this order");

  // Logic for cancellation eligibility
  // Rule: Cannot cancel if already SHIPPED or further
  const uncancelableStatuses: OrderStatus[] = ["SHIPPED", "DELIVERED", "COMPLETED", "DISPUTED", "CANCELLED"];
  if (uncancelableStatuses.includes(order.status)) {
    throw new Error(`Order cannot be cancelled at this stage (${order.status}). If there is an issue, please open a dispute.`);
  }

  // Rule: Buyer can only cancel if not yet PAID (unless seller agrees, but keeping it simple for MVP)
  if (isBuyer && order.status === "PAID") {
    throw new Error("Cannot cancel a paid order. Please contact the seller or wait for shipping to open a dispute if needed.");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      escrowStatus: order.status === "PAID" ? "REFUNDED" : "NOT_STARTED",
      // We could store the cancellation reason in a notes field if we had one
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
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
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

/**
 * Fetches all disputes for the current authenticated user (as buyer or seller).
 */
export async function getUserDisputes() {
  const user = await requireUser();

  const where: any = {
    OR: [
      { openedByProfileId: user.id },
      { order: { sellerProfileId: user.sellerProfile?.id } }
    ]
  };

  // If sellerProfile doesn't exist, only fetch by buyerProfileId
  if (!user.sellerProfile) {
    delete where.OR[1].order;
    where.openedByProfileId = user.id;
    delete where.OR;
  }

  return await prisma.dispute.findMany({
    where,
    include: {
      order: {
        include: {
          items: true,
          sellerProfile: true,
          buyerProfile: true,
        }
      },
      openedByProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
