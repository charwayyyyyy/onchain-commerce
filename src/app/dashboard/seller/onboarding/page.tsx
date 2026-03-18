"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerProfileSchema } from "@/lib/validations";
import { onboardAsSeller } from "@/actions/onboarding";
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
import { toast } from "sonner";
import { 
  ShieldCheck, 
  Wallet, 
  Store, 
  ArrowRight, 
  Loader2,
  Info
} from "lucide-react";

export default function SellerOnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sellerProfileSchema),
    defaultValues: {
      storeName: "",
      bio: "",
      payoutWalletAddress: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onboardAsSeller(data);
      toast.success("Welcome to TrustBay! Your seller profile is ready.");
    } catch (error: any) {
      toast.error(error.message || "Failed to onboard as seller.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Start Selling on TrustBay</h1>
          <p className="text-muted-foreground">
            Join the decentralized commerce revolution. Secure your payouts, build trust, and reach global buyers.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-none shadow-xl shadow-muted/50 bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 pb-8 pt-8">
              <CardTitle className="text-xl font-bold">Seller Information</CardTitle>
              <CardDescription>Configure your store details and payout address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="font-bold">Store Name</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="storeName" 
                    placeholder="My Awesome Store" 
                    className="pl-10"
                    {...register("storeName")} 
                  />
                </div>
                {errors.storeName && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.storeName.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-bold">Store Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell buyers what makes your products unique..." 
                  className="min-h-[100px] rounded-xl"
                  {...register("bio")} 
                />
                {errors.bio && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.bio.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payoutWalletAddress" className="font-bold">Payout Wallet Address (Ethereum/EVM)</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="payoutWalletAddress" 
                    placeholder="0x..." 
                    className="pl-10 font-mono"
                    {...register("payoutWalletAddress")} 
                  />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5 mt-2">
                  <Info size={12} /> This is where your escrow funds will be released.
                </p>
                {errors.payoutWalletAddress && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.payoutWalletAddress.message as string}</p>
                )}
              </div>

              <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <p className="font-bold text-primary mb-1">Escrow Protection Enabled</p>
                    By becoming a seller, your transactions will be protected by our decentralized escrow system. 
                    Buyers will pay upfront, and funds are locked until delivery is verified.
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 py-6 px-6">
              <Button 
                type="submit" 
                className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Seller Profile...
                  </>
                ) : (
                  <>
                    Complete Onboarding <ArrowRight className="h-5 w-5" />
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
