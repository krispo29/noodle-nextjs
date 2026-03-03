"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full"
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Badge className="mb-6 py-1 px-4 text-sm bg-primary/20 text-primary hover:bg-primary/20 border-none">
              {process.env.NEXT_PUBLIC_RESTAURANT_NAME || "ร้านอาหารไทย"}
            </Badge>
          </motion.div>
          <motion.h1 
            variants={fadeInUp} 
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            อาหารไทยแท้ <br className="hidden md:block"/>
            <span className="text-primary">รสชาติคุณภาพ</span>
          </motion.h1>
          <motion.p 
            variants={fadeInUp} 
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl px-4 mx-auto"
          >
            วัตถุดิบสดใหม่ทุกวัน สูตรลับความอร่อย บริการด้วยใจ สัมผัสรสชาติแห่งความใส่ใจในทุกจาน
          </motion.p>
          <motion.div 
            variants={fadeInUp} 
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center mx-auto"
          >
            <Button asChild size="lg" className="text-md w-full sm:w-auto px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
              <Link href="#menu">
                ดูเมนูเลย <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-md w-full sm:w-auto px-8 h-12 border-primary/20 hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all">
              <Link href="#contact">ติดต่อร้าน</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative blurs */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"
      ></motion.div>
    </section>
  );
}
