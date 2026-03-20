import { 
  Heart, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Star,
  Trash2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWishlistProducts, removeFromWishlist } from "@/actions/products";
import { revalidatePath } from "next/cache";
import { EmptyState } from "@/components/shared/ux/empty-state";

export default async function WishlistPage() {
  const wishlistProducts = await getWishlistProducts();

  async function handleRemove(productId: string) {
    "use server";
    await removeFromWishlist(productId);
    revalidatePath("/dashboard/wishlist");
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">My Wishlist</h1>
          <p className="text-muted-foreground text-lg font-medium">Keep track of the products you love and want to secure.</p>
        </div>
        <Link href="/marketplace">
          <Button variant="outline" className="gap-2 h-14 px-8 font-black uppercase tracking-widest rounded-2xl border-2 shadow-sm transition-all hover:bg-primary/5 hover:text-primary">
            <ShoppingBag className="h-5 w-5" /> Marketplace
          </Button>
        </Link>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2.5rem] bg-card flex flex-col group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                    <ShoppingBag size={64} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10">
                  <form action={handleRemove.bind(null, product.id)}>
                    <Button 
                      type="submit"
                      size="icon" 
                      variant="destructive" 
                      className="h-12 w-12 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </form>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-primary/5 text-primary border-primary/20">
                      {product.condition.replace("_", " ")}
                    </Badge>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[100px]">{product.sellerProfile.storeName}</p>
                  </div>
                  <h3 className="font-black text-xl tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors">{product.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tighter text-foreground">${product.price.toLocaleString()}</span>
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{product.paymentToken}</span>
                  </div>
                </div>
                <div className="pt-8 mt-auto">
                  <Link href={`/marketplace/${product.id}`}>
                    <Button className="w-full gap-2 h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                      Secure Now <Zap size={16} fill="currentColor" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Heart}
          title="Your wishlist is empty"
          description="Found something you like? Click the heart icon on any product to save it here for later."
          actionLabel="Explore Marketplace"
          actionHref="/marketplace"
          className="border-none rounded-[3rem] py-32 shadow-xl shadow-muted/30"
        />
      )}

      {/* Suggested Section */}
      {wishlistProducts.length > 0 && (
        <div className="mt-20 pt-20 border-t-2 border-dashed border-muted">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Suggested for you</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2.5rem] bg-card/50">
                <div className="aspect-[4/3] bg-muted/50 animate-pulse" />
                <CardContent className="p-8 space-y-4">
                  <div className="h-4 w-2/3 bg-muted rounded-full animate-pulse" />
                  <div className="h-8 w-1/3 bg-muted rounded-xl animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
