"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail, Lock, Smartphone, ExternalLink } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export function SecuritySettingsPanel() {
  const { openUserProfile } = useClerk();

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-muted/30 px-8 py-10">
          <CardTitle className="text-xl font-bold">Account Security</CardTitle>
          <CardDescription className="text-base font-medium">
            Manage your password, email addresses, and multi-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="p-6 rounded-[2rem] bg-primary/5 border-2 border-primary/10">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Managed by Clerk</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                  For your security, TrustBay uses Clerk to handle authentication. You can manage your security settings, including password changes and 2FA, in your global account profile.
                </p>
                <Button 
                  onClick={() => openUserProfile()}
                  className="gap-2 h-12 px-8 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                >
                  Manage Security <ExternalLink size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-6 rounded-[2rem] border-2 border-muted bg-card">
              <Lock className="h-6 w-6 text-muted-foreground mb-4" />
              <h4 className="font-bold mb-1">Password</h4>
              <p className="text-xs text-muted-foreground font-medium mb-4">Update your password regularly to keep your account safe.</p>
              <Button variant="outline" size="sm" onClick={() => openUserProfile()} className="rounded-xl font-bold">Update</Button>
            </div>
            <div className="p-6 rounded-[2rem] border-2 border-muted bg-card">
              <Smartphone className="h-6 w-6 text-muted-foreground mb-4" />
              <h4 className="font-bold mb-1">Two-Factor Auth</h4>
              <p className="text-xs text-muted-foreground font-medium mb-4">Add an extra layer of security to your account.</p>
              <Button variant="outline" size="sm" onClick={() => openUserProfile()} className="rounded-xl font-bold">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
