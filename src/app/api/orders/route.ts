/**
 * Orders API Routes
 * GET /api/orders - Get all orders
 * POST /api/orders - Create a new order
 */
import { db } from '@/db';
import { orders, orderItems, users } from '@/db/schema';
import { eq, desc, and, or, gte, lte } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { createOrderSchema, validateRequest } from '@/lib/validations';
import { NextRequest } from 'next/server';

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      platform: orders.platform,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      deliveryAddress: orders.deliveryAddress,
      subtotal: orders.subtotal,
      deliveryFee: orders.deliveryFee,
      platformFee: orders.platformFee,
      discount: orders.discount,
      total: orders.total,
      status: orders.status,
      driverName: orders.driverName,
      driverPhone: orders.driverPhone,
      notes: orders.notes,
      estimatedDeliveryTime: orders.estimatedDeliveryTime,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);
    
    // Build conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(orders.status, status));
    }
    if (platform) {
      conditions.push(eq(orders.platform, platform));
    }
    if (startDate) {
      conditions.push(gte(orders.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(orders.createdAt, new Date(endDate)));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }
    
    const result = await query;
    
    // Get total count
    let countQuery = db.select({ count: orders.id }).from(orders);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as typeof countQuery;
    }
    const [countResult] = await countQuery;
    const total = result.length;
    
    return successResponse({
      orders: result,
      pagination: {
        limit,
        offset,
        total,
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return internalErrorResponse('Failed to fetch orders');
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(createOrderSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    const { 
      orderNumber, platform, userId, customerName, customerPhone, 
      deliveryAddress, subtotal, deliveryFee, platformFee, discount, total,
      status, driverName, driverPhone, notes, estimatedDeliveryTime, items
    } = validation.data!;
    
    // Check for duplicate order number
    const [existing] = await db.select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);
    
    if (existing) {
      return badRequestResponse('Order number already exists');
    }
    
    // Insert order with items in a transaction
    const [newOrder] = await db.insert(orders).values({
      orderNumber,
      platform: platform ?? 'walkin',
      userId,
      customerName,
      customerPhone,
      deliveryAddress,
      subtotal,
      deliveryFee: deliveryFee ?? '0',
      platformFee: platformFee ?? '0',
      discount: discount ?? '0',
      total,
      status: status ?? 'pending',
      driverName,
      driverPhone,
      notes,
      estimatedDeliveryTime: estimatedDeliveryTime ? new Date(estimatedDeliveryTime) : undefined,
    }).returning();
    
    // Insert order items
    if (items && items.length > 0) {
      const orderItemsData = items.map((item: any) => ({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        options: item.options,
        notes: item.notes,
      }));
      
      await db.insert(orderItems).values(orderItemsData);
    }
    
    // Fetch the complete order with items
    const [completeOrder] = await db.select()
      .from(orders)
      .where(eq(orders.id, newOrder.id))
      .limit(1);
    
    const orderItemsResult = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, newOrder.id));
    
    return createdResponse({
      ...completeOrder,
      items: orderItemsResult,
    }, 'Order created successfully');
  } catch (error) {
    console.error('Error creating order:', error);
    return internalErrorResponse('Failed to create order');
  }
}
