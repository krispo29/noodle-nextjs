/**
 * Authentication API Routes
 * POST /api/auth/login - Login
 * POST /api/auth/logout - Logout
 */
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  successResponse, 
  createdResponse,
  unauthorizedResponse,
  badRequestResponse,
  internalErrorResponse,
  validationErrorResponse 
} from '@/lib/api-response';
import { loginSchema, validateRequest } from '@/lib/validations';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/login - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(loginSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.error!.flatten().fieldErrors);
    }
    
    const { username, password } = validation.data!;
    
    // Find user by username
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    // Note: In production, use bcrypt to compare hashed passwords
    // For now, simple comparison (should be replaced)
    if (!user || user.passwordHash !== password) {
      return unauthorizedResponse('Invalid username or password');
    }
    
    // Check if user is active
    if (!user.isActive) {
      return unauthorizedResponse('Account is disabled');
    }
    
    // Create session token (in production, use proper JWT or session)
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    // Return user info (excluding password)
    return successResponse({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      token: sessionToken,
    }, 'Login successful');
  } catch (error) {
    console.error('Error during login:', error);
    return internalErrorResponse('Login failed');
  }
}

// POST /api/auth/logout - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    
    return successResponse(null, 'Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
    return internalErrorResponse('Logout failed');
  }
}
