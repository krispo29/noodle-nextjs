import { db } from "./index";
import {
  users,
  categoryGroups,
  categories,
  menuItems,
  optionGroups,
  menuOptions,
  toppings,
  menuItemToppings,
} from "./schema";

/**
 * Seed initial data for the restaurant
 * Run this script with: npm run db:seed
 */
async function seed() {
  console.log("🌱 Starting database seed...");

  // 0. Clean up existing data (to ensure fresh seed)
  console.log("🧹 Cleaning up existing data...");
  try {
    await db.delete(menuItemToppings);
    await db.delete(menuOptions);
    await db.delete(optionGroups);
    await db.delete(menuItems);
    await db.delete(categories);
    await db.delete(categoryGroups);
    console.log("✅ Cleanup completed");
  } catch (err) {
    console.log("⚠️ Cleanup skipped or failed (likely tables don't exist yet)");
  }

  // 1. Create admin user (password: admin123 - should be hashed in production)
  const adminUser = await db
    .insert(users)
    .values({
      username: "admin",
      passwordHash: "admin123", // In production: use bcrypt to hash this!
      name: "ผู้ดูแลระบบ",
      role: "admin",
      isActive: true,
    })
    .onConflictDoNothing()
    .returning();

  console.log(
    "✅ Admin user created:",
    adminUser[0]?.username || "already exists",
  );

  // 2. Create Category Groups
  const groupData = [
    {
      name: "เมนูก๋วยเตี๋ยว",
      slug: "noodle",
      description: "ก๋วยเตี๋ยวหลากหลายรสชาติ",
      icon: "Soup",
      sortOrder: 1,
    },
    {
      name: "เมนูข้าว",
      slug: "rice",
      description: "ข้าวร้อนๆ หลากหลายเมนู",
      icon: "Rice",
      sortOrder: 2,
    },
    {
      name: "เมนูต้ม/แกง",
      slug: "soup",
      description: "ต้ม แกง จืด เปรี้ยว",
      icon: "Pot",
      sortOrder: 3,
    },
    {
      name: "เมนูผัด/คลุก",
      slug: "stir-fry",
      description: "ผัด คลุก ราดข้าว",
      icon: "Wok",
      sortOrder: 4,
    },
    {
      name: "เครื่องดื่ม",
      slug: "drinks",
      description: "เครื่องดื่มเย็นๆ ร้อนๆ",
      icon: "CupSoda",
      sortOrder: 5,
    },
    {
      name: "ของหวาน",
      slug: "dessert",
      description: "ขนม ของหวาน",
      icon: "Cake",
      sortOrder: 6,
    },
  ];

  const insertedGroups = await db
    .insert(categoryGroups)
    .values(groupData)
    .onConflictDoNothing()
    .returning();
  console.log("✅ Category groups created:", insertedGroups.length);

  // 3. Create Categories (sub-categories)
  const categoryData = [
    // ก๋วยเตี๋ยว (group 1)
    {
      groupId: insertedGroups[0]?.id,
      name: "ก๋วยเตี๋ยว",
      slug: "noodle-standard",
      description: "ก๋วยเตี๋ยวสูตรดั้งเดิม",
      sortOrder: 1,
    },
    {
      groupId: insertedGroups[0]?.id,
      name: "ก๋วยเตี๋ยวน้ำตก",
      slug: "noodle-namtok",
      description: "ก๋วยเตี๋ยวน้ำตกเข้มข้น",
      sortOrder: 2,
    },
    {
      groupId: insertedGroups[0]?.id,
      name: "ก๋วยเตี๋ยวต้มยำ",
      slug: "noodle-tomyum",
      description: "ก๋วยเตี๋ยวต้มยำรสเด็ด",
      sortOrder: 3,
    },
    {
      groupId: insertedGroups[0]?.id,
      name: "ก๋วยเตี๋ยวเย็นตาโฟ",
      slug: "noodle-yentafo",
      description: "ก๋วยเตี๋ยวเย็นตาโฟรสกลมกล่อม",
      sortOrder: 4,
    },
    {
      groupId: insertedGroups[0]?.id,
      name: "ก๋วยเตี๋ยวหมูตุ๋น",
      slug: "noodle-stewed-pork",
      description: "ก๋วยเตี๋ยวหมูตุ๋นเปื่อยๆ",
      sortOrder: 5,
    },

    // ข้าว (group 2)
    {
      groupId: insertedGroups[1]?.id,
      name: "ข้าวหมูแดง",
      slug: "khao-moo-dang",
      description: "ข้าวหมูแดงราดซอสสูตรเด็ด",
      sortOrder: 1,
    },
    {
      groupId: insertedGroups[1]?.id,
      name: "ข้าวหมูกรอบ",
      slug: "khao-moo-krob",
      description: "ข้าวหมูกรอบกรุบกรอบ",
      sortOrder: 2,
    },
    {
      groupId: insertedGroups[1]?.id,
      name: "ข้าวมันไก่",
      slug: "khao-mun-gai",
      description: "ข้าวมันไก่เนื้อนุ่ม",
      sortOrder: 3,
    },
    {
      groupId: insertedGroups[1]?.id,
      name: "ข้าวสวย",
      slug: "steamed-rice",
      description: "ข้าวสวยร้อนๆ",
      sortOrder: 4,
    },

    // ต้ม/แกง (group 3)
    {
      groupId: insertedGroups[2]?.id,
      name: "ต้มเลือดหมู",
      slug: "tom-เลือด-moo",
      description: "ต้มเลือดหมูเครื่องแน่น",
      sortOrder: 1,
    },

    // ผัด/คลุก (group 4)
    {
      groupId: insertedGroups[3]?.id,
      name: "ผัดกระเพรา",
      slug: "pad-kraprao",
      description: "ผัดกระเพราหอมๆ",
      sortOrder: 1,
    },

    // เครื่องดื่ม (group 5)
    {
      groupId: insertedGroups[4]?.id,
      name: "น้ำเย็น",
      slug: "cold-drinks",
      description: "น้ำผลไม้เย็นๆ",
      sortOrder: 1,
    },
    {
      groupId: insertedGroups[4]?.id,
      name: "น้ำร้อน",
      slug: "hot-drinks",
      description: "ชา กาแฟ ร้อนๆ",
      sortOrder: 2,
    },

    // ของหวาน (group 6)
    {
      groupId: insertedGroups[5]?.id,
      name: "ขนมไทย",
      slug: "thai-dessert",
      description: "ขนมไทยโบราณ",
      sortOrder: 1,
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing()
    .returning();
  console.log("✅ Categories created:", insertedCategories.length);

  // 4. Create Menu Items
  const menuData = [
    // ก๋วยเตี๋ยว
    {
      categoryId: insertedCategories[0]?.id,
      name: "ก๋วยเตี๋ยว (ธรรมดา)",
      description: "ก๋วยเตี๋ยวน้ำใส/แห้ง รสชาติดั้งเดิม",
      basePrice: "40",
      imageUrl: "",
      isRecommended: false,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 1,
    },
    {
      categoryId: insertedCategories[1]?.id,
      name: "ก๋วยเตี๋ยวน้ำตก",
      description: "ก๋วยเตี๋ยวเรือน้ำตกเข้มข้น หอมกลิ่นเครื่องเทศ",
      basePrice: "45",
      imageUrl: "",
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 2,
    },
    {
      categoryId: insertedCategories[2]?.id,
      name: "ก๋วยเตี๋ยวต้มยำ",
      description: "ก๋วยเตี๋ยวต้มยำรสจัดจ้าน มะนาวแท้",
      basePrice: "50",
      imageUrl: "",
      isRecommended: true,
      isSpicy: true,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 3,
    },
    {
      categoryId: insertedCategories[3]?.id,
      name: "ก๋วยเตี๋ยวเย็นตาโฟ",
      description: "ก๋วยเตี๋ยวเย็นตาโฟ ครบเครื่อง เรื่องเย็นตาโฟ",
      basePrice: "50",
      imageUrl: "",
      isRecommended: false,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 4,
    },
    {
      categoryId: insertedCategories[4]?.id,
      name: "ก๋วยเตี๋ยวหมูตุ๋น",
      description: "ก๋วยเตี๋ยวหมูตุ๋น เนื้อนุ่ม ละลายในปาก",
      basePrice: "55",
      imageUrl: "",
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 15,
      sortOrder: 5,
    },
    // ข้าว
    {
      categoryId: insertedCategories[5]?.id,
      name: "ข้าวหมูแดง",
      description: "ข้าวหมูแดงย่างเตาถ่าน ราดซอสหอมอร่อย",
      basePrice: "45",
      imageUrl: "",
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 8,
      sortOrder: 1,
    },
    {
      categoryId: insertedCategories[6]?.id,
      name: "ข้าวหมูกรอบ",
      description: "ข้าวหมูกรอบ กรอบนอกนุ่มใน ราดน้ำซอสพิเศษ",
      basePrice: "50",
      imageUrl: "",
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 8,
      sortOrder: 2,
    },
    {
      categoryId: insertedCategories[7]?.id,
      name: "ข้าวมันไก่",
      description: "ข้าวมันหอมนุ่ม พร้อมไก่ต้มเนื้อฉ่ำ",
      basePrice: "45",
      imageUrl: "",
      isRecommended: false,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 8,
      sortOrder: 3,
    },
    {
      categoryId: insertedCategories[8]?.id,
      name: "ข้าวสวย",
      description: "ข้าวสวยร้อนๆ ทานคู่กับอะไรก็อร่อย",
      basePrice: "10",
      imageUrl: "",
      isRecommended: false,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 2,
      sortOrder: 4,
    },
    // ต้มเลือดหมู
    {
      categoryId: insertedCategories[9]?.id,
      name: "ต้มเลือดหมู",
      description: "ต้มเลือดหมูร้อนๆ เครื่องแน่น น้ำซุปหวานหอม",
      basePrice: "50",
      imageUrl: "",
      isRecommended: true,
      isSpicy: false,
      isAvailable: true,
      preparationTime: 10,
      sortOrder: 1,
    },
  ];

  const insertedMenuItems = await db
    .insert(menuItems)
    .values(menuData)
    .onConflictDoNothing()
    .returning();
  console.log("✅ Menu items created:", insertedMenuItems.length);

  // 5. Create Option Groups and Options for Noodle items
  // สำหรับก๋วยเตี๋ยว - เลือกเส้น
  const noodleOptionGroup = await db
    .insert(optionGroups)
    .values({
      menuItemId: insertedMenuItems[0]?.id, // ก๋วยเตี๋ยวเรือหมูน้ำตก
      name: "เลือกเส้น",
      slug: "noodle-type",
      type: "single",
      isRequired: true,
      minSelections: 1,
      maxSelections: 1,
      sortOrder: 1,
    })
    .returning();

  // Options for noodles
  await db.insert(menuOptions).values([
    {
      optionGroupId: noodleOptionGroup[0]?.id,
      name: "เส้นเล็ก",
      priceModifier: "0",
      isDefault: true,
      sortOrder: 1,
    },
    {
      optionGroupId: noodleOptionGroup[0]?.id,
      name: "เส้นใหญ่",
      priceModifier: "5",
      isDefault: false,
      sortOrder: 2,
    },
    {
      optionGroupId: noodleOptionGroup[0]?.id,
      name: "บะหมี่",
      priceModifier: "0",
      isDefault: false,
      sortOrder: 3,
    },
    {
      optionGroupId: noodleOptionGroup[0]?.id,
      name: "วุ้นเส้น",
      priceModifier: "0",
      isDefault: false,
      sortOrder: 4,
    },
    {
      optionGroupId: noodleOptionGroup[0]?.id,
      name: "หมี่ขาว",
      priceModifier: "0",
      isDefault: false,
      sortOrder: 5,
    },
  ]);

  // สำหรับต้มยำ - ระดับความเผ็ด
  const spicyOptionGroup = await db
    .insert(optionGroups)
    .values({
      menuItemId: insertedMenuItems[1]?.id, // ก๋วยเตี๋ยวต้มยำ
      name: "ระดับความเผ็ด",
      slug: "spice-level",
      type: "single",
      isRequired: true,
      minSelections: 1,
      maxSelections: 1,
      sortOrder: 1,
    })
    .returning();

  await db.insert(menuOptions).values([
    {
      optionGroupId: spicyOptionGroup[0]?.id,
      name: "ไม่เผ็ด",
      priceModifier: "0",
      isDefault: false,
      sortOrder: 1,
    },
    {
      optionGroupId: spicyOptionGroup[0]?.id,
      name: "เผ็ดน้อย",
      priceModifier: "0",
      isDefault: true,
      sortOrder: 2,
    },
    {
      optionGroupId: spicyOptionGroup[0]?.id,
      name: "เผ็ดกลาง",
      priceModifier: "0",
      isDefault: false,
      sortOrder: 3,
    },
    {
      optionGroupId: spicyOptionGroup[0]?.id,
      name: "เผ็ดมาก",
      priceModifier: "0",
      isDefault: false,
      sortOrder: 4,
    },
  ]);

  console.log("✅ Option groups and options created");

  // 6. Create Toppings
  const toppingData = [
    { name: "พิเศษ", price: "10", isAvailable: true },
    { name: "ไข่ต้มยางมะตูม", price: "10", isAvailable: true },
    { name: "ไข่ออนเซ็น", price: "15", isAvailable: true },
    { name: "กากหมูเจียว", price: "15", isAvailable: true },
    { name: "เกี๊ยวกรอบ", price: "10", isAvailable: true },
    { name: "ลูกชิ้น", price: "15", isAvailable: true },
    { name: "แคบหมู", price: "10", isAvailable: true },
    { name: "หมูยอ", price: "15", isAvailable: true },
  ];

  const insertedToppings = await db
    .insert(toppings)
    .values(toppingData)
    .onConflictDoNothing()
    .returning();
  console.log("✅ Toppings created:", insertedToppings.length);

  // 7. Link toppings to menu items
  const menuToppingLinks = [
    {
      menuItemId: insertedMenuItems[0]?.id,
      toppingId: insertedToppings[0]?.id,
    }, // พิเศษ -> ก๋วยเตี๋ยวน้ำ
    {
      menuItemId: insertedMenuItems[0]?.id,
      toppingId: insertedToppings[1]?.id,
    },
    {
      menuItemId: insertedMenuItems[0]?.id,
      toppingId: insertedToppings[2]?.id,
    },
    {
      menuItemId: insertedMenuItems[0]?.id,
      toppingId: insertedToppings[3]?.id,
    },
    {
      menuItemId: insertedMenuItems[1]?.id,
      toppingId: insertedToppings[0]?.id,
    }, // พิเศษ -> ต้มยำ
    {
      menuItemId: insertedMenuItems[1]?.id,
      toppingId: insertedToppings[1]?.id,
    },
  ];

  await db
    .insert(menuItemToppings)
    .values(menuToppingLinks)
    .onConflictDoNothing();
  console.log("✅ Menu-topping links created");

  console.log("🎉 Database seed completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
