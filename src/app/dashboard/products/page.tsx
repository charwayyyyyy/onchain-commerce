import { getOrCreateUser } from "@/lib/auth";
import { getSellerProducts } from "@/actions/products";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function SellerProductsPage() {
  const user = await getOrCreateUser();
  if (!user || user.role !== "SELLER") return null;

  const products = await getSellerProducts();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">Manage your marketplace listings and inventory.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2 shadow-xl shadow-primary/20 h-12 px-6 font-black uppercase tracking-widest rounded-xl">
            <Plus className="h-5 w-5" /> New Product
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg font-black uppercase tracking-widest">Active Listings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden border border-muted shadow-sm">
                            {product.images?.[0] && (
                              <img src={product.images[0].url} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold line-clamp-1">{product.title}</div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase">{product.paymentToken}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="font-bold text-[9px] uppercase rounded-full">
                          {product.category.name}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-black">${product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-muted-foreground">{product.stock} Units</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black uppercase tracking-widest text-[9px]">
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/marketplace/${product.id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/5">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground/30">
                <Package size={40} />
              </div>
              <h3 className="text-xl font-bold">No products yet</h3>
              <p className="max-w-xs text-muted-foreground mt-2 font-medium">
                Start your selling journey by listing your first product on TrustBay.
              </p>
              <Link href="/dashboard/products/new" className="mt-8">
                <Button className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">Create Listing</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
