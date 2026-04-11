import { getOrCreateUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
  CreditCard,
  User,
  Store,
  Clock,
  ArrowRight,
  Loader2,
  X,
  Info
} from "lucide-react";
import Link from "next/link";
import { 
  markOrderShipped, 
  confirmDelivery, 
  completeOrder, 
  cancelOrder 
} from "@/actions/orders";
import { revalidatePath } from "next/cache";
import { StatusBadge } from "@/components/shared/ux/status-badge";
import { cn } from "@/lib/utils";

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

  // Determine who needs to act next
  let nextAction = {
    role: "",
    action: "",
    description: "",
    icon: <Clock size={20} />,
    color: "bg-primary text-primary-foreground",
    borderColor: "border-primary/20"
  };

  if (order.status === "PAID") {
    nextAction = {
      role: "SELLER",
      action: "Ship Order",
      description: "Buyer has paid. Please ship the item and provide tracking details.",
      icon: <Truck size={20} />,
      color: "bg-primary text-primary-foreground",
      borderColor: "border-primary/20"
    };
  } else if (order.status === "SHIPPED") {
    nextAction = {
      role: "BUYER",
      action: "Confirm Delivery",
      description: "Order is in transit. Confirm once you have received the package.",
      icon: <Package size={20} />,
      color: "bg-primary text-primary-foreground",
      borderColor: "border-primary/20"
    };
  } else if (order.status === "DELIVERED") {
    nextAction = {
      role: "BUYER",
      action: "Release Funds",
      description: "Item delivered! Release funds from escrow if you're satisfied.",
      icon: <CheckCircle2 size={20} />,
      color: "bg-primary text-primary-foreground",
      borderColor: "border-primary/20"
    };
  } else if (order.status === "COMPLETED") {
    nextAction = {
      role: "SYSTEM",
      action: "Order Finalized",
      description: "Transaction complete. Funds have been released to the seller.",
      icon: <CheckCircle2 size={20} />,
      color: "bg-emerald-500 text-white",
      borderColor: "border-emerald-500/20"
    };
  } else if (order.status === "CANCELLED") {
    nextAction = {
      role: "SYSTEM",
      action: "Order Cancelled",
      description: "This order has been cancelled and is no longer active.",
      icon: <X size={20} />,
      color: "bg-destructive text-destructive-foreground",
      borderColor: "border-destructive/20"
    };
  } else if (order.status === "DISPUTED") {
    nextAction = {
      role: "MODERATOR",
      action: "Under Review",
      description: "A dispute has been opened. Our team is reviewing the case.",
      icon: <AlertCircle size={20} />,
      color: "bg-amber-500 text-white",
      borderColor: "border-amber-500/20"
    };
  }

  const shipping = order.shippingAddressSnapshot as any;

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-2 shadow-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tighter uppercase">Order #{order.id.slice(-8).toUpperCase()}</h1>
              <StatusBadge status={order.status} className="text-[10px] px-3 py-1" />
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1 font-bold text-xs uppercase tracking-widest">
              <Calendar size={14} /> Placed {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>
        </div>

        {nextAction.action && (
          <div className={cn(
            "flex items-center gap-4 px-6 py-4 rounded-2xl border-2 shadow-lg shadow-primary/5",
            (role === nextAction.role || nextAction.role === "SYSTEM" || nextAction.role === "MODERATOR") ? nextAction.borderColor : "bg-muted/30 border-muted/50 opacity-80"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
              (role === nextAction.role || nextAction.role === "SYSTEM" || nextAction.role === "MODERATOR") ? nextAction.color : "bg-muted text-muted-foreground"
            )}>
              {nextAction.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                {nextAction.role === "SYSTEM" ? "Status" : `Next Action: ${nextAction.role}`}
              </p>
              <p className="font-black text-sm uppercase tracking-tighter">{nextAction.action}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-muted/30 px-8 py-8 border-b border-muted/50">
              <CardTitle className="text-lg font-black uppercase tracking-widest">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-muted/30">
                {order.items.map((item) => (
                  <div key={item.id} className="p-8 flex flex-col sm:flex-row gap-6 items-start">
                    <div className="h-28 w-28 rounded-3xl bg-muted overflow-hidden border-2 border-background shadow-lg flex-shrink-0">
                      {item.imageSnapshot && (
                        <img src={item.imageSnapshot} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className="font-black text-xl tracking-tight leading-tight">{item.titleSnapshot}</h3>
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-black text-2xl tracking-tighter text-primary">${item.unitPrice.toLocaleString()}</p>
                      </div>
                      <Link href={`/marketplace/${item.productId}`} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mt-4">
                        Original Listing <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-10 bg-muted/10 border-t-2 border-muted/30">
                <div className="space-y-4 max-w-sm ml-auto">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">${order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <span>Platform Fee (2%)</span>
                    <span className="text-foreground">${order.platformFee.toLocaleString()}</span>
                  </div>
                  <Separator className="opacity-50" />
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="font-black uppercase tracking-[0.2em] text-sm">Total</span>
                    <div className="text-right">
                      <div className="text-4xl font-black tracking-tighter text-primary">${order.total.toLocaleString()}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Paid in {order.paymentToken}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-muted/30 px-8 py-8 border-b border-muted/50">
              <CardTitle className="text-lg font-black uppercase tracking-widest">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-muted before:to-muted">
                {/* Created */}
                <div className="relative flex items-center gap-8">
                  <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground ring-8 ring-background shadow-lg shadow-primary/20">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-black uppercase tracking-widest text-xs">Order Created</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Paid */}
                <div className={cn("relative flex items-center gap-8", order.status === "CREATED" && "opacity-40 grayscale")}>
                  <div className={cn(
                    "absolute left-0 flex h-10 w-10 items-center justify-center rounded-2xl ring-8 ring-background shadow-lg",
                    order.status !== "CREATED" ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    <CreditCard size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-black uppercase tracking-widest text-xs">Payment Confirmed</p>
                    {order.txHash && <p className="text-[10px] font-mono mt-2 p-2 bg-muted/50 rounded-lg truncate max-w-[200px] font-bold">{order.txHash}</p>}
                  </div>
                </div>

                {/* Shipped */}
                <div className={cn("relative flex items-center gap-8", ["CREATED", "PAID"].includes(order.status) && "opacity-40 grayscale")}>
                  <div className={cn(
                    "absolute left-0 flex h-10 w-10 items-center justify-center rounded-2xl ring-8 ring-background shadow-lg",
                    ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    <Truck size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-black uppercase tracking-widest text-xs">Shipped</p>
                    {order.shippedAt && <p className="text-xs text-muted-foreground font-medium mt-1">{new Date(order.shippedAt).toLocaleString()}</p>}
                    {order.shipmentReference && <p className="text-[10px] font-black mt-2 uppercase tracking-widest text-primary px-3 py-1 bg-primary/5 rounded-full w-fit border border-primary/20">Ref: {order.shipmentReference}</p>}
                  </div>
                </div>

                {/* Delivered */}
                <div className={cn("relative flex items-center gap-8", ["CREATED", "PAID", "SHIPPED"].includes(order.status) && "opacity-40 grayscale")}>
                  <div className={cn(
                    "absolute left-0 flex h-10 w-10 items-center justify-center rounded-2xl ring-8 ring-background shadow-lg",
                    ["DELIVERED", "COMPLETED"].includes(order.status) ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    <Package size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-black uppercase tracking-widest text-xs">Delivered</p>
                    {order.deliveredAt && <p className="text-xs text-muted-foreground font-medium mt-1">{new Date(order.deliveredAt).toLocaleString()}</p>}
                  </div>
                </div>

                {/* Completed */}
                <div className={cn("relative flex items-center gap-8", order.status !== "COMPLETED" && "opacity-40 grayscale")}>
                  <div className={cn(
                    "absolute left-0 flex h-10 w-10 items-center justify-center rounded-2xl ring-8 ring-background shadow-lg",
                    order.status === "COMPLETED" ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-muted text-muted-foreground"
                  )}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="ml-12">
                    <p className="font-black uppercase tracking-widest text-xs">Order Finalized</p>
                    {order.completedAt && <p className="text-xs text-muted-foreground font-medium mt-1">{new Date(order.completedAt).toLocaleString()}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Actions & Info */}
        <div className="space-y-8">
          {/* Status & Actions Card */}
          <Card className="border-none shadow-2xl shadow-primary/20 overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground">
            <CardHeader className="bg-black/10 px-8 py-8 border-b border-white/10">
              <CardTitle className="text-lg font-black uppercase tracking-widest">Order Actions</CardTitle>
              <CardDescription className="text-primary-foreground/70 font-medium">Secured by TrustBay Escrow</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-8">
              <div className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl border border-white/20 shadow-inner">
                <ShieldCheck className="h-10 w-10 text-white shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Escrow Protected</p>
                  <p className="font-black text-lg tracking-tight uppercase">{order.escrowStatus.replace("_", " ")}</p>
                </div>
              </div>

              {/* Role-based Actions */}
              <div className="flex flex-col gap-4">
                {role === "SELLER" && order.status === "PAID" && (
                  <form action={async (formData) => {
                    "use server";
                    const ref = formData.get("ref") as string;
                    await markOrderShipped(order.id, ref);
                  }} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="ref" className="text-[10px] font-black uppercase tracking-widest opacity-80 ml-1">Shipping Reference</Label>
                      <input 
                        id="ref"
                        name="ref" 
                        placeholder="e.g. UPS-123456789" 
                        required 
                        className="w-full h-14 px-5 rounded-2xl bg-white/10 border-2 border-transparent focus:border-white/50 focus:bg-white/20 transition-all text-white placeholder:text-white/40 font-bold outline-none"
                      />
                    </div>
                    <Button className="w-full h-16 bg-white text-primary font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-xl shadow-black/10">
                      Mark as Shipped <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </form>
                )}

                {role === "BUYER" && order.status === "SHIPPED" && (
                  <form action={async () => {
                    "use server";
                    await confirmDelivery(order.id);
                  }}>
                    <Button className="w-full h-16 bg-white text-primary font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-xl shadow-black/10">
                      Confirm Delivery
                    </Button>
                  </form>
                )}

                {order.status === "DELIVERED" && (
                  <form action={async () => {
                    "use server";
                    await completeOrder(order.id);
                  }}>
                    <Button className="w-full h-16 bg-white text-primary font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-xl shadow-black/10">
                      {role === "BUYER" ? "Release Funds" : "Complete Order"}
                    </Button>
                    {role === "BUYER" && (
                      <p className="text-[10px] text-center uppercase tracking-widest font-black opacity-60 mt-4 px-4">
                        Releasing funds confirms you have received the item and are satisfied.
                      </p>
                    )}
                  </form>
                )}

                {/* Dispute / Cancel Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  {["CREATED", "PAID"].includes(order.status) && (
                    <form action={async (formData) => {
                      "use server";
                      await cancelOrder(order.id, "User requested cancellation via dashboard");
                    }}>
                      <Button variant="ghost" className="w-full h-12 text-white/80 font-black hover:bg-white/10 hover:text-white uppercase tracking-widest text-[10px] rounded-xl transition-all">
                        Cancel Order
                      </Button>
                    </form>
                  )}
                  
                  {["PAID", "SHIPPED", "DELIVERED"].includes(order.status) && (
                    <Link href={`/dashboard/disputes/new?orderId=${order.id}`}>
                      <Button variant="ghost" className="w-full h-12 text-white/80 font-black hover:bg-white/10 hover:text-white uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 rounded-xl transition-all">
                        <AlertCircle size={16} /> Open Dispute
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer/Seller Info */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-muted/30 px-8 py-6 border-b border-muted/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {role === "SELLER" ? "Purchased By" : "Sold By"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-muted overflow-hidden border-2 border-background shadow-lg flex items-center justify-center text-muted-foreground/30">
                  {role === "SELLER" ? (
                    order.buyerProfile.avatarUrl ? <img src={order.buyerProfile.avatarUrl} className="h-full w-full object-cover" /> : <User size={28} />
                  ) : (
                    order.sellerProfile.bannerImage ? <img src={order.sellerProfile.bannerImage} className="h-full w-full object-cover" /> : <Store size={28} />
                  )}
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight leading-none">
                    {role === "SELLER" ? order.buyerProfile.displayName : order.sellerProfile.storeName}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                    @{role === "SELLER" ? order.buyerProfile.username : "verified-seller"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-muted/30 px-8 py-6 border-b border-muted/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shipping Logistics</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0 shadow-inner">
                  <MapPin size={20} />
                </div>
                <div className="text-sm space-y-1 font-medium text-muted-foreground">
                  <p className="text-foreground font-black text-lg tracking-tight mb-2">
                    {shipping?.firstName} {shipping?.lastName}
                  </p>
                  <p className="font-bold">{shipping?.address}</p>
                  <p className="font-bold">{shipping?.city}, {shipping?.region} {shipping?.postal}</p>
                  <p className="font-bold uppercase tracking-widest text-xs opacity-70">{shipping?.country}</p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Info size={12} /> Email: {shipping?.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
