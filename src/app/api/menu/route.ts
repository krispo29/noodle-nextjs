/**
 * Menu Items API Routes
 * GET /api/menu - Get all menu items
 * POST /api/menu - Create a menu item
 */
import { db } from '@/db';
import { menuItems, categories } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { createMenuItemSchema, validateRequest } from '@/lib/validations';
import { getAuthUser, authUnauthorized } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET /api/menu - Get all menu items
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await getAuthUser();
    if (!user) {
      return authUnauthorized('Authentication required to view menu');
    }
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const recommendedOnly = searchParams.get('recommendedOnly') === 'true';
    
    let query = db.select({
      id: menuItems.id,
      categoryId: menuItems.categoryId,
      name: menuItems.name,
      description: menuItems.description,
      basePrice: menuItems.basePrice,
      imageUrl: menuItems.imageUrl,
      isRecommended: menuItems.isRecommended,
      isSpicy: menuItems.isSpicy,
      isAvailable: menuItems.isAvailable,
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
    .orderBy(desc(menuItems.sortOrder));
    
    // Build conditions
    const conditions = [];
    if (categoryId) {
      conditions.push(eq(menuItems.categoryId, categoryId));
    }
    if (availableOnly) {
      conditions.push(eq(menuItems.isAvailable, true));
    }
    if (recommendedOnly) {
      conditions.push(eq(menuItems.isRecommended, true));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }
    
    const result = await query;
    
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return internalErrorResponse('Failed to fetch menu items');
  }
}

// POST /api/menu - Create a menu item
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await getAuthUser();
    if (!user) {
      return authUnauthorized('Authentication required to create menu items');
    }
    
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(createMenuItemSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    const { categoryId, name, description, basePrice, imageUrl, isRecommended, isSpicy, isAvailable, preparationTime, sortOrder } = validation.data!;
    
    // Check if category exists
    const [category] = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);
    
    if (!category) {
      return badRequestResponse('Category not found');
    }
    
    // Insert new menu item
    const [newMenuItem] = await db.insert(menuItems).values({
      categoryId,
      name,
      description,
      basePrice,
      imageUrl,
      isRecommended: isRecommended ?? false,
      isSpicy: isSpicy ?? false,
      isAvailable: isAvailable ?? true,
      preparationTime: preparationTime ?? 15,
      sortOrder: sortOrder ?? 0,
    }).returning();
    
    return createdResponse(newMenuItem, 'Menu item created successfully');
  } catch (error) {
    console.error('Error creating menu item:', error);
    return internalErrorResponse('Failed to create menu item');
  }
}
