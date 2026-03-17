"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  { name: "ทั้งหมด", id: "all" },
  { name: "ต้มเลือดหมู", id: "soup" },
  { name: "ก๋วยจั๊บ", id: "guay-jub" },
  { name: "เกาเหลา", id: "kao-lao" },
  { name: "เครื่องเคียง", id: "sides" },
];

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background: dark overlay on food image */}
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&q=100&w=1920" 
          alt="Authentic Thai Noodles"
          fill 
          priority
          className="object-cover scale-110" 
        />
        <div
          className="absolute inset-0 bg-gradient-to-b 
          from-background/30 via-background/60 to-background"
        />
        {/* Noise texture overlay for film grain effect - handled by .grain on body, but added here for specific hero layer if needed */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
      </div>

      {/* Floating category pills — horizontal scroll on mobile */}
      <div
        className="absolute bottom-16 md:bottom-32 left-0 right-0 
        flex gap-3 px-6 overflow-x-auto no-scrollbar justify-start md:justify-center z-20"
      >
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
            className="shrink-0 px-6 py-2 rounded-full 
            bg-white/10 backdrop-blur-md border border-white/20 
            text-white text-sm hover:bg-primary hover:border-primary 
            transition-all duration-300 font-sans"
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Main headline — editorial split layout */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-10">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-accent text-primary tracking-[0.4em] 
          text-sm uppercase mb-4"
        >
          {process.env.NEXT_PUBLIC_RESTAURANT_NAME || "ร้านเปียต้มเลือดหมู"} • Since 1995
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,10vw,8rem)] 
          leading-[0.85] text-foreground max-w-4xl"
        >
          Authentic
          <br />
          <em className="text-primary not-italic">Noodles</em>
          <br />
          Since Dawn
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex flex-col md:flex-row md:items-center gap-6"
        >
          <p className="text-muted-foreground text-lg md:text-xl max-w-md font-sans leading-relaxed">
            ก๋วยเตี๋ยวต้มเลือดหมูสูตรดั้งเดิม ปรุงด้วยใจทุกวัน 
            สัมผัสรสชาติระดับตำนานที่สืบทอดมานานกว่า 30 ปี
          </p>
          <div className="h-px w-12 bg-primary/50 hidden md:block" />
          <div className="flex flex-col">
            <span className="font-accent text-primary text-2xl tracking-wider">OPEN DAILY</span>
            <span className="text-sm text-muted-foreground uppercase">06:00 AM - 02:00 PM</span>
          </div>
        </motion.div>
      </div>
      
      {/* Ambient glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
    </section>
  );
}
