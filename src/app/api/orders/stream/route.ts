import { NextRequest } from 'next/server';
import { events, APP_EVENTS } from '@/lib/events';

/**
 * Server-Sent Events endpoint for real-time order updates
 * Streams events when order status changes or new orders arrive
 */

export type OrderEvent = {
  type: 'new_order' | 'status_update';
  orderId: string;
  status: string;
  timestamp: string;
};

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

/**
 * Encode data as SSE event format
 */
function encodeSSEEvent(data: OrderEvent): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

/**
 * GET endpoint that returns SSE stream
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let heartbeatInterval: NodeJS.Timeout | null = null;
      let isClosed = false;

      const sendEvent = (event: OrderEvent) => {
        if (!isClosed) {
          try {
            controller.enqueue(encoder.encode(encodeSSEEvent(event)));
          } catch (e) {
            console.error('Error enqueuing SSE event:', e);
            close();
          }
        }
      };

      const close = () => {
        if (isClosed) return;
        isClosed = true;

        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
        
        // Remove event listeners
        events.off(APP_EVENTS.ORDER_CREATED, handleNewOrder);
        events.off(APP_EVENTS.ORDER_STATUS_UPDATED, handleStatusUpdate);
        
        try {
          controller.close();
        } catch (e) {
          // Stream might already be closed
        }
      };

      // Event handlers
      const handleNewOrder = (data: { orderId: string, status: string }) => {
        sendEvent({
          type: 'new_order',
          orderId: data.orderId,
          status: data.status,
          timestamp: new Date().toISOString(),
        });
      };

      const handleStatusUpdate = (data: { orderId: string, status: string }) => {
        sendEvent({
          type: 'status_update',
          orderId: data.orderId,
          status: data.status,
          timestamp: new Date().toISOString(),
        });
      };

      // Register for events
      events.on(APP_EVENTS.ORDER_CREATED, handleNewOrder);
      events.on(APP_EVENTS.ORDER_STATUS_UPDATED, handleStatusUpdate);

      // Send initial connection event
      sendEvent({
        type: 'status_update',
        orderId: 'connection',
        status: 'connected',
        timestamp: new Date().toISOString(),
      });

      // Heartbeat to keep connection alive
      heartbeatInterval = setInterval(() => {
        sendEvent({
          type: 'status_update',
          orderId: 'heartbeat',
          status: 'alive',
          timestamp: new Date().toISOString(),
        });
      }, HEARTBEAT_INTERVAL);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        console.log('[SSE] Client disconnected');
        close();
      });
    },

    cancel() {
      // Cleanup on client disconnect
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
