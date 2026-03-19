import { getOrCreateUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { openDispute } from "@/actions/orders";

export default async function NewDisputePage({ 
  searchParams 
}: { 
  searchParams: { orderId?: string } 
}) {
  const user = await getOrCreateUser();
  if (!user) return redirect("/sign-in");

  const orderId = searchParams.orderId;
  if (!orderId) return redirect("/dashboard/orders");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      sellerProfile: true,
      buyerProfile: true,
    }
  });

  if (!order) return notFound();

  // Only buyer or seller can open dispute
  const isBuyer = order.buyerProfileId === user.id;
  const isSeller = user.sellerProfile && order.sellerProfileId === user.sellerProfile.id;

  if (!isBuyer && !isSeller) return redirect("/dashboard/orders");

  async function handleDispute(formData: FormData) {
    "use server";
    const reason = formData.get("reason") as string;
    const description = formData.get("description") as string;
    
    await openDispute(orderId!, reason, description);
    redirect(`/dashboard/orders/${orderId}`);
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/orders/${orderId}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Open Dispute</h1>
          <p className="text-muted-foreground">Submit a claim for Order #{orderId.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-muted/50 overflow-hidden rounded-3xl">
        <CardHeader className="bg-red-500/10 border-b border-red-500/20">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle size={24} />
            <CardTitle className="text-lg font-black uppercase tracking-widest">Dispute Initiation</CardTitle>
          </div>
          <CardDescription className="font-medium text-red-600/70">
            Disputes will freeze funds in escrow until a resolution is reached.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form action={handleDispute} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Reason for Dispute</label>
              <select 
                name="reason" 
                required 
                className="w-full h-12 px-4 rounded-xl border-2 border-muted bg-background font-bold focus:border-primary focus:ring-0 transition-colors"
              >
                <option value="">Select a reason...</option>
                <option value="ITEM_NOT_RECEIVED">Item not received</option>
                <option value="NOT_AS_DESCRIBED">Item not as described</option>
                <option value="DAMAGED_ITEM">Item arrived damaged</option>
                <option value="OTHER">Other reason</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Detailed Description</label>
              <textarea 
                name="description" 
                required 
                rows={5}
                placeholder="Explain the issue in detail. Provide evidence if possible..."
                className="w-full p-4 rounded-xl border-2 border-muted bg-background font-medium focus:border-primary focus:ring-0 transition-colors resize-none"
              ></textarea>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200">
                Submit Dispute Claim
              </Button>
              <p className="text-[10px] text-center mt-4 text-muted-foreground font-bold uppercase tracking-widest">
                Our moderation team will review your claim within 48 hours.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
