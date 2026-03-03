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
    orderText += `${index + 1}. ${item.name} (${item.options?.noodleType})\n`;
    if (item.options?.toppings && item.options.toppings.length > 0) {
      orderText += `   + ${item.options.toppings.join(", ")}\n`;
    }
    if (item.options?.specialRequest) {
      orderText += `   [พิเศษ: ${item.options.specialRequest}]\n`;
    }
    orderText += `   จำนวน: ${item.quantity} ชาม x ฿${item.price} = ฿${item.quantity * item.price}\n\n`;
    total += item.quantity * item.price;
  });
  
  orderText += `💰 *ยอดรวมทั้งสิ้น: ฿${total}*\n`;
  
  // Use line:// intent for mobile apps, or fallback to https://line.me/R/
  const encodedText = encodeURIComponent(orderText);
  return `https://line.me/R/msg/text/?${encodedText}`;
}
