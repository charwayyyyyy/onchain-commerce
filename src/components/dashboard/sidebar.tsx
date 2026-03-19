import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  Heart, 
  MessageSquare,
  ShieldCheck,
  CreditCard,
  LogOut,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  SignOutButton
} from "@clerk/nextjs";

interface DashboardSidebarProps {
  role: "buyer" | "seller";
  activeTab: string;
  isMobile?: boolean;
}

export function DashboardSidebar({ role, activeTab, isMobile }: DashboardSidebarProps) {
  const buyerLinks = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard/buyer" },
    { name: "My Orders", icon: <ShoppingBag size={20} />, href: "/dashboard/orders" },
    { name: "Wishlist", icon: <Heart size={20} />, href: "/dashboard/wishlist" },
    { name: "Disputes", icon: <ShieldCheck size={20} />, href: "/dashboard/disputes" },
    { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/settings" },
    { name: "Start Selling", icon: <Store size={20} />, href: "/dashboard/seller/onboarding" },
  ];

  const sellerLinks = [
    { name: "Seller Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard/seller" },
    { name: "My Products", icon: <Package size={20} />, href: "/dashboard/products" },
    { name: "Sales Orders", icon: <ShoppingBag size={20} />, href: "/dashboard/orders" },
    { name: "Wallet & Payouts", icon: <CreditCard size={20} />, href: "/dashboard/wallet" },
    { name: "Disputes", icon: <ShieldCheck size={20} />, href: "/dashboard/disputes" },
    { name: "Store Settings", icon: <Settings size={20} />, href: "/dashboard/settings" },
  ];

  const links = role === "seller" ? sellerLinks : buyerLinks;

  return (
    <aside className={cn(
      "flex-col border-r bg-card/50",
      isMobile ? "flex h-full w-full border-r-0" : "hidden w-64 shrink-0 md:flex"
    )}>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {role === "seller" ? "Seller Dashboard" : "Buyer Dashboard"}
          </h2>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 rounded-xl transition-all",
                  activeTab === link.name.toLowerCase() ? "bg-primary/10 text-primary font-bold shadow-sm" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                )}
              >
                {link.icon}
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-6">
        <SignOutButton>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all">
            <LogOut size={20} />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </aside>
  );
}
