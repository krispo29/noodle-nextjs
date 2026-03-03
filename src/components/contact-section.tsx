import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-primary/5 rounded-bl-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">มาหาเราสิรับรองฟิน</h2>
          <p className="text-muted-foreground text-lg">แวะมาอุดหนุนที่ร้าน หรือถ้ารีบสั่งล่วงหน้าผ่านไลน์ได้เลยนะ</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/80">
            <CardContent className="p-8 space-y-8 flex flex-col h-full justify-between">
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0 transition-transform hover:scale-110 duration-300">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1.5">ที่อยู่ร้าน</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      123 ซอยก๋วยเตี๋ยว ถนนของอร่อย แขวงกินดี <br className="hidden sm:block" /> เขตอิ่มจัง กรุงเทพมหานคร 10110
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0 transition-transform hover:scale-110 duration-300">
                    <Clock className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1.5">เวลาทำการ</h3>
                    <p className="text-muted-foreground text-base font-medium">เปิดบริการทุกวัน: 09:00 - 16:00 น.</p>
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block"></span>
                      หยุดทุกวันพระ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0 transition-transform hover:scale-110 duration-300">
                    <Phone className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1.5">โทรศัพท์สั่งล่วงหน้า</h3>
                    <p className="text-muted-foreground text-lg font-bold text-foreground">081-234-5678</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t mt-6">
                <Button className="w-full bg-[#00B900] hover:bg-[#009900] text-white h-14 text-lg font-medium shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <MessageCircle className="mr-3 h-6 w-6" /> สั่งอาหารผ่าน LINE
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  ตอบไว รอรับออร์เดอร์สบายใจได้เลยจ้า
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="h-full min-h-[450px] w-full bg-muted rounded-2xl overflow-hidden shadow-lg border border-border/50 relative">
            <div className="absolute inset-0 skeleton bg-muted/20 animate-pulse"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15487.744598252284!2d99.73441615!3d13.962406199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e305a04c2b313f%3A0xcf97adbf47617405!2z4LmA4Lib4Li14Lii4LiV4LmJ4Lih4LmA4Lil4Li34Lit4LiU4Lir4Lih4Li5!5e0!3m2!1sth!2sth!4v1772356699606!5m2!1sth!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ร้านก๋วยเตี๋ยวแม่ Map"
              className="relative z-10 w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
