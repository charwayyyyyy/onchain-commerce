"use client";

import Link from "next/link";
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  useAuth
} from "@clerk/nextjs";
import { ShoppingCart, Search, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">TrustBay</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Marketplace
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              How it Works
            </Link>
            <Link href="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden relative md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              className="h-9 w-64 rounded-full border bg-muted/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                0
              </span>
            </Button>
          </Link>

          <div className="flex items-center gap-2 border-l pl-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Get Started</Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
