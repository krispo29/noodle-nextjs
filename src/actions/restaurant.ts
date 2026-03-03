"use server";

import { db } from '@/db';
import { categoryGroups, categories, menuItems, optionGroups, menuOptions, toppings, menuItemToppings } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Get all category groups with their categories
 */
export async function getCategoryGroups() {
  try {
    const groups = await db.select()
      .from(categoryGroups)
      .where(eq(categoryGroups.isActive, true))
      .orderBy(desc(categoryGroups.sortOrder));

    const groupsWithCategories = await Promise.all(
      groups.map(async (group) => {
        const categoryList = await db.select()
          .from(categories)
          .where(and(
            eq(categories.groupId, group.id),
            eq(categories.isActive, true)
          ))
          .orderBy(desc(categories.sortOrder));

        return {
          ...group,
          categories: categoryList,
        };
      })
    );

    return groupsWithCategories;
  } catch (error) {
    console.error("Error fetching category groups:", error);
    return [];
  }
}

/**
 * Get menu items by category
 */
export async function getMenuByCategory(categoryId: string) {
  try {
    const items = await db.select()
      .from(menuItems)
      .where(and(
        eq(menuItems.categoryId, categoryId),
        eq(menuItems.isAvailable, true)
      ))
      .orderBy(desc(menuItems.sortOrder));

    return items;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

/**
 * Get all available menu items
 */
export async function getAllMenuItems() {
  try {
    const items = await db.select()
      .from(menuItems)
      .where(eq(menuItems.isAvailable, true))
      .orderBy(desc(menuItems.sortOrder));

    return items;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

/**
 * Get recommended menu items
 */
export async function getRecommendedItems() {
  try {
    const items = await db.select()
      .from(menuItems)
      .where(and(
        eq(menuItems.isRecommended, true),
        eq(menuItems.isAvailable, true)
      ))
      .orderBy(desc(menuItems.sortOrder));

    return items;
  } catch (error) {
    console.error("Error fetching recommended items:", error);
    return [];
  }
}

/**
 * Get menu item with options and toppings
 */
export async function getMenuItemDetails(itemId: string) {
  try {
    const [item] = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, itemId))
      .limit(1);

    if (!item) return null;

    // Get option groups for this item
    const optionGroupList = await db.select()
      .from(optionGroups)
      .where(eq(optionGroups.menuItemId, itemId))
      .orderBy(desc(optionGroups.sortOrder));

    // Get options for each group
    const groupsWithOptions = await Promise.all(
      optionGroupList.map(async (group) => {
        const options = await db.select()
          .from(menuOptions)
          .where(eq(menuOptions.optionGroupId, group.id))
          .orderBy(desc(menuOptions.sortOrder));

        return {
          ...group,
          options,
        };
      })
    );

    // Get available toppings for this menu item
    const itemToppings = await db.select({
      id: toppings.id,
      name: toppings.name,
      price: toppings.price,
      isAvailable: toppings.isAvailable,
    })
      .from(menuItemToppings)
      .leftJoin(toppings, eq(menuItemToppings.toppingId, toppings.id))
      .where(and(
        eq(menuItemToppings.menuItemId, itemId),
        eq(toppings.isAvailable, true)
      ));

    return {
      ...item,
      optionGroups: groupsWithOptions,
      toppings: itemToppings,
    };
  } catch (error) {
    console.error("Error fetching menu item details:", error);
    return null;
  }
}

/**
 * Get all toppings (for display)
 */
export async function getAllToppings() {
  try {
    const toppingList = await db.select()
      .from(toppings)
      .where(eq(toppings.isAvailable, true))
      .orderBy(desc(toppings.name));

    return toppingList;
  } catch (error) {
    console.error("Error fetching toppings:", error);
    return [];
  }
}

// Type definitions for the frontend
export interface CategoryGroupWithCategories {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  groupId: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItemWithDetails {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  isRecommended: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime: number;
  calories: number | null;
  allergens: unknown | null;
  sortOrder: number;
  optionGroups: OptionGroupWithOptions[];
  toppings: Topping[];
}

export interface OptionGroupWithOptions {
  id: string;
  menuItemId: string;
  name: string;
  slug: string;
  type: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  sortOrder: number;
  options: MenuOption[];
}

export interface MenuOption {
  id: string;
  optionGroupId: string;
  name: string;
  priceModifier: string;
  isDefault: boolean;
  sortOrder: number;
}

export interface Topping {
  id: string | null;
  name: string | null;
  price: string | null;
  isAvailable: boolean | null;
}
