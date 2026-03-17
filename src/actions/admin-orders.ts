"use server";

import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { Order, OrderStatus } from '@/lib/types';

/**
 * Get all orders for Admin with optional filtering
 */
export async function getAdminOrders(filters?: {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  try {
    const limit = filters?.limit ?? 50;
    
    let query = db.select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status));
    }
    if (filters?.startDate) {
      conditions.push(gte(orders.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(orders.createdAt, filters.endDate));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }
    
    const result = await query;

    // Fetch items for these orders
    const ordersWithItems = await Promise.all(
      result.map(async (order) => {
        const items = await db.select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          items: items.map(item => ({
            id: item.id,
            menuItemId: item.menuItemId,
            name: item.menuItemName,
            quantity: item.quantity,
            price: item.unitPrice,
            options: item.selectedOptions ? JSON.stringify(item.selectedOptions) : undefined,
          })),
        } as unknown as Order;
      })
    );

    return ordersWithItems;
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateAdminOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const [updatedOrder] = await db.update(orders)
      .set({ 
        status, 
        updatedAt: new Date(),
        // Update timestamps based on status
        ...(status === 'ready' ? { readyAt: new Date() } : {}),
        ...(status === 'completed' ? { completedAt: new Date() } : {}),
        ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}),
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Trigger SSE event via API or internal mechanism if needed
    // Note: Since this is a server action, we can't easily emit to the SSE stream 
    // if it's running in a different process, unless we use a shared bus.
    // For now, we'll rely on the API route for status updates if real-time is needed for status changes too.

    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  try {
    const allOrders = await db.select().from(orders);
    
    // Simple stats calculation
    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter(o => o.status === 'completed').length;
    const totalSales = allOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + parseFloat(o.total), 0);
    
    const pendingOrders = allOrders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status)).length;

    return {
      totalOrders,
      completedOrders,
      totalSales,
      pendingOrders,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalOrders: 0,
      completedOrders: 0,
      totalSales: 0,
      pendingOrders: 0,
    };
  }
}
