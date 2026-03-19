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
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSellerOrders } from "@/actions/orders";
import { getSellerProducts } from "@/actions/products";
import { getCurrentUserProfile } from "@/lib/auth";

export default async function SellerDashboard() {
  const orders = await getSellerOrders();
  const products = await getSellerProducts();
  const user = await getCurrentUserProfile();

  const stats = [
    { label: "Pending Balance", value: `$${orders.filter(o => o.escrowStatus !== "RELEASED" && o.status !== "CANCELLED").reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: <Wallet className="h-4 w-4" /> },
    { label: "Total Sales", value: orders.filter(o => o.status === "COMPLETED").length.toString(), icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Active Listings", value: products.filter(p => p.status === "PUBLISHED").length.toString(), icon: <Package className="h-4 w-4" /> },
    { label: "Low Stock", value: products.filter(p => p.status === "PUBLISHED" && p.stock <= 5).length.toString(), icon: <AlertCircle className="h-4 w-4 text-orange-500" /> },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Overview</h1>
          <p className="text-muted-foreground">Manage your products, sales, and escrow earnings.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2 shadow-2xl shadow-primary/30 h-14 px-8 font-black uppercase tracking-widest rounded-2xl">
            <Plus className="h-5 w-5" /> New Product
          </Button>
        </Link>
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

      {/* Sales Performance Chart Placeholder */}
      <Card className="border-none shadow-xl shadow-muted/50 rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg font-black uppercase tracking-widest">Sales Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground font-medium italic pt-8">
          <div className="flex flex-col items-center gap-4">
            <BarChart3 size={48} className="text-muted-foreground/20" />
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Sales trend visualization coming soon</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales Table */}
      <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black uppercase tracking-widest">Recent Sales</CardTitle>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
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
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden border border-muted">
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
                        <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full border-muted-foreground/30">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-emerald-600">
                          <ShieldCheck size={14} /> {order.escrowStatus.replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase rounded-lg border-2">Manage</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground/30">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-bold">No sales yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Your recent sales will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet/Payout Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-xl shadow-muted/50 bg-muted/20 rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-sm font-black uppercase tracking-widest">Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-8 px-8">
            <div className="flex items-center justify-between rounded-2xl border-2 border-muted bg-background p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Payout Wallet</div>
                  <div className="font-mono text-xs font-bold">{user?.sellerProfile?.payoutWalletAddress || "Not set"}</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="font-bold text-xs uppercase rounded-lg">Edit</Button>
            </div>
            <div className="flex flex-col gap-1 text-center py-6 bg-emerald-500/5 rounded-[2rem] border-2 border-emerald-500/10">
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Available for Withdrawal</div>
              <div className="text-4xl font-black text-emerald-600 tracking-tighter">$0.00</div>
            </div>
            <Button className="w-full font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700">Request Payout</Button>
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
