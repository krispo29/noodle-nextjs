"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Trash2, Send } from "lucide-react"
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
  SheetTrigger,
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

// PromptPay Integration
import generatePayload from "promptpay-qr"
import { QRCodeSVG } from "qrcode.react"

// Use environment variable for PromptPay number
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

  // Watch for changes to toggle phone/table fields
  const orderType = form.watch("orderType")

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = getCartTotal()

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    const lineUrl = generateLineOrderUrl(items, values)
    globalThis.location.href = lineUrl
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg" 
            className="fixed bottom-6 right-6 h-16 px-6 rounded-full shadow-2xl z-50 transition-transform hover:scale-105"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6 mr-3" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge className="absolute -top-3 -right-5 px-2 py-0.5 bg-destructive text-white border-none rounded-full min-w-5 justify-center">
                      {itemCount}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col items-start ml-2 text-left">
              <span className="text-xs font-normal opacity-90">ตะกร้าของคุณ</span>
              <span className="text-sm font-bold">฿{totalPrice}</span>
            </div>
          </Button>
        </motion.div>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" /> สรุปรายการอาหาร
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4">
            <ShoppingCart className="h-16 w-16 opacity-20" />
            <p>ยังไม่มีรายการอาหารในตะกร้า</p>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              กลับไปเลือกเมนู
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 pb-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-sm leading-none">
                          {item.name}
                          {item.options?.noodleType && (
                            <span className="text-primary"> ({item.options.noodleType})</span>
                          )}
                          {/* Display new format selected options */}
                          {item.options?.selectedOptions && !item.options?.noodleType && (
                            <span className="text-primary">
                              {Object.entries(item.options.selectedOptions).map(([key, value]) => {
                                if (Array.isArray(value) && value.length > 0) {
                                  return ` (${key}: ${value.join(", ")})`;
                                }
                                return value ? ` (${key}: ${value})` : "";
                              })}
                            </span>
                          )}
                        </h4>
                        <span className="font-bold text-sm">฿{item.price * item.quantity}</span>
                      </div>
                      
                      {/* Toppings - support both legacy and new formats */}
                      {((item.options?.toppings?.length || 0) > 0 || (item.options?.selectedToppings?.length || 0) > 0 || item.options?.specialRequest) ? (
                        <div className="text-xs text-muted-foreground mt-1">
                          {(item.options?.toppings || item.options?.selectedToppings || []).map((topping: string) => (
                            <p key={topping}>+ {topping}</p>
                          ))}
                          {item.options?.specialRequest && (
                            <p className="italic">&quot;{item.options.specialRequest}&quot;</p>
                          )}
                        </div>
                      ) : null}
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2 bg-background border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-r-none" 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-l-none" 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.cartItemId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="py-2 space-y-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span className="text-2xl text-primary">฿{totalPrice}</span>
                </div>
                
                {totalPrice > 0 && (
                  <div className="bg-white p-4 rounded-xl border flex flex-col items-center justify-center space-y-3">
                    <p className="text-sm font-semibold text-center text-slate-800">สแกนจ่ายผ่านพร้อมเพย์ (PromptPay)</p>
                    <div className="bg-white p-2 rounded-lg inline-block border">
                       <QRCodeSVG 
                         value={generatePayload(SHOP_PROMPTPAY_NUMBER, { amount: totalPrice })} 
                         size={150}
                       />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      * กรุณาสแกนจ่ายก่อนกดสั่งอาหารผ่าน LINE
                    </p>
                  </div>
                )}
                
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <h3 className="font-semibold mb-4 text-primary flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    ข้อมูลผู้สั่งอาหาร
                  </h3>
                  
                  <Form {...form}>
                    <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="orderType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0 text-sm">
                                  <FormControl>
                                    <RadioGroupItem value="dine-in" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">ทานที่ร้าน</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="takeaway" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">สั่งกลับบ้าน</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">ชื่อของคุณ <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input className="h-9" placeholder="ชื่อเล่น" {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                        
                        {orderType === "dine-in" ? (
                          <FormField
                            control={form.control}
                            name="tableNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">หมายเลขโต๊ะ <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                  <Input className="h-9" placeholder="เช่น 3" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">เบอร์โทรศัพท์ (เลือกกรอก)</FormLabel>
                                <FormControl>
                                  <Input className="h-9" placeholder="08x-xxx-xxxx" {...field} />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </ScrollArea>
            
            <div className="pt-4 mt-auto">
              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full h-14 text-lg font-bold bg-[#00B900] hover:bg-[#009900]"
              >
                สั่งอาหารผ่าน LINE
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
