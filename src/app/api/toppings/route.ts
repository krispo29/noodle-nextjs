/**
 * Toppings API Routes
 * GET /api/toppings - Get all toppings
 * POST /api/toppings - Create a topping
 */
import { db } from '@/db';
import { toppings, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { createToppingSchema, updateToppingSchema, validateRequest } from '@/lib/validations';
import { getAuthUser, authUnauthorized } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET /api/toppings - Get all toppings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const categoryId = searchParams.get('categoryId');
    
    let query = db.select().from(toppings).orderBy(desc(toppings.name));
    
    // Build conditions
    const conditions = [];
    if (availableOnly) {
      conditions.push(eq(toppings.isAvailable, true));
    }
    if (categoryId) {
      conditions.push(eq(toppings.categoryId, categoryId));
    }
    
    if (conditions.length > 0) {
      query = query.where(eq(toppings.isAvailable, true)) as typeof query;
    }
    
    const result = await query;
    
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching toppings:', error);
    return internalErrorResponse('Failed to fetch toppings');
  }
}

// POST /api/toppings - Create a topping
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await getAuthUser();
    if (!user) {
      return authUnauthorized('Authentication required to create toppings');
    }
    
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(createToppingSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    const { name, price, categoryId, imageUrl, isAvailable } = validation.data!;
    
    // If categoryId provided, verify it exists
    if (categoryId) {
      const [category] = await db.select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);
      
      if (!category) {
        return badRequestResponse('Category not found');
      }
    }
    
    // Insert new topping
    const [newTopping] = await db.insert(toppings).values({
      name,
      price,
      categoryId,
      imageUrl,
      isAvailable: isAvailable ?? true,
    }).returning();
    
    return createdResponse(newTopping, 'Topping created successfully');
  } catch (error) {
    console.error('Error creating topping:', error);
    return internalErrorResponse('Failed to create topping');
  }
}
