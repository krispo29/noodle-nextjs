/**
 * Single Order API Route
 * GET /api/orders/[id] - Get an order by ID
 * PUT /api/orders/[id] - Update an order
 * DELETE /api/orders/[id] - Delete an order
 */
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  successResponse, 
  notFoundResponse, 
  internalErrorResponse,
  validationErrorResponse,
  noContentResponse 
} from '@/lib/api-response';
import { updateOrderSchema, validateRequest } from '@/lib/validations';
import { NextRequest } from 'next/server';
import { events, APP_EVENTS } from '@/lib/events';

// GET /api/orders/[id] - Get an order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    
    if (!order) {
      return notFoundResponse('Order');
    }
    
    // Get order items
    const items = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    
    return successResponse({
      ...order,
      items,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return internalErrorResponse('Failed to fetch order');
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(updateOrderSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    // Check if order exists
    const [existing] = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    
    if (!existing) {
      return notFoundResponse('Order');
    }
    
    // Update order
    const [updated] = await db.update(orders)
      .set({
        ...validation.data,
        estimatedReadyTime: validation.data!.estimatedDeliveryTime 
          ? new Date(validation.data!.estimatedDeliveryTime) 
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();
    
    // Trigger SSE event if status changed
    if (validation.data!.status) {
      events.emit(APP_EVENTS.ORDER_STATUS_UPDATED, {
        orderId: updated.id,
        status: updated.status,
      });
    }
    
    // Get order items
    const items = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    
    return successResponse({
      ...updated,
      items,
    }, 'Order updated successfully');
  } catch (error) {
    console.error('Error updating order:', error);
    return internalErrorResponse('Failed to update order');
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if order exists
    const [existing] = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    
    if (!existing) {
      return notFoundResponse('Order');
    }
    
    // Delete order (cascade will delete order items)
    await db.delete(orders).where(eq(orders.id, id));
    
    return noContentResponse();
  } catch (error) {
    console.error('Error deleting order:', error);
    return internalErrorResponse('Failed to delete order');
  }
}
