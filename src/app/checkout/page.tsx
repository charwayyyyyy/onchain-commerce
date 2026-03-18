"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  Info,
  Loader2,
  ShoppingBag,
  ArrowRight
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
import { getProductById } from "@/actions/products";
import { createOrder } from "@/actions/orders";
import { toast } from "sonner";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("shipping");
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    region: "",
    postal: "",
    country: "",
  });

  useEffect(() => {
    if (productId) {
      getProductById(productId).then(data => {
        setProduct(data);
        setIsLoading(false);
      });
    }
  }, [productId]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.id]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (!product) return;
    
    setIsProcessing(true);
    try {
      await createOrder(product.id, 1, shippingAddress);
      toast.success("Order placed successfully! Funds locked in escrow.");
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <ShoppingBag size={64} className="text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">No product selected</h2>
        <Link href="/marketplace">
          <Button>Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const platformFee = product.price * 0.02;
  const shipping = 25.00;
  const total = product.price + platformFee + shipping;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Left Column: Checkout Form & Steps */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Order</h1>
          <p className="text-muted-foreground">Follow the steps below to secure your items via on-chain escrow.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12 rounded-xl bg-muted p-1 shadow-sm">
            <TabsTrigger value="shipping" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">1. Shipping</TabsTrigger>
            <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">2. Payment</TabsTrigger>
            <TabsTrigger value="confirm" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">3. Confirm</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipping" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" value={shippingAddress.firstName} onChange={handleAddressChange} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" value={shippingAddress.lastName} onChange={handleAddressChange} className="rounded-xl h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" value={shippingAddress.email} onChange={handleAddressChange} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Shipping Address</Label>
              <Input id="address" placeholder="123 Street Name" value={shippingAddress.address} onChange={handleAddressChange} className="rounded-xl h-11" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Accra" value={shippingAddress.city} onChange={handleAddressChange} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" placeholder="Greater Accra" value={shippingAddress.region} onChange={handleAddressChange} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Postal Code</Label>
                <Input id="postal" placeholder="GA-123" value={shippingAddress.postal} onChange={handleAddressChange} className="rounded-xl h-11" />
              </div>
            </div>
            <Button className="w-full h-14 font-bold rounded-xl mt-4 shadow-lg shadow-primary/20" onClick={() => setActiveTab("payment")}>
              Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 text-center py-8">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary mb-6 shadow-xl shadow-primary/5">
              <Wallet size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black">Connect Your Wallet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
              TrustBay uses smart contracts to hold your payment in escrow. Connect your wallet to pay with {product.paymentToken}.
            </p>
            <div className="grid gap-4 max-w-sm mx-auto">
              <Button className="h-16 font-black uppercase tracking-widest rounded-2xl gap-3 text-sm shadow-xl shadow-primary/20" onClick={() => setActiveTab("confirm")}>
                Connect MetaMask
              </Button>
              <Button variant="outline" className="h-16 font-black uppercase tracking-widest rounded-2xl gap-3 text-sm border-2">
                WalletConnect
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-8 flex items-center justify-center gap-2 font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-600" /> Secure connection powered by ethers.js
            </p>
          </TabsContent>

          <TabsContent value="confirm" className="space-y-6">
            <div className="rounded-[2rem] border-2 border-emerald-100 p-8 space-y-6 bg-emerald-50/30">
              <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">
                <CheckCircle size={20} /> Ready to Confirm
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                You are about to lock <span className="font-black text-foreground">${total.toLocaleString()} {product.paymentToken}</span> in a secure smart contract escrow for this order.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Recipient Store</span>
                  <span className="text-foreground">{product.sellerProfile.storeName}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Escrow Contract</span>
                  <span className="font-mono text-primary font-black">TrustBayEscrow v1.0</span>
                </div>
              </div>
            </div>
            <Button 
              className="w-full h-20 text-xl font-black uppercase tracking-[0.1em] shadow-2xl shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700 transition-all gap-3 rounded-2xl"
              onClick={handleConfirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm & Pay On-Chain <Zap className="h-6 w-6 fill-current" />
                </>
              )}
            </Button>
            <p className="text-[10px] text-center uppercase tracking-[0.2em] font-black text-muted-foreground/50">
              By confirming, you agree to our Escrow Terms.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Column: Order Summary */}
      <div className="flex flex-col gap-6">
        <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl bg-card">
          <CardHeader className="bg-muted/20 pb-6">
            <CardTitle className="text-lg font-black uppercase tracking-widest">Order Summary</CardTitle>
            <CardDescription className="font-medium">Review your items and breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex flex-col gap-8">
            {/* Items List */}
            <div className="flex gap-6">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-lg border-2 border-background">
                {product.images?.[0] ? (
                  <img src={product.images[0].url} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                    <ShoppingBag size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-black text-lg line-clamp-1">{product.title}</h4>
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Qty: 1 • {product.sellerProfile.storeName}</div>
              </div>
              <div className="text-lg font-black">${product.price.toLocaleString()}</div>
            </div>

            <Separator className="opacity-50" />

            {/* Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">${product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">${shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Platform Fee (2%)</span>
                <span className="text-foreground">${platformFee.toLocaleString()}</span>
              </div>
              <Separator className="opacity-50" />
              <div className="flex justify-between items-baseline pt-4">
                <span className="font-black uppercase tracking-[0.2em] text-sm">Total</span>
                <div className="text-right">
                  <div className="text-4xl font-black tracking-tighter">${total.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Payable in {product.paymentToken}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 py-6 px-8 flex items-center gap-3">
            <Info size={16} className="text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-black leading-tight">
              Funds will be held until delivery is confirmed by carrier.
            </p>
          </CardFooter>
        </Card>

        <div className="grid gap-4">
          <div className="flex items-start gap-4 rounded-3xl border-2 border-emerald-100 p-6 shadow-sm bg-emerald-50/20">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-lg border border-emerald-50">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-1">Verified Escrow</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Our smart contracts are audited and open-source. Your funds are never at risk from seller fraud.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-3xl border-2 border-blue-100 p-6 shadow-sm bg-blue-50/20">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-lg border border-blue-50">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-1">Tracked Shipments</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Integration with global carriers ensures that delivery confirmation is verified on-chain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <Suspense fallback={
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
