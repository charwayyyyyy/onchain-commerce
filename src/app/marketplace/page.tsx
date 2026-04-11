import Link from "next/link";
import { 
  SlidersHorizontal, 
  Star, 
  ShieldCheck, 
  Zap,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMarketplaceProducts } from "@/actions/products";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { MarketplaceSearch } from "@/components/marketplace/marketplace-search";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { MarketplaceSort } from "@/components/marketplace/marketplace-sort";
import { EmptyState } from "@/components/shared/ux/empty-state";

export const dynamic = "force-dynamic";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters = {
    search: searchParams.q as string,
    category: searchParams.category as string,
    token: searchParams.token as string,
    condition: searchParams.condition as string,
    sort: searchParams.sort as string,
  };

  const products = await getMarketplaceProducts(filters);

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-10">
        {/* Header & Search */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest w-fit mb-2">
              <ShieldCheck size={14} /> TrustBay Secured
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase md:text-5xl">Marketplace</h1>
            <p className="text-muted-foreground text-lg font-medium">Browse verified listings protected by on-chain escrow.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <MarketplaceSearch />
            
            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger>
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 lg:hidden shadow-sm hover:bg-primary/5 hover:text-primary active:scale-95 transition-all">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r-2">
                <SheetHeader className="p-8 bg-muted/30 border-b border-muted/50">
                  <SheetTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <SlidersHorizontal size={24} className="text-primary" /> Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="p-8 overflow-y-auto max-h-[calc(100vh-120px)]">
                  <MarketplaceFilters />
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="outline" size="icon" className="hidden lg:flex h-14 w-14 rounded-2xl border-2 shadow-sm hover:bg-primary/5 hover:text-primary transition-all">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden w-72 shrink-0 flex-col gap-8 lg:flex">
            <div className="sticky top-8">
              <div className="p-8 rounded-[2.5rem] bg-muted/20 border-2 border-muted/30 shadow-inner">
                <MarketplaceFilters />
              </div>
              
              <div className="mt-8 p-8 rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 group overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 opacity-80">Seller Program</h4>
                  <p className="font-black text-xl tracking-tighter leading-tight mb-6">Want to sell your own items?</p>
                  <Link href="/dashboard/seller/onboarding">
                    <Button variant="secondary" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/10 group-hover:scale-105 transition-transform">Get Started</Button>
                  </Link>
                </div>
                <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Showing <span className="text-foreground">{products.length}</span> verified results
              </p>
              <MarketplaceSort />
            </div>

            {products.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <Link key={product.id} href={`/marketplace/${product.id}`} className="group">
                    <Card className="overflow-hidden border-none shadow-xl shadow-muted/50 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 bg-card rounded-[2.5rem] h-full flex flex-col">
                      <CardHeader className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                              <ShoppingBag size={64} strokeWidth={1} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <Badge className="absolute left-4 top-4 bg-background/90 text-foreground backdrop-blur-md border-2 border-muted/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            {product.category?.name || "Product"}
                          </Badge>
                          <div className="absolute right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 shadow-2xl shadow-primary/40">
                            <Zap size={24} fill="currentColor" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 flex-1 flex flex-col">
                        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                          <span className="truncate max-w-[150px]">{product.sellerProfile.storeName}</span>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{product.sellerProfile.ratingAverage}</span>
                          </div>
                        </div>
                        <h3 className="mb-2 text-xl font-black tracking-tight line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.title}</h3>
                        <div className="mt-auto pt-4 flex items-baseline gap-2">
                          <span className="text-3xl font-black tracking-tighter text-foreground">${product.price.toLocaleString()}</span>
                          <span className="text-xs font-black text-primary uppercase tracking-widest">{product.paymentToken}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="px-8 py-6 border-t border-muted/50 bg-muted/5">
                        <div className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-[0.15em]">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Escrow Active
                          </div>
                          <span className="text-muted-foreground opacity-70">{product.condition.replace("_", " ")}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={ShoppingBag}
                title="No products found"
                description="The marketplace is quiet. Try adjusting your filters or search query."
                actionLabel="Clear All Filters"
                actionHref="/marketplace"
                className="border-none rounded-[3rem] py-32 shadow-xl shadow-muted/30"
              />
            )}

            {products.length > 12 && (
              <div className="mt-16 flex justify-center">
                <Button variant="outline" size="lg" className="h-16 px-16 font-black uppercase tracking-widest rounded-2xl border-2 shadow-xl shadow-muted/20 hover:bg-muted/50 transition-all active:scale-95">
                  Load More Listings
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
