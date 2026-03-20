"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/lib/validations";
import { createProduct } from "@/actions/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Package, 
  Tag, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  Box,
  Truck
} from "lucide-react";
import { useRouter } from "next/navigation";

// Placeholder categories for MVP
const CATEGORIES = [
  { id: "electronics", name: "Electronics" },
  { id: "collectibles", name: "Collectibles" },
  { id: "fashion", name: "Fashion" },
  { id: "real-estate", name: "Real Estate" },
  { id: "services", name: "Services" },
  { id: "art", name: "Art" },
];

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      price: 0,
      paymentToken: "USDC" as const,
      stock: 1,
      categoryId: "",
      condition: "NEW" as const,
      shippingRegions: ["Global"],
      deliveryEstimate: "3-7 Days",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Publishing your listing...");
    try {
      await createProduct(data);
      toast.success("Product listed successfully!", { id: toastId });
      router.push("/dashboard/seller");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to list product.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl w-full flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest w-fit">
            <Package size={14} /> Marketplace Listing
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Create New Listing</h1>
          <p className="text-muted-foreground text-lg font-medium">Detailed listings attract more buyers and build trust.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <Card className="border-none shadow-2xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
              <CardHeader className="bg-muted/30 pb-10 pt-10 px-10">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Tag className="h-5 w-5" />
                  </div>
                  Basic Information
                </CardTitle>
                <CardDescription className="text-sm font-medium">Essential details about your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-10 px-10 pb-12">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Title</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Tag className="h-5 w-5" />
                    </div>
                    <Input 
                      id="title" 
                      placeholder="e.g. iPhone 15 Pro - Titanium Blue" 
                      className={cn(
                        "pl-12 h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-bold text-lg",
                        errors.title ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                      )}
                      {...register("title")} 
                    />
                  </div>
                  {errors.title && (
                    <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                      <AlertCircle size={14} /> {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="shortDescription" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-xs">Short Hook (Summary)</Label>
                  <Input 
                    id="shortDescription" 
                    placeholder="A catchy one-liner for search results..." 
                    className={cn(
                      "h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-medium",
                      errors.shortDescription ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                    )}
                    {...register("shortDescription")} 
                  />
                  {errors.shortDescription && (
                    <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                      <AlertCircle size={14} /> {errors.shortDescription.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-xs">Full Product Story</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe history, features, specs, and exact condition..." 
                    className={cn(
                      "min-h-[200px] rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-medium resize-none p-5",
                      errors.description ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                    )}
                    {...register("description")} 
                  />
                  {errors.description && (
                    <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                      <AlertCircle size={14} /> {errors.description.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="categoryId" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-xs">Category</Label>
                    <Select onValueChange={(val) => setValue("categoryId", val as string)}>
                      <SelectTrigger className={cn(
                        "rounded-2xl h-14 border-2 bg-muted/20 focus:bg-background transition-all font-bold px-5",
                        errors.categoryId ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                      )}>
                        <SelectValue placeholder="Pick a Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2">
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="rounded-xl my-1 font-bold">{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                        <AlertCircle size={14} /> {errors.categoryId.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="condition" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-xs">Item Condition</Label>
                    <Select onValueChange={(val) => setValue("condition", val as any)} defaultValue="NEW">
                      <SelectTrigger className="rounded-2xl h-14 border-2 bg-muted/20 focus:bg-background transition-all font-bold px-5 border-transparent focus:border-primary">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2">
                        <SelectItem value="NEW" className="rounded-xl my-1 font-bold">Brand New</SelectItem>
                        <SelectItem value="LIKE_NEW" className="rounded-xl my-1 font-bold">Like New</SelectItem>
                        <SelectItem value="PRE_OWNED" className="rounded-xl my-1 font-bold">Pre-owned</SelectItem>
                        <SelectItem value="REFURBISHED" className="rounded-xl my-1 font-bold">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
              <CardHeader className="bg-muted/30 pb-10 pt-10 px-10">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  Value & Logistics
                </CardTitle>
                <CardDescription className="text-sm font-medium">Pricing, stock, and delivery estimates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-10 px-10 pb-12">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div className="space-y-3 sm:col-span-2">
                    <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Listing Price (USD Value)</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <Input 
                        id="price" 
                        type="number"
                        step="0.01"
                        placeholder="0.00" 
                        className={cn(
                          "pl-12 h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-black text-2xl tracking-tighter",
                          errors.price ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                        )}
                        {...register("price", { valueAsNumber: true })} 
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                        <AlertCircle size={14} /> {errors.price.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="paymentToken" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Asset</Label>
                    <Select onValueChange={(val) => setValue("paymentToken", val as any)} defaultValue="USDC">
                      <SelectTrigger className="rounded-2xl h-14 border-2 bg-muted/20 focus:bg-background transition-all font-black px-5 border-transparent focus:border-primary">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2">
                        <SelectItem value="USDC" className="rounded-xl my-1 font-black">USDC</SelectItem>
                        <SelectItem value="ETH" className="rounded-xl my-1 font-black">ETH</SelectItem>
                        <SelectItem value="USDT" className="rounded-xl my-1 font-black">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Inventory Quantity</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Box className="h-5 w-5" />
                      </div>
                      <Input 
                        id="stock" 
                        type="number"
                        placeholder="1" 
                        className={cn(
                          "pl-12 h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-bold",
                          errors.stock ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                        )}
                        {...register("stock", { valueAsNumber: true })} 
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                        <AlertCircle size={14} /> {errors.stock.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="deliveryEstimate" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Est. Delivery Time</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Truck className="h-5 w-5" />
                      </div>
                      <Input 
                        id="deliveryEstimate" 
                        placeholder="e.g. 3-7 Business Days" 
                        className="pl-12 h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-bold border-transparent focus:border-primary"
                        {...register("deliveryEstimate")} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-2xl shadow-muted/50 overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground sticky top-8">
              <CardHeader className="bg-black/10 pb-8 pt-8 px-8">
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" /> Publish Listing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 px-8 pb-10 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">Your listing will be visible to all global buyers instantly.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">Funds from sales are held in Escrow until buyer confirmation.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">You can edit or archive your listing at any time from your dashboard.</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-16 text-sm font-black uppercase tracking-widest shadow-2xl shadow-black/20 gap-3 bg-white text-primary hover:bg-white/90 rounded-2xl group transition-all active:scale-95 disabled:opacity-50"
                  disabled={isSubmitting || !isDirty}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Go Live Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                
                {!isDirty && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-center opacity-60">
                    Fill in details to enable
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="p-8 rounded-[2rem] bg-muted/30 border-2 border-dashed border-muted flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-background flex items-center justify-center text-muted-foreground">
                <Info size={24} />
              </div>
              <div>
                <h4 className="font-black text-[10px] uppercase tracking-widest mb-1">Need Help?</h4>
                <p className="text-xs text-muted-foreground font-medium">Check our Seller Guide for tips on creating high-converting listings.</p>
              </div>
              <Link href="/how-it-works">
                <Button variant="link" className="text-[10px] font-black uppercase tracking-widest p-0 h-auto">View Guide</Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
