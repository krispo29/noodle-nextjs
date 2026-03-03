/**
 * Sessions table - Store user sessions for secure authentication
 */
import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: index('idx_sessions_user_id').on(table.userId),
    tokenIdx: index('idx_sessions_token').on(table.token),
    expiresAtIdx: index('idx_sessions_expires_at').on(table.expiresAt),
    userExpiresIdx: index('idx_sessions_user_expires').on(table.userId, table.expiresAt),
  };
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
