import { 
  ShieldCheck, 
  ShoppingBag, 
  Lock, 
  CreditCard, 
  CheckCircle, 
  Truck, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Find a Product",
      description: "Browse the marketplace for items you want to buy. All prices are in crypto (USDC/USDT).",
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
    },
    {
      title: "Secure Payment",
      description: "Pay using your crypto wallet. Your funds are not sent to the seller yet; they are held in a secure smart contract escrow.",
      icon: <Lock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Seller Ships",
      description: "The seller is notified of the locked funds and ships your item. They provide tracking information directly on the platform.",
      icon: <Truck className="h-8 w-8 text-primary" />,
    },
    {
      title: "Confirm & Release",
      description: "Once you receive the item and confirm it matches the description, the funds are released from escrow to the seller.",
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
          How TrustBay Works
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          We use blockchain technology to create a trustless marketplace where both buyers and sellers are protected throughout the entire transaction.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-24">
        {steps.map((step, index) => (
          <div key={index} className="relative p-8 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            <div className="absolute top-8 right-8 text-4xl font-black text-muted/20 select-none">
              0{index + 1}
            </div>
          </div>
        ))}
      </div>

      <div id="escrow" className="bg-muted/50 rounded-[3rem] p-8 md:p-16 mb-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Escrow Protection</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our smart contract escrow is the heart of TrustBay. It acts as a neutral third party that holds payment until both conditions are met: the buyer receives the item, and it matches the description.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                <span className="font-medium">Funds are immutable and cannot be withdrawn by the seller prematurely.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                <span className="font-medium">Automated release after 14 days if no dispute is opened.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                <span className="font-medium">Full transparency on-chain for every transaction.</span>
              </li>
            </ul>
          </div>
          <div className="relative aspect-video rounded-3xl bg-primary overflow-hidden shadow-2xl flex items-center justify-center p-12 text-primary-foreground">
            <ShieldCheck size={120} className="opacity-20 absolute" />
            <div className="text-center z-10">
              <div className="text-4xl font-black mb-2 uppercase tracking-tighter">Secure Escrow</div>
              <div className="text-xl font-bold opacity-80">Powered by Smart Contracts</div>
            </div>
          </div>
        </div>
      </div>

      <div id="fees" className="text-center max-w-2xl mx-auto mb-24">
        <h2 className="text-3xl font-bold mb-6">Simple, Transparent Fees</h2>
        <p className="text-lg text-muted-foreground mb-12">
          We keep it simple. No listing fees, no monthly subscriptions. We only grow when you do.
        </p>
        <div className="p-8 rounded-3xl border-2 border-primary bg-primary/5 flex flex-col items-center">
          <div className="text-6xl font-black text-primary mb-2">2%</div>
          <div className="text-xl font-bold mb-4 uppercase tracking-widest">Platform Fee</div>
          <p className="text-sm text-muted-foreground max-w-xs">
            A flat 2% fee is applied to the total transaction value, shared between maintaining the protocol and escrow insurance.
          </p>
        </div>
      </div>

      <div className="text-center bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-24 shadow-2xl shadow-primary/20">
        <h2 className="text-4xl font-extrabold mb-8">Ready to start trading?</h2>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <Link href="/marketplace">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-2xl">
              Explore Marketplace
            </Button>
          </Link>
          <Link href="/dashboard/seller/onboarding">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl border-primary-foreground hover:bg-white/10 text-primary-foreground">
              Start Selling <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
