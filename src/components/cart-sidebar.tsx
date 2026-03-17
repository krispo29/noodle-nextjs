"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Trash2, Send, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generateLineOrderUrl } from "@/lib/generateLineOrderUrl"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// PromptPay Integration
import generatePayload from "promptpay-qr"
import { QRCodeSVG } from "qrcode.react"

const SHOP_PROMPTPAY_NUMBER = process.env.NEXT_PUBLIC_PROMPTPAY_NUMBER || "0812345678"

const checkoutSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่อ (อย่างน้อย 2 ตัวอักษร)"),
  orderType: z.enum(["dine-in", "takeaway"]),
  tableNumber: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => {
  if (data.orderType === "dine-in" && !data.tableNumber) {
    return false
  }
  return true
}, {
  message: "กรุณาระบุหมายเลขโต๊ะ",
  path: ["tableNumber"],
})

export function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore()
  
  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      orderType: "dine-in",
      tableNumber: "",
      phone: "",
    },
  })

  const orderType = form.watch("orderType")
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = getCartTotal()

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    const lineUrl = generateLineOrderUrl(items, values)
    globalThis.location.href = lineUrl
  }

  return (
    <>
      {/* Floating Cart Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button 
              size="lg" 
              className="h-16 px-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-primary text-primary-foreground border-none transition-all group overflow-hidden"
              onClick={() => setIsOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 h-5 min-w-[20px] px-1 bg-accent text-white text-[10px] font-accent flex items-center justify-center rounded-full border-2 border-primary shadow-lg"
                    >
                      {itemCount}
                    </motion.div>
                  )}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="font-accent tracking-widest text-[10px] uppercase opacity-80">YOUR BASKET</span>
                  <span className="font-display text-xl">฿{totalPrice}</span>
                </div>
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right"
          className="w-full sm:max-w-[420px] p-0 bg-card/80 backdrop-blur-2xl border-l border-border/40 shadow-2xl flex flex-col"
        >
          {/* Custom Header */}
          <div className="p-6 md:p-8 flex items-center justify-between border-b border-border/20">
            <div>
              <span className="font-accent text-primary tracking-widest text-xs uppercase">SHOPPING CART</span>
              <SheetTitle className="font-display text-3xl mt-1">สรุปรายการ</SheetTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-white/5" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <ShoppingCart className="h-10 w-10 opacity-20" />
              </div>
              <p className="font-display text-xl mb-4">ยังไม่มีรายการอาหาร</p>
              <Button 
                variant="outline" 
                className="font-accent tracking-widest text-xs"
                onClick={() => setIsOpen(false)}
              >
                GO BACK TO MENU
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6 md:px-8 py-6">
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div 
                        key={item.cartItemId} 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4 group"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-display text-lg leading-tight group-hover:text-primary transition-colors">
                              {item.name}
                              {item.options?.noodleType && (
                                <span className="text-primary text-sm block font-sans"> ({item.options.noodleType})</span>
                              )}
                            </h4>
                            <span className="font-accent text-xl text-primary">฿{item.price * item.quantity}</span>
                          </div>
                          
                          {/* Options display */}
                          {item.options?.selectedOptions && (
                            <div className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider flex flex-wrap gap-2">
                              {Object.entries(item.options.selectedOptions).map(([key, value]) => (
                                <span key={key} className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                  {key}: {Array.isArray(value) ? value.join(", ") : value}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Special Request */}
                          {item.options?.specialRequest && (
                            <p className="text-xs italic text-muted-foreground font-sans">&quot;{item.options.specialRequest}&quot;</p>
                          )}
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-white/10" 
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-accent min-w-[20px] text-center">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-white/10" 
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive opacity-40 hover:opacity-100 hover:bg-destructive/10 rounded-full"
                              onClick={() => removeItem(item.cartItemId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <Separator className="my-8 bg-border/20" />
                
                {/* Information Form */}
                <div className="space-y-6 pb-12">
                  <div>
                    <span className="font-accent text-primary tracking-widest text-xs uppercase mb-4 block">ORDER INFO</span>
                    <Form {...form}>
                      <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="orderType"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 gap-4"
                                >
                                  <FormItem className="space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="dine-in" className="sr-only" />
                                    </FormControl>
                                    <FormLabel className={cn(
                                      "flex items-center justify-center h-12 rounded-xl border cursor-pointer font-accent tracking-widest text-xs transition-all",
                                      field.value === "dine-in" ? "bg-primary/20 border-primary text-primary" : "border-border/40 hover:bg-white/5"
                                    )}>
                                      DINE-IN
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="takeaway" className="sr-only" />
                                    </FormControl>
                                    <FormLabel className={cn(
                                      "flex items-center justify-center h-12 rounded-xl border cursor-pointer font-accent tracking-widest text-xs transition-all",
                                      field.value === "takeaway" ? "bg-primary/20 border-primary text-primary" : "border-border/40 hover:bg-white/5"
                                    )}>
                                      TAKEAWAY
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase">NAME</FormLabel>
                                <FormControl>
                                  <Input className="bg-white/5 border-border/40 h-11 focus-visible:ring-primary/50" placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {orderType === "dine-in" ? (
                            <FormField
                              control={form.control}
                              name="tableNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase">TABLE NO.</FormLabel>
                                  <FormControl>
                                    <Input className="bg-white/5 border-border/40 h-11 focus-visible:ring-primary/50" placeholder="Table No." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase">PHONE</FormLabel>
                                  <FormControl>
                                    <Input className="bg-white/5 border-border/40 h-11 focus-visible:ring-primary/50" placeholder="08X-XXX-XXXX" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </form>
                    </Form>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="font-accent text-primary tracking-widest text-xs uppercase mb-6">PROMPTPAY QR</span>
                    <div className="bg-white p-3 rounded-2xl inline-block mb-4 shadow-xl">
                       <QRCodeSVG 
                         value={generatePayload(SHOP_PROMPTPAY_NUMBER, { amount: totalPrice })} 
                         size={160}
                       />
                    </div>
                    <p className="text-center font-accent tracking-widest text-[10px] uppercase text-muted-foreground">
                      Scan before confirming via LINE
                    </p>
                  </div>
                </div>
              </ScrollArea>
              
              {/* Footer with Total and Button */}
              <div className="p-8 border-t border-border/20 bg-background/50 backdrop-blur-md">
                <div className="flex justify-between items-end mb-6">
                  <span className="font-accent tracking-widest text-sm text-muted-foreground uppercase">TOTAL</span>
                  <div className="flex flex-col items-end">
                    <span className="font-accent text-primary text-4xl">฿{totalPrice}</span>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  form="checkout-form" 
                  className="w-full h-16 text-lg font-accent tracking-widest uppercase bg-[#00B900] hover:bg-[#009900] text-white rounded-xl shadow-lg shadow-[#00B900]/20"
                >
                  Confirm via LINE <Send className="ml-3 h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
