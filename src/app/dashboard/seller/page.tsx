import { 
  TrendingUp, 
  Wallet, 
  Package, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  DollarSign,
  Plus,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Info,
  Truck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSellerOrders } from "@/actions/orders";
import { getSellerProducts } from "@/actions/products";
import { getCurrentUserProfile } from "@/lib/auth";
import { StatusBadge } from "@/components/shared/ux/status-badge";
import { EmptyState } from "@/components/shared/ux/empty-state";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function SellerDashboard() {
  const [orders, products, user] = await Promise.all([
    getSellerOrders(),
    getSellerProducts(),
    getCurrentUserProfile()
  ]);

  const isSeller = !!user?.sellerProfile;
  const hasPayoutWallet = !!user?.sellerProfile?.payoutWalletAddress;
  const lowStockProducts = products.filter(p => p.status === "PUBLISHED" && p.stock <= 5);
  const ordersNeedingAction = orders.filter(o => o.status === "PAID"); // Seller needs to ship these

  const stats = [
    { label: "Escrow Balance", value: `$${orders.filter(o => o.escrowStatus !== "RELEASED" && o.status !== "CANCELLED").reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: <Wallet className="h-4 w-4" /> },
    { label: "Total Sales", value: orders.filter(o => o.status === "COMPLETED").length.toString(), icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Active Listings", value: products.filter(p => p.status === "PUBLISHED").length.toString(), icon: <Package className="h-4 w-4" /> },
    { label: "Pending Shipments", value: ordersNeedingAction.length.toString(), icon: <Truck className={cn("h-4 w-4", ordersNeedingAction.length > 0 ? "text-primary animate-pulse" : "")} /> },
  ];

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Seller Hub</h1>
          <p className="text-muted-foreground text-lg font-medium">Overview of your shop performance and operations.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2 shadow-2xl shadow-primary/30 h-14 px-8 font-black uppercase tracking-widest rounded-2xl group transition-all hover:scale-[1.02]">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> New Listing
          </Button>
        </Link>
      </div>

      {/* Critical Actions & Alerts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!isSeller && (
          <Card className="border-none shadow-xl shadow-primary/10 bg-primary/5 rounded-[2.5rem] overflow-hidden group hover:bg-primary/10 transition-all border-2 border-dashed border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                <Info size={14} /> Action Required
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tighter mt-2">Complete Onboarding</CardTitle>
              <CardDescription className="text-sm font-medium">You need to set up your store profile before you can start selling.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8">
              <Link href="/dashboard/seller/onboarding">
                <Button className="w-full font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-primary/20">
                  Setup Store Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isSeller && !hasPayoutWallet && (
          <Card className="border-none shadow-xl shadow-orange-500/10 bg-orange-500/5 rounded-[2.5rem] overflow-hidden group hover:bg-orange-500/10 transition-all border-2 border-dashed border-orange-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-[10px]">
                <Wallet size={14} /> Account Setup
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tighter mt-2">Missing Payout Wallet</CardTitle>
              <CardDescription className="text-sm font-medium">Set your EVM address to receive funds when orders are completed.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8">
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full font-black uppercase tracking-widest h-12 rounded-xl border-2 border-orange-500/50 text-orange-700 hover:bg-orange-500 hover:text-white transition-all">
                  Set Wallet Address <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {lowStockProducts.length > 0 && (
          <Card className="border-none shadow-xl shadow-red-500/10 bg-red-500/5 rounded-[2.5rem] overflow-hidden group hover:bg-red-500/10 transition-all border-2 border-dashed border-red-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-[10px]">
                <AlertCircle size={14} className="animate-pulse" /> Inventory Alert
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tighter mt-2">{lowStockProducts.length} Items Low</CardTitle>
              <CardDescription className="text-sm font-medium">Some of your active listings are almost out of stock.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8">
              <Link href="/dashboard/products">
                <Button variant="outline" className="w-full font-black uppercase tracking-widest h-12 rounded-xl border-2 border-red-500/50 text-red-700 hover:bg-red-500 hover:text-white transition-all">
                  Manage Inventory <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

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
        {/* Fulfillment Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Clock size={18} />
              </div>
              Needs Shipment
            </h2>
            {ordersNeedingAction.length > 0 && (
              <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
                {ordersNeedingAction.length} Action Required
              </Badge>
            )}
          </div>

          <Card className="border-none shadow-2xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-0">
              {ordersNeedingAction.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="border-b bg-muted/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <tr>
                          <th className="px-8 py-5">Order</th>
                          <th className="px-8 py-5">Product</th>
                          <th className="px-8 py-5">Value</th>
                          <th className="px-8 py-5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/30">
                        {ordersNeedingAction.map((order) => (
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
                            <td className="px-8 py-6 font-black text-lg text-primary">${order.total.toLocaleString()}</td>
                            <td className="px-8 py-6">
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <Button variant="outline" size="sm" className="font-black text-[10px] uppercase rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                                  Ship Now <ArrowRight size={14} className="ml-1.5" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="grid gap-4 p-6 md:hidden">
                    {ordersNeedingAction.map((order) => (
                      <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                        <div className="p-6 rounded-[2rem] bg-muted/10 border-2 border-muted/20 hover:border-primary/30 hover:bg-primary/5 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="font-black text-sm uppercase tracking-tighter">#{order.id.slice(-8).toUpperCase()}</div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="font-black text-xl text-primary">${order.total.toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-muted overflow-hidden border-2 border-background shadow-lg shrink-0">
                              {order.items[0]?.product.images?.[0] && (
                                <img src={order.items[0].product.images[0].url} className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="font-bold line-clamp-2 text-sm leading-tight">{order.items[0]?.titleSnapshot}</div>
                          </div>
                          <Button className="w-full font-black text-[10px] uppercase rounded-xl h-12 shadow-lg shadow-primary/20">
                            Ship Now <ArrowRight size={14} className="ml-1.5" />
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState 
                  icon={Package}
                  title="All caught up!"
                  description="You have no pending shipments. New orders will appear here once paid."
                  actionLabel="View All Orders"
                  actionHref="/dashboard/orders"
                  className="border-none rounded-none py-20"
                />
              )}
            </CardContent>
          </Card>

          {/* Recent Sales (All) */}
          <div className="flex items-center justify-between px-2 pt-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              Recent Activity
            </h2>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">View History</Button>
            </Link>
          </div>

          <Card className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-0">
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[600px]">
                    <tbody className="divide-y divide-muted/30">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-black text-sm uppercase tracking-tighter">#{order.id.slice(-8).toUpperCase()}</div>
                          </td>
                          <td className="px-8 py-6 font-bold">{order.items[0]?.titleSnapshot}</td>
                          <td className="px-8 py-6">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-8 py-6 text-right">
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary">
                                <ExternalLink size={16} />
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
                  icon={TrendingUp}
                  title="No sales yet"
                  description="List your first product to start selling on TrustBay."
                  actionLabel="Create Listing"
                  actionHref="/dashboard/products/new"
                  className="border-none rounded-none py-20"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl shadow-primary/10 bg-primary rounded-[2.5rem] overflow-hidden text-primary-foreground">
            <CardHeader className="bg-black/10 px-8 py-8 border-b border-white/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} /> Seller Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tighter">Escrow Security</h4>
                  <p className="text-xs text-primary-foreground/70 font-medium mt-1">Funds are locked safely in escrow before you ship. No chargeback risk.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Star size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tighter">Trust Rating</h4>
                  <p className="text-xs text-primary-foreground/70 font-medium mt-1">Your reputation is stored on-chain. Build trust with every sale.</p>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <Link href="/dashboard/settings">
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest h-12 rounded-xl shadow-xl">
                  Payout Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-muted/30 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="px-8 py-8 border-b border-muted/30">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Inventory Health</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Out of Stock</span>
                  <Badge variant="outline" className="font-black">{products.filter(p => p.stock === 0).length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Listings</span>
                  <Badge variant="outline" className="font-black">{products.filter(p => p.status === "PUBLISHED").length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Drafts</span>
                  <Badge variant="outline" className="font-black">{products.filter(p => p.status === "DRAFT").length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
