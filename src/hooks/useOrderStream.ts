'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type OrderEventType = 'new_order' | 'status_update';

export interface OrderEvent {
  type: OrderEventType;
  orderId: string;
  status: string;
  timestamp: string;
}

export interface UseOrderStreamReturn {
  isConnected: boolean;
  lastEvent: OrderEvent | null;
  events: OrderEvent[];
  error: string | null;
  retryCount: number;
}

const MAX_RETRIES = 5;
const BASE_RECONNECT_DELAY = 1000; // 1 second

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoff(retryCount: number): number {
  const exponentialDelay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, retryCount), 30000);
  const jitter = Math.random() * 1000;
  return exponentialDelay + jitter;
}

/**
 * Custom hook for consuming the order stream SSE endpoint
 * Auto-reconnects on disconnect with exponential backoff
 */
export function useOrderStream(): UseOrderStreamReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<OrderEvent | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;
    if (retryCount >= MAX_RETRIES) {
      setError('Max reconnection attempts reached');
      setIsConnected(false);
      return;
    }

    try {
      const eventSource = new EventSource('/api/orders/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
        setError(null);
        setRetryCount(0); // Reset retry count on successful connection
        console.log('[SSE] Connected to order stream');
      };

      eventSource.onmessage = (event) => {
        if (!isMountedRef.current) return;
        try {
          const data: OrderEvent = JSON.parse(event.data);
          setLastEvent(data);
          setEvents(prev => [...prev.slice(-49), data]); // Keep last 50 events
          
          if (data.type === 'new_order') {
            console.log('[SSE] New order received:', data.orderId);
          } else if (data.type === 'status_update' && data.orderId !== 'heartbeat') {
            console.log('[SSE] Status update:', data);
          }
        } catch (err) {
          console.error('[SSE] Error parsing event:', err);
        }
      };

      eventSource.onerror = (err) => {
        if (!isMountedRef.current) return;
        
        setIsConnected(false);
        setError('Connection lost, attempting to reconnect...');
        console.error('[SSE] Connection error:', err);

        // Close the current connection
        eventSource.close();
        eventSourceRef.current = null;

        // Schedule reconnection with exponential backoff
        const delay = calculateBackoff(retryCount);
        console.log(`[SSE] Reconnecting in ${Math.round(delay)}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);

        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setRetryCount(prev => prev + 1);
          }
        }, delay);
      };
    } catch (err) {
      console.error('[SSE] Failed to create EventSource:', err);
      setError('Failed to connect to order stream');
    }
  }, [retryCount]);

  // Initial connection
  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [connect, cleanup]);

  // Trigger reconnection when retryCount changes
  useEffect(() => {
    if (retryCount > 0 && retryCount <= MAX_RETRIES && !eventSourceRef.current) {
      connect();
    }
  }, [retryCount, connect]);

  return {
    isConnected,
    lastEvent,
    events,
    error,
    retryCount,
  };
}
