import { pgTable, uuid, varchar, timestamp, boolean, integer, decimal, text, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categories } from './categories';

/**
 * Menu Items - รายการอาหาร
 */
export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  isRecommended: boolean('is_recommended').notNull().default(false),
  isSpicy: boolean('is_spicy').notNull().default(false),
  isAvailable: boolean('is_available').notNull().default(true),
  preparationTime: integer('preparation_time').notNull().default(15), // นาที
  calories: integer('calories'),
  allergens: jsonb('allergens'), // Array of allergen strings
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    categoryIdIdx: index('idx_menu_items_category_id').on(table.categoryId),
    isAvailableIdx: index('idx_menu_items_is_available').on(table.isAvailable),
  };
});

// Relations
export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  optionGroups: many(optionGroups),
  menuItemToppings: many(menuItemToppings),
}));

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;

/**
 * Option Groups - กลุ่มตัวเลือก (เช่น เลือกเส้น, ระดับความเผ็ด)
 */
export const optionGroups = pgTable('option_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'single' | 'multiple' | 'size'
  isRequired: boolean('is_required').notNull().default(false),
  minSelections: integer('min_selections').notNull().default(1),
  maxSelections: integer('max_selections').notNull().default(1),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const optionGroupsRelations = relations(optionGroups, ({ one, many }) => ({
  menuItem: one(menuItems, {
    fields: [optionGroups.menuItemId],
    references: [menuItems.id],
  }),
  options: many(menuOptions),
}));

export type OptionGroup = typeof optionGroups.$inferSelect;
export type NewOptionGroup = typeof optionGroups.$inferInsert;

/**
 * Menu Options - ตัวเลือกย่อย (เช่น เส้นเล็ก, เส้นใหญ่)
 */
export const menuOptions = pgTable('menu_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionGroupId: uuid('option_group_id').references(() => optionGroups.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).notNull().default('0'),
  isDefault: boolean('is_default').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const menuOptionsRelations = relations(menuOptions, ({ one }) => ({
  optionGroup: one(optionGroups, {
    fields: [menuOptions.optionGroupId],
    references: [optionGroups.id],
  }),
}));

export type MenuOption = typeof menuOptions.$inferSelect;
export type NewMenuOption = typeof menuOptions.$inferInsert;

/**
 * Toppings - ท็อปปิ้งเพิ่มเติม
 */
export const toppings = pgTable('toppings', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  imageUrl: varchar('image_url', { length: 500 }),
  isAvailable: boolean('is_available').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const toppingsRelations = relations(toppings, ({ one }) => ({
  category: one(categories, {
    fields: [toppings.categoryId],
    references: [categories.id],
  }),
}));

export type Topping = typeof toppings.$inferSelect;
export type NewTopping = typeof toppings.$inferInsert;

/**
 * Menu Item Toppings - ท็อปปิ้งที่ใช้ได้กับเมนู
 */
export const menuItemToppings = pgTable('menu_item_toppings', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  toppingId: uuid('topping_id').references(() => toppings.id, { onDelete: 'cascade' }).notNull(),
});

export const menuItemToppingsRelations = relations(menuItemToppings, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [menuItemToppings.menuItemId],
    references: [menuItems.id],
  }),
  topping: one(toppings, {
    fields: [menuItemToppings.toppingId],
    references: [toppings.id],
  }),
}));

export type MenuItemTopping = typeof menuItemToppings.$inferSelect;
export type NewMenuItemTopping = typeof menuItemToppings.$inferInsert;
