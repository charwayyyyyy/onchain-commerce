"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { preferenceSettingsSchema, PreferenceSettingsValues } from "@/lib/validations/settings";
import { updatePreferenceSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Globe, Loader2 } from "lucide-react";
import { UserProfile } from "@prisma/client";

interface PreferenceSettingsFormProps {
  user: UserProfile;
}

export function PreferenceSettingsForm({ user }: PreferenceSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PreferenceSettingsValues>({
    resolver: zodResolver(preferenceSettingsSchema),
    defaultValues: {
      preferredLanguage: user.preferredLanguage || "en",
      preferredCurrency: user.preferredCurrency || "USD",
    },
  });

  async function onSubmit(values: PreferenceSettingsValues) {
    setIsLoading(true);
    const toastId = toast.loading("Saving preferences...");
    try {
      const result = await updatePreferenceSettings(values);
      if (result.success && result.data) {
        toast.success(result.message || "Preferences updated", { id: toastId });
        // Use verified data for form reset
        form.reset({
          preferredLanguage: result.data.preferredLanguage || "en",
          preferredCurrency: result.data.preferredCurrency || "USD",
        });
      } else {
        toast.error(result.error || "Failed to update preferences", { id: toastId });
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-muted/30 px-8 py-10">
        <CardTitle className="text-xl font-bold">App Preferences</CardTitle>
        <CardDescription className="text-base font-medium">Customize your display and localization settings.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Display Language</Label>
              <Select 
                defaultValue={form.getValues("preferredLanguage")}
                onValueChange={(v) => form.setValue("preferredLanguage", v as string)}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-muted bg-background font-bold">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="font-bold">English (US)</SelectItem>
                  <SelectItem value="fr" className="font-bold">French</SelectItem>
                  <SelectItem value="es" className="font-bold">Spanish</SelectItem>
                  <SelectItem value="de" className="font-bold">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Display Currency</Label>
              <Select 
                defaultValue={form.getValues("preferredCurrency")}
                onValueChange={(v) => form.setValue("preferredCurrency", v as string)}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-muted bg-background font-bold">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="font-bold">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR" className="font-bold">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP" className="font-bold">GBP (British Pound)</SelectItem>
                  <SelectItem value="NGN" className="font-bold">NGN (Nigerian Naira)</SelectItem>
                  <SelectItem value="GHS" className="font-bold">GHS (Ghanaian Cedi)</SelectItem>
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
              Save Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
