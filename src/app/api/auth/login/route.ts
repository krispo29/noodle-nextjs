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
import { verifyPassword } from '@/lib/password';
import { createSession, deleteSession, validateSession } from '@/lib/session';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/login - Login
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Apply rate limiting - 5 login attempts per minute
    const rateLimitResult = rateLimit(ip, RATE_LIMITS.LOGIN);
    if (!rateLimitResult.success) {
      return badRequestResponse('Too many login attempts. Please try again later.');
    }
    
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
    
    // Check if user exists
    if (!user) {
      return unauthorizedResponse('Invalid username or password');
    }
    
    // Verify password using bcrypt
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return unauthorizedResponse('Invalid username or password');
    }
    
    // Check if user is active
    if (!user.isActive) {
      return unauthorizedResponse('Account is disabled');
    }
    
    // Generate secure session token and store in database
    const session = await createSession(user.id);
    
    // Set cookie with enhanced security
    const cookieStore = await cookies();
    cookieStore.set('auth-token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      // Prevent XSS from accessing cookie
      domain: process.env.COOKIE_DOMAIN || undefined,
    });
    
    // Return user info (excluding password)
    return successResponse({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      token: session.token,
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
    const token = cookieStore.get('auth-token')?.value;
    
    // Delete session from database if token exists
    if (token) {
      await deleteSession(token);
    }
    
    cookieStore.delete('auth-token');
    
    return successResponse(null, 'Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
    return internalErrorResponse('Logout failed');
  }
}
