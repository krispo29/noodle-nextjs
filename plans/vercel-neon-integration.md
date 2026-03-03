# วิธีสร้าง Neon PostgreSQL ผ่าน Vercel Integration

## ขั้นตอนที่ 1: เชื่อมต่อ Neon กับ Vercel

1. **ไปที่ Vercel Dashboard**
   - เข้าไปที่ https://vercel.com/dashboard
   - เลือก Project ของคุณ (noodle-nextjs)

2. **ไปที่ Storage Tab**
   - คลิกที่เมนู "Storage" ด้านซ้าย
   - หรือไปที่ https://vercel.com/dashboard/[your-project]/storage

3. **สร้าง Database ใหม่**
   - คลิกปุ่ม "Create Database"
   - เลือก "Neon" (PostgreSQL)
   - ตั้งชื่อ database เช่น `noodle-shop-db`
   - เลือก Region ใกล้ที่สุด (เช่น Singapore หรือ Tokyo)
   - คลิก "Create"

## ขั้นตอนที่ 2: ตั้งค่า Environment Variables อัตโนมัติ

เมื่อสร้าง Neon ผ่าน Vercel แล้ว:
- Vercel จะสร้าง `DATABASE_URL` ให้อัตโนมัติ
- ตัวแปรจะถูก set ใน **Project Settings → Environment Variables**
- ไม่ต้องตั้งค่าด้วยตัวเอง

## ขั้นตอนที่ 3: ตรวจสอบ Connection String

หลังจากสร้างแล้ว คุณจะเห็น:
- **Connection String** สำหรับ development
- **Pooled Connection** สำหรับ production/serverless

```
postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## ขั้นตอนที่ 4: ใช้งานในโปรเจค

เมื่อ Vercel สร้าง DATABASE_URL แล้ว คุณสามารถ:

1. **Run Migration** (local):
   ```bash
   # Set local DATABASE_URL first
   npx drizzle-kit push
   ```

2. **Deploy to Vercel**:
   - ไม่ต้องตั้งค่าอะไรเพิ่ม เพราะ Vercel จะใช้ค่าจาก Storage integration อัตโนมัติ

## สิ่งที่ได้จาก Vercel + Neon Integration

| ฟีเจอร์ | รายละเอียด |
|---------|-------------|
| Automatic ENV | DATABASE_URL ถูกสร้างอัตโนมัติ |
| Connection Pooling | Neon pooler ถูก enable อัตโนมัติ |
| Preview Deployments | รองรับ preview branches |
| Zero Config | ไม่ต้องตั้งค่า environment ด้วยตัวเอง |

## หมายเหตุสำคัญ

**Connection String สำหรับ Serverless:**
- ใช้ **Pooled connection** สำหรับ Vercel (ไม่ใช่ direct connection)
- จาก Neon Dashboard จะมี 2 แบบ:
  - `Connection string` (direct) - สำหรับ local development
  - `Pooled connection` - สำหรับ production/serverless

Vercel integration จะให้ค่าที่ถูกต้องอัตโนมัติแล้ว!

## ถ้าต้องการ Connection สำหรับ Local Development

1. ไปที่ Neon Dashboard → Project Settings → Connection Details
2. เลือก "Direct connection"
3. Copy connection string
4. สร้างไฟล์ `.env.local` ในโปรเจค:
   ```
   DATABASE_URL=postgresql://...
   ```
5. Run migration:
   ```bash   npx drizzle-kit push
   ```

---

**สรุป**: ไปที่ Vercel Dashboard → Storage → Create Database → เลือก Neon → สร้างเสร็จ → ใช้งานได้เลย! 🎉
