"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSettingsSchema, ProfileSettingsValues } from "@/lib/validations/settings";
import { updateProfileSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, User, Loader2 } from "lucide-react";
import { UserProfile } from "@prisma/client";

interface ProfileSettingsFormProps {
  user: UserProfile;
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: user.displayName || "",
      username: user.username || "",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
    },
  });

  async function onSubmit(values: ProfileSettingsValues) {
    setIsLoading(true);
    try {
      const result = await updateProfileSettings(values);
      if (result.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-muted/30 px-8 py-10">
        <CardTitle className="text-xl font-bold">Public Profile</CardTitle>
        <CardDescription className="text-base font-medium">This information will be displayed publicly on the platform.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-8">
            <div className="relative group">
              {form.watch("avatarUrl") ? (
                <img 
                  src={form.watch("avatarUrl")!} 
                  alt="Avatar" 
                  className="h-24 w-24 rounded-[2rem] object-cover border-2 border-muted"
                />
              ) : (
                <div className="h-24 w-24 rounded-[2rem] bg-muted flex items-center justify-center">
                  <User size={40} className="text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/20 rounded-[2rem]">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Change URL</span>
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-lg leading-none">Profile Picture</h3>
              <p className="text-sm text-muted-foreground font-medium mb-2">Provide a URL for your avatar image.</p>
              <Input 
                {...form.register("avatarUrl")} 
                placeholder="https://example.com/avatar.jpg"
                className="h-10 rounded-xl border-2 border-muted bg-background font-medium focus:border-primary focus:ring-0"
              />
              {form.formState.errors.avatarUrl && (
                <p className="text-xs text-destructive font-bold mt-1">{form.formState.errors.avatarUrl.message}</p>
              )}
            </div>
          </div>

          <Separator className="bg-muted/50" />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Display Name</Label>
              <Input 
                {...form.register("displayName")} 
                placeholder="Enter your name" 
                className="h-12 rounded-xl border-2 border-muted bg-background font-bold focus:border-primary focus:ring-0 transition-colors" 
              />
              {form.formState.errors.displayName && (
                <p className="text-xs text-destructive font-bold">{form.formState.errors.displayName.message}</p>
              )}
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Username</Label>
              <Input 
                {...form.register("username")} 
                placeholder="username" 
                className="h-12 rounded-xl border-2 border-muted bg-background font-bold focus:border-primary focus:ring-0 transition-colors" 
              />
              {form.formState.errors.username && (
                <p className="text-xs text-destructive font-bold">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Email Address (Managed by Clerk)</Label>
              <Input 
                value={user.email} 
                disabled 
                className="h-12 rounded-xl border-2 border-muted bg-muted/50 font-bold opacity-70 cursor-not-allowed" 
              />
              <p className="text-[10px] text-muted-foreground font-medium italic">Email updates are handled through your account security settings.</p>
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Bio</Label>
              <Textarea 
                {...form.register("bio")}
                className="w-full p-4 rounded-xl border-2 border-muted bg-background font-medium focus:border-primary focus:ring-0 transition-colors resize-none h-32" 
                placeholder="Tell us about yourself..." 
              />
              {form.formState.errors.bio && (
                <p className="text-xs text-destructive font-bold">{form.formState.errors.bio.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="gap-2 h-12 px-8 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
