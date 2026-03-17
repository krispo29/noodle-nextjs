"use client";

import { MapPin, Phone, Clock, MessageCircle, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ContactSection() {
  return (
    <section id="contact" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-[600px] bg-primary/5 rounded-bl-[200px] -z-10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-[400px] bg-accent/5 rounded-tr-[200px] -z-10 blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <span className="font-accent text-primary tracking-[0.4em] text-xs uppercase block mb-4">FIND US</span>
          <h2 className="text-4xl md:text-7xl font-display mb-6 leading-tight">มาสัมผัสรสชาติระดับตำนาน</h2>
          <p className="text-muted-foreground text-lg md:text-xl font-sans max-w-xl mx-auto leading-relaxed">
            แวะมาอุดหนุนที่ร้านเพื่อสัมผัสบรรยากาศดั้งเดิม หรือสั่งผ่านช่องทางออนไลน์ได้ตลอดเวลา
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/40 bg-card/40 backdrop-blur-xl h-full shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <CardContent className="p-10 space-y-10 flex flex-col h-full justify-between relative z-10">
                <div className="space-y-10">
                  <div className="flex items-start gap-6">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="font-accent tracking-widest text-[10px] text-primary uppercase mb-1 block">LOCATION</span>
                      <h3 className="font-display text-2xl mb-2 text-foreground">ที่อยู่ร้าน</h3>
                      <p className="text-muted-foreground leading-relaxed font-sans">
                        123 ซอยก๋วยเตี๋ยว ถนนของอร่อย แขวงกินดี <br /> เขตอิ่มจัง กรุงเทพมหานคร 10110
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="font-accent tracking-widest text-[10px] text-primary uppercase mb-1 block">HOURS</span>
                      <h3 className="font-display text-2xl mb-2 text-foreground">เวลาทำการ</h3>
                      <p className="text-muted-foreground font-sans">เปิดบริการทุกวัน: 06:00 - 14:00 น.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-accent tracking-widest uppercase text-accent">Closed on Buddhist Holy Days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="font-accent tracking-widest text-[10px] text-primary uppercase mb-1 block">PHONE</span>
                      <h3 className="font-display text-2xl mb-2 text-foreground">สำรองที่นั่ง</h3>
                      <p className="text-primary text-2xl font-accent tracking-wider">081-234-5678</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/20 mt-8">
                  <Button className="w-full bg-[#00B900] hover:bg-[#009900] text-white h-16 text-xs font-accent tracking-[0.2em] uppercase rounded-xl shadow-lg shadow-[#00B900]/20 transition-all hover:scale-[1.02] active:scale-95">
                    <MessageCircle className="mr-3 h-5 w-5" /> ORDER VIA LINE
                  </Button>
                  <p className="text-center text-[10px] font-accent tracking-widest uppercase text-muted-foreground mt-4 opacity-60">
                    Fast response during business hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-full min-h-[500px] w-full bg-card/40 border border-border/40 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15487.744598252284!2d99.73441615!3d13.962406199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e305a04c2b313f%3A0xcf97adbf47617405!2z4LmA4Lib4Li14Lii4LiV4LmJ4Lih4LmA4Lil4Li34Lit4LiU4Lir4Lih4Li5!5e0!3m2!1sth!2sth!4v1772356699606!5m2!1sth!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location Map"
              className="relative z-10 w-full h-full grayscale-[0.8] contrast-[1.2] invert-[0.9] hue-rotate-[180deg] opacity-60 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-1000"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
