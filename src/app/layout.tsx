import type { Metadata } from "next";
import { Niramit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const niramit = Niramit({
  variable: "--font-niramit",
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ร้านอาหารไทย - Thai Restaurant",
  description: "อาหารไทยแท้ รสชาติคุณภาพ วัตถุดิบสดใหม่ทุกวัน บริการด้วยใจ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${niramit.variable} font-sans antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
