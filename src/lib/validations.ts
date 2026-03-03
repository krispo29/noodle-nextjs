/**
 * Validation Schemas using Zod
 */
import { z } from 'zod';
import { sanitizeHtml, sanitizeNotes, sanitizePhone, sanitizeEmail } from './sanitize';

// Common validation patterns
export const uuidSchema = z.string().uuid('Invalid UUID format');
export const stringSchema = (min = 1, max = 255) => 
  z.string().min(min).max(max);
export const optionalStringSchema = (min = 0, max = 500) => 
  z.string().min(min).max(max).optional();
export const emailSchema = z.string().email('Invalid email format').optional();
export const phoneSchema = z.string().regex(/^[\d\-\s]+$/, 'Invalid phone format').optional();
export const booleanSchema = z.boolean().optional();
export const numberSchema = (min?: number, max?: number) => {
  let schema = z.number();
  if (min !== undefined) schema = schema.min(min);
  if (max !== undefined) schema = schema.max(max);
  return schema;
};
export const decimalSchema = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid decimal format');

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// ============ Category Group Validation ============
export const createCategoryGroupSchema = z.object({
  name: stringSchema(1, 100),
  slug: stringSchema(1, 50),
  description: optionalStringSchema(0, 500),
  icon: optionalStringSchema(0, 100).optional(),
  imageUrl: optionalStringSchema(0, 500).optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: booleanSchema.default(true),
});

export const updateCategoryGroupSchema = createCategoryGroupSchema.partial();

export type CreateCategoryGroupInput = z.infer<typeof createCategoryGroupSchema>;
export type UpdateCategoryGroupInput = z.infer<typeof updateCategoryGroupSchema>;

// ============ Category Validation ============
export const createCategorySchema = z.object({
  groupId: uuidSchema,
  name: stringSchema(1, 255),
  slug: stringSchema(1, 50),
  description: optionalStringSchema(0, 500),
  imageUrl: optionalStringSchema(0, 500).optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: booleanSchema.default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// ============ Menu Item Validation ============
export const createMenuItemSchema = z.object({
  categoryId: uuidSchema,
  name: stringSchema(1, 255),
  description: optionalStringSchema(0, 1000),
  basePrice: decimalSchema,
  imageUrl: optionalStringSchema(0, 500).optional(),
  isRecommended: booleanSchema.default(false),
  isSpicy: booleanSchema.default(false),
  isAvailable: booleanSchema.default(true),
  preparationTime: z.coerce.number().min(1).default(15),
  calories: z.coerce.number().min(0).optional(),
  allergens: z.array(z.string()).optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

// ============ Menu Option Group Validation ============
export const optionTypeEnum = z.enum(['single', 'multiple', 'size']);

export const createOptionGroupSchema = z.object({
  menuItemId: uuidSchema,
  name: stringSchema(1, 100),
  slug: stringSchema(1, 50),
  type: optionTypeEnum,
  isRequired: booleanSchema.default(false),
  minSelections: z.coerce.number().min(1).default(1),
  maxSelections: z.coerce.number().min(1).default(1),
  sortOrder: z.coerce.number().min(0).default(0),
});

export const updateOptionGroupSchema = createOptionGroupSchema.partial();

export type CreateOptionGroupInput = z.infer<typeof createOptionGroupSchema>;
export type UpdateOptionGroupInput = z.infer<typeof updateOptionGroupSchema>;

// ============ Menu Option Validation ============
export const createMenuOptionSchema = z.object({
  optionGroupId: uuidSchema,
  name: stringSchema(1, 100),
  priceModifier: decimalSchema.default('0'),
  isDefault: booleanSchema.default(false),
  sortOrder: z.coerce.number().min(0).default(0),
});

export const updateMenuOptionSchema = createMenuOptionSchema.partial();

export type CreateMenuOptionInput = z.infer<typeof createMenuOptionSchema>;
export type UpdateMenuOptionInput = z.infer<typeof updateMenuOptionSchema>;

// ============ Topping Validation ============
export const createToppingSchema = z.object({
  name: stringSchema(1, 100),
  price: decimalSchema,
  categoryId: uuidSchema.optional(),
  imageUrl: optionalStringSchema(0, 500).optional(),
  isAvailable: booleanSchema.default(true),
});

export const updateToppingSchema = createToppingSchema.partial();

export type CreateToppingInput = z.infer<typeof createToppingSchema>;
export type UpdateToppingInput = z.infer<typeof updateToppingSchema>;
const orderItemSchema = z.object({
  menuItemId: uuidSchema.optional(),
  name: stringSchema(1, 255),
  quantity: z.coerce.number().min(1),
  price: decimalSchema,
  options: optionalStringSchema(0, 1000).optional(),
  notes: z.string().transform(val => sanitizeNotes(val)),
});

export const orderStatusEnum = z.enum([
  'pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'
]);

export const orderTypeEnum = z.enum(['dine_in', 'takeaway', 'delivery']).default('takeaway');
export const paymentStatusEnum = z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending');
export const platformEnum = z.enum(['lineman', 'grab', 'foodpanda', 'walkin', 'line']).default('walkin');

export const createOrderSchema = z.object({
  orderNumber: stringSchema(1, 50),
  orderType: orderTypeEnum,
  platform: platformEnum,
  userId: uuidSchema.optional(),
  customerName: stringSchema(1, 255),
  customerPhone: phoneSchema.transform(val => sanitizePhone(val || '')),
  customerNote: z.string().transform(val => sanitizeNotes(val)),
  tableNumber: optionalStringSchema(0, 10).optional(),
  deliveryAddress: optionalStringSchema(0, 1000).optional(),
  subtotal: decimalSchema,
  deliveryFee: decimalSchema.default('0'),
  platformFee: decimalSchema.default('0'),
  discount: decimalSchema.default('0'),
  total: decimalSchema,
  status: orderStatusEnum.default('pending'),
  paymentStatus: paymentStatusEnum,
  driverName: optionalStringSchema(0, 255).optional(),
  driverPhone: phoneSchema.transform(val => sanitizePhone(val || '')),
  estimatedDeliveryTime: z.string().datetime().optional(),
  items: z.array(orderItemSchema).min(1),
});

export const updateOrderSchema = z.object({
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
  driverName: optionalStringSchema(0, 255).optional(),
  driverPhone: phoneSchema.optional(),
  customerNote: optionalStringSchema(0, 1000).optional(),
  estimatedDeliveryTime: z.string().datetime().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

// ============ User Validation ============
export const createUserSchema = z.object({
  username: stringSchema(1, 100),
  password: stringSchema(1, 255),
  name: stringSchema(1, 255),
  role: stringSchema(1, 50).default('admin'),
  isActive: booleanSchema.default(true),
});

export const updateUserSchema = z.object({
  password: stringSchema(1, 255).optional(),
  name: stringSchema(1, 255).optional(),
  role: stringSchema(1, 50).optional(),
  isActive: booleanSchema.optional(),
});

export const loginSchema = z.object({
  username: stringSchema(1, 100),
  password: stringSchema(1, 255),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ============ Validation Helper ============
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: z.ZodError;
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
