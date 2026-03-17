/**
 * Web Push Notifications Library
 * Handles push notification sending to admin users
 */

import webpush from 'web-push';
import { db } from '@/db';
import { pushSubscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * VAPID Keys Configuration
 * Generate these once and store in environment variables
 * Use: npx web-push generate-vapid-keys
 */
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@noodle.com';

// Only configure web-push if VAPID keys are available
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} else {
  console.warn('VAPID keys not configured. Push notifications will not work.');
}

/**
 * Push notification payload
 */
export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    orderId?: string;
    url?: string;
    [key: string]: any;
  };
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Send a push notification to a specific subscription
 */
export async function sendPushNotification(
  subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
  },
  payload: PushPayload
): Promise<boolean> {
  try {
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon.png',
      badge: payload.badge || '/badge.png',
      data: {
        ...payload.data,
        url: payload.data?.url || '/admin/orders',
      },
      tag: payload.tag || 'order-notification',
      requireInteraction: payload.requireInteraction ?? true,
    });

    const result = await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      notificationPayload
    );

    console.log('[Push] Notification sent successfully:', result.statusCode);
    return true;
  } catch (error: any) {
    // Check for subscription errors
    if (error.statusCode === 410) {
      // Subscription has expired - should remove from DB
      console.log('[Push] Subscription expired (410 Gone)');
      return false;
    }
    
    console.error('[Push] Error sending notification:', error);
    return false;
  }
}

/**
 * Send push notification to all admin users
 */
export async function sendPushToAllAdmins(payload: PushPayload): Promise<void> {
  try {
    const subscriptions = await db
      .select()
      .from(pushSubscriptions);

    if (subscriptions.length === 0) {
      console.log('[Push] No active subscriptions found');
      return;
    }

    const sendPromises = subscriptions.map(async (sub) => {
      const success = await sendPushNotification(
        {
          endpoint: sub.endpoint,
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
        payload
      );

      // Remove expired subscriptions
      if (!success) {
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.id, sub.id));
      }
    });

    await Promise.allSettled(sendPromises);
  } catch (error) {
    console.error('[Push] Error sending to all admins:', error);
  }
}

/**
 * Send push notification for new order
 */
export async function sendNewOrderNotification(
  orderId: string,
  orderNumber: string
): Promise<void> {
  const payload: PushPayload = {
    title: '🍜 ออเดอร์ใหม่!',
    body: `มีออเดอร์ #${orderNumber} เข้ามา`,
    icon: '/icon.png',
    badge: '/badge.png',
    data: {
      orderId,
      orderNumber,
      url: `/admin/orders/${orderId}`,
    },
    tag: `order-${orderId}`,
    requireInteraction: true,
  };

  await sendPushToAllAdmins(payload);
}

/**
 * Get VAPID public key for client-side subscription
 * Note: This is server-side only. For client-side, use the window.VAPID_PUBLIC_KEY global.
 */
export function getVapidPublicKey(): string | null {
  return VAPID_PUBLIC_KEY || null;
}

/**
 * Get VAPID public key from environment for client-side use
 * This should be exposed via window or a config endpoint
 */
export function getClientVapidPublicKey(): string | null {
  // In client components, use window.VAPID_PUBLIC_KEY
  if (typeof window !== 'undefined') {
    return (window as any).VAPID_PUBLIC_KEY || null;
  }
  return VAPID_PUBLIC_KEY || null;
}

/**
 * Save a new push subscription to the database
 */
export async function savePushSubscription(
  adminUserId: string,
  subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
  }
): Promise<void> {
  try {
    // Check if subscription already exists
    const existing = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint));

    if (existing.length > 0) {
      console.log('[Push] Subscription already exists, skipping');
      return;
    }

    await db.insert(pushSubscriptions).values({
      adminUserId,
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    });

    console.log('[Push] Subscription saved successfully');
  } catch (error) {
    console.error('[Push] Error saving subscription:', error);
    throw error;
  }
}
