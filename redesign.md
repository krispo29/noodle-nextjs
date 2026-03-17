โอเค! วิเคราะห์โปรเจกต์ของคุณเรียบร้อยแล้ว ต่อไปนี้คือ **Redesign Prompt** ที่ครอบคลุม เหมาะกับเทรนด์ Web Design ปี 2025–2026 โดยเฉพาะสำหรับเว็บร้านก๋วยเตี๋ยวของคุณ:

---

## 🎨 Redesign Prompt — Noodle NextJS (2025–2026 Modern Web)

---

### 📌 Prompt หลัก (วางใน AI / Dev ที่คุณใช้งาน)

```
You are an expert Next.js UI/UX designer. Redesign the "Noodle NextJS" Thai
noodle restaurant web app using 2025–2026 cutting-edge web design trends.
The tech stack is: Next.js (App Router), Tailwind CSS v4, shadcn/ui,
Framer Motion, TypeScript, and the Niramit font.

---

## 🎯 DESIGN DIRECTION: "Dark Luxury Street Food"

Concept: The raw authenticity of Thai street food elevated to a premium
editorial experience. Think high-end food magazine meets midnight Bangkok
alley — dark, moody, warm amber tones with editorial typography.

---

## 🌈 COLOR SYSTEM (OKLCH)

Replace the current monochrome palette with:

:root {
  /* Dark luxury base */
  --background: oklch(0.10 0.01 60);        /* Deep warm black */
  --foreground: oklch(0.96 0.02 80);        /* Warm white */
  --card: oklch(0.14 0.015 55);             /* Dark card */
  --card-foreground: oklch(0.94 0.02 75);   /* Warm text */

  /* Signature accent — sizzling amber/orange */
  --primary: oklch(0.72 0.18 55);           /* Warm amber */
  --primary-foreground: oklch(0.10 0 0);    /* Black on amber */

  /* Secondary — smoky red */
  --secondary: oklch(0.25 0.03 30);         /* Dark muted red */
  --secondary-foreground: oklch(0.90 0 0);

  /* Muted tones */
  --muted: oklch(0.18 0.01 50);
  --muted-foreground: oklch(0.60 0.02 70);

  /* Highlight */
  --accent: oklch(0.65 0.20 40);            /* Deep orange-red */
  --border: oklch(0.25 0.02 55);
  --ring: oklch(0.72 0.18 55);
}
```

---

## 🔤 TYPOGRAPHY — 2025 Editorial Style

Use these font pairings (import from Google Fonts):

1. **Display/Hero**: "Playfair Display" — for large headings, creates luxury contrast
2. **Thai Body**: "Niramit" — keep for Thai text support
3. **Accent/Label**: "Bebas Neue" — for price tags, badges, number callouts

```css
@theme inline {
  --font-display: var(--font-playfair);
  --font-sans: var(--font-niramit);
  --font-accent: var(--font-bebas);
}
```

Hero headings: `font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9]`
Price display: `font-accent text-5xl tracking-wide`
Thai body: `font-sans text-base leading-relaxed`

---

## 🖼️ HERO SECTION — Full-Viewport Immersive

Replace the current hero with:

```tsx
// Cinematic full-screen hero with parallax food imagery
<section className="relative h-screen overflow-hidden">
  {/* Background: dark overlay on food image */}
  <div className="absolute inset-0">
    <Image src="/hero-noodle.jpg" fill className="object-cover scale-110" />
    <div
      className="absolute inset-0 bg-gradient-to-b 
      from-background/30 via-background/60 to-background"
    />
    {/* Noise texture overlay for film grain effect */}
    <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
  </div>

  {/* Floating category pills — horizontal scroll on mobile */}
  <div
    className="absolute bottom-32 left-0 right-0 
    flex gap-3 px-6 overflow-x-auto no-scrollbar"
  >
    {categories.map((cat) => (
      <button
        className="shrink-0 px-5 py-2 rounded-full 
        bg-white/10 backdrop-blur-md border border-white/20 
        text-white text-sm hover:bg-primary hover:border-primary 
        transition-all duration-300"
      >
        {cat.name}
      </button>
    ))}
  </div>

  {/* Main headline — editorial split layout */}
  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
    <motion.p
      className="font-accent text-primary tracking-[0.4em] 
      text-sm uppercase mb-4"
    >
      ร้านเปียต้มเลือดหมู • Since 1995
    </motion.p>
    <motion.h1
      className="font-display text-[clamp(3.5rem,9vw,8rem)] 
      leading-[0.85] text-foreground max-w-3xl"
    >
      Authentic
      <br />
      <em className="text-primary">Noodles</em>
      <br />
      Since Dawn
    </motion.h1>
    <motion.p className="mt-6 text-muted-foreground text-lg max-w-md">
      ก๋วยเตี๋ยวต้มเลือดหมูสูตรดั้งเดิม ปรุงด้วยใจทุกวัน
    </motion.p>
  </div>
</section>
```

---

## 🍜 MENU SECTION — 2025 "Bento Grid" Layout

Replace the uniform card grid with an asymmetric bento layout:

```tsx
// Bento grid: featured item large, others smaller
<section className="py-20 px-4 md:px-8">
  {/* Section header — editorial style */}
  <div className="flex items-end justify-between mb-12">
    <div>
      <span className="font-accent text-primary tracking-widest text-sm">
        OUR MENU
      </span>
      <h2 className="font-display text-5xl md:text-7xl text-foreground mt-1">
        เมนูวันนี้
      </h2>
    </div>
    <div className="hidden md:block w-32 h-px bg-border mb-4" />
  </div>

  {/* Bento Grid */}
  <div className="grid grid-cols-12 grid-rows-auto gap-4 auto-rows-[180px]">
    {/* Featured item — spans 8 cols, 2 rows */}
    <MenuCardFeatured className="col-span-12 md:col-span-8 row-span-2" />

    {/* Regular items — 4 cols each */}
    <MenuCardCompact className="col-span-6 md:col-span-4" />
    <MenuCardCompact className="col-span-6 md:col-span-4" />

    {/* Wide item */}
    <MenuCardWide className="col-span-12 md:col-span-6" />
    <MenuCardCompact className="col-span-6 md:col-span-3" />
    <MenuCardCompact className="col-span-6 md:col-span-3" />
  </div>
</section>
```

