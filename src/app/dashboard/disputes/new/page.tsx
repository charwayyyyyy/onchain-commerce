import { getOrCreateUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShieldAlert, ArrowRight, Info, Scale } from "lucide-react";
import Link from "next/link";
import { openDispute } from "@/actions/orders";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6">
        <Link href={`/dashboard/orders/${orderId}`}>
          <Button variant="outline" className="gap-2 rounded-2xl h-12 border-2 shadow-sm font-bold uppercase tracking-widest text-[10px] group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Order
          </Button>
        </Link>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest w-fit">
            <ShieldAlert size={14} /> Formal Dispute
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Initiate Claim</h1>
          <p className="text-muted-foreground text-lg font-medium">Order #{orderId.slice(-8).toUpperCase()} • {order.items[0]?.titleSnapshot}</p>
        </div>
      </div>

      <div className="grid gap-10">
        <form action={handleDispute}>
          <Card className="border-none shadow-2xl shadow-red-500/10 overflow-hidden rounded-[3rem] bg-card">
            <CardHeader className="bg-red-500/5 border-b border-red-500/10 px-10 py-10">
              <div className="flex items-center gap-4 text-red-600">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center shadow-inner">
                  <Scale size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter leading-none">Evidence & Details</CardTitle>
                  <CardDescription className="font-medium text-red-600/70 mt-1">
                    Providing accurate details speeds up resolution.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Claim Reason</label>
                <select 
                  name="reason" 
                  required 
                  className="w-full h-14 px-5 rounded-2xl border-2 border-muted bg-muted/20 font-bold focus:border-red-500/50 focus:bg-background transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select the primary issue...</option>
                  <option value="ITEM_NOT_RECEIVED">Item not received</option>
                  <option value="NOT_AS_DESCRIBED">Item not as described</option>
                  <option value="DAMAGED_ITEM">Item arrived damaged</option>
                  <option value="OTHER">Other technical or logistical issue</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Statement</label>
                <textarea 
                  name="description" 
                  required 
                  rows={6}
                  placeholder="Describe exactly what happened. Be specific about dates, communication, and the condition of the item received (if any)..."
                  className="w-full p-6 rounded-[2rem] border-2 border-muted bg-muted/20 font-medium focus:border-red-500/50 focus:bg-background transition-all outline-none resize-none"
                ></textarea>
              </div>

              <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-700 leading-relaxed font-medium">
                    <p className="font-black uppercase tracking-widest mb-1">Escrow Freeze Active</p>
                    Opening this dispute will immediately freeze the funds in the smart contract. Neither party will be able to move the funds until a resolution is agreed upon or moderated.
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 py-10 px-10 border-t border-muted/50">
              <div className="w-full space-y-6">
                <Button type="submit" className="w-full h-20 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.1em] text-lg rounded-[2rem] shadow-2xl shadow-red-500/30 transition-all active:scale-95 group">
                  Submit Formal Claim <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                  <Info size={14} /> TrustBay Moderation will review within 48h
                </div>
              </div>
            </CardFooter>
          </Card>
        </form>

        <div className="p-8 rounded-[2.5rem] bg-muted/20 border-2 border-dashed border-muted text-center space-y-4">
          <h4 className="font-black text-xs uppercase tracking-widest">Wait! Have you contacted the {role === "BUYER" ? "seller" : "buyer"}?</h4>
          <p className="text-sm text-muted-foreground font-medium px-4">
            Most issues can be resolved faster by communicating directly. Try sending a message before opening a formal dispute.
          </p>
        </div>
      </div>
    </div>
  );
}
