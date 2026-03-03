import { db } from './index';
import { 
  users, 
  categoryGroups, 
  categories, 
  menuItems, 
  optionGroups, 
  menuOptions,
  toppings,
  menuItemToppings
} from './schema';

/**
 * Seed initial data for the restaurant
 * Run this script with: npm run db:seed
 */
async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Create admin user (password: admin123 - should be hashed in production)
  const adminUser = await db.insert(users).values({
    username: 'admin',
    passwordHash: 'admin123', // In production: use bcrypt to hash this!
    name: 'ผู้ดูแลระบบ',
    role: 'admin',
    isActive: true,
  }).onConflictDoNothing().returning();

  console.log('✅ Admin user created:', adminUser[0]?.username || 'already exists');

  // 2. Create Category Groups
  const groupData = [
    { 
      name: 'เมนูก๋วยเตี๋ยว', 
      slug: 'noodle', 
      description: 'ก๋วยเตี๋ยวหลากหลายรสชาติ',
      icon: 'Soup',
      sortOrder: 1 
    },
    { 
      name: 'เมนูข้าว', 
      slug: 'rice', 
      description: 'ข้าวร้อนๆ หลากหลายเมนู',
      icon: 'Rice',
      sortOrder: 2 
    },
    { 
      name: 'เมนูต้ม/แกง', 
      slug: 'soup', 
      description: 'ต้ม แกง จืด เปรี้ยว',
      icon: 'Pot',
      sortOrder: 3 
    },
    { 
      name: 'เมนูผัด/คลุก', 
      slug: 'stir-fry', 
      description: 'ผัด คลุก ราดข้าว',
      icon: 'Wok',
      sortOrder: 4 
    },
    { 
      name: 'เครื่องดื่ม', 
      slug: 'drinks', 
      description: 'เครื่องดื่มเย็นๆ ร้อนๆ',
      icon: 'CupSoda',
      sortOrder: 5 
    },
    { 
      name: 'ของหวาน', 
      slug: 'dessert', 
      description: 'ขนม ของหวาน',
      icon: 'Cake',
      sortOrder: 6 
    },
  ];

  const insertedGroups = await db.insert(categoryGroups).values(groupData).onConflictDoNothing().returning();
  console.log('✅ Category groups created:', insertedGroups.length);

  // 3. Create Categories (sub-categories)
  const categoryData = [
    // ก๋วยเตี๋ยว (group 1)
    { groupId: insertedGroups[0]?.id, name: 'ก๋วยเตี๋ยวน้ำ', slug: 'noodle-soup', description: 'ก๋วยเตี๋ยวในซุปร้อนๆ', sortOrder: 1 },
    { groupId: insertedGroups[0]?.id, name: 'ก๋วยเตี๋ยวแห้ง', slug: 'noodle-dry', description: 'ก๋วยเตี๋ยวแห้งราดซอส', sortOrder: 2 },
    { groupId: insertedGroups[0]?.id, name: 'บะหมี่', slug: 'bamee', description: 'บะหมี่เกี๊ยวหมูแดง', sortOrder: 3 },
    { groupId: insertedGroups[0]?.id, name: 'ขนมจีน', slug: 'khanomjeen', description: 'ขนมจีนน้ำยาต่างๆ', sortOrder: 4 },
    
    // ข้าว (group 2)
    { groupId: insertedGroups[1]?.id, name: 'ข้าวหมูแดง', slug: 'khao-moo-dang', description: 'ข้าวหมูแดงราดซอส', sortOrder: 1 },
    { groupId: insertedGroups[1]?.id, name: 'ข้าวมันไก่', slug: 'khao-mun-gai', description: 'ข้าวมันไก่สูตรต้นตำรับ', sortOrder: 2 },
    { groupId: insertedGroups[1]?.id, name: 'ข้าวผัด', slug: 'khao-pad', description: 'ข้าวผัดหลากรส', sortOrder: 3 },
    { groupId: insertedGroups[1]?.id, name: 'ข้าวราดแกง', slug: 'khao-gaeng', description: 'ข้าวราดแกงเข้มข้น', sortOrder: 4 },
    
    // ต้ม/แกง (group 3)
    { groupId: insertedGroups[2]?.id, name: 'ต้มจืด', slug: 'tom-jued', description: 'ต้มจืดสมุนไพร', sortOrder: 1 },
    { groupId: insertedGroups[2]?.id, name: 'ต้มยำ', slug: 'tom-yum', description: 'ต้มยำร้อนๆ', sortOrder: 2 },
    { groupId: insertedGroups[2]?.id, name: 'แกง', slug: 'gaeng', description: 'แกงเขียว แกงส้ม', sortOrder: 3 },
    
    // ผัด/คลุก (group 4)
    { groupId: insertedGroups[3]?.id, name: 'ผัดกระเพรา', slug: 'pad-kraprao', description: 'ผัดกระเพราหอมๆ', sortOrder: 1 },
    { groupId: insertedGroups[3]?.id, name: 'ผัดพริกแกง', slug: 'pad-prik-gaeng', description: 'ผัดร้อนๆ', sortOrder: 2 },
    { groupId: insertedGroups[3]?.id, name: 'ผัดไทย', slug: 'pad-thai', description: 'ผัดไทยสูตรต้นตำรับ', sortOrder: 3 },
    
    // เครื่องดื่ม (group 5)
    { groupId: insertedGroups[4]?.id, name: 'น้ำเย็น', slug: 'cold-drinks', description: 'น้ำผลไม้เย็นๆ', sortOrder: 1 },
    { groupId: insertedGroups[4]?.id, name: 'น้ำร้อน', slug: 'hot-drinks', description: 'ชา กาแฟ ร้อนๆ', sortOrder: 2 },
    
    // ของหวาน (group 6)
    { groupId: insertedGroups[5]?.id, name: 'ขนมไทย', slug: 'thai-dessert', description: 'ขนมไทยโบราณ', sortOrder: 1 },
    { groupId: insertedGroups[5]?.id, name: 'ไอศกรีม', slug: 'ice-cream', description: 'ไอศกรีมหลากรส', sortOrder: 2 },
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).onConflictDoNothing().returning();
  console.log('✅ Categories created:', insertedCategories.length);

  // 4. Create Menu Items
  const menuData = [
    // ก๋วยเตี๋ยวน้ำ
    {
      categoryId: insertedCategories[0]?.id,
      name: 'ก๋วยเตี๋ยวเรือหมูน้ำตก',
      description: 'ก๋วยเตี๋ยวเรือรสเข้มข้น หอมกลิ่นเครื่องเทศ พร้อมหมูตุ๋นและลูกชิ้น',
      basePrice: '50',
      imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 1,
    },
    {
      categoryId: insertedCategories[0]?.id,
      name: 'ก๋วยเตี๋ยวเรือต้มยำ',
      description: 'รสจัดจ้าน ครบรส เปรี้ยว เผ็ด หวาน หอมถั่วคั่วและมะนาวแท้',
      basePrice: '55',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isSpicy: true,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 2,
    },
    // บะหมี่
    {
      categoryId: insertedCategories[2]?.id,
      name: 'บะหมี่หมูแดง',
      description: 'บะหมี่ไข่เส้นเหนียวนุ่ม หมูแดงย่างเตาถ่านสูตรพิเศษ ราดน้ำชุ่มฉ่ำ',
      basePrice: '50',
      imageUrl: 'https://images.unsplash.com/photo-1626804475297-41609ea0dc4c?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 1,
    },
    // ข้าวหมูแดง
    {
      categoryId: insertedCategories[4]?.id,
      name: 'ข้าวหมูแดง',
      description: 'ข้าวหมูแดงย่างเตาถ่าน ราดซอสหอมอร่อย',
      basePrice: '45',
      imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 8,
      sortOrder: 1,
    },
    // ข้าวมันไก่
    {
      categoryId: insertedCategories[5]?.id,
      name: 'ข้าวมันไก่',
      description: 'ข้าวมันหอมนุ่ม พร้อมไก่ต้มน้ำซุปสดใหม่',
      basePrice: '40',
      imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800',
      isRecommended: false,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 8,
      sortOrder: 1,
    },
    // ต้มยำ
    {
      categoryId: insertedCategories[9]?.id,
      name: 'ต้มยำกุ้งน้ำข้น',
      description: 'ต้มยำรสจัดจ้าน กุ้งสด หอมเครื่องสมุนไพร',
      basePrice: '120',
      imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isSpicy: true,
      isAvailable: true,
      preparationTime: 15,
      sortOrder: 1,
    },
    // ผัดกระเพรา
    {
      categoryId: insertedCategories[12]?.id,
      name: 'ผัดกระเพราหมู',
      description: 'ผัดกระเพราหอมๆ หมูสับใส่ใบโหระพา ร้อนๆ',
      basePrice: '50',
      imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
      isRecommended: true,
      isSpicy: true,
      isAvailable: true,
      preparationTime: 8,
      sortOrder: 1,
    },
    // เครื่องดื่ม
    {
      categoryId: insertedCategories[15]?.id,
      name: 'น้ำส้มคั้นสด',
      description: 'น้ำส้มคั้นสดใหม่ วิตามินซีเพียบ',
      basePrice: '30',
      imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800',
      isRecommended: false,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 3,
      sortOrder: 1,
    },
    {
      categoryId: insertedCategories[15]?.id,
      name: 'น้ำเต้าหู้',
      description: 'น้ำเต้าหู้สดใหม่ หวานน้อย เย็นชื่นใจ',
      basePrice: '20',
      imageUrl: '',
      isRecommended: false,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 3,
      sortOrder: 2,
    },
  ];

  const insertedMenuItems = await db.insert(menuItems).values(menuData).onConflictDoNothing().returning();
  console.log('✅ Menu items created:', insertedMenuItems.length);

  // 5. Create Option Groups and Options for Noodle items
  // สำหรับก๋วยเตี๋ยว - เลือกเส้น
  const noodleOptionGroup = await db.insert(optionGroups).values({
    menuItemId: insertedMenuItems[0]?.id, // ก๋วยเตี๋ยวเรือหมูน้ำตก
    name: 'เลือกเส้น',
    slug: 'noodle-type',
    type: 'single',
    isRequired: true,
    minSelections: 1,
    maxSelections: 1,
    sortOrder: 1,
  }).returning();

  // Options for noodles
  await db.insert(menuOptions).values([
    { optionGroupId: noodleOptionGroup[0]?.id, name: 'เส้นเล็ก', priceModifier: '0', isDefault: true, sortOrder: 1 },
    { optionGroupId: noodleOptionGroup[0]?.id, name: 'เส้นใหญ่', priceModifier: '5', isDefault: false, sortOrder: 2 },
    { optionGroupId: noodleOptionGroup[0]?.id, name: 'บะหมี่', priceModifier: '0', isDefault: false, sortOrder: 3 },
    { optionGroupId: noodleOptionGroup[0]?.id, name: 'วุ้นเส้น', priceModifier: '0', isDefault: false, sortOrder: 4 },
    { optionGroupId: noodleOptionGroup[0]?.id, name: 'หมี่ขาว', priceModifier: '0', isDefault: false, sortOrder: 5 },
  ]);

  // สำหรับต้มยำ - ระดับความเผ็ด
  const spicyOptionGroup = await db.insert(optionGroups).values({
    menuItemId: insertedMenuItems[1]?.id, // ก๋วยเตี๋ยวต้มยำ
    name: 'ระดับความเผ็ด',
    slug: 'spice-level',
    type: 'single',
    isRequired: true,
    minSelections: 1,
    maxSelections: 1,
    sortOrder: 1,
  }).returning();

  await db.insert(menuOptions).values([
    { optionGroupId: spicyOptionGroup[0]?.id, name: 'ไม่เผ็ด', priceModifier: '0', isDefault: false, sortOrder: 1 },
    { optionGroupId: spicyOptionGroup[0]?.id, name: 'เผ็ดน้อย', priceModifier: '0', isDefault: true, sortOrder: 2 },
    { optionGroupId: spicyOptionGroup[0]?.id, name: 'เผ็ดกลาง', priceModifier: '0', isDefault: false, sortOrder: 3 },
    { optionGroupId: spicyOptionGroup[0]?.id, name: 'เผ็ดมาก', priceModifier: '0', isDefault: false, sortOrder: 4 },
  ]);

  console.log('✅ Option groups and options created');

  // 6. Create Toppings
  const toppingData = [
    { name: 'พิเศษ', price: '10', isAvailable: true },
    { name: 'ไข่ต้มยางมะตูม', price: '10', isAvailable: true },
    { name: 'ไข่ออนเซ็น', price: '15', isAvailable: true },
    { name: 'กากหมูเจียว', price: '15', isAvailable: true },
    { name: 'เกี๊ยวกรอบ', price: '10', isAvailable: true },
    { name: 'ลูกชิ้น', price: '15', isAvailable: true },
    { name: 'แคบหมู', price: '10', isAvailable: true },
    { name: 'หมูยอ', price: '15', isAvailable: true },
  ];

  const insertedToppings = await db.insert(toppings).values(toppingData).onConflictDoNothing().returning();
  console.log('✅ Toppings created:', insertedToppings.length);

  // 7. Link toppings to menu items
  const menuToppingLinks = [
    { menuItemId: insertedMenuItems[0]?.id, toppingId: insertedToppings[0]?.id }, // พิเศษ -> ก๋วยเตี๋ยวน้ำ
    { menuItemId: insertedMenuItems[0]?.id, toppingId: insertedToppings[1]?.id },
    { menuItemId: insertedMenuItems[0]?.id, toppingId: insertedToppings[2]?.id },
    { menuItemId: insertedMenuItems[0]?.id, toppingId: insertedToppings[3]?.id },
    { menuItemId: insertedMenuItems[1]?.id, toppingId: insertedToppings[0]?.id }, // พิเศษ -> ต้มยำ
    { menuItemId: insertedMenuItems[1]?.id, toppingId: insertedToppings[1]?.id },
  ];

  await db.insert(menuItemToppings).values(menuToppingLinks).onConflictDoNothing();
  console.log('✅ Menu-topping links created');

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
