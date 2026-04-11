import { 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  ShoppingBag,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserDisputes } from "@/actions/orders";
import { StatusBadge } from "@/components/shared/ux/status-badge";
import { EmptyState } from "@/components/shared/ux/empty-state";

export default async function DisputesPage() {
  const disputes = await getUserDisputes();

  const activeClaims = disputes.filter(d => d.status === "OPEN" || d.status === "UNDER_REVIEW").length;
  const resolvedClaims = disputes.filter(d => d.status === "RESOLVED").length;

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Disputes Center</h1>
          <p className="text-muted-foreground text-lg font-medium">Manage your open claims and resolution status.</p>
        </div>
        <Link href="/faq#disputes">
          <Button variant="outline" className="gap-2 h-14 px-8 font-black uppercase tracking-widest rounded-2xl border-2">
            <HelpCircle className="h-5 w-5" /> Dispute FAQ
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-xl shadow-primary/20 rounded-[2rem] overflow-hidden bg-primary text-primary-foreground">
          <CardHeader className="bg-black/10 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Active Claims</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="text-5xl font-black tracking-tighter">{activeClaims}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl shadow-muted/50 rounded-[2rem] overflow-hidden bg-card/50">
          <CardHeader className="bg-muted/10 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="text-5xl font-black tracking-tighter">{resolvedClaims}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl shadow-muted/50 rounded-[2rem] overflow-hidden bg-card/50">
          <CardHeader className="bg-muted/10 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Escrow Refunded</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="text-5xl font-black tracking-tighter">$0.00</div>
          </CardContent>
        </Card>
      </div>

      {disputes.length > 0 ? (
        <Card className="border-none shadow-2xl shadow-muted/50 overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-muted/30 px-8 py-8 border-b border-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-widest">Open Claims</CardTitle>
                <CardDescription className="font-medium">Track your active dispute cases</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="border-b bg-muted/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-8 py-5">Dispute ID</th>
                    <th className="px-8 py-5">Order</th>
                    <th className="px-8 py-5">Reason</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Opened On</th>
                    <th className="px-8 py-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/30">
                  {disputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-8 py-6 font-mono font-bold text-xs">#{dispute.id.slice(-8).toUpperCase()}</td>
                      <td className="px-8 py-6">
                        <Link href={`/dashboard/orders/${dispute.orderId}`} className="hover:text-primary transition-colors">
                          <div className="font-black text-sm uppercase tracking-tighter">Order #{dispute.orderId.slice(-8).toUpperCase()}</div>
                          <div className="text-[10px] font-black text-muted-foreground uppercase mt-1">{dispute.order.items[0]?.titleSnapshot}</div>
                        </Link>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full border-muted-foreground/30">
                          {dispute.reason.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={dispute.status} />
                      </td>
                      <td className="px-8 py-6 font-bold text-muted-foreground text-xs">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <Link href={`/dashboard/orders/${dispute.orderId}`}>
                          <Button variant="outline" size="sm" className="font-black text-[10px] uppercase rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                            Details <ArrowRight size={14} className="ml-1.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState 
          icon={ShieldCheck}
          title="No disputes found"
          description="All your orders are currently healthy and moving through the escrow process safely."
          actionLabel="View All Orders"
          actionHref="/dashboard/orders"
          className="border-none rounded-[3rem] py-24 shadow-xl shadow-muted/30"
        />
      )}

      {/* Process Section */}
      <div className="mt-16 bg-muted/20 rounded-[3.5rem] p-10 md:p-20 border-2 border-dashed border-muted relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <ShieldCheck size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">The Resolution Process</h2>
            <p className="text-muted-foreground font-medium italic leading-relaxed">
              TrustBay ensures a fair resolution for both buyers and sellers through our verified dispute moderation flow.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              { 
                title: "Open Claim", 
                desc: "Provide details and evidence within 14 days of estimated delivery.", 
                icon: <AlertCircle size={32} /> 
              },
              { 
                title: "Moderation", 
                desc: "A neutral third party reviews the evidence from both parties.", 
                icon: <Clock size={32} /> 
              },
              { 
                title: "Resolution", 
                desc: "Funds are released to the rightful party based on the outcome.", 
                icon: <CheckCircle size={32} /> 
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="mb-8 h-20 w-20 flex items-center justify-center rounded-3xl bg-background text-primary shadow-xl shadow-primary/10 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
