import { 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  ShoppingBag,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DisputesPage() {
  // Since we don't have real disputes in the database yet, we'll show an empty state
  const disputes: any[] = [];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disputes Center</h1>
          <p className="text-muted-foreground">Manage your open claims and resolution status.</p>
        </div>
        <Link href="/faq#disputes">
          <Button variant="ghost" className="gap-2 h-12 px-6 font-bold rounded-2xl">
            <HelpCircle className="h-4 w-4" /> Dispute FAQ
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card className="border-none shadow-xl shadow-muted/50 rounded-3xl overflow-hidden bg-primary text-primary-foreground">
          <CardHeader className="bg-black/10">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Active Claims</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-black">{disputes.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl shadow-muted/50 rounded-3xl overflow-hidden bg-card/50">
          <CardHeader className="bg-muted/10">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-black">0</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl shadow-muted/50 rounded-3xl overflow-hidden bg-card/50">
          <CardHeader className="bg-muted/10">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Refunded</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-black">$0.00</div>
          </CardContent>
        </Card>
      </div>

      {disputes.length > 0 ? (
        <div className="space-y-4">
          {/* Dispute list would go here */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-background shadow-2xl text-primary">
            <ShieldCheck size={48} />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">No disputes found</h3>
          <p className="max-w-md text-muted-foreground mb-12 text-lg leading-relaxed">
            All your orders are currently healthy and moving through the escrow process safely. 
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <Link href="/dashboard/orders">
              <Button size="lg" className="w-full h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20">
                View All Orders
              </Button>
            </Link>
            <Link href="/how-it-works#escrow">
              <Button size="lg" variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-xs rounded-2xl">
                Escrow Protection
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Process Section */}
      <div className="mt-16 bg-card/50 rounded-[3rem] p-8 md:p-16 border shadow-sm">
        <h2 className="text-2xl font-bold mb-12 text-center uppercase tracking-widest text-muted-foreground/50">The Dispute Process</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { 
              title: "Open Claim", 
              desc: "Provide details and evidence within 14 days of estimated delivery.", 
              icon: <AlertCircle className="h-8 w-8 text-primary" /> 
            },
            { 
              title: "Moderation", 
              desc: "A neutral third party reviews the evidence from both parties.", 
              icon: <Clock className="h-8 w-8 text-primary" /> 
            },
            { 
              title: "Resolution", 
              desc: "Funds are released to the rightful party based on the outcome.", 
              icon: <CheckCircle className="h-8 w-8 text-primary" /> 
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-6 h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
