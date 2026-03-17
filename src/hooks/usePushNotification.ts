'use client';

import { useState, useCallback } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/**
 * Helper: Convert base64 URL safe string to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Helper: Convert ArrayBuffer to base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface UsePushNotificationReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

/**
 * Hook for managing push notifications
 */
export function usePushNotification(): UsePushNotificationReturn {
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'serviceWorker' in navigator && 'PushManager' in window;
  });

  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  const [isSubscribed, setIsSubscribed] = useState(false);

  const checkSubscription = useCallback(async () => {
    if (!isSupported) return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    return permission === 'granted';
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported || !VAPID_PUBLIC_KEY) {
      console.error('[Push] Push notifications not supported or VAPID key not configured');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setIsSubscribed(true);
      console.log('[Push] Subscribed successfully');
    } catch (error) {
      console.error('[Push] Subscription error:', error);
      throw error;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        console.log('[Push] Unsubscribed successfully');
      }
    } catch (error) {
      console.error('[Push] Unsubscribe error:', error);
      throw error;
    }
  }, [isSupported]);

  // Check subscription status on mount
  useState(() => {
    if (isSupported) {
      checkSubscription();
    }
  });

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}
