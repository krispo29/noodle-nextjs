'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ถ้าล็อกอินแล้ว ให้ไปหน้า dashboard
  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router, isMounted]);

  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // จำลองการ delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = await login(username, password);
    
    if (success) {
      router.push('/admin');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md relative shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            <Image 
              src="/images/logos/logo_noodle.png" 
              alt="ก๋วยเตี๋ยว" 
              width={48} 
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">เข้าสู่ระบบ Admin</CardTitle>
          <CardDescription>
            ระบบจัดการร้านก๋วยเตี๋ยว - Lineman Analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
