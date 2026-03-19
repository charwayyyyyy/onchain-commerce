import Link from "next/link";
import { ShieldCheck, Twitter, Github, Linkedin, Globe } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card/50 px-4 py-12 md:px-6">
      <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">TrustBay</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
            Decentralized commerce you can trust. Secure, transparent escrow-protected transactions powered by the blockchain.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <Github size={18} />
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <Linkedin size={18} />
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <Globe size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider">Marketplace</h4>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Browse Products</Link></li>
            <li><Link href="/marketplace?filter=categories" className="hover:text-foreground transition-colors">Categories</Link></li>
            <li><Link href="/dashboard/seller/onboarding" className="hover:text-foreground transition-colors">Become a Seller</Link></li>
            <li><Link href="/marketplace?filter=featured" className="hover:text-foreground transition-colors">Featured Listings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider">Platform</h4>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How it Works</Link></li>
            <li><Link href="/how-it-works#escrow" className="hover:text-foreground transition-colors">Escrow Protection</Link></li>
            <li><Link href="/dashboard/disputes" className="hover:text-foreground transition-colors">Dispute Resolution</Link></li>
            <li><Link href="/how-it-works#fees" className="hover:text-foreground transition-colors">Fees & Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider">Resources</h4>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li><Link href="/faq" className="hover:text-foreground transition-colors">Frequently Asked Questions</Link></li>
            <li><Link href="https://docs.trustbay.io" className="hover:text-foreground transition-colors">Developer Docs</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>© {currentYear} TrustBay Labs. Built with trust in Ghana for the world.</p>
      </div>
    </footer>
  );
}
