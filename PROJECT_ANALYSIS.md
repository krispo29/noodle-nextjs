# Noodle NextJS Project - Comprehensive Analysis

## 📋 Project Overview

**Noodle NextJS** is a modern, full-stack restaurant ordering system built for a Thai noodle restaurant (ร้านเปียต้มเลือดหมู - Pork Blood Noodle Shop). This application provides a complete solution for both customers and restaurant administrators.

### Core Purpose
- **Customer-facing interface**: Browse menu, customize orders, add to cart, and submit orders via LINE
- **Admin dashboard**: Comprehensive management system for menu, orders, analytics, and restaurant settings

---

## 🏗️ Architecture & Technology Stack

### Frontend Framework
- **Next.js 16.1.6** (App Router) - React framework with server-side rendering capabilities
- **React 19.2.3** - Latest React with full hooks support
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** (New York style) - Component library built on Radix UI
- **Radix UI** - Accessible, unstyled components
- **Lucide React** - Icon library
- **Framer Motion** - Animation library for smooth transitions
- **next-themes** - Dark/light theme support

### State Management
- **Zustand** - Lightweight state management for:
  - Cart management (`useCartStore`)
  - Authentication (`useAuthStore`)

### Database & ORM
- **Drizzle ORM** - TypeScript ORM for type-safe database operations
- **PostgreSQL** - Primary database (via `postgres` driver)
- **Database Schema**:
  - Users (admin authentication)
  - Categories & Category Groups
  - Menu items
  - Orders
  - Sessions

### Form & Validation
- **React Hook Form** - Form handling
- **Zod v4** - Schema validation and type inference

### Additional Libraries
- **bcryptjs** - Password hashing
- **recharts** - Data visualization for analytics
- **embla-carousel-react** - Carousel component
- **qrcode.react** - QR code generation (PromptPay integration)
- **promptpay-qr** - Thai payment system integration

---

## 📁 Project Structure

```
noodle-nextjs/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/                # Admin Dashboard
│   │   │   ├── dashboard/        # Dashboard overview
│   │   │   ├── menu/             # Menu management
│   │   │   ├── orders/           # Order management
│   │   │   ├── analytics/        # Analytics & reports
│   │   │   ├── settings/         # Restaurant settings
│   │   │   └── login/            # Admin login
│   │   ├── api/                  # API routes
│   │   ├── page.tsx              # Customer homepage
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── navbar.tsx            # Navigation bar
│   │   ├── hero.tsx              # Hero section
│   │   ├── menu-section.tsx      # Menu display
│   │   ├── cart-sidebar.tsx      # Shopping cart
│   │   ├── mode-toggle.tsx       # Theme switcher
│   │   └── theme-provider.tsx    # Theme context
│   │
│   ├── actions/                  # Server actions
│   │   └── menu.ts               # Menu CRUD operations
│   │
│   ├── db/                       # Database layer
│   │   ├── schema/               # Drizzle schema definitions
│   │   └── seed.ts               # Database seeding
│   │
│   ├── store/                    # Zustand stores
│   │   ├── useCartStore.ts       # Cart state
│   │   └── auth-store.ts         # Auth state
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts              # Helper functions
│   │   ├── validations.ts        # Zod schemas
│   │   ├── auth.ts               # Auth utilities
│   │   ├── session.ts            # Session management
│   │   ├── password.ts           # Password hashing
│   │   ├── generateLineOrderUrl.ts # LINE integration
│   │   ├── api-client.ts         # API client
│   │   ├── api-response.ts       # API response types
│   │   ├── csrf.ts               # CSRF protection
│   │   ├── rate-limit.ts         # Rate limiting
│   │   └── sanitize.ts           # Input sanitization
│   │
│   └── data/                     # Static data & JSON
│
├── public/                       # Static assets
├── drizzle.config.ts             # Drizzle configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🎯 Key Features

### Customer Interface (Homepage)

1. **Hero Section**
   - Animated welcome banner with Framer Motion
   - Restaurant branding
   - Call-to-action buttons

2. **Menu Section**
   - Grid layout with responsive design
   - Menu items with images
   - Recommendation badges
   - Item customization modal (noodle type, soup type, toppings)
   - Price calculation including toppings

3. **Cart System**
   - Slide-out cart sidebar
   - Quantity management
   - Item customization tracking
   - Total price calculation
   - LINE order integration

4. **Contact Section**
   - Restaurant information
   - Location details
   - Contact methods

5. **Theme Support**
   - Dark/Light mode toggle
   - Persistent theme preference

### Admin Dashboard

1. **Dashboard Overview**
   - Real-time order statistics
   - Revenue analytics with charts
   - Order status tracking
   - New order notifications
   - Key metrics cards (total orders, sales, delivery fees, net sales)

2. **Menu Management**
   - Create/Edit/Delete menu items
   - Image upload support
   - Category organization
   - Pricing configuration
   - Recommendation flags

3. **Order Management**
   - Order status workflow:
     - Pending → Accepted → Preparing → Ready → Delivering → Completed
   - Order details view
   - Customer information
   - Delivery tracking
   - Status updates
   - Cancellation support

4. **Analytics**
   - Daily/weekly/monthly sales charts
   - Hourly order distribution
   - Popular menu items (pie chart)
   - Cost and profit analysis
   - Platform fee tracking

5. **Settings**
   - Restaurant configuration
   - LINE integration settings
   - Business hours
   - Delivery zones

6. **Authentication**
   - Secure login system
   - Session management via httpOnly cookies
   - Role-based access control
   - CSRF protection

---

## 🔐 Security Features

1. **Authentication**
   - httpOnly cookie-based sessions (not localStorage)
   - Password hashing with bcryptjs
   - Session validation server-side

2. **API Security**
   - CSRF protection
   - Rate limiting
   - Input sanitization
   - Zod validation

3. **HTTP Headers** (configured in `next.config.ts`)
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection
   - Strict-Transport-Security
   - Content-Security-Policy
   - Referrer-Policy

4. **Image Security**
   - Remote pattern restrictions
   - Optimized image formats (AVIF, WebP)

---

## 🚀 Performance Optimizations

1. **Next.js Optimizations**
   - Image optimization with multiple formats
   - Package import optimization for Radix UI components
   - Compression enabled
   - Incremental static regeneration support

2. **Tailwind CSS v4**
   - JIT compilation
   - CSS variable-based theming
   - Custom animations

3. **Custom Animations**
   - Spring physics-based transitions
   - Fade-in, slide-in animations
   - Bounce effects for badges
   - Smooth theme transitions

---

## 📊 Database Schema

### Tables

1. **users** - Admin users
2. **category_groups** - Menu category groups
3. **categories** - Menu categories
4. **menu** - Menu items with variants
5. **orders** - Customer orders
6. **sessions** - User sessions

---

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database
```

