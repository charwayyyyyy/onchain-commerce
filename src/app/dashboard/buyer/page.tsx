import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Wallet,
  Package,
  Star,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BuyerDashboard() {
  const stats = [
    { label: "Active Orders", value: "3", icon: <Clock className="h-4 w-4" /> },
    { label: "Completed", value: "12", icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Disputes", value: "0", icon: <AlertCircle className="h-4 w-4" /> },
    { label: "Total Spent", value: "$2,450", icon: <Wallet className="h-4 w-4" /> },
  ];

  const recentOrders = [
    { id: "ORD-12345", product: "iPhone 15 Pro", date: "2 days ago", price: "$999.00", status: "In Transit", escrow: "Locked" },
    { id: "ORD-12346", product: "MacBook Air M3", date: "5 days ago", price: "$1,299.00", status: "Delivered", escrow: "Released" },
    { id: "ORD-12347", product: "Leather Bag", date: "1 week ago", price: "$150.00", status: "Completed", escrow: "Released" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buyer Overview</h1>
        <p className="text-muted-foreground">Manage your purchases, tracking, and trust history.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Table Placeholder */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Escrow</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.product}</td>
                    <td className="px-6 py-4 font-bold">{order.price}</td>
                    <td className="px-6 py-4">
                      <Badge variant={order.status === "In Transit" ? "outline" : "secondary"} className={order.status === "In Transit" ? "border-amber-200 bg-amber-50 text-amber-700" : ""}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                        <ShieldCheck size={14} /> {order.escrow}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Track</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity/Reviews/Wishlist Preview Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-xl border p-3">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-muted overflow-hidden">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=200&auto=format&fit=crop" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold line-clamp-1">Vintage Rolex Submariner</h4>
                <div className="text-sm text-muted-foreground">$8,500.00 • ETH</div>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
            <div className="flex items-center gap-4 rounded-xl border p-3">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-muted overflow-hidden">
                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200&auto=format&fit=crop" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold line-clamp-1">MacBook Air M3 (2024)</h4>
                <div className="text-sm text-muted-foreground">$1,299.00 • USDC</div>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Become a Seller</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm opacity-90 leading-relaxed">
              Start your decentralized business journey. List products globally and get paid in crypto instantly.
            </p>
            <Button variant="secondary" className="w-full font-bold">Apply for Seller Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
