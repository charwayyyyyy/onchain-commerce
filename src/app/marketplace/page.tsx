import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  Zap 
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

// Mock data for initial MVP display
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "iPhone 15 Pro - Titanium Blue",
    price: 999.00,
    paymentToken: "USDC",
    seller: "Apple Store Accra",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop",
    category: "Electronics",
    condition: "New"
  },
  {
    id: "2",
    title: "Vintage Rolex Submariner",
    price: 8500.00,
    paymentToken: "ETH",
    seller: "Luxe Collectibles",
    rating: 5.0,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop",
    category: "Collectibles",
    condition: "Pre-owned"
  },
  {
    id: "3",
    title: "MacBook Air M3 (2024)",
    price: 1299.00,
    paymentToken: "USDC",
    seller: "TechHub Ghana",
    rating: 4.9,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    category: "Electronics",
    condition: "New"
  },
  {
    id: "4",
    title: "Premium Leather Messenger Bag",
    price: 150.00,
    paymentToken: "USDT",
    seller: "Heritage Crafts",
    rating: 4.7,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    category: "Fashion",
    condition: "New"
  }
];

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Browse thousands of products protected by TrustBay Escrow.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anything..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
            <div>
              <h3 className="mb-4 font-semibold uppercase tracking-wider text-xs text-muted-foreground">Categories</h3>
              <div className="flex flex-col gap-2">
                {["All Categories", "Electronics", "Collectibles", "Fashion", "Real Estate", "Services"].map((cat) => (
                  <Button key={cat} variant="ghost" className="justify-start text-sm font-normal h-8">
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-4 font-semibold uppercase tracking-wider text-xs text-muted-foreground">Payment Token</h3>
              <div className="flex flex-wrap gap-2">
                {["USDC", "ETH", "USDT", "BTC"].map((token) => (
                  <Badge key={token} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {token}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-4 font-semibold uppercase tracking-wider text-xs text-muted-foreground">Condition</h3>
              <div className="flex flex-col gap-2">
                {["New", "Like New", "Pre-owned", "Refurbished"].map((cond) => (
                  <div key={cond} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" id={cond} className="rounded border-gray-300" />
                    <label htmlFor={cond}>{cond}</label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing 1-12 of 150 products</p>
              <Button variant="ghost" size="sm" className="gap-2">
                Sort by: Featured <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {MOCK_PRODUCTS.map((product) => (
                <Link key={product.id} href={`/marketplace/${product.id}`}>
                  <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="p-0">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-sm border-none">
                          {product.category}
                        </Badge>
                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          <Zap size={16} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">{product.seller}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating} ({product.reviews})</span>
                        </div>
                      </div>
                      <h3 className="mb-1 font-bold line-clamp-1">{product.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">${product.price.toLocaleString()}</span>
                        <span className="text-xs font-medium text-primary">{product.paymentToken}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 border-t bg-muted/30">
                      <div className="flex w-full items-center justify-between py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <ShieldCheck size={12} /> Escrow Protected
                        </div>
                        <span>{product.condition}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg">Load More Products</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
