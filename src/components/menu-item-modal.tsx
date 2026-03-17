"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/store/useCartStore"
import type { MenuItem } from "@/actions/menu"
import Image from "next/image"
import { Plus, Minus, X, Clock, Info, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

const NOODLE_TYPES = [
  { id: "เล็ก", label: "เส้นเล็ก" },
  { id: "ใหญ่", label: "เส้นใหญ่" },
  { id: "บะหมี่", label: "บะหมี่" },
  { id: "วุ้นเส้น", label: "วุ้นเส้น" },
  { id: "หมี่ขาว", label: "หมี่ขาว" },
  { id: "เกี้ยมอี๋", label: "เส้นเกี้ยมอี๋" },
  { id: "มาม่า", label: "เส้นมาม่า" },
  { id: "ก๋วยจั๊บ", label: "เส้นก๋วยจั๊บ" },
  { id: "เกาเหลา", label: "เกาเหลา (ไม่ใส่เส้น)" },
] as const

const TOPPINGS = [
  { id: "พิเศษ", label: "พิเศษ (+10 บาท)", price: 10 },
  { id: "ไข่ยางมะตูม", label: "ไข่ต้มยางมะตูม (+10 บาท)", price: 10 },
  { id: "ไข่ออนเซ็น", label: "ไข่ออนเซ็น (+15 บาท)", price: 15 },
  { id: "กากหมูเจียว", label: "กากหมูเจียว (+15 บาท)", price: 15 },
  { id: "เกี๊ยวกรอบ", label: "เกี๊ยวกรอบ (+10 บาท)", price: 10 },
  { id: "เพิ่มลูกชิ้น", label: "เพิ่มลูกชิ้น (+15 บาท)", price: 15 },
  { id: "แคบหมู", label: "แคบหมู (+10 บาท)", price: 10 },
  { id: "หมูยอ", label: "หมูยอ (+15 บาท)", price: 15 },
] as const

const formSchema = z.object({
  noodleType: z.string().min(1, {
    message: "กรุณาเลือกเส้น",
  }),
  toppings: z.array(z.string()),
  specialRequest: z.string().optional(),
})

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

export function MenuItemModal({ isOpen, onClose, item }: MenuItemModalProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noodleType: "เล็ก",
      toppings: [],
      specialRequest: "",
    },
  })

  const watchToppings = form.watch("toppings")

  useEffect(() => {
    if (item) {
      let extraPrice = 0
      if (watchToppings?.length) {
        extraPrice = watchToppings.reduce((total, toppingId) => {
          const topping = TOPPINGS.find(t => t.id === toppingId)
          return total + (topping?.price || 0)
        }, 0)
      }
      setTotalPrice((item.price + extraPrice) * quantity)
    }
  }, [item, watchToppings, quantity])

  useEffect(() => {
    if (isOpen) {
      form.reset({
        noodleType: "เล็ก",
        toppings: [],
        specialRequest: "",
      })
      setQuantity(1)
    }
  }, [isOpen, form])

  if (!item) return null

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!item) return;
    
    addItem({
      id: item.id,
      name: item.name,
      price: totalPrice,
      quantity: quantity,
      options: {
        noodleType: values.noodleType,
        toppings: values.toppings,
        specialRequest: values.specialRequest,
      },
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border/40 bg-card/80 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-3xl">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-50 p-2 rounded-full bg-black/40 hover:bg-primary text-white transition-all duration-300 shadow-xl border border-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Hero Image Section */}
          <div className="relative w-full h-[350px]">
            {item.image ? (
              <>
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <span className="text-8xl text-primary/20 font-display">{item.name[0]}</span>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-accent text-primary tracking-[0.4em] text-[10px] uppercase">LEGENDARY FLAVOR</span>
                  {item.isRecommended && (
                    <Badge className="bg-primary text-primary-foreground font-accent text-[9px] tracking-widest border-none px-2 py-0.5 rounded-full uppercase">
                      Recommended
                    </Badge>
                  )}
                </div>
                <h2 className="text-4xl md:text-5xl font-display text-foreground leading-tight">
                  {item.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {item.description && (
              <p className="text-muted-foreground text-lg leading-relaxed font-sans italic opacity-80 border-l-2 border-primary/40 pl-6">
                &quot;{item.description}&quot;
              </p>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 pb-24">
                
                {/* Noodle Selection */}
                <FormField
                  control={form.control}
                  name="noodleType"
                  render={({ field }) => (
                    <FormItem className="space-y-6">
                      <div className="flex items-end justify-between border-b border-border/20 pb-4">
                        <FormLabel className="font-display text-2xl">
                          Select <span className="text-primary">Noodles</span>
                        </FormLabel>
                        <span className="font-accent tracking-widest text-[10px] text-primary uppercase">MANDATORY</span>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          {NOODLE_TYPES.map((type) => {
                            const isSelected = field.value === type.id;
                            return (
                              <FormItem 
                                key={type.id} 
                                className={cn(
                                  "relative flex items-center h-16 px-6 rounded-2xl cursor-pointer transition-all duration-300 border",
                                  isSelected 
                                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/5" 
                                    : "border-border/40 hover:bg-white/5 hover:border-border"
                                )}
                              >
                                <FormControl>
                                  <RadioGroupItem value={type.id} className="sr-only" />
                                </FormControl>
                                <FormLabel className="font-accent tracking-widest text-xs uppercase cursor-pointer w-full flex justify-between items-center">
                                  <span className={cn(isSelected ? "text-primary" : "text-muted-foreground")}>
                                    {type.label}
                                  </span>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />}
                                </FormLabel>
                              </FormItem>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Toppings Selection */}
                <FormField
                  control={form.control}
                  name="toppings"
                  render={() => (
                    <FormItem className="space-y-6">
                      <div className="flex items-end justify-between border-b border-border/20 pb-4">
                        <FormLabel className="font-display text-2xl">Elevate <span className="text-primary">Dish</span></FormLabel>
                        <span className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase">OPTIONAL</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {TOPPINGS.map((topping) => (
                          <FormField
                            key={topping.id}
                            control={form.control}
                            name="toppings"
                            render={({ field }) => {
                              const isSelected = field.value?.includes(topping.id);
                              return (
                                <FormItem
                                  key={topping.id}
                                  className={cn(
                                    "relative flex flex-row items-center h-16 px-6 rounded-2xl border transition-all duration-300 cursor-pointer",
                                    isSelected
                                      ? "border-primary bg-primary/10"
                                      : "border-border/40 hover:bg-white/5 hover:border-border"
                                  )}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, topping.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== topping.id
                                              )
                                            )
                                      }}
                                      className="rounded border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                  </FormControl>
                                  <FormLabel className="font-accent tracking-widest text-[11px] uppercase cursor-pointer w-full flex justify-between items-center ml-4">
                                    <span className={cn(isSelected ? "text-primary" : "text-muted-foreground")}>
                                      {topping.label.split(" (")[0]}
                                    </span>
                                    <span className="text-[10px] opacity-60">
                                      +฿{topping.price}
                                    </span>
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {/* Special Request */}
                <FormField
                  control={form.control}
                  name="specialRequest"
                  render={({ field }) => (
                    <FormItem className="space-y-6">
                      <div className="flex items-end justify-between border-b border-border/20 pb-4">
                        <FormLabel className="font-display text-2xl">Chef Notes</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="EX: NO GARLIC, EXTRA SPICY..."
                          className="min-h-[120px] resize-none rounded-2xl bg-white/5 border-border/40 focus:border-primary font-accent tracking-widest text-[10px] uppercase transition-all duration-500 p-6"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-card via-card to-transparent z-50">
                  <div className="flex items-center gap-4">
                    {/* Quantity */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl h-16 px-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-white/10 text-primary"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-accent w-12 text-center text-foreground">{quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-white/10 text-primary"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Submit */}
                    <Button 
                      type="submit" 
                      className="flex-1 h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-accent tracking-widest text-sm rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-between px-8"
                    >
                      <span className="uppercase">ADD TO BASKET</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary-foreground/40 rounded-full" />
                        <span className="text-xl">฿{totalPrice}</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
