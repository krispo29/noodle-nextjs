import { EventEmitter } from 'events';

/**
 * Global event emitter for server-side events
 * Used for real-time updates like SSE and internal triggers
 */

class AppEventEmitter extends EventEmitter {}

// Global instance to be shared across the application
// Note: In a serverless environment like Vercel, this only works if
// the producer and consumer are in the same execution context.
// For true distributed real-time, an external message bus like Redis is needed.
const globalEventEmitter = new AppEventEmitter();

// Limit listeners to avoid memory leaks
globalEventEmitter.setMaxListeners(100);

export const events = globalEventEmitter;

export const APP_EVENTS = {
  ORDER_CREATED: 'order:created',
  ORDER_STATUS_UPDATED: 'order:status_updated',
  NOTIFICATION_SENT: 'notification:sent',
} as const;
