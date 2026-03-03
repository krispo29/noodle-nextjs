'use client';

import { useState } from 'react';
import { 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  CheckCircle,
  XCircle,
  Package,
  Bell,
  RefreshCw,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  calculateOrderSummary,
  Order,
  OrderStatus,
  OrderItem,
  DailyStats,
  MenuStats,
  HourlyStats
} from '@/lib/types';

// Status colors and labels
const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'รอดำเนินการ' },
  accepted: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'รับออร์เดอร์' },
  preparing: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'กำลังเตรียม' },
  ready: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'พร้อมส่ง' },
  delivering: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'กำลังส่ง' },
  completed: { color: 'text-green-600', bg: 'bg-green-100', label: 'ส่งเรียบร้อย' },
  cancelled: { color: 'text-red-600', bg: 'bg-red-100', label: 'ยกเลิก' },
};

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fff7ed'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [menuStats, setMenuStats] = useState<MenuStats[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrderNotification, setShowNewOrderNotification] = useState(true);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const summary = calculateOrderSummary(orders);
  const pendingOrders = orders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status));

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getNextStatus = (currentStatus: string): OrderStatus | null => {
    const flow: Record<string, OrderStatus> = {
      pending: 'accepted',
      accepted: 'preparing',
      preparing: 'ready',
      ready: 'delivering',
      delivering: 'completed',
    };
    return flow[currentStatus] || null;
  };

  return (
    <div className="space-y-6">
      {/* New Order Notification Banner */}
      {pendingOrders.length > 0 && showNewOrderNotification && (
        <div className="bg-gradient-500 to--to-r from-orangeamber-500 rounded-lg p-4 text-white shadow-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <div>
                <p className="font-bold text-lg">มีคำสั่งซื้อใหม่!</p>
                <p className="text-sm opacity-90">มี {pendingOrders.length} คำสั่งซื้อที่รอดำเนินการ</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => setShowNewOrderNotification(false)}
            >
              ปิด
            </Button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">คำสั่งซื้อทั้งหมด</p>
                <p className="text-3xl font-bold mt-1">{summary.totalOrders}</p>
                <p className="text-blue-100 text-xs mt-1">เสร็จสิ้น: {summary.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">ยอดขายรวม</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(summary.totalSales)}</p>
                <p className="text-green-100 text-xs mt-1">+12% จากเมื่อวาน</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">ค่าส่ง</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(summary.totalDeliveryFees)}</p>
                <p className="text-amber-100 text-xs mt-1">เฉลี่ย: {formatCurrency(summary.totalDeliveryFees / summary.totalOrders)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">ยอดสุทธิ</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(summary.netSales)}</p>
                <p className="text-purple-100 text-xs mt-1">หักค่าธรรมเนียม: {formatCurrency(summary.totalPlatformFees)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>ยอดขายรายวัน</CardTitle>
                <CardDescription>สถิติยอดขายในช่วง 7 วันที่ผ่านมา</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={timeRange === 'daily' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimeRange('daily')}
                >
                  วัน
                </Button>
                <Button 
                  variant={timeRange === 'weekly' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimeRange('weekly')}
                >
                  สัปดาห์
                </Button>
                <Button 
                  variant={timeRange === 'monthly' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimeRange('monthly')}
                >
                  เดือน
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                  className="text-xs"
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  className="text-xs"
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value) || 0), 'ยอดขาย']}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ช่วงเวลาที่มีคำสั่งซื้อมากที่สุด</CardTitle>
            <CardDescription>จำนวนคำสั่งซื้อแต่ละชั่วโมง</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(value) => `${value}:00`}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value) => [`${Number(value) || 0} คำสั่ง`, 'จำนวน']}
                  labelFormatter={(label) => `เวลา ${label}:00 - ${label + 1}:00`}
                />
                <Bar dataKey="orderCount" fill="#fb923c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Menu & Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>เมนูยอดนิยม</CardTitle>
            <CardDescription>อันดับเมนูที่ขายดีที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={menuStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="totalSold"
                  nameKey="name"
                  label={({ name, percent }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {dailyStats.map((entry: DailyStats, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${Number(value) || 0} จาน`, String(name) || '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {menuStats.slice(0, 3).map((menu: MenuStats, index: number) => (
                <div key={menu.menuId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{menu.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(menu.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ต้นทุนและกำไร</CardTitle>
            <CardDescription>วิเคราะห์ต้นทุนค่าใช้จ่าย</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyStats.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <YAxis dataKey="date" type="category" tickFormatter={(value) => formatDate(value)} width={80} />
                <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                <Bar dataKey="totalSales" fill="#22c55e" name="ยอดขาย" radius={[0, 4, 4, 0]} />
                <Bar dataKey="platformFees" fill="#ef4444" name="ค่าธรรมเนียม" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-600 dark:text-green-400 text-sm">กำไรเฉลี่ย/วัน</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(dailyStats.reduce((sum: number, d: DailyStats) => sum + d.netSales, 0) / dailyStats.length)}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">ค่าธรรมเนียมรวม</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(dailyStats.reduce((sum: number, d: DailyStats) => sum + d.platformFees, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
              <CardDescription>รายการคำสั่งซื้อจาก Lineman</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              รีเฟรช
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่คำสั่ง</TableHead>
                <TableHead>เวลา</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>รายการ</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 8).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {formatTime(order.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <p key={idx}>{item.name} x{item.quantity}</p>
                      ))}
                      {order.items && order.items.length > 2 && (
                        <p className="text-muted-foreground">+{order.items.length - 2} รายการ</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={`${statusConfig[order.status].bg} ${statusConfig[order.status].color} border-0`}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>รายละเอียดคำสั่งซื้อ</DialogTitle>
                            <DialogDescription>
                              เลขที่: {order.orderNumber}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge className={`${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].color} border-0`}>
                                  {statusConfig[selectedOrder.status].label}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">ลูกค้า</label>
                                  <p className="font-medium">{selectedOrder.customerName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">เบอร์โทร</label>
                                  <p className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {selectedOrder.customerPhone}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">ที่อยู่จัดส่ง</label>
                                <p className="flex items-start gap-1 text-sm">
                                  <MapPin className="w-3 h-3 mt-0.5" />
                                  {selectedOrder.deliveryAddress}
                                </p>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">รายการอาหาร</label>
                                <div className="space-y-2">
                                  {selectedOrder.items?.map((item: OrderItem, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                      <span>{item.name} x{item.quantity}</span>
                                      <span className="font-medium">{formatCurrency(Number(item.price) * item.quantity)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>ยอดรวม</span>
                                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ค่าส่ง</span>
                                  <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between text-red-500">
                                  <span>ส่วนลด</span>
                                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                  <span>ยอดสุทธิ</span>
                                  <span>{formatCurrency(selectedOrder.total)}</span>
                                </div>
                              </div>
                              
                              {selectedOrder.notes && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                                  <label className="text-sm font-medium text-amber-700 dark:text-amber-400">หมายเหตุ</label>
                                  <p className="text-sm">{selectedOrder.notes}</p>
                                </div>
                              )}
                              
                              {selectedOrder.driverName && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                  <label className="text-sm font-medium text-blue-700 dark:text-blue-400">ไรด์เลอร์</label>
                                  <p className="text-sm">{selectedOrder.driverName} - {selectedOrder.driverPhone}</p>
                                </div>
                              )}
                            </div>
                          )}
                          <DialogFooter>
                            {getNextStatus(order.status) && (
                              <Button 
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => {
                                  if (selectedOrder) {
                                    updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                                  }
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                ดำเนินการต่อ
                              </Button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'completed' && (
                              <Button 
                                variant="destructive"
                                onClick={() => {
                                  if (selectedOrder) {
                                    updateOrderStatus(selectedOrder.id, 'cancelled');
                                  }
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                ยกเลิก
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      {getNextStatus(order.status) && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-green-500 hover:text-green-600 hover:bg-green-50"
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                        >
                          <ChefHat className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {order.status === 'ready' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => updateOrderStatus(order.id, 'delivering')}
                        >
                          <Package className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
