/**
 * Categories API Routes
 * GET /api/categories - Get all categories
 * POST /api/categories - Create a category
 */
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse, 
  notFoundResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { createCategorySchema, updateCategorySchema, validateRequest } from '@/lib/validations';
import { getAuthUser, authUnauthorized } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await getAuthUser();
    if (!user) {
      return authUnauthorized('Authentication required to view categories');
    }
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let query = db.select().from(categories).orderBy(desc(categories.sortOrder));
    
    if (activeOnly) {
      query = query.where(eq(categories.isActive, true)) as typeof query;
    }
    
    const result = await query;
    
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return internalErrorResponse('Failed to fetch categories');
  }
}

// POST /api/categories - Create a category
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await getAuthUser();
    if (!user) {
      return authUnauthorized('Authentication required to create categories');
    }
    
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(createCategorySchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    const { name, description, sortOrder, isActive } = validation.data!;
    
    // Check for duplicate name
    const existing = await db.select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);
    
    if (existing.length > 0) {
      return badRequestResponse('Category with this name already exists');
    }
    
    // Insert new category
    const [newCategory] = await db.insert(categories).values({
      name,
      description,
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    }).returning();
    
    return createdResponse(newCategory, 'Category created successfully');
  } catch (error) {
    console.error('Error creating category:', error);
    return internalErrorResponse('Failed to create category');
  }
}