---

## 🌐 Integrations

### LINE Messaging Platform
- Order submission via LINE
- Order notifications
- Customer communication

### PromptPay (Thai Payment)
- QR code generation for payments
- Thai banking integration

---

## 🎨 Design System

### Color Palette (OKLCH)
- **Primary**: Black/White (monochrome)
- **Secondary**: Neutral grays
- **Accent**: Orange/Amber tones
- **Semantic**: Green (success), Red (destructive), Blue (info)

### Typography
- **Font**: Niramit (Thai-friendly Google Font)
- **Scale**: Responsive text sizing

### Components
- 15+ shadcn/ui components
- Custom restaurant-specific components
- Fully accessible (WCAG compliant)

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 750px, 828px, 1080px, 1200px, 1920px, 2048px
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

---

## 🔄 State Management Flow

### Cart Flow
1. User selects menu item
2. Customization modal opens
3. Options stored in cart with unique ID
4. Price calculated (base + toppings)
5. Cart persisted in Zustand store
6. Order submitted via LINE

### Auth Flow
1. Admin enters credentials
2. API validates against database
3. Session created with httpOnly cookie
4. User state updated in Zustand
5. Protected routes accessible
6. Session validated server-side on each request

---

## 📈 Analytics & Metrics

The dashboard tracks:
- Total orders (completed, pending, cancelled)
- Revenue (gross, net, delivery fees)
- Platform fees
- Daily sales trends
- Hourly order patterns
- Menu item popularity
- Profit margins
- Average order value

---

## 🎯 Business Logic

### Order Status Workflow
```
pending → accepted → preparing → ready → delivering → completed
                                ↓
                            cancelled (any state)
```

### Pricing Calculation
```
Item Price = Base Price + Σ(Topping Prices)
Cart Total = Σ(Item Price × Quantity)
Order Total = Subtotal + Delivery Fee - Discount
Net Sales = Total Sales - Platform Fees
```

---

## 🌟 Unique Features

1. **Thai Restaurant Specific**
   - Thai language UI
   - PromptPay integration
   - LINE ordering (popular in Thailand)
   - Thai font (Niramit)

2. **Advanced Animations**
   - Custom spring physics
   - Staggered card animations
   - Intersection Observer triggers
   - Smooth theme transitions

3. **Legacy Support**
   - Backward compatibility with old noodle shop system
   - Multiple option formats supported

---

## 📝 License

MIT License

---

## 👥 Target Users

1. **Customers**: Order food online with customization
2. **Restaurant Staff**: Manage orders and menu
3. **Administrators**: View analytics and configure settings
4. **Delivery Drivers**: Order tracking (future feature)

---

## 🔮 Future Enhancements (Potential)

- Real-time order updates with WebSockets
- Multi-language support
- Mobile app (React Native)
- Loyalty program
- Advanced reporting
- Multi-branch support
- Inventory management
- Staff scheduling
