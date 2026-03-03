import { pgTable, uuid, varchar, timestamp, boolean, integer, text } from 'drizzle-orm/pg-core';

/**
 * Category Groups - กลุ่มหมวดหมู่หลัก (เช่น เมนูข้าว, เมนูก๋วยเตี๋ยว, เครื่องดื่ม)
 */
export const categoryGroups = pgTable('category_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  imageUrl: varchar('image_url', { length: 500 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CategoryGroup = typeof categoryGroups.$inferSelect;
export type NewCategoryGroup = typeof categoryGroups.$inferInsert;
