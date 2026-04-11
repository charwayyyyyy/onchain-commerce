"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationSettingsSchema, NotificationSettingsValues } from "@/lib/validations/settings";
import { updateNotificationSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Bell, Loader2 } from "lucide-react";
import { UserProfile } from "@prisma/client";

interface NotificationSettingsFormProps {
  user: UserProfile;
}

export function NotificationSettingsForm({ user }: NotificationSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      notificationOrderUpdates: user.notificationOrderUpdates,
      notificationDisputeUpdates: user.notificationDisputeUpdates,
      notificationSellerActivity: user.notificationSellerActivity,
      notificationMarketing: user.notificationMarketing,
      notificationSecurity: user.notificationSecurity,
    },
  });

  async function onSubmit(values: NotificationSettingsValues) {
    setIsLoading(true);
    const toastId = toast.loading("Saving preferences...");
    try {
      const result = await updateNotificationSettings(values);
      if (result.success && result.data) {
        toast.success(result.message || "Notification preferences updated", { id: toastId });
        // Use verified data for form reset
        form.reset({
          notificationOrderUpdates: result.data.notificationOrderUpdates,
          notificationDisputeUpdates: result.data.notificationDisputeUpdates,
          notificationSellerActivity: result.data.notificationSellerActivity,
          notificationMarketing: result.data.notificationMarketing,
          notificationSecurity: result.data.notificationSecurity,
        });
      } else {
        toast.error(result.error || "Failed to update notifications", { id: toastId });
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  const items = [
    {
      id: "notificationOrderUpdates",
      label: "Order Updates",
      description: "Receive notifications about your order status changes and shipping updates.",
    },
    {
      id: "notificationDisputeUpdates",
      label: "Dispute Updates",
      description: "Get alerts when a dispute is opened, updated, or resolved.",
    },
    {
      id: "notificationSellerActivity",
      label: "Seller Activity",
      description: "Notifications about new products from sellers you follow or your own store activity.",
    },
    {
      id: "notificationMarketing",
      label: "Marketing Emails",
      description: "Stay updated with new features, premium listings, and community news.",
    },
    {
      id: "notificationSecurity",
      label: "Security Alerts",
      description: "Critical alerts about account logins, wallet changes, and security updates.",
    },
  ] as const;

  return (
    <Card className="border-none shadow-xl shadow-muted/50 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-muted/30 px-8 py-10">
        <CardTitle className="text-xl font-bold">Notification Preferences</CardTitle>
        <CardDescription className="text-base font-medium">Control how and when you receive updates from TrustBay.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 p-4 rounded-2xl border-2 border-transparent hover:border-muted hover:bg-muted/10 transition-all">
                <Checkbox
                  id={item.id}
                  checked={form.watch(item.id)}
                  onCheckedChange={(checked) => {
                    form.setValue(item.id, checked === true);
                  }}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={item.id}
                    className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </Label>
                  <p className="text-xs text-muted-foreground font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6">
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
