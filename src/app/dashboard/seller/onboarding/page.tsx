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

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SellerOnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
    const toastId = toast.loading("Setting up your seller account...");
    try {
      await onboardAsSeller(data);
      toast.success("Welcome to TrustBay! Your seller profile is ready.", { id: toastId });
      router.push("/dashboard/seller");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to onboard as seller.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-2xl w-full flex flex-col gap-10">
        <div className="flex flex-col gap-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Store size={48} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter md:text-5xl uppercase">Start Selling</h1>
            <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto">
              Join the decentralized commerce revolution. Secure payouts, global reach.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-none shadow-2xl shadow-muted/50 bg-card overflow-hidden rounded-[3rem]">
            <CardHeader className="bg-muted/30 pb-10 pt-10 px-10 border-b border-muted/50">
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">Store Setup</CardTitle>
              <CardDescription className="text-sm font-medium">Define your brand and where you want to receive funds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 pt-10 px-10 pb-12">
              <div className="space-y-3">
                <Label htmlFor="storeName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Official Store Name</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Store className="h-5 w-5" />
                  </div>
                  <Input 
                    id="storeName" 
                    placeholder="e.g. Satoshi Collectibles" 
                    className={cn(
                      "pl-12 h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-bold text-lg",
                      errors.storeName ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                    )}
                    {...register("storeName")} 
                  />
                </div>
                {errors.storeName && (
                  <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                    <AlertCircle size={14} /> {errors.storeName.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Store Biography</Label>
                <Textarea 
                  id="bio" 
                  placeholder="What makes your products special? Tell your story..." 
                  className={cn(
                    "min-h-[120px] rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-medium resize-none p-5",
                    errors.bio ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                  )}
                  {...register("bio")} 
                />
                {errors.bio && (
                  <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                    <AlertCircle size={14} /> {errors.bio.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="payoutWalletAddress" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payout Wallet (EVM)</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <Input 
                    id="payoutWalletAddress" 
                    placeholder="0x..." 
                    className={cn(
                      "pl-12 h-14 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all font-mono text-xs",
                      errors.payoutWalletAddress ? "border-destructive/50 focus:border-destructive" : "border-transparent focus:border-primary"
                    )}
                    {...register("payoutWalletAddress")} 
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10 mt-2">
                  <Info size={14} className="text-primary shrink-0" />
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-tight">
                    This address will receive all funds released from escrow. Ensure you own the keys.
                  </p>
                </div>
                {errors.payoutWalletAddress && (
                  <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2">
                    <AlertCircle size={14} /> {errors.payoutWalletAddress.message as string}
                  </p>
                )}
              </div>

              <div className="rounded-[2rem] bg-emerald-500/5 p-6 border-2 border-emerald-500/10 flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="font-black text-emerald-700 uppercase tracking-widest mb-1">Escrow Ready</p>
                  As a TrustBay seller, your funds are automatically protected by our smart contract escrow system.
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 py-10 px-10 border-t border-muted/50">
              <Button 
                type="submit" 
                className="w-full h-16 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 gap-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Launching Store...
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
