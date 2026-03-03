/**
 * Single Category API Route
 * GET /api/categories/[id] - Get a category by ID
 * PUT /api/categories/[id] - Update a category
 * DELETE /api/categories/[id] - Delete a category
 */
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  successResponse, 
  notFoundResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse,
  noContentResponse 
} from '@/lib/api-response';
import { updateCategorySchema, validateRequest } from '@/lib/validations';
import { NextRequest } from 'next/server';

// GET /api/categories/[id] - Get a category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [category] = await db.select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    
    if (!category) {
      return notFoundResponse('Category');
    }
    
    return successResponse(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return internalErrorResponse('Failed to fetch category');
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(updateCategorySchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    // Check if category exists
    const [existing] = await db.select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    
    if (!existing) {
      return notFoundResponse('Category');
    }
    
    // Update category
    const [updated] = await db.update(categories)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    
    return successResponse(updated, 'Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    return internalErrorResponse('Failed to update category');
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if category exists
    const [existing] = await db.select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    
    if (!existing) {
      return notFoundResponse('Category');
    }
    
    // Delete category
    await db.delete(categories).where(eq(categories.id, id));
    
    return noContentResponse();
  } catch (error) {
    console.error('Error deleting category:', error);
    return internalErrorResponse('Failed to delete category');
  }
}
