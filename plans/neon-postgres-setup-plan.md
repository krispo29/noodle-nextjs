# Neon PostgreSQL Integration Plan for Noodle Shop

## 1. Database Schema Design

Based on the existing project structure, here's the recommended database schema:

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | Admin users for authentication |
| `menu_items` | Menu items with name, description, price, image |
| `orders` | Customer orders from all platforms |
| `order_items` | Individual items in each order |
| `categories` | Menu categories (noodles, drinks, etc.) |
| `settings` | Application settings |

### Schema Diagram

```mermaid
erDiagram
    categories ||--o{ menu_items : contains
    users ||--o{ orders : creates
    orders ||--o{ order_items : contains
    
    categories {
        uuid id PK
        string name
        string description
        integer sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    menu_items {
        uuid id PK
        uuid category_id FK
        string name
        string description
        decimal price
        string image_url
        boolean is_recommended
        boolean is_available
        integer sort_order
        timestamp created_at
        timestamp updated_at
    }
    
    users {
        uuid id PK
        string username UK
        string password_hash
        string name
        string role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    orders {
        uuid id PK
        string order_number UK
        string platform
        uuid user_id FK
        string customer_name
        string customer_phone
        string delivery_address
        decimal subtotal
        decimal delivery_fee
        decimal platform_fee
        decimal discount
        decimal total
        string status
        string driver_name
        string driver_phone
        text notes
        timestamp estimated_delivery_time
        timestamp created_at
        timestamp updated_at
    }
    
    order_items {
        uuid id PK
        uuid order_id FK
        uuid menu_item_id FK
        string name
        integer quantity
        decimal price
        text options
        text notes
    }
```

---

## 2. ORM/Query Builder Selection

### Recommended: **Drizzle ORM**

| Criteria | Prisma | Drizzle |
|----------|--------|---------|
| Bundle Size | ~40MB | ~10MB |
| Learning Curve | Medium | Low |
| Type Safety | Excellent | Excellent |
| Neon Compatibility | Good | Excellent |
| Serverless Ready | Good | Excellent |
| Query Performance | Good | Excellent |
| Migration Tooling | Built-in | Separate (Drizzle Kit) |

**Why Drizzle for Neon:**
- Lightweight - perfect for serverless functions
- Native support for PostgreSQL features
- Smaller bundle size = faster cold starts
- Excellent connection pooling support for Neon
- SQL-like syntax = easy to understand and debug

---

## 3. Connection Setup & Pooling

### Neon PostgreSQL Connection String Format

```
postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
```

### Connection Pooling Strategy

Neon provides **built-in connection pooling** via PgBouncer. Use the pooled connection:

```
postgresql://[user]:[password]@[host]/[dbname]?sslmode=require&connection_limit=1
```

**For Serverless (Next.js on Vercel):**
- Use Neon Pooled Connection
- Set `max: 1` connection limit
- Enable prepared statements cache

---

## 4. Environment Variables

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
DATABASE_POOL_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require&connection_limit=1

# Security
NODE_ENV=development  # or production

# Optional: For direct database access
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=your_host
POSTGRES_DATABASE=your_db
```

### Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use Vercel Dashboard** - Set production env vars in project settings
3. **Rotate credentials** - Change passwords periodically
4. **Use minimum permissions** - Create read-only user for read operations

---

## 5. Deployment Strategy

### Option A: Vercel (Recommended)

```bash
# 1. Set environment variables in Vercel Dashboard
# Project Settings > Environment Variables

# 2. Add all required DATABASE_URL variables
# Set to production branch only for sensitive vars
```

### Option B: Docker/Container

```dockerfile
# Build and run with environment variables
docker build -t noodle-shop .
docker run -e DATABASE_URL="$DATABASE_URL" noodle-shop
```

### Option C: Traditional Server

```bash
# Set environment variable before running
export DATABASE_URL="postgresql://..."
npm run start
```

---

## 6. Implementation Plan

### Phase 1: Setup & Configuration
- [ ] Create Neon project and get connection string
- [ ] Install Drizzle ORM and PostgreSQL driver
- [ ] Configure environment variables
- [ ] Set up Drizzle config file

### Phase 2: Database Schema
- [ ] Create migration files
- [ ] Define all table schemas
- [ ] Run migrations against Neon
- [ ] Seed initial data

### Phase 3: API Integration
- [ ] Create database connection utility
- [ ] Build CRUD operations for each entity
- [ ] Integrate with existing API routes
- [ ] Add data validation

### Phase 4: Testing & Optimization
- [ ] Test all database operations
- [ ] Verify connection pooling works
- [ ] Optimize slow queries
- [ ] Add database indexes

---

## 7. File Structure

```
src/
├── db/
│   ├── index.ts          # Database connection
│   ├── config.ts         # Drizzle config
│   ├── schema/
│   │   ├── index.ts      # Export all schemas
│   │   ├── users.ts      # User schema
│   │   ├── menu.ts       # Menu schema
│   │   ├── orders.ts     # Order schema
│   │   └── categories.ts # Category schema
│   ├── migrations/       # Migration files
│   └── seed/             # Seed data
├── lib/
│   └── db.ts             # Shared DB instance
└── actions/              # Server actions using DB
```

---

## 8. Next Steps

Once you approve this plan, we will:

1. Install required dependencies (Drizzle ORM, pg driver)
2. Set up the project structure
3. Create database schema files
4. Configure connection and migrations
5. Migrate existing data to the database
6. Update application code to use database

**Please confirm if this plan meets your requirements, or let me know if you'd like any modifications.**
