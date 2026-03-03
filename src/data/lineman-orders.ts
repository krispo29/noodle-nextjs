/**
 * Mock Data for Lineman Orders
 * ข้อมูลจำลองสำหรับคำสั่งซื้อจาก Lineman
 */

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  platform: 'lineman' | 'grab' | 'foodpanda';
  createdAt: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  driverName?: string;
  driverPhone?: string;
  notes?: string;
  estimatedDeliveryTime?: string;
}

export interface DailyStats {
  date: string;
  totalOrders: number;
  totalSales: number;
  deliveryFees: number;
  platformFees: number;
  netSales: number;
}

export interface MenuStats {
  menuId: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface HourlyStats {
  hour: number;
  orderCount: number;
  totalSales: number;
}

// Generate mock orders
export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'LM-2026-0303-001',
    platform: 'lineman',
    createdAt: '2026-03-03T11:30:00',
    status: 'completed',
    customerName: 'สมชาย ใจดี',
    customerPhone: '081-234-5678',
    deliveryAddress: '123 ถนนสุขุมวิท แขวงสุขุมวิท เขตวัฒนา กรุงเทพฯ 10110',
    items: [
      { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', quantity: 2, price: 60, notes: 'น้ำซุปเย็น' },
      { id: '2', name: 'น้ำเต้าหู้', quantity: 2, price: 20 },
    ],
    subtotal: 160,
    deliveryFee: 35,
    platformFee: 16,
    discount: 0,
    total: 195,
    driverName: 'พี่แทน',
    driverPhone: '089-123-4567',
    notes: 'ไม่ใส่ถั่วงอก',
  },
  {
    id: 'ord-002',
    orderNumber: 'LM-2026-0303-002',
    platform: 'lineman',
    createdAt: '2026-03-03T12:15:00',
    status: 'delivering',
    customerName: 'สมหญิง รักเรา',
    customerPhone: '082-345-6789',
    deliveryAddress: '45 ซอยสุขุมวิท 23 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    items: [
      { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', quantity: 1, price: 60 },
      { id: '3', name: 'ก๋วยเตี๋ยวไก่', quantity: 1, price: 55 },
      { id: '4', name: 'ลูกชิ้นปิ้ง', quantity: 2, price: 15 },
    ],
    subtotal: 145,
    deliveryFee: 35,
    platformFee: 14.5,
    discount: 20,
    total: 160,
    driverName: 'พี่โจ',
    driverPhone: '089-234-5678',
    estimatedDeliveryTime: '12:45',
  },
  {
    id: 'ord-003',
    orderNumber: 'LM-2026-0303-003',
    platform: 'lineman',
    createdAt: '2026-03-03T12:45:00',
    status: 'preparing',
    customerName: 'วิชัย มาดี',
    customerPhone: '083-456-7890',
    deliveryAddress: '78 ถนนเพลินจิต แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330',
    items: [
      { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', quantity: 3, price: 60 },
      { id: '5', name: 'น้ำแข็งใส', quantity: 3, price: 15 },
    ],
    subtotal: 225,
    deliveryFee: 35,
    platformFee: 22.5,
    discount: 0,
    total: 260,
    estimatedDeliveryTime: '13:15',
    notes: 'แยกน้ำซุป',
  },
  {
    id: 'ord-004',
    orderNumber: 'LM-2026-0303-004',
    platform: 'lineman',
    createdAt: '2026-03-03T13:00:00',
    status: 'accepted',
    customerName: 'นภา ใส่ใจ',
    customerPhone: '084-567-8901',
    deliveryAddress: '99 ซอยราชดำเนิน แขวงตลาดยอด เขตพระนคร กรุงเทพฯ 10200',
    items: [
      { id: '3', name: 'ก๋วยเตี๋ยวไก่', quantity: 2, price: 55 },
      { id: '6', name: 'ข้าวไก่เทศ', quantity: 1, price: 49 },
    ],
    subtotal: 159,
    deliveryFee: 35,
    platformFee: 15.9,
    discount: 0,
    total: 194,
    estimatedDeliveryTime: '13:30',
  },
  {
    id: 'ord-005',
    orderNumber: 'LM-2026-0303-005',
    platform: 'lineman',
    createdAt: '2026-03-02T18:30:00',
    status: 'completed',
    customerName: 'ธนกฤต ห่วงใย',
    customerPhone: '085-678-9012',
    deliveryAddress: '111 ถนนพระราม 4 แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    items: [
      { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', quantity: 1, price: 60 },
      { id: '7', name: 'น้ำมะตูม', quantity: 1, price: 25 },
    ],
    subtotal: 85,
    deliveryFee: 35,
    platformFee: 8.5,
    discount: 10,
    total: 110,
    driverName: 'พี่ต้น',
    driverPhone: '089-345-6789',
  },
  {
    id: 'ord-006',
    orderNumber: 'LM-2026-0302-006',
    platform: 'lineman',
    createdAt: '2026-03-02T19:15:00',
    status: 'completed',
    customerName: 'พิมพ์ชนก น่ารัก',
    customerPhone: '086-789-0123',
    deliveryAddress: '222 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    items: [
      { id: '2', name: 'ก๋วยเตี๋ยวต้มยำ', quantity: 2, price: 65 },
      { id: '8', name: 'สาดข้าว', quantity: 2, price: 10 },
    ],
    subtotal: 150,
    deliveryFee: 35,
    platformFee: 15,
    discount: 0,
    total: 185,
    driverName: 'พี่โจ',
    driverPhone: '089-234-5678',
    notes: 'เผ็ดน้อย',
  },
  {
    id: 'ord-007',
    orderNumber: 'LM-2026-0301-007',
    platform: 'lineman',
    createdAt: '2026-03-01T12:00:00',
    status: 'completed',
    customerName: 'อรุณ สว่าง',
    customerPhone: '087-890-1234',
    deliveryAddress: '50 ซอยสุขุมวิท 39 แขวงพระโขนง เขตคลองเตย กรุงเทพฯ 10110',
    items: [
      { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', quantity: 4, price: 60 },
      { id: '4', name: 'ลูกชิ้นปิ้ง', quantity: 4, price: 15 },
      { id: '9', name: 'น้ำส้ม', quantity: 2, price: 20 },
    ],
    subtotal: 310,
    deliveryFee: 35,
    platformFee: 31,
    discount: 30,
    total: 315,
    driverName: 'พี่แทน',
    driverPhone: '089-123-4567',
  },
  {
    id: 'ord-008',
    orderNumber: 'LM-2026-0301-008',
    platform: 'lineman',
    createdAt: '2026-03-01T19:30:00',
    status: 'cancelled',
    customerName: 'สุภาพร สุขสันติ',
    customerPhone: '088-901-2345',
    deliveryAddress: '88 ถนนพระราม 3 แขวงช่องนนทรี เขตยานนาวา กรุงเทพฯ 10120',
    items: [
      { id: '3', name: 'ก๋วยเตี๋ยวไก่', quantity: 2, price: 55 },
    ],
    subtotal: 110,
    deliveryFee: 35,
    platformFee: 11,
    discount: 0,
    total: 145,
    notes: 'ลูกค้ายกเลิก - ไม่รับสาย',
  },
  {
    id: 'ord-009',
    orderNumber: 'LM-2026-0228-009',
    platform: 'lineman',
    createdAt: '2026-02-28T18:00:00',
    status: 'completed',
    customerName: 'กิตติ ทองดี',
    customerPhone: '089-012-3456',
    deliveryAddress: '30 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
    items: [
      { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', quantity: 2, price: 60 },
      { id: '2', name: 'ก๋วยเตี๋ยวต้มยำ', quantity: 1, price: 65 },
      { id: '10', name: 'ขนมครก', quantity: 3, price: 10 },
    ],
    subtotal: 205,
    deliveryFee: 35,
    platformFee: 20.5,
    discount: 0,
    total: 240,
    driverName: 'พี่ต้น',
    driverPhone: '089-345-6789',
  },
  {
    id: 'ord-010',
    orderNumber: 'LM-2026-0228-010',
    platform: 'lineman',
    createdAt: '2026-02-28T20:00:00',
    status: 'completed',
    customerName: 'ปิยะ มีสุข',
    customerPhone: '090-123-4567',
    deliveryAddress: '66 ถนนเจริญกรุง แขวงบางรัก เขตบางรัก กรุงเทพฯ 10500',
    items: [
      { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', quantity: 3, price: 60 },
    ],
    subtotal: 180,
    deliveryFee: 35,
    platformFee: 18,
    discount: 15,
    total: 200,
    driverName: 'พี่โจ',
    driverPhone: '089-234-5678',
  },
];

// Daily statistics for the past 7 days
export const mockDailyStats: DailyStats[] = [
  { date: '2026-02-28', totalOrders: 15, totalSales: 4200, deliveryFees: 525, platformFees: 420, netSales: 3255 },
  { date: '2026-03-01', totalOrders: 22, totalSales: 5800, deliveryFees: 770, platformFees: 580, netSales: 4450 },
  { date: '2026-03-02', totalOrders: 18, totalSales: 4900, deliveryFees: 630, platformFees: 490, netSales: 3780 },
  { date: '2026-03-03', totalOrders: 12, totalSales: 3400, deliveryFees: 420, platformFees: 340, netSales: 2640 },
  { date: '2026-02-27', totalOrders: 20, totalSales: 5500, deliveryFees: 700, platformFees: 550, netSales: 4250 },
  { date: '2026-02-26', totalOrders: 25, totalSales: 6800, deliveryFees: 875, platformFees: 680, netSales: 5245 },
  { date: '2026-02-25', totalOrders: 19, totalSales: 5100, deliveryFees: 665, platformFees: 510, netSales: 3925 },
];

// Menu statistics
export const mockMenuStats: MenuStats[] = [
  { menuId: '1', name: 'ก๋วยเตี๋ยวเนื้อ', totalSold: 156, revenue: 9360 },
  { menuId: '2', name: 'ก๋วยเตี๋ยวต้มยำ', totalSold: 89, revenue: 5785 },
  { menuId: '3', name: 'ก๋วยเตี๋ยวไก่', totalSold: 124, revenue: 6820 },
  { menuId: '4', name: 'ลูกชิ้นปิ้ง', totalSold: 200, revenue: 3000 },
  { menuId: '5', name: 'น้ำแข็งใส', totalSold: 180, revenue: 2700 },
  { menuId: '6', name: 'ข้าวไก่เทศ', totalSold: 45, revenue: 2205 },
];

// Hourly order distribution
export const mockHourlyStats: HourlyStats[] = [
  { hour: 10, orderCount: 3, totalSales: 450 },
  { hour: 11, orderCount: 12, totalSales: 2100 },
  { hour: 12, orderCount: 28, totalSales: 4900 },
  { hour: 13, orderCount: 22, totalSales: 3800 },
  { hour: 14, orderCount: 10, totalSales: 1750 },
  { hour: 15, orderCount: 5, totalSales: 850 },
  { hour: 16, orderCount: 8, totalSales: 1400 },
  { hour: 17, orderCount: 15, totalSales: 2700 },
  { hour: 18, orderCount: 32, totalSales: 5800 },
  { hour: 19, orderCount: 25, totalSales: 4500 },
  { hour: 20, orderCount: 15, totalSales: 2700 },
  { hour: 21, orderCount: 5, totalSales: 900 },
];

// Admin credentials (mock)
export const adminCredentials = {
  username: 'admin',
  password: 'admin123',
  name: 'ผู้ดูแลระบบ',
  role: 'admin',
};

// Helper function to calculate summary
export function calculateOrderSummary(orders: Order[]) {
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDeliveryFees = orders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const totalPlatformFees = orders.reduce((sum, o) => sum + o.platformFee, 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + o.discount, 0);
  const netSales = totalSales - totalPlatformFees - totalDiscounts + totalDeliveryFees;

  return {
    totalOrders,
    completedOrders: completedOrders.length,
    totalSales,
    totalDeliveryFees,
    totalPlatformFees,
    totalDiscounts,
    netSales,
  };
}
