/**
 * Category Groups API Routes
 * GET /api/category-groups - Get all category groups
 * POST /api/category-groups - Create a category group
 */
import { db } from '@/db';
import { categoryGroups } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse, 
  notFoundResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { createCategoryGroupSchema, updateCategoryGroupSchema, validateRequest } from '@/lib/validations';
import { getAuthUser, authUnauthorized } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET /api/category-groups - Get all category groups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let query = db.select().from(categoryGroups).orderBy(desc(categoryGroups.sortOrder));
    
    if (activeOnly) {
      query = query.where(eq(categoryGroups.isActive, true)) as typeof query;
    }
    
    const result = await query;
    
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching category groups:', error);
    return internalErrorResponse('Failed to fetch category groups');
  }
}

// POST /api/category-groups - Create a category group
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await getAuthUser();
    if (!user) {
      return authUnauthorized('Authentication required to create category groups');
    }
    
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(createCategoryGroupSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    const { name, slug, description, icon, imageUrl, sortOrder, isActive } = validation.data!;
    
    // Check for duplicate slug
    const existing = await db.select()
      .from(categoryGroups)
      .where(eq(categoryGroups.slug, slug))
      .limit(1);
    
    if (existing.length > 0) {
      return badRequestResponse('Category group with this slug already exists');
    }
    
    // Insert new category group
    const [newGroup] = await db.insert(categoryGroups).values({
      name,
      slug,
      description,
      icon,
      imageUrl,
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    }).returning();
    
    return createdResponse(newGroup, 'Category group created successfully');
  } catch (error) {
    console.error('Error creating category group:', error);
    return internalErrorResponse('Failed to create category group');
  }
}
