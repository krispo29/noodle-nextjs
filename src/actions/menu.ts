"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isRecommended: boolean;
  image: string;
}

const dataFilePath = path.join(process.cwd(), "src", "data", "menu.json");

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading menu items:", error);
    return [];
  }
}

export async function addMenuItem(item: Omit<MenuItem, "id">) {
  try {
    const items = await getMenuItems();
    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    
    items.push(newItem);
    await fs.writeFile(dataFilePath, JSON.stringify(items, null, 2));
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, item: newItem };
  } catch (error) {
    console.error("Error adding menu item:", error);
    return { success: false, error: "Failed to add item" };
  }
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  try {
    const items = await getMenuItems();
    const itemIndex = items.findIndex((item) => item.id === id);
    
    if (itemIndex === -1) {
      return { success: false, error: "Item not found" };
    }
    
    items[itemIndex] = { ...items[itemIndex], ...updates };
    await fs.writeFile(dataFilePath, JSON.stringify(items, null, 2));
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, item: items[itemIndex] };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const items = await getMenuItems();
    const filteredItems = items.filter((item) => item.id !== id);
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredItems, null, 2));
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}
