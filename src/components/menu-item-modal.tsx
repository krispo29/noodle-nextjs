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
import { Plus, Minus, X, Clock, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
      noodleType: "เล็ก", // Default to sen lek
      toppings: [],
      specialRequest: "",
    },
  })

  // Watch for topping changes to recalculate the modal price
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

  // Reset form when opened with a new item
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
      price: totalPrice, // Save the calculated base item + toppings price as the cart price
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
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl shadow-2xl rounded-[2rem]">
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all duration-200 shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden custom-scrollbar pb-24">
          {/* Hero Section */}
          <div className="relative w-full h-64 sm:h-72">
            {item.image ? (
              <>
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl text-primary font-bold">{item.name[0]}</span>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tight text-foreground drop-shadow-sm">
                  {item.name}
                </h2>
                {item.isRecommended && (
                  <Badge className="bg-primary text-primary-foreground border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Recommended
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground/80">
                <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Freshly Prepared</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-full border border-border/50">
                  <Info className="w-3.5 h-3.5" />
                  <span>High Quality</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 space-y-8 mt-4">
            {item.description && (
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {item.description}
              </p>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <FormField
              control={form.control}
              name="noodleType"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex items-end justify-between px-1">
                    <FormLabel className="text-lg font-bold tracking-tight">
                      เลือกเส้นก๋วยเตี๋ยว <span className="text-primary ml-1">*</span>
                    </FormLabel>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Required</span>
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {NOODLE_TYPES.map((type) => {
                        const isSelected = field.value === type.id;
                        return (
                          <FormItem 
                            key={type.id} 
                            className={cn(
                              "relative flex items-center space-x-3 space-y-0 border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200",
                              isSelected 
                                ? "border-primary bg-primary/5 ring-4 ring-primary/5 shadow-sm" 
                                : "border-border/50 hover:border-border hover:bg-muted/30"
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem value={type.id} className="sr-only" />
                            </FormControl>
                            <FormLabel className="font-semibold cursor-pointer w-full flex justify-between items-center text-[15px]">
                              <span className={cn(isSelected ? "text-primary" : "text-foreground")}>
                                {type.label}
                              </span>
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

            <FormField
              control={form.control}
              name="toppings"
              render={() => (
                <FormItem className="space-y-4">
                  <div className="flex items-end justify-between px-1">
                    <FormLabel className="text-lg font-bold tracking-tight">เพิ่มท็อปปิ้ง (เลือกได้หลายอย่าง)</FormLabel>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Optional</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                "relative flex flex-row items-center space-x-3 space-y-0 rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-4 ring-primary/5 shadow-sm"
                                  : "border-border/50 hover:border-border hover:bg-muted/30"
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
                                  className="rounded-full h-5 w-5"
                                />
                              </FormControl>
                              <FormLabel className="text-[14px] font-semibold cursor-pointer w-full flex justify-between items-center pr-1">
                                <span className={cn(isSelected ? "text-primary" : "text-foreground")}>
                                  {topping.label.split(" (")[0]}
                                </span>
                                <Badge variant="secondary" className="font-bold bg-background text-[10px] scale-90 origin-right">
                                  +{topping.price}฿
                                </Badge>
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequest"
              render={({ field }) => (
                <FormItem className="space-y-4 pb-4">
                  <div className="flex items-end justify-between px-1">
                    <FormLabel className="text-lg font-bold tracking-tight">ความต้องการพิเศษ</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="เช่น ไม่กระเทียมเจียว, ขอรสจัดๆ"
                      className="min-h-[100px] resize-none rounded-2xl bg-muted/30 border-2 border-border/50 focus:border-primary transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Final Actions Area */}
            <div className="sticky bottom-0 left-0 right-0 pt-6 pb-2 bg-gradient-to-t from-background via-background to-transparent z-40">
              <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-3 shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-4">
                  {/* Modern Quantity Selector */}
                  <div className="flex items-center bg-muted/50 rounded-full p-1.5 h-14 min-w-[140px] justify-between border border-border/30">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-full bg-background hover:bg-primary/5 hover:text-primary shadow-sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-black w-8 text-center tabular-nums">{quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-full bg-background hover:bg-primary/5 hover:text-primary shadow-sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    type="submit" 
                    size="lg"
                    className="flex-1 h-14 text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-[0_8px_30px_rgb(var(--primary-rgb),0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    เพิ่มลงตะกร้า • ฿{totalPrice}
                  </Button>
                </div>
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
