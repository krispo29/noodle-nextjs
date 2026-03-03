import { pgTable, uuid, varchar, timestamp, decimal, text, index, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Define enums directly here to avoid circular imports
export const orderTypeEnum = pgEnum('order_type', ['dine_in', 'takeaway', 'delivery']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded']);
export const platformEnum = pgEnum('platform', ['lineman', 'grab', 'foodpanda', 'walkin', 'line']);

/**
 * Orders table - Customer orders
 */
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 20 }).notNull().unique(),
  orderType: varchar('order_type', { length: 20 }).notNull().default('takeaway'),
  platform: varchar('platform', { length: 20 }).notNull().default('walkin'),
  userId: uuid('user_id').references(() => users.id),
  
  // Customer Info
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }),
  customerNote: text('customer_note'),
  
  // Table for Dine-in
  tableNumber: varchar('table_number', { length: 10 }),
  
  // Address for Delivery
  deliveryAddress: text('delivery_address'),
  
  // Pricing
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull().default('0'),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('pending'),
  
  // Delivery Info
  driverName: varchar('driver_name', { length: 255 }),
  driverPhone: varchar('driver_phone', { length: 20 }),
  
  // Timestamps
  estimatedReadyTime: timestamp('estimated_ready_time'),
  readyAt: timestamp('ready_at'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    statusIdx: index('idx_orders_status').on(table.status),
    createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
    platformIdx: index('idx_orders_platform').on(table.platform),
    orderTypeIdx: index('idx_orders_order_type').on(table.orderType),
    userIdIdx: index('idx_orders_user_id').on(table.userId),
    customerPhoneIdx: index('idx_orders_customer_phone').on(table.customerPhone),
    orderNumberIdx: index('idx_orders_order_number').on(table.orderNumber),
  };
});

/**
 * Order Items table - Individual items in each order
 */
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id'), // References menuItems.id but defined in menu.ts
  menuItemName: varchar('menu_item_name', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  
  // Selected options (JSON) - e.g. { "noodleType": "เส้นใหญ่", "soupType": "น้ำ" }
  selectedOptions: jsonb('selected_options'),
  // Selected toppings (JSON) - e.g. ["พิเศษ", "ไข่ยางมะตูม"]
  selectedToppings: jsonb('selected_toppings'),
  // Special request
  specialRequest: text('special_request'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations - must be defined after both tables
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

// Types
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
