/**
 * Menu Options API Routes
 * GET /api/options - Get options for a menu item
 * POST /api/options - Create an option group
 */
import { db } from '@/db';
import { optionGroups, menuOptions, menuItems } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { 
  createOptionGroupSchema, 
  createMenuOptionSchema, 
  validateRequest 
} from '@/lib/validations';
import { getAuthUser, authUnauthorized } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET /api/options?menuItemId=xxx - Get option groups for a menu item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get('menuItemId');
    
    if (!menuItemId) {
      return badRequestResponse('menuItemId is required');
    }
    
    // Get option groups for the menu item
    const groups = await db.select()
      .from(optionGroups)
      .where(eq(optionGroups.menuItemId, menuItemId))
      .orderBy(desc(optionGroups.sortOrder));
    
    // Get options for each group
    const groupsWithOptions = await Promise.all(
      groups.map(async (group) => {
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
    
    return successResponse(groupsWithOptions);
  } catch (error) {
    console.error('Error fetching options:', error);
    return internalErrorResponse('Failed to fetch options');
  }
}

// POST /api/options - Create an option group
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await getAuthUser();
    if (!user) {
      return authUnauthorized('Authentication required to create options');
    }
    
    const body = await request.json();
    
    // Determine if creating option group or menu option
    if (body.optionGroupId) {
      // Creating a menu option
      const validation = validateRequest(createMenuOptionSchema, body);
      if (!validation.success) {
        return validationErrorResponse(validation.error!.flatten().fieldErrors);
      }
      
      const { optionGroupId, name, priceModifier, isDefault, sortOrder } = validation.data!;
      
      // Verify option group exists
      const [group] = await db.select()
        .from(optionGroups)
        .where(eq(optionGroups.id, optionGroupId))
        .limit(1);
      
      if (!group) {
        return badRequestResponse('Option group not found');
      }
      
      // If this is set as default, unset other defaults
      if (isDefault) {
        await db.update(menuOptions)
          .set({ isDefault: false })
          .where(eq(menuOptions.optionGroupId, optionGroupId));
      }
      
      const [newOption] = await db.insert(menuOptions).values({
        optionGroupId,
        name,
        priceModifier: priceModifier ?? '0',
        isDefault: isDefault ?? false,
        sortOrder: sortOrder ?? 0,
      }).returning();
      
      return createdResponse(newOption, 'Menu option created successfully');
    } else {
      // Creating an option group
      const validation = validateRequest(createOptionGroupSchema, body);
      if (!validation.success) {
        return validationErrorResponse(validation.error!.flatten().fieldErrors);
      }
      
      const { menuItemId, name, slug, type, isRequired, minSelections, maxSelections, sortOrder } = validation.data!;
      
      // Verify menu item exists
      const [menuItem] = await db.select()
        .from(menuItems)
        .where(eq(menuItems.id, menuItemId))
        .limit(1);
      
      if (!menuItem) {
        return badRequestResponse('Menu item not found');
      }
      
      const [newGroup] = await db.insert(optionGroups).values({
        menuItemId,
        name,
        slug,
        type,
        isRequired: isRequired ?? false,
        minSelections: minSelections ?? 1,
        maxSelections: maxSelections ?? 1,
        sortOrder: sortOrder ?? 0,
      }).returning();
      
      return createdResponse(newGroup, 'Option group created successfully');
    }
  } catch (error) {
    console.error('Error creating option:', error);
    return internalErrorResponse('Failed to create option');
  }
}
