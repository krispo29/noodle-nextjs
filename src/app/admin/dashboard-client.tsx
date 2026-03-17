'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Eye,
  ArrowUpRight,
  Wifi,
  WifiOff
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
import { cn } from '@/lib/utils';
import { useOrderStream } from '@/hooks/useOrderStream';
import { useToast } from '@/hooks/use-toast';
import { getAdminOrders, updateAdminOrderStatus } from '@/actions/admin-orders';

export const dynamic = 'force-dynamic';

// Status colors and labels
const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'PENDING' },
  accepted: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'ACCEPTED' },
  preparing: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'PREPARING' },
  ready: { color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'READY' },
  delivering: { color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'DELIVERING' },
  completed: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'COMPLETED' },
  cancelled: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'CANCELLED' },
};

const COLORS = ['oklch(0.72 0.18 55)', 'oklch(0.65 0.20 40)', 'oklch(0.45 0.15 35)', 'oklch(0.25 0.03 30)'];

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, colorClass }: any) => (
  <Card className="relative overflow-hidden bg-card border border-border/40 group hover:border-primary/40 transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <CardContent className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <Badge className="bg-green-500/10 text-green-500 border-none font-accent text-[10px]">
            {trend} <ArrowUpRight className="w-3 h-3 ml-1" />
          </Badge>
        )}
      </div>
      <div>
        <p className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase mb-1">{title}</p>
        <h3 className="font-display text-3xl text-foreground">{value}</h3>
        <p className="font-sans text-xs text-muted-foreground mt-2">{subtitle}</p>
      </div>
    </CardContent>
    {/* Gradient border effect */}
    <div className="absolute inset-0 border border-transparent group-hover:border-primary/20 rounded-lg pointer-events-none transition-all" />
  </Card>
);

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [menuStats, setMenuStats] = useState<MenuStats[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, lastEvent } = useOrderStream();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const summary = calculateOrderSummary(orders);
  const pendingOrders = orders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status));

  // Initial fetch
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchOrders();
    }
  }, [fetchOrders, isMounted]);

  // Handle new order events
  useEffect(() => {
    if (isMounted && lastEvent && lastEvent.type === 'new_order' && lastEvent.orderId !== 'connection') {
      // Show toast notification for new order
      toast({
        title: '🍜 ออเดอร์ใหม่!',
        description: `มีออเดอร์ใหม่เข้ามา (#${lastEvent.orderId.substring(0, 8)})`,
        duration: 5000,
      });

      // Refresh order list
      fetchOrders();
    } else if (isMounted && lastEvent && lastEvent.type === 'status_update' && lastEvent.orderId !== 'heartbeat' && lastEvent.orderId !== 'connection') {
      // Refresh list on status updates from other sources
      fetchOrders();
    }
  }, [lastEvent, toast, fetchOrders, isMounted]);

  if (!isMounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '฿0';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const result = await updateAdminOrderStatus(orderId, newStatus);
      if (result.success) {
        toast({
          title: 'สำเร็จ',
          description: `อัพเดตสถานะออเดอร์เป็น ${statusConfig[newStatus].label}`,
        });
        fetchOrders(); // Refresh to get updated data
      } else {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
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

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-accent text-primary tracking-[0.4em] text-xs uppercase block mb-2">
            OVERVIEW
          </span>
          <h2 className="font-display text-4xl text-foreground">
            Welcome back, <span className="text-primary">Admin</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Connection Indicator */}
          <Badge className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full border-none transition-all",
            isConnected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {isConnected ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-accent text-[10px] tracking-widest uppercase">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span className="font-accent text-[10px] tracking-widest uppercase">Disconnected</span>
              </>
            )}
          </Badge>

          {pendingOrders.length > 0 && (
            <div className="flex items-center gap-4 bg-accent/10 border border-accent/20 rounded-2xl px-6 py-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-accent animate-bounce" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
              </div>
              <div>
                <p className="font-accent tracking-widest text-[10px] text-accent uppercase leading-none mb-1">Incoming</p>
                <p className="font-display text-lg text-foreground leading-none">{pendingOrders.length} New Orders</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Orders" 
          value={summary.totalOrders} 
          subtitle={`Completed: ${summary.completedOrders}`}
          icon={ShoppingCart}
          colorClass="text-blue-400"
        />
        <MetricCard 
          title="Gross Sales" 
          value={formatCurrency(summary.totalSales)} 
          subtitle="+12.5% from yesterday"
          icon={DollarSign}
          trend="+12%"
          colorClass="text-primary"
        />
        <MetricCard 
          title="Delivery Fees" 
          value={formatCurrency(summary.totalDeliveryFees)} 
          subtitle={`Avg: ${formatCurrency(summary.totalOrders > 0 ? summary.totalDeliveryFees / summary.totalOrders : 0)}`}
          icon={Truck}
          colorClass="text-amber-400"
        />
        <MetricCard 
          title="Net Revenue" 
          value={formatCurrency(summary.netSales)} 
          subtitle={`Fees: ${formatCurrency(summary.totalPlatformFees)}`}
          icon={TrendingUp}
          colorClass="text-accent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="font-display text-2xl">Sales Analytics</CardTitle>
              <CardDescription className="font-sans text-xs">Revenue performance over time</CardDescription>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              {['daily', 'weekly', 'monthly'].map((r) => (
                <Button 
                  key={r}
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "font-accent text-[10px] tracking-widest uppercase h-8 px-3 rounded-md",
                    timeRange === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/5"
                  )}
                  onClick={() => setTimeRange(r as any)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 55 / 0.2)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                  className="font-accent text-[10px] text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  className="font-accent text-[10px] text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'oklch(0.14 0.015 55)', border: '1px solid oklch(0.25 0.02 55)', borderRadius: '12px' }}
                  itemStyle={{ fontFamily: 'var(--font-niramit)', fontSize: '12px' }}
                  labelStyle={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em', color: 'oklch(0.72 0.18 55)' }}
                  formatter={(value) => [formatCurrency(Number(value) || 0), 'REVENUE']}
                  labelFormatter={(label) => formatDate(label).toUpperCase()}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke="oklch(0.72 0.18 55)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Peak Hours</CardTitle>
            <CardDescription className="font-sans text-xs">Order distribution by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 55 / 0.2)" vertical={false} />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(value) => `${value}h`}
                  className="font-accent text-[10px] text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis className="font-accent text-[10px] text-muted-foreground" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'oklch(1 0 0 / 0.05)' }}
                  contentStyle={{ backgroundColor: 'oklch(0.14 0.015 55)', border: '1px solid oklch(0.25 0.02 55)', borderRadius: '12px' }}
                  itemStyle={{ fontFamily: 'var(--font-niramit)', fontSize: '12px' }}
                  labelStyle={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em', color: 'oklch(0.72 0.18 55)' }}
                  formatter={(value) => [`${Number(value) || 0} ORDERS`, 'COUNT']}
                />
                <Bar dataKey="orderCount" fill="oklch(0.65 0.20 40)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-card border-border/40 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 py-8">
          <div>
            <CardTitle className="font-display text-2xl">Recent Orders</CardTitle>
            <CardDescription className="font-sans text-xs">Latest transactions from your store</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl font-accent tracking-widest text-[10px] uppercase border-border/40 hover:bg-white/5"
            onClick={() => fetchOrders()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-3 h-3 mr-2", isLoading && "animate-spin")} />
            {isLoading ? 'REFRESHING...' : 'REFRESH'}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-transparent border-border/20">
                <TableHead className="font-accent tracking-widest text-[10px] uppercase h-12">ORDER ID</TableHead>
                <TableHead className="font-accent tracking-widest text-[10px] uppercase h-12">TIME</TableHead>
                <TableHead className="font-accent tracking-widest text-[10px] uppercase h-12">CUSTOMER</TableHead>
                <TableHead className="font-accent tracking-widest text-[10px] uppercase h-12">TOTAL</TableHead>
                <TableHead className="font-accent tracking-widest text-[10px] uppercase h-12">STATUS</TableHead>
                <TableHead className="font-accent tracking-widest text-[10px] uppercase h-12 text-right">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-sans italic">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.slice(0, 8).map((order) => (
                  <TableRow key={order.id} className="border-border/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-accent text-sm text-foreground">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
                        <Clock className="w-3 h-3" />
                        {formatTime(order.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-display text-base text-foreground leading-none mb-1">{order.customerName}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[150px] uppercase tracking-wider">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-accent text-lg text-primary">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge className={cn("rounded-full px-3 py-0.5 text-[9px] font-accent tracking-[0.1em] border-none shadow-sm", statusConfig[order.status].bg, statusConfig[order.status].color)}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" onClick={() => setSelectedOrder(order)}>
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg bg-card border-border/40">
                            {/* ... Dialog Content remains mostly same but styled for luxury ... */}
                            <DialogHeader>
                              <DialogTitle className="font-display text-2xl">Order Details</DialogTitle>
                              <DialogDescription className="font-accent tracking-widest text-xs uppercase text-muted-foreground">
                                REF: {order.orderNumber}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6 mt-4">
                                <div className="flex items-center justify-between">
                                  <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-accent tracking-[0.1em] border-none", statusConfig[selectedOrder.status].bg, statusConfig[selectedOrder.status].color)}>
                                    {statusConfig[selectedOrder.status].label}
                                  </Badge>
                                  <span className="font-accent text-muted-foreground text-xs uppercase">{formatDate(selectedOrder.createdAt as string)} {formatTime(selectedOrder.createdAt as string)}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <label className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase mb-2 block">CUSTOMER</label>
                                    <p className="font-display text-lg text-foreground">{selectedOrder.customerName}</p>
                                    <p className="flex items-center gap-2 text-sm text-primary font-sans mt-1">
                                      <Phone className="w-3 h-3" />
                                      {selectedOrder.customerPhone}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase mb-2 block">LOCATION</label>
                                    <p className="flex items-start gap-2 text-sm text-foreground font-sans leading-relaxed">
                                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                                      {selectedOrder.deliveryAddress}
                                    </p>
                                  </div>
                                </div>
                                
                                <Separator className="bg-border/20" />
                                
                                <div className="space-y-4">
                                  <label className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase mb-2 block">ORDER ITEMS</label>
                                  {selectedOrder.items?.map((item: OrderItem, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-accent text-xs">
                                          {item.quantity}x
                                        </div>
                                        <span className="font-display text-base group-hover:text-primary transition-colors">{item.name}</span>
                                      </div>
                                      <span className="font-accent text-lg">฿{Number(item.price) * item.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                                
                                <Separator className="bg-border/20" />
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-muted-foreground font-accent tracking-widest uppercase">
                                    <span>SUBTOTAL</span>
                                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground font-accent tracking-widest uppercase">
                                    <span>DELIVERY FEE</span>
                                    <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-red-400 font-accent tracking-widest uppercase">
                                    <span>DISCOUNT</span>
                                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                                  </div>
                                  <div className="flex justify-between font-display text-2xl pt-4 border-t border-border/20 text-primary">
                                    <span className="text-foreground">GRAND TOTAL</span>
                                    <span>{formatCurrency(selectedOrder.total)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0">
                              {getNextStatus(order.status) && (
                                <Button 
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-accent tracking-widest text-xs h-12 px-6 rounded-xl"
                                  onClick={() => {
                                    if (selectedOrder) {
                                      updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                                    }
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  PROCEED TO {statusConfig[getNextStatus(order.status)!].label}
                                </Button>
                              )}
                              {order.status !== 'cancelled' && order.status !== 'completed' && (
                                <Button 
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10 font-accent tracking-widest text-xs h-12 px-6 rounded-xl"
                                  onClick={() => {
                                    if (selectedOrder) {
                                      updateOrderStatus(selectedOrder.id, 'cancelled');
                                    }
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  CANCEL ORDER
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {getNextStatus(order.status) && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="rounded-full text-primary hover:bg-primary/10"
                            onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                          >
                            <ChefHat className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
