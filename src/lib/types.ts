/**
 * Type definitions for the application
 */

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

export interface DailyStats {
  date: string;
  totalOrders: number;
  totalSales: number;
  deliveryFees: number;
  platformFees: number;
  netSales: number;
}

export interface MenuStats {
  menuId: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface HourlyStats {
  hour: number;
  orderCount: number;
  totalSales: number;
}

// Order type - compatible with both mock and API data
export interface Order {
  id: string;
  orderNumber: string;
  platform: string;
  createdAt: Date | string;
  status: OrderStatus;
  customerName: string;
  customerPhone?: string | null;
  deliveryAddress?: string | null;
  items?: OrderItem[];
  subtotal: number | string;
  deliveryFee: number | string;
  platformFee: number | string;
  discount: number | string;
  total: number | string;
  driverName?: string | null;
  driverPhone?: string | null;
  notes?: string | null;
  estimatedDeliveryTime?: Date | string | null;
}

// Order item type
export interface OrderItem {
  id?: string;
  orderId?: string;
  menuItemId?: string | null;
  name: string;
  quantity: number;
  price: number | string;
  options?: string | null;
  notes?: string | null;
}

// Category type
export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Menu item type
export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isRecommended: boolean;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
  };
}

// For calculating order summary
export function calculateOrderSummary(orders: Order[]) {
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + parseFloat(String(o.subtotal || '0')), 0);
  const totalDeliveryFees = orders.reduce((sum, o) => sum + parseFloat(String(o.deliveryFee || '0')), 0);
  const totalPlatformFees = orders.reduce((sum, o) => sum + parseFloat(String(o.platformFee || '0')), 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + parseFloat(String(o.discount || '0')), 0);
  const netSales = totalSales - totalPlatformFees - totalDiscounts + totalDeliveryFees;

  return {
    totalOrders,
    completedOrders: completedOrders.length,
    totalSales,
    totalDeliveryFees,
    totalPlatformFees,
    totalDiscounts,
    netSales,
  };
}
