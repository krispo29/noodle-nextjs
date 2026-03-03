/**
 * Single Menu Item API Route
 * GET /api/menu/[id] - Get a menu item by ID
 * PUT /api/menu/[id] - Update a menu item
 * DELETE /api/menu/[id] - Delete a menu item
 */
import { db } from '@/db';
import { menuItems, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  successResponse, 
  notFoundResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse,
  noContentResponse 
} from '@/lib/api-response';
import { updateMenuItemSchema, validateRequest } from '@/lib/validations';
import { NextRequest } from 'next/server';

// GET /api/menu/[id] - Get a menu item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [menuItem] = await db.select({
      id: menuItems.id,
      categoryId: menuItems.categoryId,
      name: menuItems.name,
      description: menuItems.description,
      basePrice: menuItems.basePrice,
      imageUrl: menuItems.imageUrl,
      isRecommended: menuItems.isRecommended,
      isAvailable: menuItems.isAvailable,
      isSpicy: menuItems.isSpicy,
      preparationTime: menuItems.preparationTime,
      sortOrder: menuItems.sortOrder,
      createdAt: menuItems.createdAt,
      updatedAt: menuItems.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
      }
    })
    .from(menuItems)
    .leftJoin(categories, eq(menuItems.categoryId, categories.id))
    .where(eq(menuItems.id, id))
    .limit(1);
    
    if (!menuItem) {
      return notFoundResponse('Menu item');
    }
    
    return successResponse(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return internalErrorResponse('Failed to fetch menu item');
  }
}

// PUT /api/menu/[id] - Update a menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(updateMenuItemSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    // Check if menu item exists
    const [existing] = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, id))
      .limit(1);
    
    if (!existing) {
      return notFoundResponse('Menu item');
    }
    
    // Check category if being updated
    if (validation.data!.categoryId) {
      const [category] = await db.select()
        .from(categories)
        .where(eq(categories.id, validation.data!.categoryId))
        .limit(1);
      
      if (!category) {
        return badRequestResponse('Category not found');
      }
    }
    
    // Update menu item
    const [updated] = await db.update(menuItems)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(menuItems.id, id))
      .returning();
    
    return successResponse(updated, 'Menu item updated successfully');
  } catch (error) {
    console.error('Error updating menu item:', error);
    return internalErrorResponse('Failed to update menu item');
  }
}

// DELETE /api/menu/[id] - Delete a menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if menu item exists
    const [existing] = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, id))
      .limit(1);
    
    if (!existing) {
      return notFoundResponse('Menu item');
    }
    
    // Delete menu item
    await db.delete(menuItems).where(eq(menuItems.id, id));
    
    return noContentResponse();
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return internalErrorResponse('Failed to delete menu item');
  }
}
