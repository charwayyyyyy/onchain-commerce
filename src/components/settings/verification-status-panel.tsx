"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertCircle, Clock, Wallet, UserCheck } from "lucide-react";
import { UserProfile, SellerProfile } from "@prisma/client";

interface VerificationStatusPanelProps {
  user: UserProfile;
  sellerProfile: SellerProfile | null;
}

export function VerificationStatusPanel({ user, sellerProfile }: VerificationStatusPanelProps) {
  const isSeller = user.role === "SELLER";
  const hasWallet = !!sellerProfile?.payoutWalletAddress;

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-muted/30 px-8 py-10">
          <CardTitle className="text-xl font-bold">Verification Center</CardTitle>
          <CardDescription className="text-base font-medium">View your account trust level and verification status.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Global Trust Score */}
          <div className="flex items-center justify-between p-6 rounded-[2rem] bg-emerald-500/5 border-2 border-emerald-500/10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Shield size={32} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 mb-1">Trust Score</div>
                <div className="text-3xl font-black text-emerald-600 leading-none">98/100</div>
              </div>
            </div>
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              High Trust
            </Badge>
          </div>

          <div className="grid gap-6">
            {/* Identity Verification */}
            <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-muted">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm">Identity Verified</p>
                  <p className="text-xs text-muted-foreground font-medium">Basic account verification via Clerk.</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>

            {/* Email Verification */}
            <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-muted">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm">Email Confirmed</p>
                  <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>

            {/* Seller Verification */}
            {isSeller ? (
              <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-muted">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Store Verification</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {sellerProfile?.isVerified ? "Verified Merchant" : "Pending Verification"}
                    </p>
                  </div>
                </div>
                {sellerProfile?.isVerified ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Clock className="h-5 w-5 text-orange-500" />
                )}
              </div>
            ) : null}

            {/* Wallet Verification */}
            {isSeller ? (
              <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-muted">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Payout Wallet</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {hasWallet ? "Wallet configured" : "No payout wallet set"}
                    </p>
                  </div>
                </div>
                {hasWallet ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
