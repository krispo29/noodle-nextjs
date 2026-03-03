import { db } from './index';
import { users, categories, menuItems } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Seed initial data for the database
 * Run this script with: npx tsx src/db/seed.ts
 */
async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Create admin user (password: admin123 - should be hashed in production)
  // Note: In production, always use hashed passwords!
  const adminUser = await db.insert(users).values({
    username: 'admin',
    passwordHash: 'admin123', // In production: use bcrypt to hash this!
    name: 'ผู้ดูแลระบบ',
    role: 'admin',
    isActive: true,
  }).onConflictDoNothing().returning();

  console.log('✅ Admin user created:', adminUser[0]?.username || 'already exists');

  // 2. Create categories
  const categoryData = [
    { name: 'ก๋วยเตี๋ยว', description: 'ก๋วยเตี๋ยวหลากหลายรสชาติ', sortOrder: 1 },
    { name: 'บะหมี่', description: 'บะหมี่เกี๊ยว บะหมี่หมูแดง', sortOrder: 2 },
    { name: 'ขนมจีน', description: 'ขนมจีนน้ำยาต่างๆ', sortOrder: 3 },
    { name: 'เครื่องดื่ม', description: 'เครื่องดื่มเย็นๆ ร้อนๆ', sortOrder: 4 },
    { name: 'ของทานเล่น', description: 'ของทานเล่นเพิ่มเติม', sortOrder: 5 },
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).onConflictDoNothing().returning();
  console.log('✅ Categories created:', insertedCategories.length);

  // 3. Create menu items
  const menuData = [
    // ก๋วยเตี๋ยว (category 1)
    {
      categoryId: insertedCategories[0]?.id,
      name: 'ก๋วยเตี๋ยวเรือหมูน้ำตก',
      description: 'ก๋วยเตี๋ยวเรือรสเข้มข้น หอมกลิ่นเครื่องเทศ พร้อมหมูตุ๋นและลูกชิ้น',
      price: '50',
      imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      categoryId: insertedCategories[0]?.id,
      name: 'ก๋วยเตี๋ยวเรือต้มยำ',
      description: 'รสจัดจ้าน ครบรส เปรี้ยว เผ็ด หวาน หอมถั่วคั่วและมะนาวแท้',
      price: '55',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      categoryId: insertedCategories[0]?.id,
      name: 'ก๋วยจั๊บน้ำข้น',
      description: 'เส้นก๋วยจั๊บเหนียวนุ่มในน้ำซุปพะโล้รสเข้มข้น หอมเครื่องเทศพริกไทย',
      price: '55',
      imageUrl: 'https://images.unsplash.com/photo-1547928576-a4a33237ce35?auto=format&fit=crop&q=80&w=800',
      isRecommended: false,
      isAvailable: true,
      sortOrder: 3,
    },
    // บะหมี่ (category 2)
    {
      categoryId: insertedCategories[1]?.id,
      name: 'บะหมี่หมูแดง',
      description: 'บะหมี่ไข่เส้นเหนียวนุ่ม หมูแดงย่างเตาถ่านสูตรพิเศษ ราดน้ำชุ่มฉ่ำ',
      price: '50',
      imageUrl: 'https://images.unsplash.com/photo-1626804475297-41609ea0dc4c?auto=format&fit=crop&q=80&w=800',
      isRecommended: false,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      categoryId: insertedCategories[1]?.id,
      name: 'บะหมี่เกี๊ยวหมูแดง',
      description: 'บะหมี่ไข่ทำเอง แผ่นเกี๊ยวบางนุ่มไส้แน่น หมูแดงหอมเตาถ่าน',
      price: '65',
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isAvailable: true,
      sortOrder: 2,
    },
    // ขนมจีน (category 3)
    {
      categoryId: insertedCategories[2]?.id,
      name: 'ขนมจีนน้ำยาปลา',
      description: 'ขนมจีนเส้นสด ราดความเข้มข้นของน้ำยาปลาผสมกระชาย หอมกรุ่นกะทิสด',
      price: '45',
      imageUrl: 'https://images.unsplash.com/photo-1634459419130-9b6264f33fd9?auto=format&fit=crop&q=80&w=800',
      isRecommended: false,
      isAvailable: true,
      sortOrder: 1,
    },
    // เครื่องดื่ม (category 4)
    {
      categoryId: insertedCategories[3]?.id,
      name: 'น้ำเต้าหู้',
      description: 'น้ำเต้าหู้สดใหม่ หวานน้อย �เย็นชื่นใจ',
      price: '20',
      imageUrl: '',
      isRecommended: false,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      categoryId: insertedCategories[3]?.id,
      name: 'น้ำแข็งใส',
      description: 'น้ำแข็งใสหลากรสชาติ',
      price: '15',
      imageUrl: '',
      isRecommended: false,
      isAvailable: true,
      sortOrder: 2,
    },
    // Premium
    {
      categoryId: insertedCategories[0]?.id,
      name: 'มาม่าต้มยำทะเลหม้อไฟ',
      description: 'พรีเมียมจัดเต็ม! เส้นมาม่าในซุปต้มยำมันกุ้ง พร้อมกุ้งแม่น้ำ ปลาหมึก และไข่เยิ้ม',
      price: '120',
      imageUrl: 'https://images.unsplash.com/photo-1569058242252-62324e68884c?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isAvailable: true,
      sortOrder: 4,
    },
  ];

  const insertedMenuItems = await db.insert(menuItems).values(menuData).onConflictDoNothing().returning();
  console.log('✅ Menu items created:', insertedMenuItems.length);

  console.log('🎉 Database seed completed!');
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
