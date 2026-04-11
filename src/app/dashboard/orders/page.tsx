import { getOrCreateUser } from "@/lib/auth";
import { getBuyerOrders, getSellerOrders } from "@/actions/orders";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShoppingBag, Clock, Package } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const user = await getOrCreateUser();
  if (!user) return null;

  const orders = user.role === "SELLER" 
    ? await getSellerOrders() 
    : await getBuyerOrders();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {user.role === "SELLER" ? "Sales Orders" : "My Orders"}
        </h1>
        <p className="text-muted-foreground">
          {user.role === "SELLER" 
            ? "Manage your sales and fulfill shipments." 
            : "Track your purchases and confirm deliveries."}
        </p>
      </div>

      <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg font-black uppercase tracking-widest">Order History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Escrow</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden border border-muted">
                              {order.items[0]?.product.images?.[0] && (
                                <img src={order.items[0].product.images[0].url} className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold line-clamp-1">{order.items[0]?.titleSnapshot}</div>
                              <div className="text-[10px] text-muted-foreground font-bold uppercase">
                                {user.role === "SELLER" 
                                  ? `Buyer: ${order.buyerProfile.username}` 
                                  : `Seller: ${order.sellerProfile.storeName}`}
                              </div>
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
                        <td className="px-6 py-4 text-right">
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase rounded-lg border-2">Details</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="grid gap-4 p-4 lg:hidden">
                {orders.map((order) => (
                  <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                    <div className="p-6 rounded-3xl bg-muted/10 border-2 border-muted/20 hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-mono font-bold text-xs">#{order.id.slice(-8).toUpperCase()}</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full border-muted-foreground/30">
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden border-2 border-background shadow-md shrink-0">
                          {order.items[0]?.product.images?.[0] && (
                            <img src={order.items[0].product.images[0].url} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="font-bold line-clamp-1 text-sm">{order.items[0]?.titleSnapshot}</div>
                          <div className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">
                            {user.role === "SELLER" 
                              ? `Buyer: ${order.buyerProfile.username}` 
                              : `Seller: ${order.sellerProfile.storeName}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-muted/20">
                        <div className="font-black text-lg">${order.total.toLocaleString()}</div>
                        <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-emerald-600 bg-emerald-500/5 px-3 py-1.5 rounded-full">
                          <ShieldCheck size={14} /> {order.escrowStatus.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground/30">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-bold">No orders found</h3>
              <p className="max-w-xs text-muted-foreground mt-2 font-medium">
                {user.role === "SELLER" 
                  ? "You haven't made any sales yet. Try promoting your products!" 
                  : "You haven't placed any orders yet. Start shopping in the marketplace."}
              </p>
              {user.role === "BUYER" && (
                <Link href="/marketplace" className="mt-8">
                  <Button className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">Explore Marketplace</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
