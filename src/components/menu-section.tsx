"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuItemModal } from "@/components/menu-item-modal";
import { getMenuItems, type MenuItem } from "@/actions/menu";
import { motion } from "framer-motion";
import Image from "next/image";

// Animation variants for staggered cards
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  })
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function MenuSection() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

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

  // Intersection observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const menuSection = document.getElementById("menu");
    if (menuSection) {
      observer.observe(menuSection);
    }

    return () => observer.disconnect();
  }, []);

  const handleOpenModal = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <section id="menu" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">ยอดฮิตติดดาว</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">เมนูแนะนำของแม่</h2>
          <p className="text-muted-foreground text-lg">เลือกความอร่อยได้ตามใจชอบ ทั้งชามน้ำ ชามแห้ง เส้นเหนียวนุ่มและเครื่องเน้นๆ</p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">ไม่พบรายการอาหารอัพเดทในระบบขณะนี้</div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={cardVariants}
              >
                <Card className="flex flex-col group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm h-full">
                  <div className="h-48 relative bg-muted/80 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <CardHeader className="pt-6 relative">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                      {item.isRecommended && (
                        <Badge variant="default" className="shrink-0 bg-primary/90 hover:bg-primary shadow-sm">แนะนำ</Badge>
                      )}
                    </div>
                    <CardDescription className="min-h-[48px] pt-1 text-sm leading-relaxed">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-primary">฿{item.price}</span>
                      <span className="text-xs text-muted-foreground">เริ่มที่</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full font-medium shadow-sm group-hover:bg-primary text-primary-foreground group-hover:text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95" 
                      onClick={() => handleOpenModal(item)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> เลือกรูปแบบ
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <MenuItemModal 
        isOpen={!!selectedItem} 
        onClose={handleCloseModal} 
        item={selectedItem} 
      />
    </section>
  );
}
