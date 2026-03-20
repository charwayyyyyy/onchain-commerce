import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Wallet,
  ShieldCheck,
  Package,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBuyerOrders } from "@/actions/orders";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/ux/status-badge";
import { EmptyState } from "@/components/shared/ux/empty-state";

export default async function BuyerDashboard() {
  const orders = await getBuyerOrders();

  const stats = [
    { label: "Active Orders", value: orders.filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED").length.toString(), icon: <Clock className="h-4 w-4" /> },
    { label: "Completed", value: orders.filter(o => o.status === "COMPLETED").length.toString(), icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Disputes", value: orders.filter(o => o.status === "DISPUTED").length.toString(), icon: <AlertCircle className="h-4 w-4" /> },
    { label: "Total Spent", value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: <Wallet className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyer Overview</h1>
          <p className="text-muted-foreground">Manage your purchases, tracking, and trust history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2">
              Browse Marketplace
            </Button>
          </Link>
        </div>
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

      {/* Orders Table */}
      <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-widest">Recent Orders</CardTitle>
              <CardDescription className="text-xs font-medium">Your most recent purchases and their status</CardDescription>
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
                            <div className="text-[10px] text-muted-foreground font-bold uppercase">{order.sellerProfile.storeName}</div>
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
                            Track <ArrowRight size={12} className="ml-1" />
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
              title="No orders yet"
              description="When you buy products, they will appear here. Start exploring our secure marketplace."
              actionLabel="Explore Marketplace"
              actionHref="/marketplace"
              className="border-none rounded-none py-24"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-xl shadow-muted/50 rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/20">
            <CardTitle className="text-sm font-black uppercase tracking-widest">Buyer Protection</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Escrow Secured</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Your funds are held in a secure smart contract and only released when you confirm delivery.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Dispute System</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Open a dispute within 14 days if the item doesn't match the description or never arrives.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-muted/50 bg-primary text-primary-foreground rounded-3xl overflow-hidden group">
          <CardHeader className="bg-black/10">
            <CardTitle className="text-sm font-black uppercase tracking-widest">Become a Seller</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-6">
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Start your decentralized business journey. List products globally and get paid in crypto instantly with TrustBay Escrow.
            </p>
            <Link href="/dashboard/seller/onboarding">
              <Button variant="secondary" className="w-full font-black uppercase tracking-widest h-12 rounded-2xl shadow-xl shadow-black/10 group-hover:scale-[1.02] transition-transform">
                Start Selling Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

