"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
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
      setTotalPrice(item.price + extraPrice)
    }
  }, [item, watchToppings])

  // Reset form when opened with a new item
  useEffect(() => {
    if (isOpen) {
      form.reset({
        noodleType: "เล็ก",
        toppings: [],
        specialRequest: "",
      })
    }
  }, [isOpen, form])

  if (!item) return null

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!item) return;
    
    addItem({
      id: item.id,
      name: item.name,
      price: totalPrice, // Save the calculated base item + toppings price as the cart price
      quantity: 1,
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
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {item.image} {item.name}
          </DialogTitle>
          <DialogDescription>
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            <FormField
              control={form.control}
              name="noodleType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">เลือกเส้นก๋วยเตี๋ยว <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      {NOODLE_TYPES.map((type) => (
                        <FormItem key={type.id} className="flex items-center space-x-3 space-y-0 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <FormControl>
                            <RadioGroupItem value={type.id} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer w-full">
                            {type.label}
                          </FormLabel>
                        </FormItem>
                      ))}
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
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base font-semibold">เพิ่มท็อปปิ้ง (เลือกได้หลายอย่าง)</FormLabel>
                    <FormDescription>
                      เพิ่มความอร่อยให้ชามโปรดของคุณ
                    </FormDescription>
                  </div>
                  <div className="space-y-3">
                    {TOPPINGS.map((topping) => (
                      <FormField
                        key={topping.id}
                        control={form.control}
                        name="toppings"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={topping.id}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(topping.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, topping.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== topping.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium leading-none cursor-pointer w-full">
                                {topping.label}
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
                <FormItem>
                  <FormLabel className="text-base font-semibold">ความต้องการพิเศษ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="เช่น ไม่กระเทียมเจียว, ขอรสจัดๆ"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                ยกเลิก
              </Button>
              <Button type="submit" className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90">
                เพิ่มลงตะกร้า • ฿{totalPrice}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
