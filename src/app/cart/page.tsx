import Link from "next/link";
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowRight,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock cart data
const MOCK_CART = [
  {
    id: "1",
    title: "iPhone 15 Pro",
    price: 999.00,
    paymentToken: "USDC",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=200&auto=format&fit=crop",
    seller: "Apple Store Accra"
  }
];

export default function CartPage() {
  const subtotal = MOCK_CART.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const platformFee = subtotal * 0.02; // 2% fee
  const total = subtotal + platformFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">Review your items before proceeding to crypto checkout.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {MOCK_CART.length > 0 ? (
              MOCK_CART.map((item) => (
                <Card key={item.id} className="border-none shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">Seller: {item.seller}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-2 py-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-lg font-bold">
                            ${(item.price * item.quantity).toLocaleString()} <span className="text-xs font-medium text-primary uppercase">{item.paymentToken}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-xl font-bold">Your cart is empty</h3>
                <p className="mb-8 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/marketplace">
                  <Button>Browse Marketplace</Button>
                </Link>
              </div>
            )}
            
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="flex flex-col gap-6">
            <Card className="border-none shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (2%)</span>
                  <span className="font-medium">${platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Calculated at Checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${total.toLocaleString()}</div>
                    <div className="text-xs font-medium text-primary uppercase">Payable in USDC / ETH / USDT</div>
                  </div>
                </div>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 mt-4">
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="rounded-2xl border-2 border-dashed border-primary/20 p-6 bg-primary/5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <ShieldCheck size={20} /> Secure On-Chain Checkout
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your payment will be secured by TrustBay's smart contract escrow. Funds are only released to the seller after successful delivery.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 grayscale opacity-70">
                  <Badge variant="outline" className="bg-background">USDC</Badge>
                  <Badge variant="outline" className="bg-background">ETH</Badge>
                  <Badge variant="outline" className="bg-background">USDT</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
