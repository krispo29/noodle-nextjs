/**
 * Users API Routes
 * GET /api/users - Get all users
 * POST /api/users - Create a new user
 */
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse, 
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { createUserSchema, validateRequest } from '@/lib/validations';
import { NextRequest } from 'next/server';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let query = db.select({
      id: users.id,
      username: users.username,
      name: users.name,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
    
    if (activeOnly) {
      query = query.where(eq(users.isActive, true)) as typeof query;
    }
    
    const result = await query;
    
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return internalErrorResponse('Failed to fetch users');
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(createUserSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    const { username, password, name, role, isActive } = validation.data!;
    
    // Check for duplicate username
    const [existing] = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    if (existing) {
      return badRequestResponse('Username already exists');
    }
    
    // Note: In production, hash the password with bcrypt!
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [newUser] = await db.insert(users).values({
      username,
      passwordHash: password, // In production: hashedPassword
      name,
      role: role ?? 'admin',
      isActive: isActive ?? true,
    }).returning();
    
    // Return user without password
    return createdResponse({
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
    }, 'User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    return internalErrorResponse('Failed to create user');
  }
}
