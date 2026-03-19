import { getOrCreateUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { 
  markOrderShipped, 
  confirmDelivery, 
  completeOrder, 
  cancelOrder 
} from "@/actions/orders";
import { revalidatePath } from "next/cache";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getOrCreateUser();
  if (!user) return redirect("/sign-in");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
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
      disputes: true,
    },
  });

  if (!order) return notFound();

  // Check if user is part of this order
  const isBuyer = order.buyerProfileId === user.id;
  const isSeller = user.sellerProfile && order.sellerProfileId === user.sellerProfile.id;

  if (!isBuyer && !isSeller) {
    return redirect("/dashboard/orders");
  }

  const role = isBuyer ? "BUYER" : "SELLER";

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <Badge variant="outline" className="font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full border-primary/30 bg-primary/5 text-primary">
              {order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2 mt-1 font-medium">
            <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg font-black uppercase tracking-widest">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-muted/50">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6 items-start">
                    <div className="h-24 w-24 rounded-2xl bg-muted overflow-hidden border border-muted flex-shrink-0">
                      {item.imageSnapshot && (
                        <img src={item.imageSnapshot} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{item.titleSnapshot}</h3>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-black text-xl">${item.unitPrice.toLocaleString()}</p>
                      </div>
                      <Link href={`/marketplace/product/${item.product.slug}`} className="text-xs font-bold text-primary mt-4 flex items-center gap-1 hover:underline">
                        View Original Listing <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-muted/10 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Platform Fee (2%)</span>
                    <span>${order.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-2 border-t border-muted/50">
                    <span>Total</span>
                    <span className="text-primary">${order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg font-black uppercase tracking-widest">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-muted before:to-muted">
                {/* Created */}
                <div className="relative flex items-center gap-6">
                  <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-bold">Order Created</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Paid */}
                <div className={`relative flex items-center gap-6 ${order.status === "CREATED" ? "opacity-40" : ""}`}>
                  <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ${order.status !== "CREATED" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ring-8 ring-background`}>
                    <CreditCard size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-bold">Payment Confirmed</p>
                    {order.txHash && <p className="text-[10px] font-mono mt-1 opacity-70 truncate max-w-[200px]">{order.txHash}</p>}
                  </div>
                </div>

                {/* Shipped */}
                <div className={`relative flex items-center gap-6 ${["CREATED", "PAID"].includes(order.status) ? "opacity-40" : ""}`}>
                  <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ${["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ring-8 ring-background`}>
                    <Truck size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-bold">Shipped</p>
                    {order.shippedAt && <p className="text-xs text-muted-foreground">{new Date(order.shippedAt).toLocaleString()}</p>}
                    {order.shipmentReference && <p className="text-xs font-bold mt-1 uppercase tracking-widest text-primary">Ref: {order.shipmentReference}</p>}
                  </div>
                </div>

                {/* Delivered */}
                <div className={`relative flex items-center gap-6 ${["CREATED", "PAID", "SHIPPED"].includes(order.status) ? "opacity-40" : ""}`}>
                  <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ${["DELIVERED", "COMPLETED"].includes(order.status) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ring-8 ring-background`}>
                    <Package size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-bold">Delivered</p>
                    {order.deliveredAt && <p className="text-xs text-muted-foreground">{new Date(order.deliveredAt).toLocaleString()}</p>}
                  </div>
                </div>

                {/* Completed */}
                <div className={`relative flex items-center gap-6 ${order.status !== "COMPLETED" ? "opacity-40" : ""}`}>
                  <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ${order.status === "COMPLETED" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"} ring-8 ring-background`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-bold">Order Completed</p>
                    {order.completedAt && <p className="text-xs text-muted-foreground">{new Date(order.completedAt).toLocaleString()}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Actions & Info */}
        <div className="space-y-8">
          {/* Status & Actions Card */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase tracking-widest">Actions</CardTitle>
              <CardDescription className="text-primary-foreground/70 font-medium">Manage this order</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/20">
                <ShieldCheck className="h-8 w-8 text-white" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Escrow Status</p>
                  <p className="font-bold text-lg">{order.escrowStatus.replace("_", " ")}</p>
                </div>
              </div>

              {/* Role-based Actions */}
              <div className="pt-4 flex flex-col gap-3">
                {role === "SELLER" && order.status === "PAID" && (
                  <form action={async (formData) => {
                    "use server";
                    const ref = formData.get("ref") as string;
                    await markOrderShipped(order.id, ref);
                  }}>
                    <div className="flex flex-col gap-2">
                      <input 
                        name="ref" 
                        placeholder="Tracking Reference" 
                        required 
                        className="h-10 px-4 rounded-xl bg-white/20 border-none text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 text-sm"
                      />
                      <Button className="w-full h-12 bg-white text-primary font-bold rounded-xl hover:bg-white/90 uppercase tracking-widest text-xs">
                        Mark as Shipped
                      </Button>
                    </div>
                  </form>
                )}

                {role === "BUYER" && order.status === "SHIPPED" && (
                  <form action={async () => {
                    "use server";
                    await confirmDelivery(order.id);
                  }}>
                    <Button className="w-full h-12 bg-white text-primary font-bold rounded-xl hover:bg-white/90 uppercase tracking-widest text-xs">
                      Confirm Delivery
                    </Button>
                  </form>
                )}

                {order.status === "DELIVERED" && (
                  <form action={async () => {
                    "use server";
                    await completeOrder(order.id);
                  }}>
                    <Button className="w-full h-12 bg-white text-primary font-bold rounded-xl hover:bg-white/90 uppercase tracking-widest text-xs">
                      {role === "BUYER" ? "Release Funds" : "Complete Order"}
                    </Button>
                  </form>
                )}

                {/* Dispute / Cancel Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {["CREATED", "PAID"].includes(order.status) && (
                    <form action={async () => {
                      "use server";
                      await cancelOrder(order.id, "User requested cancellation");
                    }} className="col-span-2">
                      <Button variant="ghost" className="w-full h-10 text-white/80 font-bold hover:bg-white/10 hover:text-white uppercase tracking-widest text-[10px]">
                        Cancel Order
                      </Button>
                    </form>
                  )}
                  
                  {["PAID", "SHIPPED", "DELIVERED"].includes(order.status) && (
                    <Link href={`/dashboard/disputes/new?orderId=${order.id}`} className="col-span-2">
                      <Button variant="ghost" className="w-full h-10 text-white/80 font-bold hover:bg-white/10 hover:text-white uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <AlertCircle size={14} /> Open Dispute
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer/Seller Info */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg font-black uppercase tracking-widest">
                {role === "SELLER" ? "Customer" : "Seller"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                  <img 
                    src={role === "SELLER" ? order.buyerProfile.avatarUrl || "" : order.sellerProfile.bannerImage || ""} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">
                    {role === "SELLER" ? order.buyerProfile.displayName : order.sellerProfile.storeName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    @{role === "SELLER" ? order.buyerProfile.username : "seller"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg font-black uppercase tracking-widest">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 items-start">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="text-sm space-y-1 font-medium text-muted-foreground">
                  <p className="text-foreground font-bold">{(order.shippingAddressSnapshot as any)?.fullName}</p>
                  <p>{(order.shippingAddressSnapshot as any)?.addressLine1}</p>
                  {(order.shippingAddressSnapshot as any)?.addressLine2 && <p>{(order.shippingAddressSnapshot as any)?.addressLine2}</p>}
                  <p>{(order.shippingAddressSnapshot as any)?.city}, {(order.shippingAddressSnapshot as any)?.region} {(order.shippingAddressSnapshot as any)?.postalCode}</p>
                  <p>{(order.shippingAddressSnapshot as any)?.country}</p>
                  <p className="pt-2 font-bold text-primary">{(order.shippingAddressSnapshot as any)?.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
