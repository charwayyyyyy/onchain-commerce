import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in zoom-in duration-500">
      <div className="mb-10 flex h-32 w-32 items-center justify-center rounded-[3rem] bg-muted text-muted-foreground/30 shadow-inner overflow-hidden border-4 border-muted/20 relative group">
        <Search size={64} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase">
        404
      </h1>
      
      <h2 className="text-3xl font-black tracking-tight mb-4 uppercase tracking-tighter">
        Page Not Found
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-12 font-medium leading-relaxed italic">
        The resource you are looking for has been moved, deleted, or never existed in the first place.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link href="/" className="flex-1">
          <Button 
            className="w-full h-14 gap-2 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
          >
            <Home size={18} /> Back Home
          </Button>
        </Link>
        <Link href="/marketplace" className="flex-1">
          <Button 
            variant="outline"
            className="w-full h-14 gap-2 font-black uppercase tracking-widest text-xs rounded-2xl border-2 hover:bg-muted transition-all active:scale-95"
          >
            Explore Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}
