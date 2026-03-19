import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Lock, Bell, Shield, CreditCard, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { SecuritySettingsPanel } from "@/components/settings/security-settings-panel";
import { NotificationSettingsForm } from "@/components/settings/notification-settings-form";
import { VerificationStatusPanel } from "@/components/settings/verification-status-panel";
import { PaymentSettingsForm } from "@/components/settings/payment-settings-form";
import { PreferenceSettingsForm } from "@/components/settings/preferences-settings-form";

export default async function SettingsPage() {
  const user = await getOrCreateUser();
  if (!user) return redirect("/sign-in");

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal profile, security, and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0">
              {[
                { name: "Profile", value: "profile", icon: <User size={18} /> },
                { name: "Security", value: "security", icon: <Lock size={18} /> },
                { name: "Notifications", value: "notifications", icon: <Bell size={18} /> },
                { name: "Verification", value: "verification", icon: <Shield size={18} /> },
                { name: "Payments", value: "payments", icon: <CreditCard size={18} /> },
                { name: "Preferences", value: "preferences", icon: <Globe size={18} /> },
              ].map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="w-full justify-start gap-3 rounded-xl transition-all h-12 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                >
                  {item.icon}
                  {item.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </aside>

          <div className="lg:col-span-3">
            <TabsContent value="profile" className="mt-0">
              <ProfileSettingsForm user={user} />
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <SecuritySettingsPanel />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationSettingsForm user={user} />
            </TabsContent>

            <TabsContent value="verification" className="mt-0">
              <VerificationStatusPanel user={user} sellerProfile={user.sellerProfile || null} />
            </TabsContent>

            <TabsContent value="payments" className="mt-0">
              <PaymentSettingsForm sellerProfile={user.sellerProfile || null} />
            </TabsContent>

            <TabsContent value="preferences" className="mt-0">
              <PreferenceSettingsForm user={user} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
