## PHASE 5 TASK: Security Hardening + Admin Productivity Tools

---

### Task 5.1 — Admin Activity Log

Create: /src/db/schema/activity-logs.ts

Schema:
activity_logs {
id: uuid PK
admin_id: uuid FK → users.id
action: varchar(50) -- 'update_order_status', 'delete_menu', etc.
resource: varchar(50) -- 'order', 'menu', 'settings'
resource_id: uuid nullable
old_value: jsonb nullable
new_value: jsonb nullable
ip_address: varchar(45)
created_at: timestamp
}

Create: /src/lib/activity-logger.ts

- logActivity(params: LogParams): Promise<void>
- Call this in every admin server action

Create: /src/app/admin/activity/page.tsx

- Paginated log table
- Filter by: admin, action, date range
- Show: time, admin name, action description, resource

---

### Task 5.2 — 2FA via LINE OTP

Create: /src/db/schema/otp.ts

Schema:
otp_codes {
id: uuid PK
admin_id: uuid FK → users.id
code: varchar(6)
expires_at: timestamp -- 5 minutes
used: boolean default false
created_at: timestamp
}

Create: /src/lib/otp.ts

- generateOTP(): string -- 6-digit
- sendOTPviaLINE(userId, code): Promise<void>
- verifyOTP(adminId, code): Promise<boolean>

Modify: /src/app/admin/login/page.tsx

- Step 1: email + password → success → send OTP via LINE
- Step 2: enter 6-digit OTP → verified → create session
- OTP expires in 5 minutes, max 3 attempts

---

### Task 5.3 — Kitchen Print Ticket

Create: /src/components/print-ticket.tsx

Requirements:

- Print-optimized component (CSS @media print)
- Show: order number, items + customizations, table/delivery info, timestamp
- "พิมพ์ใบออเดอร์" button in order detail dialog
- Use window.print() with only ticket visible
- Thai font (Niramit) must be embedded for print
- Format: thermal receipt style, max width 80mm equivalent

---

### Task 5.4 — Admin 2FA settings toggle

Modify: /src/app/admin/settings/page.tsx

Requirements:

- Toggle to enable/disable 2FA per admin account
- Add column to users table: two_fa_enabled boolean default false
- Add LINE user ID field: line_user_id varchar (for sending OTP)
- If 2FA disabled → normal login flow
- If 2FA enabled → OTP flow

---

### Task 5.5 — Session security improvements

Modify: /src/lib/session.ts

Requirements:

- Add session fingerprint: hash of (IP + User-Agent)
- Invalidate session if fingerprint changes (possible session hijack)
- Auto-logout after 8 hours of inactivity
- Update last_active timestamp on each authenticated request
- Show active sessions list in admin profile page

Deliverables:

- [ ] /src/db/schema/activity-logs.ts
- [ ] /src/lib/activity-logger.ts
- [ ] /src/app/admin/activity/page.tsx
- [ ] /src/db/schema/otp.ts
- [ ] /src/lib/otp.ts
- [ ] Updated: /src/app/admin/login/page.tsx (2FA flow)
- [ ] /src/components/print-ticket.tsx
- [ ] DB migration: two_fa_enabled + line_user_id on users
- [ ] Updated: /src/lib/session.ts (fingerprint + timeout)
