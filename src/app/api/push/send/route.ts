import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendPushToAllAdmins } from '@/lib/push-notifications';
import { validateSession } from '@/lib/session';

/**
 * Zod schema for push notification request
 */
const pushNotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
  icon: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
  tag: z.string().optional(),
});

/**
 * POST endpoint to send push notification to all admins
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
    const parsed = pushNotificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { title, body: messageBody, icon, data, tag } = parsed.data;

    // Send push notification
    await sendPushToAllAdmins({
      title,
      body: messageBody,
      icon: icon || '/icon.png',
      data,
      tag,
    });

    return NextResponse.json(
      { success: true, message: 'Notification sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Push/Send] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
