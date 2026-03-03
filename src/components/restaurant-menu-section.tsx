"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCategoryGroups, getRecommendedItems, type CategoryGroupWithCategories } from "@/actions/restaurant"
import { getMenuItemDetails, type MenuItemWithDetails } from "@/actions/restaurant"
import { FoodOptionModal } from "@/components/food-option-modal"
import { motion } from "framer-motion"
import Image from "next/image"
import { Flame, Clock, Utensils, ChevronRight } from "lucide-react"

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
    }
  })
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

interface MenuItemCardProps {
  item: MenuItemWithDetails
  onSelect: (id: string) => void
  index: number
}

function MenuItemCard({ item, onSelect, index }: MenuItemCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
    >
      <Card className="flex flex-col group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm h-full cursor-pointer" onClick={() => onSelect(item.id)}>
        <div className="h-48 relative bg-muted/80 flex items-center justify-center overflow-hidden">
          {item.imageUrl ? (
            <Image 
              src={item.imageUrl} 
              alt={item.name} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <Utensils className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          {item.isSpicy && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              <Flame className="w-3 h-3 mr-1" /> เผ็ด
            </Badge>
          )}
        </div>
        <CardHeader className="pt-4">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
            {item.isRecommended && (
              <Badge className="shrink-0 bg-amber-500 hover:bg-amber-500 text-white shadow-sm">แนะนำ</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-primary">฿{item.basePrice}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {item.preparationTime} นาที
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            className="w-full font-medium shadow-sm group-hover:bg-primary text-primary-foreground group-hover:text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95" 
          >
            เลือกรูปแบบ <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export function RestaurantMenuSection() {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroupWithCategories[]>([])
  const [recommendedItems, setRecommendedItems] = useState<MenuItemWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItemWithDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("recommended")

  useEffect(() => {
    async function fetchData() {
      try {
        const [groups, recommended] = await Promise.all([
          getCategoryGroups(),
          getRecommendedItems()
        ])
        
        setCategoryGroups(groups)
        // Cast recommended items
        setRecommendedItems(recommended as unknown as MenuItemWithDetails[])
      } catch (error) {
        console.error("Failed to fetch menu:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleOpenModal = async (itemId: string) => {
    try {
      const item = await getMenuItemDetails(itemId)
      if (item) {
        setSelectedItem(item)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Failed to fetch item details:", error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  if (isLoading) {
    return (
      <section id="menu" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="menu" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            เมนูของเรา
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">เลือกสั่งอาหารตามใจชอบ</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            อาหารสดใหม่ทุกวัน สัมผัสรสชาติแห่งความอร่อย
          </p>
        </motion.div>

        {/* Category Navigation - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
          <Button
            variant={activeCategory === "recommended" ? "default" : "outline"}
            onClick={() => setActiveCategory("recommended")}
            className="shrink-0"
          >
            ⭐ แนะนำ
          </Button>
          {categoryGroups.map((group) => (
            <Button
              key={group.id}
              variant={activeCategory === `group-${group.slug}` ? "default" : "outline"}
              onClick={() => setActiveCategory(`group-${group.slug}`)}
              className="shrink-0"
            >
              {group.name}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {recommendedItems.map((item, index) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onSelect={handleOpenModal}
              index={index}
            />
          ))}
        </motion.div>

        {recommendedItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            ไม่พบรายการอาหาร
          </div>
        )}
      </div>

      <FoodOptionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        item={selectedItem}
      />
    </section>
  )
}
