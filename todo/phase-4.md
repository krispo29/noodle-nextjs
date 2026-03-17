## PHASE 4 TASK: Reviews, Inventory Management, Repeat Order

---

### Task 4.1 — Reviews DB schema

Create: /src/db/schema/reviews.ts

Schema:
reviews {
id: uuid PK
order_id: uuid FK → orders.id
menu_id: uuid FK → menu.id
rating: integer (1-5)
comment: text nullable
is_visible: boolean default true
created_at: timestamp
}

---

### Task 4.2 — Review submission

Create: /src/app/order/[id]/review/page.tsx

Requirements:

- Only accessible when order status = 'completed'
- One-time review per order (check if already reviewed)
- Star rating component (1-5) for each menu item ordered
- Optional text comment per item
- Submit via server action
- Success state: "ขอบคุณสำหรับรีวิว!" with animation

---

### Task 4.3 — Show ratings on menu

Modify: /src/components/menu-section.tsx
Modify: menu item card component

Requirements:

- Show average rating (★ 4.5) on menu card
- Show total review count "(23)"
- Fetch aggregated ratings with menu items
- Add to menu query: AVG(rating) + COUNT(reviews)

---

### Task 4.4 — Daily stock limit

Modify: /src/db/schema/menu.ts (add column)

Requirements:

- Add: daily_limit integer nullable (null = unlimited)
- Add: sold_today integer default 0
- Reset sold_today at midnight via cron or on first order of day

Create: /src/app/api/menu/stock/route.ts

- PATCH { menuId, action: 'increment' | 'reset' }
- Decrement available stock when order is accepted

Modify cart + order submission:

- Check availability before allowing add to cart
- Show "หมดสำหรับวันนี้" badge on sold-out items
- Disable "เลือก" button when sold out

---

### Task 4.5 — Repeat order feature

Modify: /src/store/useCartStore.ts

Requirements:

- Save last completed order to localStorage key: 'last_order'
- Format: { items: CartItem[], timestamp: string }
- Keep only last 3 orders

Create: /src/components/repeat-order-button.tsx

Requirements:

- Show only if last_order exists in localStorage
- Button: "สั่งเหมือนเดิม 🍜"
- On click: populate cart with previous items
- Handle case where menu item no longer available (skip + warn)
- Show in cart sidebar or homepage

Deliverables:

- [ ] /src/db/schema/reviews.ts
- [ ] /src/app/order/[id]/review/page.tsx
- [ ] Updated: menu display with ratings
- [ ] DB migration: daily_limit + sold_today on menu
- [ ] /src/app/api/menu/stock/route.ts
- [ ] Updated: useCartStore with repeat order
- [ ] /src/components/repeat-order-button.tsx
