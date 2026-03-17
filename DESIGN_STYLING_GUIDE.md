# Noodle NextJS - Design & Styling Guide

## 🎨 Design Philosophy

This project follows a **modern, minimalist Thai restaurant aesthetic** that combines:
- **Clean typography** with Thai-friendly fonts
- **Smooth animations** for delightful user experience
- **Accessible color contrast** for readability
- **Responsive layouts** for all devices

---

## 🖌️ Styling Approach

### CSS Architecture

The project uses **Tailwind CSS v4** with a custom configuration:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

### Design Tokens (CSS Variables)

All colors and values are defined as CSS variables in `globals.css` using the **OKLCH color space** for better perceptual uniformity.

#### Light Theme Variables
```css
:root {
  --background: oklch(1 0 0);           /* Pure white */
  --foreground: oklch(0.145 0 0);       /* Near black */
  --primary: oklch(0.205 0 0);          /* Black */
  --primary-foreground: oklch(0.985 0 0); /* White */
  --secondary: oklch(0.97 0 0);         /* Light gray */
  --accent: oklch(0.97 0 0);            /* Light gray */
  --muted: oklch(0.97 0 0);             /* Light gray */
  --border: oklch(0.922 0 0);           /* Light border */
  --ring: oklch(0.708 0 0);             /* Focus ring */
}
```

#### Dark Theme Variables
```css
.dark {
  --background: oklch(0.145 0 0);       /* Near black */
  --foreground: oklch(0.985 0 0);       /* White */
  --primary: oklch(0.922 0 0);          /* White */
  --primary-foreground: oklch(0.205 0 0); /* Black */
  --secondary: oklch(0.269 0 0);        /* Dark gray */
  --accent: oklch(0.269 0 0);           /* Dark gray */
  --muted: oklch(0.269 0 0);            /* Dark gray */
  --border: oklch(1 0 0 / 10%);         /* Transparent white */
  --ring: oklch(0.556 0 0);             /* Dimmed ring */
}
```

### Color Palette Strategy

| Purpose | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| Background | White (`#FFFFFF`) | Near Black (`#1A1A1A`) | Page backgrounds |
| Card | White | Dark Gray (`#262626`) | Cards, modals |
| Primary | Black | White | Buttons, accents |
| Secondary | Light Gray | Dark Gray | Secondary actions |
| Muted | Light Gray | Dark Gray | Disabled states |
| Accent | Orange/Amber | Orange/Amber | Highlights, CTAs |

---

## 🎭 Animation System

### Custom Keyframe Animations

Defined in `globals.css`:

#### 1. Spring Ease Animation
```css
@keyframes ease-spring {
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
}
```
**Usage**: Sheet/dialog slide-in transitions

#### 2. Pop-Up Scale Animation
```css
@keyframes pop-up {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```
**Usage**: Modal pop-up effects

#### 3. Bounce-In Animation
```css
@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```
**Usage**: Cart badge notifications

#### 4. Fade-In-Up Animation
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
**Usage**: Content reveal on scroll

#### 5. Slide-In Animations
```css
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```
**Usage**: Side panel animations

### Framer Motion Integration

#### Hero Section Animation Variants
```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};
```

#### Menu Card Animation Variants
```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] // Custom spring ease
    }
  })
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Animation Timing Functions

Custom cubic-bezier for spring physics:
```css
cubic-bezier(0.16, 1, 0.3, 1) /* Smooth deceleration */
```

---

## 📐 Layout System

### Container Pattern
```tsx
<div className="container mx-auto px-4">
  {/* Content */}
</div>
```

### Grid Layouts

#### Menu Grid (Responsive)
```tsx
className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
```

#### Dashboard Stats Grid
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

### Flexbox Patterns

#### Centered Content
```tsx
className="flex flex-col justify-center items-center"
```

#### Space Between
```tsx
className="flex items-center justify-between"
```

---

## 🧩 Component Styling Patterns

### Card Component
```tsx
<Card className="
  group 
  overflow-hidden 
  border-border/50 
  hover:border-primary/50 
  transition-all 
  duration-300 
  hover:shadow-xl 
  hover:-translate-y-1 
  bg-card/50 
  backdrop-blur-sm
">
```

**Key Features**:
- Group hover states
- Border transition on hover
- Shadow elevation
- Slight lift animation
- Semi-transparent background with blur

### Button Component
```tsx
<Button className="
  shadow-sm 
  hover:shadow-xl 
  transition-all 
  hover:scale-105 
  active:scale-95
">
```

**Key Features**:
- Shadow on hover
- Scale up on hover
- Scale down on click
- Smooth transitions

### Badge Component
```tsx
<Badge variant="outline" className="
  text-primary 
  border-primary/30
">
```

### Image Styling
```tsx
<Image
  fill
  className="
    object-cover 
    transition-transform 
    duration-500 
    group-hover:scale-110
  "
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
/>
```

**Key Features**:
- Responsive sizing
- Scale on parent hover
- Smooth transition
- Object-fit cover

---

## 🌙 Theme System

### Theme Provider Component
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange={false}
>
```

### Theme Toggle
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  </DropdownMenuTrigger>
</DropdownMenu>
```

### Theme Classes
```css
/* Light mode (default) */
:root { ... }

/* Dark mode */
.dark { ... }
```

---

## 📱 Responsive Design

### Breakpoints

| Name | Size | Usage |
|------|------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### Responsive Text
```tsx
className="text-4xl md:text-6xl font-extrabold"
```

### Responsive Layouts
```tsx
className="flex flex-col sm:flex-row gap-4"
```

### Responsive Spacing
```tsx
className="py-20 md:py-32"
```

---

## 🎨 Visual Effects

### Gradient Backgrounds
```tsx
className="bg-gradient-to-br from-primary/10 via-background to-background"
```

### Decorative Blurs
```tsx
<div className="
  absolute 
  top-1/2 
  left-0 
  -translate-y-1/2 
  w-64 
  h-64 
  bg-primary/10 
  rounded-full 
  blur-3xl 
  -z-10
