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
  Info
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

export default async function SellerDashboard() {
  const orders = await getSellerOrders();
  const products = await getSellerProducts();
  const user = await getCurrentUserProfile();

  const isSeller = !!user?.sellerProfile;
  const hasPayoutWallet = !!user?.sellerProfile?.payoutWalletAddress;
  const lowStockProducts = products.filter(p => p.status === "PUBLISHED" && p.stock <= 5);
  const pendingOrders = orders.filter(o => o.status === "PAID" || o.status === "SHIPPED");

  const stats = [
    { label: "Pending Balance", value: `$${orders.filter(o => o.escrowStatus !== "RELEASED" && o.status !== "CANCELLED").reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: <Wallet className="h-4 w-4" /> },
    { label: "Total Sales", value: orders.filter(o => o.status === "COMPLETED").length.toString(), icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Active Listings", value: products.filter(p => p.status === "PUBLISHED").length.toString(), icon: <Package className="h-4 w-4" /> },
    { label: "Low Stock", value: lowStockProducts.length.toString(), icon: <AlertCircle className={cn("h-4 w-4", lowStockProducts.length > 0 ? "text-red-500 animate-pulse" : "text-orange-500")} /> },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Overview</h1>
          <p className="text-muted-foreground">Manage your products, sales, and escrow earnings.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2 shadow-2xl shadow-primary/30 h-14 px-8 font-black uppercase tracking-widest rounded-2xl group transition-all hover:scale-[1.02]">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> New Product
          </Button>
        </Link>
      </div>

      {/* Onboarding & Action Alerts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!isSeller && (
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-3xl overflow-hidden group hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                <Info size={16} /> Action Required
              </div>
              <CardTitle className="text-lg font-black mt-2">Finish Onboarding</CardTitle>
              <CardDescription className="text-xs font-medium">Complete your seller profile to start listing products.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <Link href="/dashboard/seller/onboarding">
                <Button className="w-full font-black uppercase tracking-widest h-11 rounded-xl shadow-lg shadow-primary/20">
                  Complete Profile <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isSeller && !hasPayoutWallet && (
          <Card className="border-2 border-dashed border-orange-500/30 bg-orange-500/5 rounded-3xl overflow-hidden group hover:border-orange-500/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-xs">
                <Wallet size={16} /> Wallet Missing
              </div>
              <CardTitle className="text-lg font-black mt-2">Set Payout Address</CardTitle>
              <CardDescription className="text-xs font-medium">You need a payout address to receive your earnings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full font-black uppercase tracking-widest h-11 rounded-xl border-2 border-orange-500/50 text-orange-700 hover:bg-orange-500 hover:text-white transition-all">
                  Set Wallet Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {lowStockProducts.length > 0 && (
          <Card className="border-2 border-dashed border-red-500/30 bg-red-500/5 rounded-3xl overflow-hidden group hover:border-red-500/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-xs">
                <AlertCircle size={16} className="animate-pulse" /> Low Stock Alert
              </div>
              <CardTitle className="text-lg font-black mt-2">{lowStockProducts.length} Item(s) Low</CardTitle>
              <CardDescription className="text-xs font-medium">Some of your products are running out of stock.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <Link href="/dashboard/products">
                <Button variant="outline" className="w-full font-black uppercase tracking-widest h-11 rounded-xl border-2 border-red-500/50 text-red-700 hover:bg-red-500 hover:text-white transition-all">
                  Restock Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card/50 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-black">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sales Table */}
      <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-widest">Recent Sales</CardTitle>
              <CardDescription className="text-xs font-medium">Monitor your orders and escrow fulfillment</CardDescription>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="border-b bg-muted/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Escrow</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden border border-muted flex-shrink-0">
                            {order.items[0]?.product.images?.[0] && (
                              <img src={order.items[0].product.images[0].url} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold line-clamp-1">{order.items[0]?.titleSnapshot}</div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase">Buyer: {order.buyerProfile.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black">${order.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.escrowStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase rounded-lg border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                            Manage <ArrowRight size={12} className="ml-1" />
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
              description="Your products are live but haven't found a buyer yet. Try sharing your store link."
              actionLabel="Manage Products"
              actionHref="/dashboard/products"
              className="border-none rounded-none py-24"
            />
          )}
        </CardContent>
      </Card>

      {/* Wallet/Payout Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-xl shadow-muted/50 bg-muted/20 rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Wallet & Payouts</CardTitle>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest h-8">Manage Settings</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-8 px-8 pb-8">
            <div className="flex items-center justify-between rounded-2xl border-2 border-muted bg-background p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <DollarSign size={24} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Payout Wallet</div>
                  <div className="font-mono text-xs font-bold truncate max-w-[150px] md:max-w-none">{user?.sellerProfile?.payoutWalletAddress || "Not set"}</div>
                </div>
              </div>
              <Link href="/dashboard/settings">
                <Button size="icon" variant="ghost" className="rounded-lg h-10 w-10 border-2 border-muted">
                  <ExternalLink size={16} />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-1 text-center py-6 bg-emerald-500/5 rounded-[2rem] border-2 border-emerald-500/10">
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Available for Withdrawal</div>
              <div className="text-4xl font-black text-emerald-600 tracking-tighter">$0.00</div>
            </div>
            <Button 
              className="w-full font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:grayscale transition-all"
              disabled={!hasPayoutWallet}
            >
              Request Payout
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-muted/50 rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/20">
            <CardTitle className="text-sm font-black uppercase tracking-widest">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 pt-6 px-8 pb-8">
            <Link href="/dashboard/products" className="contents">
              <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-[2rem] border-2 border-dashed hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group">
                <Package className="h-8 w-8 group-hover:scale-110 transition-transform" /> 
                <span className="text-[10px] font-black uppercase tracking-widest">Products</span>
              </Button>
            </Link>
            <Link href="/dashboard/orders" className="contents">
              <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-[2rem] border-2 border-dashed hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group">
                <Clock className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Orders</span>
              </Button>
            </Link>
            <Link href="/dashboard/disputes" className="contents">
              <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-[2rem] border-2 border-dashed hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group">
                <AlertCircle className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Disputes</span>
              </Button>
            </Link>
            <Link href="/dashboard/profile" className="contents">
              <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-[2rem] border-2 border-dashed hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group">
                <Star className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Reviews</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
