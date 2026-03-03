/**
 * API Client for fetching data from the database
 * ใช้สำหรับดึงข้อมูลจาก API
 */

const API_BASE = '/api';

// Types
export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string | null;
  name: string;
  quantity: number;
  price: string;
  options: string | null;
  notes: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  platform: string;
  customerName: string;
  customerPhone: string | null;
  deliveryAddress: string | null;
  subtotal: string;
  deliveryFee: string;
  platformFee: string;
  discount: string;
  total: string;
  status: string;
  driverName: string | null;
  driverPhone: string | null;
  notes: string | null;
  estimatedDeliveryTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

// API Functions

// Categories
export async function getCategories(activeOnly = false): Promise<Category[]> {
  const url = `${API_BASE}/categories${activeOnly ? '?activeOnly=true' : ''}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error?.message || 'Failed to fetch categories');
}

export async function getCategory(id: string): Promise<Category | null> {
  const response = await fetch(`${API_BASE}/categories/${id}`);
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  return null;
}

// Menu Items
export async function getMenuItems(filters?: {
  categoryId?: string;
  availableOnly?: boolean;
  recommendedOnly?: boolean;
}): Promise<MenuItem[]> {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);
  if (filters?.availableOnly) params.set('availableOnly', 'true');
  if (filters?.recommendedOnly) params.set('recommendedOnly', 'true');
  
  const url = `${API_BASE}/menu${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error?.message || 'Failed to fetch menu items');
}

export async function getMenuItem(id: string): Promise<MenuItem | null> {
  const response = await fetch(`${API_BASE}/menu/${id}`);
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  return null;
}

// Orders
export async function getOrders(filters?: {
  status?: string;
  platform?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ orders: Order[]; pagination: { limit: number; offset: number; total: number } }> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.platform) params.set('platform', filters.platform);
  if (filters?.startDate) params.set('startDate', filters.startDate);
  if (filters?.endDate) params.set('endDate', filters.endDate);
  if (filters?.limit) params.set('limit', filters.limit.toString());
  if (filters?.offset) params.set('offset', filters.offset.toString());
  
  const url = `${API_BASE}/orders${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error?.message || 'Failed to fetch orders');
}

export async function getOrder(id: string): Promise<Order | null> {
  const response = await fetch(`${API_BASE}/orders/${id}`);
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  return null;
}

export async function createOrder(orderData: Partial<Order> & { items: any[] }): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error?.message || 'Failed to create order');
}

export async function updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error?.message || 'Failed to update order');
}

// Statistics helpers
export async function getOrderStats(days = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { orders } = await getOrders({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    limit: 1000,
  });
  
  return orders;
}
