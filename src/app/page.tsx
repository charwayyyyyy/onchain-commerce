import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Globe, 
  CheckCircle, 
  CreditCard, 
  Zap,
  ArrowUpRight,
  TrendingUp,
  Award,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 py-12 md:gap-24 md:py-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center gap-8">
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
            The Future of Commerce is On-Chain
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Decentralized Marketplace You Can <span className="text-primary">Trust</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            TrustBay is a secure, crypto-powered platform where funds are held in escrow until delivery. 
            No intermediaries, no hidden fees, just pure peer-to-peer commerce.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/marketplace">
              <Button size="lg" className="h-12 px-8 text-base">
                Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/seller-onboarding">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Start Selling
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 flex items-center gap-6 grayscale opacity-60">
            <div className="flex items-center gap-1.5 font-bold"><ShieldCheck size={20} /> Secure Escrow</div>
            <div className="flex items-center gap-1.5 font-bold"><Globe size={20} /> Global Payments</div>
            <div className="flex items-center gap-1.5 font-bold"><Lock size={20} /> Zero Frauds</div>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Total Volume", value: "$2.4M+", icon: <TrendingUp className="h-5 w-5 text-primary" /> },
              { label: "Active Users", value: "15k+", icon: <Users className="h-5 w-5 text-primary" /> },
              { label: "Products Listed", value: "45k+", icon: <Zap className="h-5 w-5 text-primary" /> },
              { label: "Trust Score", value: "99.9%", icon: <Award className="h-5 w-5 text-primary" /> },
            ].map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow Explainer */}
      <section className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How TrustBay Protects You</h2>
            <p className="text-lg text-muted-foreground">
              We've eliminated the risks of online shopping by leveraging smart contract escrow technology.
            </p>
            <div className="space-y-6">
              {[
                { 
                  title: "Smart Contract Escrow", 
                  desc: "When you pay, funds are locked in a secure smart contract, not sent directly to the seller.",
                  icon: <Lock className="h-5 w-5" /> 
                },
                { 
                  title: "Proof of Delivery", 
                  desc: "Funds are only released once you confirm receipt of the item or the tracking confirms delivery.",
                  icon: <CheckCircle className="h-5 w-5" /> 
                },
                { 
                  title: "Dispute Resolution", 
                  desc: "If something goes wrong, our decentralized dispute system ensures a fair outcome for both parties.",
                  icon: <ShieldCheck className="h-5 w-5" /> 
                }
              ].map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/how-it-works">
              <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                Learn more about our trust protocol <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative aspect-video rounded-3xl bg-muted overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
            {/* Placeholder for escrow flow animation or illustration */}
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40 font-bold uppercase tracking-widest italic">
              Escrow Flow Illustration
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground">Discover a wide range of products from verified sellers.</p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline">View All Categories</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            "Electronics", "Collectibles", "Fashion", "Real Estate", "Services", "Art"
          ].map((cat) => (
            <Link key={cat} href={`/marketplace?category=${cat.toLowerCase()}`} className="group">
              <Card className="flex h-32 flex-col items-center justify-center transition-all group-hover:border-primary group-hover:shadow-md">
                <div className="text-sm font-semibold">{cat}</div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center gap-8">
            <h2 className="text-3xl font-bold sm:text-5xl">Ready to start trading on-chain?</h2>
            <p className="text-lg opacity-90 sm:text-xl">
              Join thousands of buyers and sellers already using TrustBay for secure, borderless commerce.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                Create Account
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Join our Discord
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
