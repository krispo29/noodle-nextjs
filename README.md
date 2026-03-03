# Noodle Restaurant Order System

A modern restaurant ordering system built with Next.js, featuring a customer-facing ordering interface and a comprehensive admin dashboard.

## Features

### Customer Interface
- Browse menu items by category
- Add items to cart with customization options
- Order via LINE integration
- Dark/Light theme support

### Admin Dashboard
- **Dashboard** - Overview of restaurant performance
- **Menu Management** - Add, edit, and organize menu items
- **Orders** - View and manage customer orders
- **Analytics** - Track orders and revenue
- **Settings** - Configure restaurant settings

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Database**: In-memory (easily swappable)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard pages
│   │   ├── analytics/     # Analytics page
│   │   ├── dashboard/     # Dashboard home
│   │   ├── login/         # Admin login
│   │   ├── menu/          # Menu management
│   │   ├── orders/        # Orders management
│   │   └── settings/      # Settings page
│   └── page.tsx           # Customer-facing home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Custom components
├── actions/              # Server actions
├── data/                 # Static data & JSON
├── lib/                  # Utility functions
└── store/                # Zustand stores
```

## LINE Integration

This project supports LINE ordering integration. Configure your LINE channel credentials in the settings to enable order notifications.

## License

MIT
