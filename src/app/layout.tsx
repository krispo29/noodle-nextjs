import type { Metadata } from "next";
import { Niramit, Playfair_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const niramit = Niramit({
  variable: "--font-niramit",
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ร้านเปียต้มเลือดหมู - Authentic Noodles Since 1995",
  description: "ก๋วยเตี๋ยวต้มเลือดหมูสูตรดั้งเดิม ปรุงด้วยใจทุกวัน สัมผัสรสชาติระดับพรีเมียม",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${niramit.variable} ${playfair.variable} ${bebas.variable} font-sans antialiased grain`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
