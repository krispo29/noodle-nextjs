import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { savePushSubscription } from '@/lib/push-notifications';
import { validateSession } from '@/lib/session';

/**
 * Zod schema for push subscription request
 */
const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string(),
  auth: z.string(),
});

/**
 * POST endpoint to save push subscription
 */
export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate session
    const session = await validateSession(sessionToken);
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = pushSubscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid subscription data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { endpoint, p256dh, auth } = parsed.data;

    // Save subscription to database
    await savePushSubscription(session.userId, {
      endpoint,
      p256dh,
      auth,
    });

    return NextResponse.json(
      { success: true, message: 'Subscription saved' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Push/Subscribe] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}
