import { create } from 'zustand'

export interface OrderOptions {
  noodleType?: string;
  soupType?: string;
  toppings?: string[];
  specialRequest?: string;
}

export interface CartItem {
  id: string; // The base item ID
  cartItemId: string; // Unique ID for this specific configured item in the cart
  name: string;
  price: number;
  quantity: number;
  options?: OrderOptions;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Helper to check if two options match perfectly
const areOptionsEqual = (opt1?: OrderOptions, opt2?: OrderOptions) => {
  return JSON.stringify(opt1 || {}) === JSON.stringify(opt2 || {});
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    set((state) => {
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
      
      return { items: [...state.items, { ...newItem, cartItemId }] };
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
    // Assuming base price doesn't change based on options yet, just simple (price * quantity)
    // If toppings have extra cost, you would parse options here to add them to base price
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
