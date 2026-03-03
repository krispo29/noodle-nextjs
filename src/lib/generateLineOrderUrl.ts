import { CartItem } from "@/store/useCartStore";

export function generateLineOrderUrl(
  items: CartItem[],
  customerInfo: { name: string; orderType: string; phone?: string; tableNumber?: string }
): string {
  
  let orderText = `🍜 *สั่งอาหารใหม่* 🍜\n\n`;
  orderText += `👤 ชื่อลูกค้า: ${customerInfo.name}\n`;
  orderText += `📍 ประเภท: ${customerInfo.orderType === "dine-in" ? `ทานที่ร้าน (โต๊ะ ${customerInfo.tableNumber})` : "สั่งกลับบ้าน"}\n`;
  if (customerInfo.phone) {
    orderText += `📞 เบอร์โทร: ${customerInfo.phone}\n`;
  }
  
  orderText += `\n📦 *รายการอาหาร:*\n`;
  
  let total = 0;
  items.forEach((item, index) => {
    // Build item description
    let itemDesc = item.name;
    
    // Support both legacy (noodleType) and new (selectedOptions) formats
    if (item.options?.noodleType) {
      itemDesc += ` (${item.options.noodleType})`;
    } else if (item.options?.selectedOptions) {
      // Format selected options as: Option1: Value1, Option2: Value2
      const optionStrings = Object.entries(item.options.selectedOptions).map(
        ([key, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0 ? `${key}: ${value.join(", ")}` : null;
          }
          return value ? `${key}: ${value}` : null;
        }
      ).filter(Boolean);
      
      if (optionStrings.length > 0) {
        itemDesc += ` (${optionStrings.join(", ")})`;
      }
    }
    
    orderText += `${index + 1}. ${itemDesc}\n`;
    
    // Toppings - support both legacy and new formats
    const toppings = item.options?.toppings || item.options?.selectedToppings;
    if (toppings && toppings.length > 0) {
      orderText += `   + ${toppings.join(", ")}\n`;
    }
    
    // Special request
    if (item.options?.specialRequest) {
      orderText += `   [หมายเหตุ: ${item.options.specialRequest}]\n`;
    }
    
    const itemTotal = item.price * item.quantity;
    orderText += `   จำนวน: ${item.quantity} x ฿${item.price} = ฿${itemTotal}\n\n`;
    total += itemTotal;
  });
  
  orderText += `💰 *ยอดรวมทั้งสิ้น: ฿${total}*\n`;

  // Use line:// intent for mobile apps, or fallback to https://line.me/R/
  const encodedText = encodeURIComponent(orderText);
  return `https://line.me/R/msg/text/?${encodedText}`;
}
