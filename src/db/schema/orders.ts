import { pgTable, uuid, varchar, timestamp, decimal, text, index, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

/**
 * Order Status Enum
 */
export const orderStatusEnum = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  delivering: 'delivering',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export type OrderStatus = typeof orderStatusEnum[keyof typeof orderStatusEnum];

/**
 * Platform Enum
 */
export const platformEnum = {
  lineman: 'lineman',
  grab: 'grab',
  foodpanda: 'foodpanda',
  walkin: 'walkin',
} as const;

export type Platform = typeof platformEnum[keyof typeof platformEnum];

/**
 * Orders table - Customer orders
 */
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  platform: varchar('platform', { length: 20 }).notNull().default('walkin'),
  userId: uuid('user_id').references(() => users.id),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }),
  deliveryAddress: text('delivery_address'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull().default('0'),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull().default('0'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  driverName: varchar('driver_name', { length: 255 }),
  driverPhone: varchar('driver_phone', { length: 20 }),
  notes: text('notes'),
  estimatedDeliveryTime: timestamp('estimated_delivery_time'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    statusIdx: index('idx_orders_status').on(table.status),
    createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
    platformIdx: index('idx_orders_platform').on(table.platform),
  };
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

/**
 * Order Items table - Individual items in each order
 */
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id'),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  options: text('options'), // JSON string for order options
  notes: text('notes'),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
