import Link from "next/link";
import { 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Star, 
  Check, 
  Truck, 
  Lock, 
  AlertCircle,
  Share2,
  Heart,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-6">
          <div className="aspect-square overflow-hidden rounded-[2.5rem] bg-muted shadow-2xl border-8 border-background">
            {product.images?.[0] ? (
              <img
                src={product.images[0].url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground/20">
                <ShoppingBag size={120} strokeWidth={1} />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square cursor-pointer overflow-hidden rounded-2xl bg-muted transition-all hover:ring-2 hover:ring-primary shadow-sm">
                  <img src={img.url} alt={`${product.title} ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest">{product.category?.name || "Product"}</Badge>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Escrow Protected
              </Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl leading-tight">{product.title}</h1>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-base">{product.sellerProfile.ratingAverage}</span>
                <span className="text-muted-foreground">({product.sellerProfile.totalSales} sales)</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Condition: <span className="font-bold text-foreground">{product.condition}</span></div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Stock: <span className="font-bold text-foreground">{product.stock} units</span></div>
            </div>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-5xl font-black tracking-tighter">${product.price.toLocaleString()}</span>
              <span className="text-xl font-bold text-primary uppercase tracking-widest">{product.paymentToken}</span>
            </div>
          </div>

          <Separator className="opacity-50" />

          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <Link href={`/checkout?productId=${product.id}`} className="flex-1">
                <Button size="lg" className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 rounded-2xl hover:scale-[1.02] transition-transform">
                  Buy Now <ShoppingCart className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Button size="icon" variant="outline" className="h-16 w-16 shrink-0 rounded-2xl border-2 hover:bg-primary/5 hover:text-primary transition-all">
                <Heart className="h-7 w-7" />
              </Button>
              <Button size="icon" variant="outline" className="h-16 w-16 shrink-0 rounded-2xl border-2 hover:bg-primary/5 hover:text-primary transition-all">
                <Share2 className="h-7 w-7" />
              </Button>
            </div>
            <div className="rounded-3xl bg-muted/30 p-6 border-2 border-dashed border-muted">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background shadow-xl text-primary border border-muted/50">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-1">TrustBay Escrow Protection</h4>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Your payment will be held securely in escrow. The seller only receives funds once you confirm delivery or the shipment is verified on-chain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <Card className="border-none shadow-xl shadow-muted/50 bg-card rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 bg-muted/20">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Verified Seller</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
                    {product.sellerProfile.storeName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-black text-lg">
                      {product.sellerProfile.storeName}
                      {product.sellerProfile.isVerified && <Check className="h-5 w-5 rounded-full bg-emerald-500 p-1 text-white shadow-sm" />}
                    </div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Joined {new Date(product.sellerProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} • {product.sellerProfile.totalSales} sales</div>
                  </div>
                </div>
                <Link href={`/seller/${product.sellerProfile.storeName.toLowerCase().replace(/ /g, '-')}`}>
                  <Button variant="outline" size="sm" className="font-bold rounded-xl border-2">Visit Store</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tabs: Description, Specs, Shipping */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto gap-8">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent px-0 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent font-black uppercase tracking-widest text-[10px] text-muted-foreground data-[state=active]:text-foreground">Description</TabsTrigger>
              <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent px-0 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent font-black uppercase tracking-widest text-[10px] text-muted-foreground data-[state=active]:text-foreground">Specifications</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent px-0 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent font-black uppercase tracking-widest text-[10px] text-muted-foreground data-[state=active]:text-foreground">Shipping & Trust</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-8">
              <p className="text-muted-foreground font-medium leading-loose text-lg">{product.description}</p>
            </TabsContent>
            <TabsContent value="specs" className="pt-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex justify-between border-b border-muted/50 pb-3 text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Condition</span>
                  <span className="font-black">{product.condition}</span>
                </div>
                <div className="flex justify-between border-b border-muted/50 pb-3 text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Stock</span>
                  <span className="font-black">{product.stock} Units</span>
                </div>
                <div className="flex justify-between border-b border-muted/50 pb-3 text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Payment</span>
                  <span className="font-black">{product.paymentToken} (ERC-20)</span>
                </div>
                <div className="flex justify-between border-b border-muted/50 pb-3 text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Category</span>
                  <span className="font-black">{product.category?.name}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-8">
              <div className="grid gap-6">
                <div className="flex gap-4 p-4 rounded-2xl bg-muted/20 border-2 border-muted/50">
                  <Truck className="h-6 w-6 text-primary shrink-0" />
                  <div className="text-sm">
                    <p className="font-black uppercase tracking-widest text-[10px] mb-1">Standard Delivery</p>
                    <p className="text-muted-foreground font-bold">{product.deliveryEstimate || "Estimated 3-7 Business Days"}</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100">
                  <Lock className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-black uppercase tracking-widest text-[10px] mb-1 text-emerald-600">Escrow Holding Period</p>
                    <p className="text-emerald-700 font-bold">Funds are released 48 hours after delivery confirmation is recorded on-chain.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-100">
                  <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-black uppercase tracking-widest text-[10px] mb-1 text-amber-600">Dispute Policy</p>
                    <p className="text-amber-700 font-bold">Returns accepted for damaged or incorrect items within 7 days. Escrow holds funds during active disputes.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
