'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { 
  Coffee, 
  LayoutDashboard, 
  BarChart3, 
  ShoppingCart, 
  UtensilsCrossed,
  Settings,
  LogOut,
  Bell,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'วิเคราะห์', icon: BarChart3 },
  { href: '/admin/orders', label: 'คำสั่งซื้อ', icon: ShoppingCart, badge: 3 },
  { href: '/admin/menu', label: 'จัดการเมนู', icon: UtensilsCrossed },
  { href: '/admin/settings', label: 'ตั้งค่า', icon: Settings },
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

  // Skip layout for login page
  const isLoginPage = pathname === '/admin/login';

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router, isLoginPage]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Don't render layout for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Get current page title
  const getPageTitle = () => {
    const item = navItems.find(item => 
      pathname === item.href || 
      (item.href !== '/admin' && pathname.startsWith(item.href))
    );
    return item?.label || 'แดชบอร์ด';
  };

  // Check if nav item is active
  const isNavActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-40 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg">ก๋วยเตี๋ยว</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = isNavActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </div>
                {item.badge && sidebarOpen && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
          {sidebarOpen && (
            <div className="mb-3 px-3">
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">ผู้ดูแลระบบ</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {sidebarOpen && 'ออกจากระบบ'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </Button>
            
            {/* Shop Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                เปิดรับออร์เดอร์
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
