"use client";

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image 
              src="/images/logos/logo_noodle.png" 
              alt="ร้านเปียต้มเลือดหมู" 
              width={40} 
              height={40}
              className="h-10 w-auto"
            />
          </motion.div>
          <span className="font-bold text-xl inline-block">ร้านเปียต้มเลือดหมู</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#menu" className="transition-colors hover:text-foreground/80 text-foreground/60">เมนูของเรา</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#contact" className="transition-colors hover:text-foreground/80 text-foreground/60">ติดต่อเรา</Link>
            </motion.div>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  );
}
