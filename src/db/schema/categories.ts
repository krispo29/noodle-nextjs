import { pgTable, uuid, varchar, timestamp, boolean, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categoryGroups } from './category-groups';

/**
 * Categories - หมวดหมู่ย่อย (เช่น ต้มจืด, ผัดกระเพรา, ก๋วยเตี๋ยวน้ำ)
 */
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => categoryGroups.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ one }) => ({
  group: one(categoryGroups, {
    fields: [categories.groupId],
    references: [categoryGroups.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
