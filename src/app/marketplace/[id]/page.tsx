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
  Heart
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

// Mock data for initial MVP display
const MOCK_PRODUCT = {
  id: "1",
  title: "iPhone 15 Pro - Titanium Blue",
  price: 999.00,
  paymentToken: "USDC",
  seller: {
    name: "Apple Store Accra",
    rating: 4.8,
    reviews: 124,
    verified: true,
    totalSales: 450,
    joinDate: "Jan 2024"
  },
  images: [
    "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1696446702183-bc0640955355?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1696446702047-36e6761f041e?q=80&w=1200&auto=format&fit=crop"
  ],
  category: "Electronics",
  condition: "New",
  stock: 5,
  description: "Experience the next level of mobile technology with the iPhone 15 Pro. Featuring a strong and lightweight titanium design with new contoured edges, a new Action button, powerful camera upgrades, and A17 Pro for next-level performance and mobile gaming.",
  specifications: [
    { label: "Display", value: "6.1-inch Super Retina XDR" },
    { label: "Processor", value: "A17 Pro chip" },
    { label: "Camera", value: "48MP Main | Ultra Wide | Telephoto" },
    { label: "Capacity", value: "256GB" },
    { label: "Connectivity", value: "5G, USB-C" }
  ],
  delivery: "Ships within 24 hours. Estimated delivery: 3-5 days."
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square overflow-hidden rounded-3xl bg-muted shadow-lg">
            <img
              src={MOCK_PRODUCT.images[0]}
              alt={MOCK_PRODUCT.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {MOCK_PRODUCT.images.map((img, i) => (
              <div key={i} className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted transition-all hover:ring-2 hover:ring-primary">
                <img src={img} alt={`${MOCK_PRODUCT.title} ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{MOCK_PRODUCT.category}</Badge>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                <ShieldCheck className="mr-1 h-3 w-3" /> Escrow Protected
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{MOCK_PRODUCT.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{MOCK_PRODUCT.seller.rating}</span>
                <span className="text-muted-foreground">({MOCK_PRODUCT.seller.reviews} reviews)</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-muted-foreground">Condition: <span className="font-medium text-foreground">{MOCK_PRODUCT.condition}</span></div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-muted-foreground">Stock: <span className="font-medium text-foreground">{MOCK_PRODUCT.stock} units</span></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">${MOCK_PRODUCT.price.toLocaleString()}</span>
              <span className="text-xl font-medium text-primary uppercase">{MOCK_PRODUCT.paymentToken}</span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 h-14 text-base font-bold shadow-lg shadow-primary/20">
                Buy Now <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className="h-14 w-14 shrink-0 rounded-2xl">
                <Heart className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="outline" className="h-14 w-14 shrink-0 rounded-2xl">
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">TrustBay Escrow Protection</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your payment will be held securely in escrow. The seller only receives funds once you confirm delivery or the shipment is verified.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background font-bold text-primary shadow-sm">
                    {MOCK_PRODUCT.seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold">
                      {MOCK_PRODUCT.seller.name}
                      {MOCK_PRODUCT.seller.verified && <Check className="h-4 w-4 rounded-full bg-primary p-0.5 text-primary-foreground" />}
                    </div>
                    <div className="text-xs text-muted-foreground">Joined {MOCK_PRODUCT.seller.joinDate} • {MOCK_PRODUCT.seller.totalSales} sales</div>
                  </div>
                </div>
                <Link href={`/seller/${MOCK_PRODUCT.seller.name.toLowerCase().replace(/ /g, '-')}`}>
                  <Button variant="outline" size="sm">View Store</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tabs: Description, Specs, Shipping */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent">Description</TabsTrigger>
              <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent">Specifications</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-muted-foreground leading-relaxed">{MOCK_PRODUCT.description}</p>
            </TabsContent>
            <TabsContent value="specs" className="pt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {MOCK_PRODUCT.specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-bold">Standard Delivery</p>
                    <p className="text-muted-foreground">{MOCK_PRODUCT.delivery}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-bold">Escrow Holding Period</p>
                    <p className="text-muted-foreground">Funds are released 48 hours after delivery confirmation.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-bold">Returns Policy</p>
                    <p className="text-muted-foreground">Returns accepted for damaged or incorrect items within 7 days.</p>
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
