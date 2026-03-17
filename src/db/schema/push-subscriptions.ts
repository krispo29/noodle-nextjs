import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

/**
 * Push Subscriptions table - Store Web Push API subscriptions for admin users
 */
export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminUserId: uuid('admin_user_id').notNull(),
  
  // Web Push endpoint
  endpoint: text('endpoint').notNull(),
  
  // P256DH key (Elliptic curve Diffie-Hellman public key)
  p256dh: text('p256dh').notNull(),
  
  // Auth secret
  auth: text('auth').notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    adminUserIdx: index('idx_push_subscriptions_admin_user_id').on(table.adminUserId),
    endpointIdx: index('idx_push_subscriptions_endpoint').on(table.endpoint),
  };
});

/**
 * Relations
 */
export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  adminUser: one(users, {
    fields: [pushSubscriptions.adminUserId],
    references: [users.id],
  }),
}));

/**
 * Types
 */
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptions.$inferInsert;
