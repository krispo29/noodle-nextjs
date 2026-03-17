## PHASE 2 TASK: Customer Order Tracking Page

### Goal

ลูกค้าสามารถติดตามสถานะออเดอร์ real-time ผ่าน URL ที่ได้รับจาก LINE

---

### Task 2.1 — Order tracking page

Create: /src/app/order/[id]/page.tsx

Requirements:

- Public page (no auth required)
- Fetch order by ID from DB
- If order not found → show 404 with friendly message
- Show order details:
  - รายการอาหาร + ราคา
  - ชื่อ/เบอร์ลูกค้า
  - เวลาที่สั่ง
  - เวลาโดยประมาณ (ถ้า status = preparing)

Status progress bar component:
pending → accepted → preparing → ready → delivering → completed
Show current step highlighted, previous steps checked ✓
Use shadcn/ui Progress or custom stepper component

---

### Task 2.2 — Live status updates on tracking page

Create: /src/hooks/useOrderTracking.ts

Requirements:

- Connect to SSE endpoint /api/orders/[id]/stream
- Update status in real-time without refresh
- Show animated transition when status changes
- Auto-stop polling when status = 'completed' or 'cancelled'

Create: /src/app/api/orders/[id]/stream/route.ts

- SSE stream filtered to specific order ID only

---

### Task 2.3 — Generate tracking URL after order

Modify: /src/lib/generateLineOrderUrl.ts

Requirements:

- Append tracking URL to LINE message
- Format: "ติดตามออเดอร์ของคุณ: https://[domain]/order/[orderId]"
- URL must be generated after order is saved to DB (have real ID)

---

### Task 2.4 — Estimated time display

Modify: /src/app/api/orders/route.ts (or relevant server action)

Requirements:

- When Admin changes status to 'preparing', allow setting estimated minutes
- Add field to orders table: estimated_minutes (integer, nullable)
- Show countdown timer on tracking page when status = preparing
- Timer counts down from estimated_minutes, shows "อีกประมาณ X นาที"

Add migration: estimated_minutes column to orders table

Deliverables:

- [ ] /src/app/order/[id]/page.tsx
- [ ] /src/hooks/useOrderTracking.ts
- [ ] /src/app/api/orders/[id]/stream/route.ts
- [ ] Updated: /src/lib/generateLineOrderUrl.ts
- [ ] DB migration: add estimated_minutes to orders
