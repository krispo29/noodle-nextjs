/**
 * Session validation endpoint
 * GET /api/auth/session - Validate current session
 */
import { getAuthUser } from '@/lib/auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { NextRequest } from 'next/server';

// GET /api/auth/session - Validate session
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return unauthorizedResponse('No active session');
    }
    
    return successResponse({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return unauthorizedResponse('Invalid session');
  }
}
