/**
 * Authentication middleware for API routes
 * Provides functions to verify user authentication
 */
import { cookies } from 'next/headers';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { unauthorizedResponse } from './api-response';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  isActive: boolean;
}

/**
 * Get the current authenticated user from the request
 * Returns null if not authenticated
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // Find the session
    const [session] = await db.select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token, token),
          eq(sessions.expiresAt, sessions.expiresAt) // This will be filtered by gt in the actual check
        )
      )
      .limit(1);

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    // Get the user
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API routes that require login
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

/**
 * Check if the current user has a specific role
 */
export async function requireRole(allowedRoles: string[]): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  
  return user;
}

/**
 * Create an unauthorized response for API routes
 */
export function authUnauthorized(message = 'Authentication required') {
  return unauthorizedResponse(message);
}

/**
 * Create a forbidden response for API routes
 */
export function authForbidden(message = 'Insufficient permissions') {
  return {
    success: false,
    error: {
      code: 'FORBIDDEN',
      message,
    },
    data: null,
  };
}
