## PHASE 1 TASK: Real-time Order Updates + Admin Push Notifications

### Goal
ให้ Admin เห็นออเดอร์ใหม่แบบ real-time โดยไม่ต้อง refresh
ให้ลูกค้าเห็นสถานะออเดอร์อัพเดตแบบ live

---

### Task 1.1 — Server-Sent Events (SSE) for order status

Create: /src/app/api/orders/stream/route.ts

Requirements:
- GET endpoint that returns SSE stream
- Stream events when order status changes
- Event format:
  type OrderEvent = {
    type: 'new_order' | 'status_update'
    orderId: string
    status: string
    timestamp: string
  }
- Keep connection alive with heartbeat every 30s
- Clean up on client disconnect

---

### Task 1.2 — useOrderStream hook

Create: /src/hooks/useOrderStream.ts

Requirements:
- Custom hook using EventSource API
- Auto-reconnect on disconnect (max 5 retries, exponential backoff)
- Returns: { isConnected, lastEvent, events[] }
- Clean up EventSource on unmount

---

### Task 1.3 — Admin dashboard integration

Modify: /src/app/admin/dashboard/page.tsx

Requirements:
- Use useOrderStream hook
- Show toast notification when new order arrives
- Use shadcn/ui toast or sonner
- Auto-refresh order list when new_order event received
- Show live indicator badge: green dot + "Live" text when connected
- Example UI:
  <Badge className="animate-pulse bg-green-500">● Live</Badge>

---

### Task 1.4 — Web Push Notifications for Admin

Create: /src/lib/push-notifications.ts
Create: /src/app/api/push/subscribe/route.ts
Create: /src/app/api/push/send/route.ts

Requirements:
- Use Web Push API with VAPID keys
- Store push subscriptions in new DB table: push_subscriptions
  Schema: { id, admin_user_id, endpoint, p256dh, auth, created_at }
- Send push when new order arrives (trigger from order creation)
- Notification payload:
  { title: "ออเดอร์ใหม่!", body: "มีออเดอร์ #${id} เข้ามา", icon: "/icon.png" }
- Add permission request button in admin dashboard header

Add to schema: /src/db/schema/push-subscriptions.ts

---

### Task 1.5 — Service Worker

Create: /public/sw.js

Requirements:
- Handle push event
- Show notification with click action that opens /admin/orders
- Handle notificationclick event
- Register SW in /src/app/layout.tsx (client component)

Deliverables:
- [ ] /src/app/api/orders/stream/route.ts
- [ ] /src/hooks/useOrderStream.ts
- [ ] /src/db/schema/push-subscriptions.ts
- [ ] /src/lib/push-notifications.ts
- [ ] /src/app/api/push/subscribe/route.ts
- [ ] /src/app/api/push/send/route.ts
- [ ] /public/sw.js
- [ ] Updated: /src/app/admin/dashboard/page.tsx