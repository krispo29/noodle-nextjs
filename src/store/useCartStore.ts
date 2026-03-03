import { create } from 'zustand'

export interface OrderOptions {
  selectedOptions?: Record<string, string | string[]>;
  selectedToppings?: string[];
  specialRequest?: string;
  // Legacy support for old noodle shop
  noodleType?: string;
  soupType?: string;
  toppings?: string[];
}

export interface CartItem {
  id: string; // The base item ID
  cartItemId: string; // Unique ID for this specific configured item in the cart
  name: string;
  price: number; // This is the TOTAL price including toppings
  quantity: number;
  options?: OrderOptions;
}

// Topping prices - for legacy support
const TOPPING_PRICES: Record<string, number> = {
  'พิเศษ': 10,
  'ไข่ยางมะตูม': 10,
  'ไข่ออนเซ็น': 15,
  'กากหมูเจียว': 15,
  'เกี๊ยวกรอบ': 10,
  'เพิ่มลูกชิ้น': 15,
  'แคบหมู': 10,
  'หมูยอ': 15,
};

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Helper to calculate topping total (for legacy support)
const calculateToppingTotal = (toppings?: string[]): number => {
  if (!toppings || toppings.length === 0) return 0;
  return toppings.reduce((total, topping) => {
    return total + (TOPPING_PRICES[topping] || 0);
  }, 0);
};

// Helper to check if two options match perfectly
const areOptionsEqual = (opt1?: OrderOptions, opt2?: OrderOptions) => {
  return JSON.stringify(opt1 || {}) === JSON.stringify(opt2 || {});
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    set((state) => {
      // Calculate total price including toppings (for legacy support)
      const toppingTotal = calculateToppingTotal(newItem.options?.toppings);
      const totalPrice = newItem.price + toppingTotal;
      
      // Check if exact same config exists
      const existingItemIndex = state.items.findIndex(
        (i) => i.id === newItem.id && areOptionsEqual(i.options, newItem.options)
      );

      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += newItem.quantity;
        return { items: newItems };
      }

      // Generate a unique ID for this cart item entry
      const cartItemId = `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return { items: [...state.items, { ...newItem, price: totalPrice, cartItemId }] };
    });
  },
  updateQuantity: (cartItemId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter(i => i.quantity > 0)
    }));
  },
  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.cartItemId !== cartItemId)
    }));
  },
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    const { items } = get();
    // Cart total includes all prices (base + toppings) × quantity
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
