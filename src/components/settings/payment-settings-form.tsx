"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSettingsSchema, PaymentSettingsValues } from "@/lib/validations/settings";
import { updatePaymentSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Wallet, Loader2, AlertCircle } from "lucide-react";
import { SellerProfile } from "@prisma/client";
import Link from "next/link";

interface PaymentSettingsFormProps {
  sellerProfile: SellerProfile | null;
}

export function PaymentSettingsForm({ sellerProfile }: PaymentSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PaymentSettingsValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      payoutWalletAddress: sellerProfile?.payoutWalletAddress || "",
      preferredPayoutNetwork: sellerProfile?.preferredPayoutNetwork || "POLYGON",
    },
  });

  async function onSubmit(values: PaymentSettingsValues) {
    setIsLoading(true);
    try {
      const result = await updatePaymentSettings(values);
      if (result.success) {
        toast.success("Payment settings updated");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update payment settings");
    } finally {
      setIsLoading(false);
    }
  }

  if (!sellerProfile) {
    return (
      <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-primary/5 px-8 py-10 border-b border-primary/10">
          <div className="flex items-center gap-3 text-primary">
            <Wallet size={24} />
            <CardTitle className="text-xl font-bold">Seller Payouts</CardTitle>
          </div>
          <CardDescription className="text-base font-medium">Configure where you receive your earnings.</CardDescription>
        </CardHeader>
        <CardContent className="p-12 text-center flex flex-col items-center">
          <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-6 text-muted-foreground/30">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">Seller Profile Required</h3>
          <p className="text-muted-foreground max-w-xs mb-8 font-medium">
            You need a seller profile to configure payout settings and receive crypto payments.
          </p>
          <Link href="/dashboard/seller/onboarding">
            <Button className="h-12 px-8 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
              Start Selling Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-muted/30 px-8 py-10">
        <CardTitle className="text-xl font-bold">Seller Payouts</CardTitle>
        <CardDescription className="text-base font-medium">Manage your crypto payout wallet and preferred network.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Payout Wallet Address (EVM Compatible)</Label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  {...form.register("payoutWalletAddress")} 
                  placeholder="0x..." 
                  className="h-14 pl-12 rounded-xl border-2 border-muted bg-background font-mono text-sm focus:border-primary focus:ring-0 transition-colors" 
                />
              </div>
              {form.formState.errors.payoutWalletAddress && (
                <p className="text-xs text-destructive font-bold">{form.formState.errors.payoutWalletAddress.message}</p>
              )}
              <p className="text-[10px] text-muted-foreground font-medium italic px-1">
                Enter your Ethereum, Polygon, or Base wallet address. Ensure you have access to this wallet.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Preferred Network</Label>
              <Select 
                defaultValue={form.getValues("preferredPayoutNetwork") || "POLYGON"}
                onValueChange={(v) => form.setValue("preferredPayoutNetwork", v as string)}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-muted bg-background font-bold">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POLYGON" className="font-bold">Polygon (Recommended)</SelectItem>
                  <SelectItem value="ETHEREUM" className="font-bold">Ethereum Mainnet</SelectItem>
                  <SelectItem value="BASE" className="font-bold">Base</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="gap-2 h-12 px-8 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Update Payouts
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
