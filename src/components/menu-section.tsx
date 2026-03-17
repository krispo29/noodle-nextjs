"use client"

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { MenuItemModal } from "@/components/menu-item-modal";
import { getMenuItems, type MenuItem } from "@/actions/menu";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const WordReveal = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");
  return (
    <h2 className={cn("font-display overflow-hidden flex flex-wrap", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-3"
          initial={{ y: "110%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            delay: i * 0.08,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

const MenuCard = ({ 
  item, 
  className, 
  onSelect 
}: { 
  item: MenuItem; 
  className?: string; 
  onSelect: (item: MenuItem) => void 
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set((x - rect.width / 2) / 15);
    mouseY.set((y - rect.height / 2) / 15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer border border-border/40 bg-card",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Image with Parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ x: dx, y: dy, scale: 1.1 }}
      >
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
        <div className="flex justify-between items-start mb-2">
          {item.isRecommended && (
            <Badge className="bg-primary text-primary-foreground font-accent tracking-widest text-[10px] uppercase px-2 py-0.5 mb-2">
              RECOMMENDED
            </Badge>
          )}
          <span className="font-accent text-3xl text-primary drop-shadow-lg">
            ฿{item.price}
          </span>
        </div>
        
        <h3 className="font-display text-2xl md:text-3xl text-foreground mb-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 font-sans max-w-xs">
          {item.description}
        </p>

        <div className="flex items-center text-primary font-accent tracking-widest text-xs uppercase group-hover:translate-x-2 transition-transform duration-300">
          ORDER NOW <ArrowRight className="ml-2 h-3 w-3" />
        </div>
      </div>

      {/* Hover Highlight Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export function MenuSection() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const handleOpenModal = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <section id="menu" className="py-32 px-4 md:px-8 bg-background relative">
      <div className="container mx-auto">
        {/* Section header — editorial style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="font-accent text-primary tracking-[0.4em] text-sm uppercase block mb-4">
              OUR MENU
            </span>
            <WordReveal 
              text="เลือกความอร่อยระดับตำนาน ที่คุณต้องลอง" 
              className="text-4xl md:text-7xl text-foreground leading-[1.1]"
            />
          </div>
          <div className="hidden md:block w-32 h-px bg-border/60 mb-6" />
          <p className="text-muted-foreground text-lg md:text-xl font-sans max-w-sm">
            สูตรลับที่ตกทอดมาหลายทศวรรษ ทุกชามปรุงด้วยความพิถีพิถันและวัตถุดิบที่ดีที่สุด
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground font-sans">
            ไม่พบรายการอาหารอัพเดทในระบบขณะนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[220px] md:auto-rows-[250px] gap-6">
            {menuItems.map((item, index) => {
              // Create a bento layout pattern
              let gridSpan = "md:col-span-4 row-span-1";
              
              if (index === 0) {
                gridSpan = "md:col-span-8 row-span-2"; // Featured
              } else if (index === 1) {
                gridSpan = "md:col-span-4 row-span-2"; // Tall
              } else if (index === 2) {
                gridSpan = "md:col-span-6 row-span-1"; // Wide
              } else if (index === 3) {
                gridSpan = "md:col-span-6 row-span-1"; // Wide
              } else if (index === 4) {
                gridSpan = "md:col-span-4 row-span-1";
              } else if (index === 5) {
                gridSpan = "md:col-span-8 row-span-1"; // Wide
              }
              
              return (
                <MenuCard 
                  key={item.id} 
                  item={item} 
                  className={gridSpan}
                  onSelect={handleOpenModal}
                />
              );
            })}
          </div>
        )}
      </div>

      <MenuItemModal 
        isOpen={!!selectedItem} 
        onClose={handleCloseModal} 
        item={selectedItem} 
      />
      
      {/* Decorative blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
}
