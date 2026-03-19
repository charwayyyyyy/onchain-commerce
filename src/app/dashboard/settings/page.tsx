import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe,
  CheckCircle,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your personal profile, security, and preferences.</p>
        </div>
        <Button className="gap-2 h-12 px-6 font-bold rounded-2xl shadow-xl shadow-primary/20">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <nav className="flex flex-col gap-1 sticky top-8">
            {[
              { name: "Profile", icon: <User size={18} />, active: true },
              { name: "Security", icon: <Lock size={18} />, active: false },
              { name: "Notifications", icon: <Bell size={18} />, active: false },
              { name: "Verification", icon: <Shield size={18} />, active: false },
              { name: "Payments", icon: <CreditCard size={18} />, active: false },
              { name: "Language", icon: <Globe size={18} />, active: false },
            ].map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`w-full justify-start gap-3 rounded-xl transition-all h-12 ${
                  item.active 
                    ? "bg-primary/10 text-primary font-bold shadow-sm" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-muted/30 px-8 py-10">
              <CardTitle className="text-xl font-bold">Public Profile</CardTitle>
              <CardDescription className="text-base font-medium">This information will be displayed publicly on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-[2rem] bg-muted animate-pulse group-hover:opacity-50 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-none">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground font-medium">JPG, GIF or PNG. Max size of 800K.</p>
                </div>
              </div>

              <Separator className="bg-muted/50" />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Display Name</Label>
                  <Input placeholder="Enter your name" className="h-12 rounded-xl border-2 border-muted bg-background font-bold focus:border-primary focus:ring-0 transition-colors" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Username</Label>
                  <Input placeholder="username" className="h-12 rounded-xl border-2 border-muted bg-background font-bold focus:border-primary focus:ring-0 transition-colors" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Email Address</Label>
                  <Input placeholder="email@example.com" className="h-12 rounded-xl border-2 border-muted bg-background font-bold focus:border-primary focus:ring-0 transition-colors" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Bio</Label>
                  <textarea className="w-full p-4 rounded-xl border-2 border-muted bg-background font-medium focus:border-primary focus:ring-0 transition-colors resize-none h-32" placeholder="Tell us about yourself..." />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-muted/30 px-8 py-10">
              <CardTitle className="text-xl font-bold">Account Verification</CardTitle>
              <CardDescription className="text-base font-medium">Verify your identity to unlock higher limits and premium features.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <div className="font-bold text-lg leading-none">Trust Score: 98/100</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Your account is highly trusted.</div>
                </div>
              </div>
              <Button variant="outline" className="h-12 px-6 font-bold rounded-xl border-2">Verified</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
