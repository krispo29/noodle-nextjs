import Link from "next/link";
import { Utensils } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-full">
            <Utensils className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl inline-block">ร้านเปียต้มเลือดหมู</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#menu" className="transition-colors hover:text-foreground/80 text-foreground/60">เมนูของเรา</Link>
            <Link href="#contact" className="transition-colors hover:text-foreground/80 text-foreground/60">ติดต่อเรา</Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
