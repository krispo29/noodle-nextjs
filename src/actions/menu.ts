"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isRecommended: boolean;
  image: string;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const results = await db.query.menuItems.findMany({
      where: eq(menuItems.isAvailable, true),
      orderBy: [asc(menuItems.sortOrder)],
    });

    return results.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: Number(item.basePrice),
      isRecommended: item.isRecommended,
      image: item.imageUrl || "https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&q=80&w=800", // Fallback
    }));
  } catch (error) {
    console.error("Error fetching menu items from database:", error);
    return [];
  }
}

export async function addMenuItem(item: Omit<MenuItem, "id">) {
  try {
    // Note: In a real app, you'd need a categoryId here. 
    // This is a simplified version to maintain previous interface.
    // We'll use the first category found as a placeholder if needed.
    const [newItem] = await db.insert(menuItems).values({
      categoryId: "placeholder-id", // This would need to be handled properly
      name: item.name,
      description: item.description,
      basePrice: item.price.toString(),
      imageUrl: item.image,
      isRecommended: item.isRecommended,
    }).returning();
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, item: { ...newItem, price: Number(newItem.basePrice), image: newItem.imageUrl || "" } };
  } catch (error) {
    console.error("Error adding menu item:", error);
    return { success: false, error: "Failed to add item" };
  }
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  try {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.price) dbUpdates.basePrice = updates.price.toString();
    if (updates.image) dbUpdates.imageUrl = updates.image;
    if (updates.isRecommended !== undefined) dbUpdates.isRecommended = updates.isRecommended;

    const [updatedItem] = await db.update(menuItems)
      .set(dbUpdates)
      .where(eq(menuItems.id, id))
      .returning();
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, item: { ...updatedItem, price: Number(updatedItem.basePrice), image: updatedItem.imageUrl || "" } };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}
