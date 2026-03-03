/**
 * Session management utilities
 * Handles session creation, validation, and cleanup
 */
import { db } from '@/db';
import { sessions } from '@/db/schema/sessions';
import { eq, and, lt, gt } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Create a new session for a user
 */
export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const [session] = await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
    ipAddress,
    userAgent,
  }).returning();

  return session;
}

/**
 * Validate a session token
 * Returns the session if valid, null if invalid or expired
 */
export async function validateSession(token: string) {
  const [session] = await db.select()
    .from(sessions)
    .where(
      and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  return session || null;
}

/**
 * Get session by token (without expiry check - for logout)
 */
export async function getSessionByToken(token: string) {
  const [session] = await db.select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  return session || null;
}

/**
 * Delete a session by token
 */
export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

/**
 * Delete all sessions for a user (logout from all devices)
 */
export async function deleteAllUserSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

/**
 * Delete expired sessions (cleanup)
 */
export async function deleteExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

/**
 * Refresh session expiration (extend session)
 */
export async function refreshSession(token: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  
  await db.update(sessions)
    .set({ expiresAt })
    .where(eq(sessions.token, token));
}
