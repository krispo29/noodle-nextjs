import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center items-center text-center">
        <Badge className="mb-6 py-1 px-4 text-sm bg-primary/20 text-primary hover:bg-primary/20 border-none">
          สูตรลับความอร่อยกว่า 20 ปี
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          ก๋วยเตี๋ยวรสเด็ด <br className="hidden md:block"/>
          <span className="text-primary">สูตรดั้งเดิมคุณแม่</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl px-4">
          น้ำซุปเข้มข้น หอมกรุ่นต้มกระดูกหมู เครื่องแน่น วัตถุดิบสดใหม่ทุกวัน สัมผัสรสชาติแห่งความใส่ใจในทุกชาม
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Button asChild size="lg" className="text-md w-full sm:w-auto px-8 h-12 shadow-lg hover:shadow-xl transition-all">
            <Link href="#menu">
              ดูเมนูเลย <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-md w-full sm:w-auto px-8 h-12 border-primary/20 hover:bg-primary/5">
            <Link href="#contact">ติดต่อร้าน</Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}
