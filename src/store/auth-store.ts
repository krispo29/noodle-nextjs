/**
 * Authentication Store using Zustand
 * ระบบจัดการการล็อกอินสำหรับ Admin
 * ใช้ API สำหรับ authentication
 * 
 * Security: Token is stored in httpOnly cookie, not localStorage
 */
import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    isAuthenticated: false,
    user: null,
    login: async (username: string, password: string) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            set({
              isAuthenticated: true,
              user: data.data.user,
            });
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    logout: async () => {
      try {
        await fetch('/api/auth/login', {
          method: 'DELETE',
        }).catch(console.error);
      } finally {
        set({ isAuthenticated: false, user: null });
      }
    },
    checkAuth: async () => {
      // Auth is handled by httpOnly cookie - just check if we have user info
      // The actual session validation happens server-side
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Important: send cookies
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.user) {
            set({
              isAuthenticated: true,
              user: data.data.user,
            });
            return true;
          }
        }
        set({ isAuthenticated: false, user: null });
        return false;
      } catch {
        set({ isAuthenticated: false, user: null });
        return false;
      }
    },
  })
);
