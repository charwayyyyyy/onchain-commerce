import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  Zap,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getMarketplaceProducts } from "@/actions/products";

export default async function MarketplacePage() {
  const products = await getMarketplaceProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Browse products protected by TrustBay Escrow.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anything..."
                className="pl-9 h-11 rounded-xl"
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Categories</h3>
              <div className="flex flex-col gap-1">
                {["All Categories", "Electronics", "Collectibles", "Fashion", "Real Estate", "Services"].map((cat) => (
                  <Button key={cat} variant="ghost" className="justify-start text-sm font-medium h-9 rounded-lg px-3 hover:bg-primary/5 hover:text-primary transition-all">
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Payment Token</h3>
              <div className="flex flex-wrap gap-2">
                {["USDC", "ETH", "USDT"].map((token) => (
                  <Badge key={token} variant="outline" className="cursor-pointer px-3 py-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-all border-muted-foreground/20">
                    {token}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Condition</h3>
              <div className="flex flex-col gap-3">
                {["New", "Like New", "Pre-owned", "Refurbished"].map((cond) => (
                  <div key={cond} className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" id={cond} className="h-4 w-4 rounded border-muted-foreground/30 accent-primary" />
                    <label htmlFor={cond} className="cursor-pointer">{cond}</label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing <span className="font-bold text-foreground">{products.length}</span> products</p>
              <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold uppercase tracking-wider rounded-lg">
                Sort by: Featured <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <Link key={product.id} href={`/marketplace/${product.id}`}>
                    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card rounded-2xl">
                      <CardHeader className="p-0">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                              <ShoppingBag size={48} />
                            </div>
                          )}
                          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-md border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            {product.category?.name || "Product"}
                          </Badge>
                          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                            <Zap size={18} fill="currentColor" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                          <span>{product.sellerProfile.storeName}</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{product.sellerProfile.ratingAverage}</span>
                          </div>
                        </div>
                        <h3 className="mb-1 text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold tracking-tight">${product.price.toLocaleString()}</span>
                          <span className="text-xs font-bold text-primary uppercase">{product.paymentToken}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 border-t border-muted/50 bg-muted/5">
                        <div className="flex w-full items-center justify-between py-2 text-[10px] font-bold uppercase tracking-widest">
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <ShieldCheck size={14} /> Escrow Protected
                          </div>
                          <span className="text-muted-foreground">{product.condition}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="text-xl font-bold">No products found</h3>
                <p className="max-w-xs text-muted-foreground mt-2">
                  Be the first to list a product in the TrustBay marketplace!
                </p>
                <Link href="/dashboard/products/new" className="mt-8">
                  <Button className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-primary/20">List a Product</Button>
                </Link>
              </div>
            )}

            {products.length > 12 && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" size="lg" className="px-12 font-bold rounded-xl">Load More Products</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