" />
```

### Glassmorphism
```tsx
className="bg-card/50 backdrop-blur-sm"
```

### Shadow System
```tsx
className="shadow-lg hover:shadow-xl transition-shadow"
```

---

## 🧵 Tailwind Custom Classes

### Custom Utilities in globals.css
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Custom Theme Values
```css
@theme inline {
  --animate-ease-spring: ease-spring 300ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-pop-up: pop-up 300ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-bounce-in: bounce-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-fade-in-up: fade-in-up 500ms ease-out forwards;
  --animate-slide-in-left: slide-in-left 500ms ease-out forwards;
  --animate-slide-in-right: slide-in-right 500ms ease-out forwards;
  
  --font-sans: var(--font-niramit);
}
```

---

## 🔤 Typography

### Font Family
```css
--font-sans: var(--font-niramit); /* Thai-friendly Google Font */
```

### Font Weights
- **Extrabold**: Headings (`font-extrabold`)
- **Bold**: Subheadings (`font-bold`)
- **Medium**: Buttons (`font-medium`)
- **Normal**: Body text (default)

### Text Colors
- `text-foreground`: Primary text
- `text-muted-foreground`: Secondary text
- `text-primary`: Accent text
- `text-destructive`: Error/danger text

---

## 🎯 Accessibility

### Focus States
```tsx
className="outline-ring/50" // Custom ring from theme
```

### Color Contrast
All text meets WCAG AA standards:
- Light mode: Black on white (21:1)
- Dark mode: White on black (21:1)

### Screen Reader Support
- Semantic HTML elements
- ARIA labels where needed
- Icon + text combinations

---

## 📊 Dashboard Styling

### Stat Cards
```tsx
<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      {/* Content */}
    </div>
  </CardContent>
</Card>
```

### Status Badges
```tsx
const statusConfig = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
  accepted: { color: 'text-blue-600', bg: 'bg-blue-100' },
  preparing: { color: 'text-orange-600', bg: 'bg-orange-100' },
  ready: { color: 'text-purple-600', bg: 'bg-purple-100' },
  delivering: { color: 'text-indigo-600', bg: 'bg-indigo-100' },
  completed: { color: 'text-green-600', bg: 'bg-green-100' },
  cancelled: { color: 'text-red-600', bg: 'bg-red-100' },
};
```

### Charts (Recharts)
```tsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={dailyStats}>
    <defs>
      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <Area
      type="monotone"
      dataKey="totalSales"
      stroke="#f97316"
      strokeWidth={2}
      fill="url(#colorSales)"
    />
  </AreaChart>
</ResponsiveContainer>
```

---

## 🎪 Special Effects

### Pulse Animation for Notifications
```tsx
className="animate-pulse bg-gradient-to-r from-orange-500 to-amber-500"
```

### Loading Spinner
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
```

### Hover Card Lift
```tsx
className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
```

### Image Zoom on Hover
```tsx
className="transition-transform duration-500 group-hover:scale-110"
```

---

## 🧪 Component Examples

### Hero Section
```tsx
<section className="
  relative 
  overflow-hidden 
  bg-background 
  py-20 md:py-32
">
  {/* Decorative background */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
  </div>
  
  {/* Content */}
  <div className="container mx-auto px-4 relative z-10">
    {/* Animated content */}
  </div>
  
  {/* Decorative blurs */}
  <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
</section>
```

### Menu Card
```tsx
<Card className="
  group 
  overflow-hidden 
  border-border/50 
  hover:border-primary/50 
  transition-all 
  duration-300 
  hover:shadow-xl 
  hover:-translate-y-1 
  bg-card/50 
  backdrop-blur-sm 
  h-full
">
  <div className="h-48 relative bg-muted/80 overflow-hidden">
    <Image
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-110"
    />
  </div>
  <CardHeader>
    <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
    <CardDescription className="min-h-[48px] pt-1 text-sm leading-relaxed">
      {item.description}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-black text-primary">฿{item.price}</span>
      <span className="text-xs text-muted-foreground">เริ่มที่</span>
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full font-medium shadow-sm group-hover:bg-primary transition-all duration-300 hover:scale-105 active:scale-95">
      <Plus className="mr-2 h-4 w-4" /> เลือกรูปแบบ
    </Button>
  </CardFooter>
</Card>
```

---

## 📋 Style Guidelines

### Naming Conventions
- Use semantic class names with Tailwind
- Group related classes together
- Order: layout → spacing → typography → visual → interactive → state

### Class Order (Recommended)
```tsx
className="
  /* Layout */
  flex items-center justify-between
  
  /* Spacing */
  p-6 gap-4
  
  /* Typography */
  text-lg font-bold
  
  /* Visual */
  bg-primary text-primary-foreground rounded-lg
  
  /* Interactive */
  cursor-pointer transition-all duration-300
  
  /* State */
  hover:shadow-lg hover:scale-105 active:scale-95
"
```

### Responsive Modifiers
Order: `base` → `sm:` → `md:` → `lg:` → `xl:` → `2xl:`

### Dark Mode
Use `dark:` prefix for dark theme overrides:
```tsx
className="bg-white dark:bg-black text-black dark:text-white"
```

---

## 🎨 Design Inspiration

- **Minimalism**: Clean, uncluttered layouts
- **Thai aesthetics**: Warm, inviting colors
- **Modern UI**: Card-based design, subtle shadows
- **Micro-interactions**: Delightful hover states
- **Accessibility**: High contrast, clear typography

---

## 📚 Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)
