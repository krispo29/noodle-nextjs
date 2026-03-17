'use client';

import { useCallback } from 'react';

// Simple toast notification system
// In production, consider using sonner or react-hot-toast

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = useCallback(({ title, description, duration = 5000, variant = 'default' }: ToastOptions) => {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    // Create toast element
    const toastId = Math.random().toString(36).substring(7);
    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    
    const baseClasses = 'bg-card border rounded-xl p-4 shadow-lg min-w-[300px] pointer-events-auto transition-all duration-300 transform translate-x-0 opacity-100';
    const variantClasses = variant === 'destructive' 
      ? 'border-red-500/50 text-red-500 bg-red-500/5' 
      : 'border-border/40 text-foreground';
    
    toastElement.className = `${baseClasses} ${variantClasses} animate-in slide-in-from-right fade-in`;
    
    let html = '<div class="flex flex-col gap-1">';
    if (title) {
      html += `<div class="font-display text-base">${title}</div>`;
    }
    if (description) {
      html += `<div class="font-sans text-xs opacity-80">${description}</div>`;
    }
    html += '</div>';
    
    toastElement.innerHTML = html;
    container.appendChild(toastElement);

    // Auto-remove after duration
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transform = 'translateX(100%)';
      toastElement.style.transition = 'all 0.3s ease-out';
      setTimeout(() => {
        toastElement.remove();
        if (container?.children.length === 0) {
          container.remove();
        }
      }, 300);
    }, duration);

    return toastId;
  }, []);

  return { toast };
}
