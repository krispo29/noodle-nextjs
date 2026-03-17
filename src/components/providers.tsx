'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CustomCursor } from "@/components/custom-cursor";

export function Providers({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {isMounted && <CustomCursor />}
      {children}
    </NextThemesProvider>
  );
}
