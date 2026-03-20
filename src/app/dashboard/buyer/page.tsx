import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Wallet,
  ShieldCheck,
  Package,
  ArrowRight,
  Heart,
  ExternalLink,
  Zap,
  Star,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBuyerOrders, getUserDisputes } from "@/actions/orders";
import { getWishlistProducts } from "@/actions/products";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/ux/status-badge";
import { EmptyState } from "@/components/shared/ux/empty-state";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function BuyerDashboard() {
  const [orders, wishlist, disputes] = await Promise.all([
    getBuyerOrders(),
    getWishlistProducts(),
    getUserDisputes()
  ]);

  const activeOrders = orders.filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED");
  const actionsNeeded = orders.filter(o => o.status === "SHIPPED" || o.status === "DELIVERED");
  const activeDisputes = disputes.filter(d => d.status === "OPEN" || d.status === "IN_REVIEW");

  const stats = [
    { label: "Active Orders", value: activeOrders.length.toString(), icon: <Clock className="h-4 w-4" /> },
    { label: "Wishlist Items", value: wishlist.length.toString(), icon: <Heart className="h-4 w-4" /> },
    { label: "Active Disputes", value: activeDisputes.length.toString(), icon: <AlertCircle className={cn("h-4 w-4", activeDisputes.length > 0 ? "text-red-500 animate-pulse" : "")} /> },
    { label: "Total Spent", value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: <Wallet className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Buyer Hub</h1>
          <p className="text-muted-foreground text-lg font-medium">Manage your purchases, tracking, and trust history.</p>
        </div>
        <Link href="/marketplace">
          <Button className="gap-2 shadow-2xl shadow-primary/30 h-14 px-8 font-black uppercase tracking-widest rounded-2xl group transition-all hover:scale-[1.02]">
            <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" /> Explore Marketplace
          </Button>
        </Link>
      </div>

      {/* Critical Actions Needed */}
      {actionsNeeded.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap size={18} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Actions Required</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {actionsNeeded.slice(0, 2).map((order) => (
              <Card key={order.id} className="border-none shadow-xl shadow-primary/10 bg-primary/5 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-primary/30 group hover:bg-primary/10 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                      <Package size={14} /> {order.status === "SHIPPED" ? "Confirm Receipt" : "Release Funds"}
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/50">Order #{order.id.slice(-6).toUpperCase()}</Badge>
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tighter mt-2">{order.items[0]?.titleSnapshot}</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {order.status === "SHIPPED" 
                      ? "Item is in transit. Please confirm once it arrives." 
                      : "Item delivered. If satisfied, release funds to the seller."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 pb-8">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button className="w-full font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-primary/20">
                      Manage Order <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-xl shadow-muted/20 bg-card rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Active Orders Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                <Clock size={18} />
              </div>
              Active Purchases
            </h2>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">View All</Button>
            </Link>
          </div>

          <Card className="border-none shadow-2xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-0">
              {activeOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[600px]">
                    <thead className="border-b bg-muted/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="px-8 py-5">Order</th>
                        <th className="px-8 py-5">Product</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/30">
                      {activeOrders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-black text-sm uppercase tracking-tighter">#{order.id.slice(-8).toUpperCase()}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden border-2 border-background shadow-lg">
                                {order.items[0]?.product.images?.[0] && (
                                  <img src={order.items[0].product.images[0].url} className="h-full w-full object-cover" />
                                )}
                              </div>
                              <div className="font-bold line-clamp-1 max-w-[200px]">{order.items[0]?.titleSnapshot}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-8 py-6">
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="font-black text-[10px] uppercase rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                                Track <ArrowRight size={14} className="ml-1.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState 
                  icon={ShoppingBag}
                  title="No active orders"
                  description="When you buy products, they will appear here. Start exploring our secure marketplace."
                  actionLabel="Explore Marketplace"
                  actionHref="/marketplace"
                  className="border-none rounded-none py-20"
                />
              )}
            </CardContent>
          </Card>

          {/* Wishlist Summary */}
          <div className="flex items-center justify-between px-2 pt-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                <Heart size={18} />
              </div>
              Saved Items
            </h2>
            <Link href="/dashboard/wishlist">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">View Full List</Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {wishlist.length > 0 ? (
              wishlist.slice(0, 2).map((product) => (
                <Link key={product.id} href={`/marketplace/${product.id}`}>
                  <Card className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2rem] bg-card group hover:shadow-2xl transition-all">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-4">
                        <div className="h-20 w-20 rounded-2xl bg-muted overflow-hidden border-2 border-background shadow-lg shrink-0">
                          {product.images?.[0] && (
                            <img src={product.images[0].url} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h3 className="font-black text-sm uppercase tracking-tighter line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                          <p className="font-black text-lg text-primary mt-1">${product.price.toLocaleString()}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <ArrowRight size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-2">
                <EmptyState 
                  icon={Heart}
                  title="Empty wishlist"
                  description="Save items you love to keep track of them here."
                  className="border-none py-12 bg-muted/5 rounded-[2rem]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Protection & Disputes */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl shadow-primary/10 bg-primary rounded-[2.5rem] overflow-hidden text-primary-foreground">
            <CardHeader className="bg-black/10 px-8 py-8 border-b border-white/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} /> Buyer Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Escrow Locked</p>
                  <p className="text-xs opacity-80 leading-relaxed font-medium mt-1">
                    Funds are held in a smart contract until you confirm delivery.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Resolution Center</p>
                  <p className="text-xs opacity-80 leading-relaxed font-medium mt-1">
                    Full support if items don't arrive or match the description.
                  </p>
                </div>
              </div>
              <Link href="/how-it-works#escrow" className="block">
                <Button className="w-full h-12 rounded-xl bg-white text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/90">Learn More</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-muted/30 rounded-[2.5rem] overflow-hidden bg-card">
            <CardHeader className="bg-muted/10 border-b border-muted/10 px-8 py-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={16} /> Active Disputes
                </CardTitle>
                {activeDisputes.length > 0 && (
                  <Badge variant="destructive" className="font-black uppercase tracking-widest text-[9px] rounded-full">{activeDisputes.length}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {activeDisputes.length > 0 ? (
                <div className="space-y-4">
                  {activeDisputes.map((dispute) => (
                    <Link key={dispute.id} href={`/dashboard/orders/${dispute.orderId}`}>
                      <div className="p-4 rounded-2xl bg-muted/50 border-2 border-transparent hover:border-primary/20 transition-all flex items-center justify-between group">
                        <div className="overflow-hidden">
                          <p className="font-black text-[10px] uppercase tracking-widest opacity-60">Order #{dispute.orderId.slice(-6).toUpperCase()}</p>
                          <p className="font-bold text-sm truncate">{dispute.reason.replace("_", " ")}</p>
                        </div>
                        <StatusBadge status={dispute.status} className="scale-75 origin-right" />
                      </div>
                    </Link>
                  ))}
                  <Link href="/dashboard/disputes">
                    <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest mt-2">View Resolution Center</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground/30">
                    <ShieldCheck size={24} />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No active claims</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

