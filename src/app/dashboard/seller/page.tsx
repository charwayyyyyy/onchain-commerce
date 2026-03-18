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
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SellerDashboard() {
  const stats = [
    { label: "Pending Balance", value: "$4,250", icon: <Wallet className="h-4 w-4" /> },
    { label: "Total Sales", value: "450", icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Active Listings", value: "12", icon: <Package className="h-4 w-4" /> },
    { label: "Average Rating", value: "4.8", icon: <Star className="h-4 w-4" /> },
  ];

  const recentSales = [
    { id: "ORD-12345", product: "iPhone 15 Pro", date: "2 days ago", price: "$999.00", status: "Paid", escrow: "Locked" },
    { id: "ORD-12346", product: "MacBook Air M3", date: "5 days ago", price: "$1,299.00", status: "Shipped", escrow: "In Transit" },
    { id: "ORD-12347", product: "Leather Bag", date: "1 week ago", price: "$150.00", status: "Delivered", escrow: "Released" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Overview</h1>
          <p className="text-muted-foreground">Manage your products, sales, and escrow earnings.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2 shadow-lg shadow-primary/20 h-12 px-6 font-bold">
            <Plus className="h-5 w-5" /> New Product
          </Button>
        </Link>
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

      {/* Sales Performance Chart Placeholder */}
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg font-bold">Sales Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground font-medium italic">
          <div className="flex flex-col items-center gap-4">
            <BarChart3 size={48} className="text-muted-foreground/30" />
            <p>Sales trend visualization will appear here.</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales Table Placeholder */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Sales</CardTitle>
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
                {recentSales.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.product}</td>
                    <td className="px-6 py-4 font-bold">{order.price}</td>
                    <td className="px-6 py-4">
                      <Badge variant={order.status === "Paid" ? "outline" : "secondary"} className={order.status === "Paid" ? "border-amber-200 bg-amber-50 text-amber-700" : ""}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                        <CheckCircle size={14} /> {order.escrow}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Wallet/Payout Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center justify-between rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <DollarSign size={20} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Payout Wallet</div>
                  <div className="font-mono text-sm">0x1234...5678</div>
                </div>
              </div>
              <Button size="sm" variant="ghost">Edit</Button>
            </div>
            <div className="flex flex-col gap-1 text-center py-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="text-sm text-muted-foreground">Available for Withdrawal</div>
              <div className="text-3xl font-bold text-primary">$1,250.45</div>
            </div>
            <Button className="w-full font-bold h-12">Request Payout</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl border-dashed hover:border-primary transition-all">
              <Package className="h-6 w-6" /> Manage Products
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl border-dashed hover:border-primary transition-all">
              <Clock className="h-6 w-6" /> View All Orders
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl border-dashed hover:border-primary transition-all">
              <AlertCircle className="h-6 w-6" /> Dispute Center
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl border-dashed hover:border-primary transition-all">
              <Star className="h-6 w-6" /> Reviews & Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
