"use server";

import { db } from '@/db';
import { menuItems, categories, categoryGroups, optionGroups, menuOptions, toppings, menuItemToppings } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Get all menu items with category info for Admin
 */
export async function getAdminMenuItems() {
  try {
    const items = await db.select({
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      basePrice: menuItems.basePrice,
      imageUrl: menuItems.imageUrl,
      isRecommended: menuItems.isRecommended,
      isSpicy: menuItems.isSpicy,
      isAvailable: menuItems.isAvailable,
      preparationTime: menuItems.preparationTime,
      sortOrder: menuItems.sortOrder,
      categoryId: menuItems.categoryId,
      categoryName: categories.name,
      categoryGroupName: categoryGroups.name,
    })
      .from(menuItems)
      .leftJoin(categories, eq(menuItems.categoryId, categories.id))
      .leftJoin(categoryGroups, eq(categories.groupId, categoryGroups.id))
      .orderBy(desc(menuItems.sortOrder));

    return items;
  } catch (error) {
    console.error("Error fetching admin menu items:", error);
    return [];
  }
}

/**
 * Create a new menu item
 */
export async function createMenuItem(data: {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: string;
  imageUrl?: string;
  isRecommended?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  preparationTime?: number;
  sortOrder?: number;
}) {
  try {
    const [newItem] = await db.insert(menuItems).values({
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      imageUrl: data.imageUrl,
      isRecommended: data.isRecommended ?? false,
      isSpicy: data.isSpicy ?? false,
      isAvailable: data.isAvailable ?? true,
      preparationTime: data.preparationTime ?? 15,
      sortOrder: data.sortOrder ?? 0,
    }).returning();

    return { success: true, item: newItem };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return { success: false, error: "Failed to create menu item" };
  }
}

/**
 * Update a menu item
 */
export async function updateMenuItem(id: string, data: Partial<{
  categoryId: string;
  name: string;
  description: string;
  basePrice: string;
  imageUrl: string;
  isRecommended: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime: number;
  sortOrder: number;
}>) {
  try {
    const [updatedItem] = await db.update(menuItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();

    return { success: true, item: updatedItem };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return { success: false, error: "Failed to update menu item" };
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string) {
  try {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: "Failed to delete menu item" };
  }
}

/**
 * Toggle menu item availability
 */
export async function toggleMenuItemAvailability(id: string) {
  try {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
    
    if (!item) {
      return { success: false, error: "Item not found" };
    }

    const [updatedItem] = await db.update(menuItems)
      .set({ isAvailable: !item.isAvailable, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();

    return { success: true, item: updatedItem };
  } catch (error) {
    console.error("Error toggling menu item availability:", error);
    return { success: false, error: "Failed to toggle availability" };
  }
}

/**
 * Get all categories with group info
 */
export async function getAdminCategories() {
  try {
    const categoryList = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      imageUrl: categories.imageUrl,
      sortOrder: categories.sortOrder,
      isActive: categories.isActive,
      groupId: categories.groupId,
      groupName: categoryGroups.name,
    })
      .from(categories)
      .leftJoin(categoryGroups, eq(categories.groupId, categoryGroups.id))
      .orderBy(desc(categories.sortOrder));

    return categoryList;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Get all category groups
 */
export async function getAdminCategoryGroups() {
  try {
    const groups = await db.select()
      .from(categoryGroups)
      .orderBy(desc(categoryGroups.sortOrder));

    return groups;
  } catch (error) {
    console.error("Error fetching category groups:", error);
    return [];
  }
}

/**
 * Create a category
 */
export async function createCategory(data: {
  groupId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}) {
  try {
    const [newCategory] = await db.insert(categories).values({
      groupId: data.groupId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder ?? 0,
    }).returning();

    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

/**
 * Create a category group
 */
export async function createCategoryGroup(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}) {
  try {
    const [newGroup] = await db.insert(categoryGroups).values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      sortOrder: data.sortOrder ?? 0,
    }).returning();

    return { success: true, group: newGroup };
  } catch (error) {
    console.error("Error creating category group:", error);
    return { success: false, error: "Failed to create category group" };
  }
}

/**
 * Create option group for a menu item
 */
export async function createOptionGroup(data: {
  menuItemId: string;
  name: string;
  slug: string;
  type: 'single' | 'multiple' | 'size';
  isRequired?: boolean;
  minSelections?: number;
  maxSelections?: number;
}) {
  try {
    const [newGroup] = await db.insert(optionGroups).values({
      menuItemId: data.menuItemId,
      name: data.name,
      slug: data.slug,
      type: data.type,
      isRequired: data.isRequired ?? false,
      minSelections: data.minSelections ?? 1,
      maxSelections: data.maxSelections ?? 1,
    }).returning();

    return { success: true, group: newGroup };
  } catch (error) {
    console.error("Error creating option group:", error);
    return { success: false, error: "Failed to create option group" };
  }
}

/**
 * Create menu option
 */
export async function createMenuOption(data: {
  optionGroupId: string;
  name: string;
  priceModifier?: string;
  isDefault?: boolean;
}) {
  try {
    const [newOption] = await db.insert(menuOptions).values({
      optionGroupId: data.optionGroupId,
      name: data.name,
      priceModifier: data.priceModifier ?? '0',
      isDefault: data.isDefault ?? false,
    }).returning();

    return { success: true, option: newOption };
  } catch (error) {
    console.error("Error creating menu option:", error);
    return { success: false, error: "Failed to create menu option" };
  }
}

/**
 options
 * Get menu item */
export async function getMenuItemOptions(itemId: string) {
  try {
    const groups = await db.select()
      .from(optionGroups)
      .where(eq(optionGroups.menuItemId, itemId))
      .orderBy(desc(optionGroups.sortOrder));

    const groupsWithOptions = await Promise.all(
      groups.map(async (group) => {
        const options = await db.select()
          .from(menuOptions)
          .where(eq(menuOptions.optionGroupId, group.id))
          .orderBy(desc(menuOptions.sortOrder));

        return { ...group, options };
      })
    );

    return groupsWithOptions;
  } catch (error) {
    console.error("Error fetching menu item options:", error);
    return [];
  }
}
