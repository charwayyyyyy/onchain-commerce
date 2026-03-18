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
    formState: { errors },
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
    try {
      await createProduct(data);
      toast.success("Product listed successfully!");
      router.push("/dashboard/seller");
    } catch (error: any) {
      toast.error(error.message || "Failed to list product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Create New Listing</h1>
          <p className="text-muted-foreground">Fill in the details to list your product on TrustBay.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-none shadow-lg shadow-muted/50 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-8 pt-8">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Basic Information
              </CardTitle>
              <CardDescription>Tell buyers what you are selling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">Product Title</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="title" 
                    placeholder="iPhone 15 Pro - Titanium Blue" 
                    className="pl-10 rounded-xl"
                    {...register("title")} 
                  />
                </div>
                {errors.title && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.title.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="font-bold">Short Description</Label>
                <Input 
                  id="shortDescription" 
                  placeholder="A quick summary of the product (max 200 chars)" 
                  className="rounded-xl"
                  {...register("shortDescription")} 
                />
                {errors.shortDescription && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.shortDescription.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Full Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed features, specs, and condition details..." 
                  className="min-h-[150px] rounded-xl"
                  {...register("description")} 
                />
                {errors.description && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.description.message as string}</p>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="font-bold">Category</Label>
                  <Select onValueChange={(val) => setValue("categoryId", val as string)}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-xs font-medium text-destructive mt-1">{errors.categoryId.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition" className="font-bold">Condition</Label>
                  <Select onValueChange={(val) => setValue("condition", val as any)} defaultValue="NEW">
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">Brand New</SelectItem>
                      <SelectItem value="LIKE_NEW">Like New</SelectItem>
                      <SelectItem value="PRE_OWNED">Pre-owned</SelectItem>
                      <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardHeader className="bg-muted/30 pb-8 pt-8 border-t">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Pricing & Inventory
              </CardTitle>
              <CardDescription>Set your price and stock levels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="price" className="font-bold">Price (USD equivalent)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="price" 
                      type="number"
                      step="0.01"
                      placeholder="999.00" 
                      className="pl-10 rounded-xl h-11"
                      {...register("price")} 
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs font-medium text-destructive mt-1">{errors.price.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentToken" className="font-bold">Payment Token</Label>
                  <Select onValueChange={(val) => setValue("paymentToken", val as any)} defaultValue="USDC">
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="font-bold">Available Stock</Label>
                  <div className="relative">
                    <Box className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="stock" 
                      type="number"
                      placeholder="1" 
                      className="pl-10 rounded-xl h-11"
                      {...register("stock")} 
                    />
                  </div>
                  {errors.stock && (
                    <p className="text-xs font-medium text-destructive mt-1">{errors.stock.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryEstimate" className="font-bold">Delivery Estimate</Label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="deliveryEstimate" 
                      placeholder="3-7 Business Days" 
                      className="pl-10 rounded-xl h-11"
                      {...register("deliveryEstimate")} 
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 leading-relaxed">
                  <strong>TrustBay Escrow Active:</strong> Once published, buyers can purchase this item. Their funds will be held securely by our escrow contract until you fulfill the order and delivery is confirmed.
                </p>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 py-8 px-8 border-t">
              <Button 
                type="submit" 
                className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Publishing Listing...
                  </>
                ) : (
                  <>
                    Publish Product <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
