/**
 * Authentication Store using Zustand
 * ระบบจัดการการล็อกอินสำหรับ Admin
 * ใช้ API สำหรับ authentication
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
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
                token: data.data.token,
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
      logout: () => {
        // Call logout API
        fetch('/api/auth/login', {
          method: 'DELETE',
        }).catch(console.error);
        
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user,
        token: state.token 
      }),
    }
  )
);
