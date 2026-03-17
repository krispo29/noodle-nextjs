## PHASE 3 TASK: Promotions System + Business Hours Enforcement

### Goal

Admin สร้าง coupon/โปรโมชั่นได้ และระบบปิดรับออเดอร์อัตโนมัติตามเวลาร้าน

---

### Task 3.1 — Promotions DB schema

Create: /src/db/schema/promotions.ts

Schema:
promotions {
id: uuid PK
code: varchar(20) unique -- "WELCOME10"
type: enum('percent','fixed') -- ลด % หรือลดบาท
value: decimal(10,2) -- 10 = 10% หรือ 10 บาท
min_order: decimal(10,2) -- ขั้นต่ำในการใช้
max_uses: integer nullable -- จำนวนครั้งสูงสุด (null = ไม่จำกัด)
used_count: integer default 0
expires_at: timestamp nullable
is_active: boolean default true
created_at: timestamp
}

---

### Task 3.2 — Coupon validation API

Create: /src/app/api/promotions/validate/route.ts

Requirements:

- POST { code: string, orderTotal: number }
- Validate: exists, active, not expired, not over max_uses, min_order met
- Return: { valid: boolean, discount: number, message: string }
- Zod schema for request validation
- Rate limit: max 10 requests per minute per IP

---

### Task 3.3 — Coupon input in cart

Modify: /src/components/cart-sidebar.tsx

Requirements:

- Add coupon input field at bottom of cart
- Show discount amount when valid coupon applied
- Update total calculation: subtotal - discount + delivery fee
- Update useCartStore to include: couponCode, discountAmount
- Show error message if invalid (wrong code, expired, etc.)
- Remove coupon button (×)

---

### Task 3.4 — Admin promotions management

Create: /src/app/admin/promotions/page.tsx

Requirements:

- List all promotions with usage stats
- Create new promotion form (shadcn/ui Sheet or Dialog)
- Toggle active/inactive
- Delete promotion
- Show: code, type, value, used/max, expires_at, status badge

---

### Task 3.5 — Business hours enforcement

Modify: /src/app/api/settings/route.ts (or relevant action)
Modify: /src/components/cart-sidebar.tsx

Requirements:

- Read business_hours from settings table (already exists)
- Parse format: { open: "10:00", close: "21:00", days: [1,2,3,4,5] }
- Server-side: reject order submission if outside hours
- Client-side: disable "ส่งออเดอร์" button + show "ร้านปิดแล้ว เปิด xx:xx น."
- Create utility: /src/lib/businessHours.ts
  - isOpen(settings): boolean
  - getNextOpenTime(settings): string

Deliverables:

- [ ] /src/db/schema/promotions.ts
- [ ] /src/app/api/promotions/validate/route.ts
- [ ] Updated: /src/components/cart-sidebar.tsx
- [ ] /src/app/admin/promotions/page.tsx
- [ ] /src/lib/businessHours.ts
- [ ] Updated: order submission to check business hours