Each card features:

- Dark background with image fill + gradient overlay
- Price in Bebas Neue font, overlaid on image
- Hover: image zooms + overlay lightens + "เลือก" button slides up

---

## 🎭 ANIMATIONS — 2025 Motion Design

### 1. Scroll-Triggered Text Reveal (Word by Word)

```tsx
// Split heading into words, animate each with stagger
const WordReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <motion.h2 className="font-display text-6xl overflow-hidden">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-3"
          initial={{ y: "110%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            delay: i * 0.08,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
};
```

### 2. Magnetic Button Effect

```tsx
// Buttons follow cursor with subtle magnetic pull
const MagneticButton = ({ children, ...props }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = btnRef.current!.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  return (
    <motion.button
      ref={btnRef}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

### 3. Smooth Page Transition

```tsx
// Curtain wipe transition between routes (in layout.tsx)
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ clipPath: "inset(0 100% 0 0)" }}
    animate={{ clipPath: "inset(0 0% 0 0)" }}
    exit={{ clipPath: "inset(0 0 0 100%)" }}
    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
  >
    {children}
  </motion.div>
);
```

---

## 🛒 CART SIDEBAR — Floating Drawer Style

```tsx
// Redesigned cart: floating glassmorphism panel
<motion.aside
  className="
    fixed right-4 top-4 bottom-4 w-[380px] z-50
    bg-card/80 backdrop-blur-xl
    border border-border/40
    rounded-2xl shadow-2xl shadow-black/50
    overflow-hidden
  "
  initial={{ x: "120%", opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: "120%", opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  {/* Cart items with animated list */}
  <AnimatePresence mode="popLayout">
    {items.map((item) => (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40, height: 0 }}
      >
        <CartItem item={item} />
      </motion.div>
    ))}
  </AnimatePresence>
</motion.aside>
```

---

## 📊 ADMIN DASHBOARD — Dark Analytics UI

Redesign dashboard with:

- **Dark sidebar**: `bg-card border-r border-border/40 w-64`
- **Metric cards**: Gradient borders using `background: linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(135deg, var(--primary), var(--accent)) border-box`
- **Charts**: Use `--primary` (amber) as the main chart color with opacity fills
- **Status badges**: Keep existing color logic but use pill style with `rounded-full px-3 py-1 text-xs font-accent tracking-wide`

---

## ✨ VISUAL EFFECTS TO ADD

### Noise Texture (Film Grain)

```css
/* In globals.css */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.035;
  animation: grain 0.5s steps(2) infinite;
}

@keyframes grain {
  0%,
  100% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-2%, -3%);
  }
  20% {
    transform: translate(3%, 2%);
  }
  /* etc... */
}
```

### Custom Cursor

```tsx
// Amber dot cursor that follows mouse
const CustomCursor = () => {
  // Track mouse position with useMotionValue
  // Render: outer ring (slow follow) + inner dot (instant)
  // On hover over buttons: scale up outer ring + change color
};
```

### Ambient Glow on Hero

```css
.hero-glow {
  background: radial-gradient(
    ellipse 80% 50% at 50% 60%,
    oklch(0.72 0.18 55 / 0.15) 0%,
    transparent 70%
  );
}
```

---

## 📱 MOBILE-SPECIFIC PATTERNS

- **Bottom navigation bar** instead of top navbar on mobile
- **Full-screen menu item modal** with spring physics
- **Swipeable cart** (drag down to dismiss)
- **Sticky "View Cart" pill** button fixed at bottom

```tsx
// Mobile bottom nav
<nav className="
  fixed bottom-0 left-0 right-0 z-40
  bg-card/90 backdrop-blur-xl
  border-t border-border/40
  px-6 py-3
  flex items-center justify-around
  md:hidden
">
```

---

## 🚀 IMPLEMENTATION PRIORITY

1. **Phase 1** — Color system + typography (globals.css + layout.tsx)
2. **Phase 2** — Hero section redesign
3. **Phase 3** — Bento menu grid
4. **Phase 4** — Cart sidebar animation upgrade
5. **Phase 5** — Admin dashboard dark theme polish
6. **Phase 6** — Micro-interactions (magnetic buttons, cursor, grain)

```

---

## 🔑 สรุป Trends ที่ใส่ใน Prompt นี้

| Trend | รายละเอียด |
|---|---|
| **Dark Luxury Theme** | เทรนด์ 2025 — premium dark UI แทน white minimal |
| **Bento Grid Layout** | asymmetric grid แทน uniform card grid |
| **Editorial Typography** | Playfair Display + Bebas Neue — contrast สูง |
| **Film Grain Texture** | noise overlay สร้าง depth และ warmth |
| **Magnetic Buttons** | cursor-following micro-interaction |
| **Word-by-word Reveal** | scroll animation สุดนิยมปี 2025 |
| **Floating Glassmorphism** | cart/modal แบบ backdrop-blur |
| **Page Curtain Transition** | wipe transition ระหว่าง pages |
| **Custom Cursor** | branding touch ที่ web designers ชอบ |
| **Mobile Bottom Nav** | UX pattern ที่ถูกต้องสำหรับ mobile |
```
