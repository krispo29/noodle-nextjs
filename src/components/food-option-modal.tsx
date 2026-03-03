"use client"

import { useState, useEffect, use } from "react"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useCartStore, type CartItem } from "@/store/useCartStore"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"

// Types
interface MenuOption {
  id: string
  name: string
  priceModifier: string
  isDefault: boolean
}

interface OptionGroup {
  id: string
  name: string
  slug: string
  type: string
  isRequired: boolean
  minSelections: number
  maxSelections: number
  options: MenuOption[]
}

interface Topping {
  id: string | null
  name: string | null
  price: string | null
  isAvailable: boolean | null
}

interface MenuItemDetail {
  id: string
  name: string
  description: string | null
  basePrice: string
  imageUrl: string | null
  isSpicy: boolean
  preparationTime: number
  optionGroups: OptionGroup[]
  toppings: Topping[]
}

interface FoodOptionModalProps {
  isOpen: boolean
  onClose: () => void
  item: MenuItemDetail | null
}

export function FoodOptionModal({ isOpen, onClose, item }: FoodOptionModalProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  // Create dynamic form schema based on option groups
  const createFormSchema = () => {
    const shape: Record<string, z.ZodTypeAny> = {}

    if (item) {
      // Add option groups
      item.optionGroups.forEach((group) => {
        if (group.type === 'single' || group.type === 'size') {
          shape[group.slug] = z.string().min(1, `กรุณาเลือก${group.name}`)
        } else {
          shape[group.slug] = z.array(z.string()).min(
            group.isRequired ? group.minSelections : 0,
            `กรุณาเลือก${group.name}อย่างน้อย ${group.minSelections} อย่าง`
          )
        }
      })

      // Add toppings
      if (item.toppings.length > 0) {
        shape['toppings'] = z.array(z.string())
      }
    }

    shape['specialRequest'] = z.string().optional()
    return z.object(shape)
  }

  const formSchema = createFormSchema()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialRequest: ''
    } as z.infer<typeof formSchema>
  })

  // Watch for changes to recalculate price
  const watchedValues = form.watch()

  useEffect(() => {
    if (!item) return

    let price = parseFloat(item.basePrice)

    // Add option prices
    item.optionGroups.forEach((group) => {
      const value = watchedValues[group.slug]
      
      if (group.type === 'single' || group.type === 'size') {
        const option = group.options.find(o => o.name === value)
        if (option) {
          price += parseFloat(option.priceModifier)
        }
      } else {
        // Multiple selection
        const selectedOptions = value as string[] || []
        selectedOptions.forEach((optName) => {
          const option = group.options.find(o => o.name === optName)
          if (option) {
            price += parseFloat(option.priceModifier)
          }
        })
      }
    })

    // Add topping prices
    const selectedToppings = (watchedValues['toppings'] as string[]) || []
    selectedToppings.forEach((toppingName) => {
      const topping = item.toppings.find(t => t.name === toppingName)
      if (topping && topping.price) {
        price += parseFloat(topping.price)
      }
    })

    // Multiply by quantity
    setTotalPrice(price * quantity)
  }, [item, watchedValues, quantity])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && item) {
      const defaults: Record<string, unknown> = {}
      
      // Set defaults
      item.optionGroups.forEach((group) => {
        const defaultOption = group.options.find(o => o.isDefault)
        if (group.type === 'single' || group.type === 'size') {
          defaults[group.slug] = defaultOption?.name || group.options[0]?.name || ''
        } else {
          defaults[group.slug] = []
        }
      })
      defaults['toppings'] = []
      defaults['specialRequest'] = ''
      
      form.reset(defaults as z.infer<typeof formSchema>)
      setQuantity(1)
    }
  }, [isOpen, item, form])

  if (!item) return null

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Build the options object
    const selectedOptions: Record<string, string | string[]> = {}
    
    item.optionGroups.forEach((group) => {
      const value = values[group.slug as keyof typeof values]
      if (value) {
        selectedOptions[group.name] = value as string | string[]
      }
    })

    // Build toppings list
    const selectedToppingsList = (values.toppings as string[]) || []

    // Create cart item
    const cartItem: Omit<CartItem, 'cartItemId'> = {
      id: item.id,
      name: item.name,
      price: totalPrice,
      quantity,
      options: {
        selectedOptions,
        selectedToppings: selectedToppingsList,
        specialRequest: String(values.specialRequest || ''),
      }
    }

    addItem(cartItem)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {item.imageUrl && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image 
                  src={item.imageUrl} 
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              {item.name}
              {item.isSpicy && (
                <Badge variant="destructive" className="ml-2">เผ็ด</Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {item.description}
          </DialogDescription>
          <div className="text-sm text-muted-foreground">
            ⏱️ เวลาเตรียมประมาณ {item.preparationTime} นาที
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            {/* Option Groups */}
            {item.optionGroups.map((group) => (
              <FormField
                key={group.id}
                control={form.control}
                name={group.slug}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">
                      {group.name}
                      {group.isRequired && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                      {group.type === 'single' || group.type === 'size' ? (
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value as string}
                          className="grid grid-cols-2 gap-3"
                        >
                          {group.options.map((option) => (
                            <FormItem key={option.id} className="flex items-center space-x-3 space-y-0 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                              <FormControl>
                                <RadioGroupItem value={option.name} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full flex justify-between">
                                <span>{option.name}</span>
                                {parseFloat(option.priceModifier) > 0 && (
                                  <span className="text-primary">+{option.priceModifier}฿</span>
                                )}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      ) : (
                        <div className="space-y-3">
                          {group.options.map((option) => (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={(field.value as string[])?.includes(option.name)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = (field.value as string[]) || []
                                    const newValues = checked
                                      ? [...currentValues, option.name]
                                      : currentValues.filter((v) => v !== option.name)
                                    field.onChange(newValues)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium leading-none cursor-pointer w-full flex justify-between">
                                <span>{option.name}</span>
                                {parseFloat(option.priceModifier) > 0 && (
                                  <span className="text-primary">+{option.priceModifier}฿</span>
                                )}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Toppings */}
            {item.toppings.length > 0 && (
              <FormField
                control={form.control}
                name="toppings"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base font-semibold">เพิ่มท็อปปิ้ง</FormLabel>
                    </div>
                    <div className="space-y-3">
                      {item.toppings.map((topping) => (
                        <FormField
                          key={topping.id}
                          control={form.control}
                          name="toppings"
                          render={({ field }) => (
                            <FormItem
                              key={topping.id}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={(field.value as string[] || []).includes(topping.name || '')}
                                  onCheckedChange={(checked) => {
                                    const currentValues = (field.value as string[]) || []
                                    const newValues = checked
                                      ? [...currentValues, topping.name || '']
                                      : currentValues.filter((v) => v !== (topping.name || ''))
                                    field.onChange(newValues)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium leading-none cursor-pointer w-full flex justify-between">
                                <span>{topping.name}</span>
                                <span className="text-primary">+{topping.price}฿</span>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Special Request */}
            <FormField
              control={form.control}
              name="specialRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">หมายเหตุ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="เช่น ไม่กระเทียม, ขอรสจัดๆ"
                      className="resize-none"
                      value={field.value as string || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <div className="flex items-center justify-between border rounded-lg p-4">
              <span className="font-semibold">จำนวน</span>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                ยกเลิก
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90"
              >
                เพิ่มลงตะกร้า • ฿{totalPrice}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
