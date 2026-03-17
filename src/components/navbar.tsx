"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const headerHeight = useTransform(scrollY, [0, 100], [100, 70]);
  const headerBg = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(10, 10, 10, 0)", "rgba(16, 16, 16, 0.8)"]
  );

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header 
      style={{ height: headerHeight, backgroundColor: headerBg }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent backdrop-blur-none",
        isScrolled && "border-border/20 backdrop-blur-xl"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
            <Image 
              src="/images/logos/logo_noodle.png" 
              alt="Logo" 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl md:text-2xl tracking-tight text-foreground leading-none">
              PIER <span className="text-primary italic">Noodles</span>
            </span>
            <span className="font-accent text-[10px] tracking-[0.3em] text-primary uppercase leading-none mt-1">
              EST. 1995
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: "MENU", href: "#menu" },
            { label: "OUR STORY", href: "#story" },
            { label: "CONTACT", href: "#contact" },
          ].map((item) => (
            <Link 
              key={item.label}
              href={item.href} 
              className="relative font-accent tracking-[0.2em] text-[11px] text-muted-foreground hover:text-primary transition-colors group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link 
            href="/admin" 
            className="hidden md:block font-accent tracking-widest text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            ADMIN ACCESS
          </Link>
          <button className="md:hidden flex flex-col gap-1.5 p-2">
            <span className="w-6 h-0.5 bg-foreground" />
            <span className="w-6 h-0.5 bg-foreground opacity-70" />
            <span className="w-4 h-0.5 bg-primary self-end" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
