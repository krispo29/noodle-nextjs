'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock,
  MapPin,
  Phone,
  ChefHat,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  Eye,
  RefreshCw,
  type LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Order, OrderStatus, OrderItem } from '@/lib/types';
import { getOrders, updateOrder } from '@/lib/api-client';

// Status config
const statusConfig: Record<string, { color: string; bg: string; label: string; icon: LucideIcon }> = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'รอดำเนินการ', icon: Clock },
  accepted: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'รับออร์เดอร์', icon: CheckCircle },
  preparing: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'กำลังเตรียม', icon: ChefHat },
  ready: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'พร้อมส่ง', icon: Package },
  delivering: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'กำลังส่ง', icon: Truck },
  completed: { color: 'text-green-600', bg: 'bg-green-100', label: 'ส่งเรียบร้อย', icon: CheckCircle },
  cancelled: { color: 'text-red-600', bg: 'bg-red-100', label: 'ยกเลิก', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrders({ limit: 100 });
      // Cast status to OrderStatus to fix type compatibility
      const ordersWithTypedStatus = data.orders.map((order) => ({
        ...order,
        status: order.status as OrderStatus,
      }));
      setOrders(ordersWithTypedStatus);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Update order status with API call
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
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

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatTime = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Order count by status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">จัดการคำสั่งซื้อ</h2>
          <p className="text-muted-foreground">ติดตามและจัดการคำสั่งซื้อทั้งหมด</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="w-4 h-4 mr-2" />
          รีเฟรช
        </Button>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'ghost'}
          className="flex flex-col h-auto py-3"
          onClick={() => setStatusFilter('all')}
        >
          <span className="text-2xl font-bold">{orders.length}</span>
          <span className="text-xs">ทั้งหมด</span>
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'ghost'}
            className={`flex flex-col h-auto py-3 ${statusFilter === status ? '' : 'bg-white dark:bg-slate-800'}`}
            onClick={() => setStatusFilter(status)}
          >
            <span className={`text-2xl font-bold ${config.color}`}>
              {statusCounts[status] || 0}
            </span>
            <span className="text-xs truncate w-full">{config.label}</span>
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาเลขคำสั่งซื้อ หรือ ชื่อลูกค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          ตัวกรอง
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่คำสั่ง</TableHead>
                <TableHead>เวลา</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>ที่อยู่</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
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
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.customerPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm truncate max-w-[200px]">
                      {order.deliveryAddress}
                    </p>
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
                                {statusConfig[getNextStatus(order.status)!].label}
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
                          title={statusConfig[getNextStatus(order.status)!].label}
                        >
                          <ChefHat className="w-4 h-4" />
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
