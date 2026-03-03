/**
 * Authentication Store using Zustand
 * ระบบจัดการการล็อกอินสำหรับ Admin
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminCredentials } from '@/data/lineman-orders';

interface User {
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username: string, password: string) => {
        // ตรวจสอบ credentials
        if (
          username === adminCredentials.username && 
          password === adminCredentials.password
        ) {
          set({
            isAuthenticated: true,
            user: {
              username: adminCredentials.username,
              name: adminCredentials.name,
              role: adminCredentials.role,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'admin-auth-storage', // name of the item in the storage
    }
  )
);
