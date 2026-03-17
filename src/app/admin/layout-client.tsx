'use client';

export const dynamic = 'force-dynamic';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  UtensilsCrossed,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ServiceWorkerProvider } from '@/components/service-worker-provider';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, badge: 3 },
  { href: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isMounted && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router, isLoginPage, isMounted]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const getPageTitle = () => {
    const item = navItems.find(item =>
      pathname === item.href ||
      (item.href !== '/admin' && pathname.startsWith(item.href))
    );
    return item?.label || 'Dashboard';
  };

  const isNavActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <ServiceWorkerProvider>
      <div className="min-h-screen flex bg-background font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border/40 transition-all duration-500 ease-spring",
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center px-4 border-b border-border/20">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
            </div>
            {sidebarOpen && (
              <span className="font-display text-xl tracking-tight text-foreground">Admin<span className="text-primary">Panel</span></span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = isNavActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                  {sidebarOpen && <span className="font-accent tracking-widest text-xs uppercase">{item.label}</span>}
                </div>
                {item.badge && sidebarOpen && (
                  <Badge className="bg-accent text-white font-accent text-[10px] rounded-full h-5 min-w-[20px] flex items-center justify-center border-none">
                    {item.badge}
                  </Badge>
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/20 bg-background/50 backdrop-blur-sm">
          {sidebarOpen && (
            <div className="mb-4 px-3">
              <p className="font-display text-base text-foreground">{user?.name}</p>
              <p className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase">Administrator</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start rounded-xl hover:bg-destructive/10 hover:text-destructive group"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            {sidebarOpen && <span className="font-accent tracking-widest text-xs uppercase">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 ease-spring min-h-screen relative",
        sidebarOpen ? 'ml-64' : 'ml-20'
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-background/80 backdrop-blur-xl border-b border-border/40 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-xl border border-border/40 hover:bg-primary/10 hover:border-primary/40 transition-all"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            <h1 className="font-display text-2xl text-foreground">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Shop Status */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <span className="font-accent tracking-widest text-[10px] uppercase text-primary">
                Accepting Orders
              </span>
            </div>

            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative rounded-xl border border-border/40 hover:bg-white/5 group">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-white text-[10px] flex items-center justify-center font-accent border-2 border-background">
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Decorative grain handle by body class */}
    </div>
    </ServiceWorkerProvider>
  );
}
