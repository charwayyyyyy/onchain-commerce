import Link from "next/link";
import { 
  ArrowLeft, 
  Wallet, 
  ShieldCheck, 
  CheckCircle, 
  Truck, 
  CreditCard, 
  AlertCircle,
  ChevronRight,
  Zap,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CheckoutPage() {
  const subtotal = 999.00;
  const platformFee = 19.98;
  const shipping = 25.00;
  const total = subtotal + platformFee + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left Column: Checkout Form & Steps */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Complete Your Order</h1>
            <p className="text-muted-foreground">Follow the steps below to secure your items via on-chain escrow.</p>
          </div>

          <Tabs defaultValue="shipping" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12 rounded-xl bg-muted p-1 shadow-sm">
              <TabsTrigger value="shipping" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">1. Shipping</TabsTrigger>
              <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">2. Payment</TabsTrigger>
              <TabsTrigger value="confirm" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">3. Confirm</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shipping" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input id="address" placeholder="123 Street Name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Accra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region/State</Label>
                  <Input id="region" placeholder="Greater Accra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input id="postal" placeholder="GA-123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Ghana" />
              </div>
              <Button className="w-full h-12 font-bold mt-4">Continue to Payment</Button>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6 text-center py-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6 shadow-sm">
                <Wallet size={40} />
              </div>
              <h3 className="text-xl font-bold">Connect Your Wallet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                TrustBay uses smart contracts to hold your payment in escrow. Connect your wallet to pay with USDC, ETH, or USDT.
              </p>
              <div className="grid gap-4 max-w-sm mx-auto">
                <Button className="h-14 font-bold rounded-2xl gap-3 text-base shadow-lg shadow-primary/20">
                  <img src="https://metamask.io/images/metamask-logo.png" className="h-6 w-6" alt="MetaMask" />
                  Connect MetaMask
                </Button>
                <Button variant="outline" className="h-14 font-bold rounded-2xl gap-3 text-base">
                  <Wallet className="h-5 w-5" />
                  WalletConnect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-8 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-emerald-600" /> Secure connection powered by ethers.js
              </p>
            </TabsContent>

            <TabsContent value="confirm" className="space-y-6">
              <div className="rounded-2xl border p-6 space-y-4 bg-muted/30">
                <div className="flex items-center gap-3 text-emerald-600 font-bold">
                  <CheckCircle size={20} /> Ready to Confirm
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You are about to lock <span className="font-bold text-foreground">$1,043.98 USDC</span> in a secure smart contract escrow for this order.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase font-bold tracking-wider">Recipient Address</span>
                    <span className="font-mono">0x9876...4321</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase font-bold tracking-wider">Escrow Contract</span>
                    <span className="font-mono text-primary font-bold">TrustBayEscrow v1.0</span>
                  </div>
                </div>
              </div>
              <Button className="w-full h-16 text-lg font-extrabold shadow-xl shadow-primary/20 bg-emerald-600 hover:bg-emerald-700 transition-all gap-3">
                Confirm & Pay On-Chain <Zap className="h-5 w-5 fill-current" />
              </Button>
              <p className="text-[10px] text-center uppercase tracking-widest font-bold text-muted-foreground">
                By confirming, you agree to our Escrow Terms of Service.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Order Summary & Trust Info */}
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
              <CardDescription>Review your items and breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-6">
              {/* Items List */}
              <div className="flex gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
                  <img src="https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=200&auto=format&fit=crop" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold line-clamp-1">iPhone 15 Pro</h4>
                  <div className="text-xs text-muted-foreground">Qty: 1 • Seller: Apple Store Accra</div>
                </div>
                <div className="text-sm font-bold">$999.00</div>
              </div>

              <Separator />

              {/* Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">${platformFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-bold">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${total.toLocaleString()}</div>
                    <div className="text-xs font-medium text-primary uppercase">Payable in USDC</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 py-4 px-6 flex items-center gap-2">
              <Info size={14} className="text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                Funds will be held until delivery is confirmed.
              </p>
            </CardFooter>
          </Card>

          <div className="grid gap-4">
            <div className="flex items-start gap-4 rounded-2xl border p-4 shadow-sm bg-background">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Verified Escrow</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Our smart contracts are audited and open-source. Your funds are never at risk from seller fraud.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border p-4 shadow-sm bg-background">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Tracked Shipments</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Integration with global carriers ensures that delivery confirmation is verified on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
