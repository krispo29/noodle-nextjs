'use client';

import { useEffect, useCallback } from 'react';

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

/**
 * Service Worker Registration and Push Notification Handler
 */
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const registerServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) {
      console.log('[SW] Service Worker not supported');
      return;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[SW] Service Worker registered:', registration.scope);

      // Request notification permission
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        console.log('[SW] Notification permission:', permission);
      }

      // Subscribe to push notifications
      if (Notification.permission === 'granted' && VAPID_PUBLIC_KEY) {
        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });

          // Send subscription to server
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
              p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
              auth: arrayBufferToBase64(subscription.getKey('auth')!),
            }),
          });

          console.log('[SW] Push subscription saved');
        } catch (error) {
          console.error('[SW] Failed to subscribe to push:', error);
        }
      } else if (!VAPID_PUBLIC_KEY) {
        console.warn('[SW] VAPID public key not configured (NEXT_PUBLIC_VAPID_PUBLIC_KEY)');
      }
    } catch (error) {
      console.error('[SW] Registration failed:', error);
    }
  }, []);

  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  return <>{children}</>;
}
