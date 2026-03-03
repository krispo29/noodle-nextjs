import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { ContactSection } from "@/components/contact-section";
import { CartSidebar } from "@/components/cart-sidebar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground scroll-smooth relative">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuSection />
        <ContactSection />
      </main>
      <footer className="border-t py-6 md:py-0 bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between h-16 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ร้านเปียต้มเลือดหมู. All rights reserved.</p>
          <div className="mt-4 md:mt-0 text-xs">
            Built with Next.js, Tailwind CSS & shadcn/ui
          </div>
        </div>
      </footer>
      <CartSidebar />
    </div>
  );
}
