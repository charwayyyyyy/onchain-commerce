import { 
  Heart, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Star,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWishlistProducts, removeFromWishlist } from "@/actions/products";
import { revalidatePath } from "next/cache";

export default async function WishlistPage() {
  const wishlistProducts = await getWishlistProducts();

  async function handleRemove(productId: string) {
    "use server";
    await removeFromWishlist(productId);
    revalidatePath("/dashboard/wishlist");
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">Keep track of the products you love.</p>
        </div>
        <Link href="/marketplace">
          <Button variant="outline" className="gap-2 h-12 px-6 font-bold rounded-2xl shadow-sm">
            <ShoppingBag className="h-4 w-4" /> Browse Marketplace
          </Button>
        </Link>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2rem] bg-card flex flex-col group">
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                    <ShoppingBag size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <form action={handleRemove.bind(null, product.id)}>
                    <Button 
                      type="submit"
                      size="icon" 
                      variant="destructive" 
                      className="h-10 w-10 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </form>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-primary border-primary/10">
                      {product.condition}
                    </Badge>
                    <p className="text-xs font-bold text-muted-foreground">{product.sellerProfile.storeName}</p>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-2xl font-black text-primary">${product.price.toLocaleString()}</p>
                </div>
                <div className="pt-6">
                  <Link href={`/marketplace/${product.id}`}>
                    <Button className="w-full gap-2 h-12 font-black uppercase tracking-widest text-xs rounded-xl">
                      View Details <ExternalLink size={14} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-muted/50 text-muted-foreground/30 shadow-inner">
            <Heart size={48} className="fill-muted/20" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Your wishlist is empty</h3>
          <p className="max-w-md text-muted-foreground mb-12 text-lg leading-relaxed">
            Found something you like? Click the heart icon on any product to save it here for later.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <Link href="/marketplace">
              <Button size="lg" className="w-full h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20">
                Explore Marketplace
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-xs rounded-2xl">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Suggested Section */}
      {wishlistProducts.length > 0 && (
        <div className="mt-16 pt-16 border-t border-muted-foreground/10">
          <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-muted-foreground/50">Suggested for you</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-xl shadow-muted/30 overflow-hidden rounded-[2rem] bg-card/50">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-4 w-2/3 bg-muted rounded mb-3 animate-pulse" />
                  <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
