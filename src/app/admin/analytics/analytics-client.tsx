'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DailyStats, MenuStats } from '@/lib/types';

export const dynamic = 'force-dynamic';
import { cn } from '@/lib/utils';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, isPositive, colorClass }: any) => (
  <Card className="relative overflow-hidden bg-card border border-border/40 group hover:border-primary/40 transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <CardContent className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <Badge className={cn(
            "border-none font-accent text-[10px] px-2 py-0.5 rounded-full",
            isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend} {isPositive ? <ArrowUpRight className="w-3 h-3 ml-1 inline" /> : <TrendingDown className="w-3 h-3 ml-1 inline" />}
          </Badge>
        )}
      </div>
      <div>
        <p className="font-accent tracking-widest text-[10px] text-muted-foreground uppercase mb-1">{title}</p>
        <h3 className="font-display text-3xl text-foreground">{value}</h3>
        <p className="font-sans text-xs text-muted-foreground mt-2">{subtitle}</p>
      </div>
    </CardContent>
  </Card>
);

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [menuStats, setMenuStats] = useState<MenuStats[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-white/5 rounded-2xl w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map(i => <div key={i} className="h-[400px] bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const totalSales = dailyStats.reduce((sum: number, d: DailyStats) => sum + d.totalSales, 0);
  const totalOrders = dailyStats.reduce((sum: number, d: DailyStats) => sum + d.totalOrders, 0);
  const totalFees = dailyStats.reduce((sum: number, d: DailyStats) => sum + d.platformFees, 0);
  const netSales = dailyStats.reduce((sum: number, d: DailyStats) => sum + d.netSales, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-accent text-primary tracking-[0.4em] text-xs uppercase block mb-2">
            PERFORMANCE
          </span>
          <h2 className="font-display text-4xl text-foreground">
            In-depth <span className="text-primary">Analytics</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {(['week', 'month', 'year'] as const).map((p) => (
              <Button 
                key={p}
                variant="ghost" 
                size="sm"
                className={cn(
                  "font-accent text-[10px] tracking-widest uppercase h-9 px-4 rounded-lg transition-all",
                  period === p ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/5"
                )}
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="h-11 rounded-xl border-border/40 font-accent tracking-widest text-[10px] uppercase hover:bg-white/5">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Gross Sales" 
          value={formatCurrency(totalSales)} 
          subtitle="Based on selected period"
          icon={DollarSign}
          trend="+15%"
          isPositive={true}
          colorClass="text-primary"
        />
        <MetricCard 
          title="Total Orders" 
          value={`${totalOrders} ITEMS`} 
          subtitle="Order volume trend"
          icon={BarChart3}
          trend="+8%"
          isPositive={true}
          colorClass="text-blue-400"
        />
        <MetricCard 
          title="Platform Fees" 
          value={formatCurrency(totalFees)} 
          subtitle="Total commissions paid"
          icon={Calendar}
          trend="-5%"
          isPositive={false}
          colorClass="text-red-400"
        />
        <MetricCard 
          title="Net Profit" 
          value={formatCurrency(netSales)} 
          subtitle="Revenue after all deductions"
          icon={TrendingUp}
          trend="+18%"
          isPositive={true}
          colorClass="text-accent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border/40">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Revenue vs Profit</CardTitle>
            <CardDescription className="font-sans text-xs">Comparative trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 55 / 0.2)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate} 
                  className="font-accent text-[10px] text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} 
                  className="font-accent text-[10px] text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'oklch(0.14 0.015 55)', border: '1px solid oklch(0.25 0.02 55)', borderRadius: '12px' }}
                  itemStyle={{ fontFamily: 'var(--font-niramit)', fontSize: '12px' }}
                  labelStyle={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em', color: 'oklch(0.72 0.18 55)' }}
                />
                <Legend 
                  wrapperStyle={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.1em', fontSize: '10px', textTransform: 'uppercase', paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line type="monotone" dataKey="totalSales" stroke="oklch(0.72 0.18 55)" strokeWidth={3} name="GROSS REVENUE" dot={{ r: 4, strokeWidth: 2, fill: 'oklch(0.10 0.01 60)' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="netSales" stroke="oklch(0.65 0.20 40)" strokeWidth={3} name="NET PROFIT" dot={{ r: 4, strokeWidth: 2, fill: 'oklch(0.10 0.01 60)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Fee Distribution</CardTitle>
            <CardDescription className="font-sans text-xs">Daily platform commission tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 55 / 0.2)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate} 
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
                />
                <Bar dataKey="platformFees" fill="oklch(0.65 0.20 40 / 0.8)" radius={[4, 4, 0, 0]} name="FEES" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Menu Performance */}
      <Card className="bg-card border-border/40 overflow-hidden">
        <CardHeader className="border-b border-border/20 py-8">
          <CardTitle className="font-display text-2xl">Menu Performance</CardTitle>
          <CardDescription className="font-sans text-xs">Revenue and volume by item</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-border/20">
                  <th className="text-left py-4 px-8 font-accent tracking-widest text-[10px] uppercase">RANK</th>
                  <th className="text-left py-4 px-8 font-accent tracking-widest text-[10px] uppercase">ITEM</th>
                  <th className="text-right py-4 px-8 font-accent tracking-widest text-[10px] uppercase">VOLUME</th>
                  <th className="text-right py-4 px-8 font-accent tracking-widest text-[10px] uppercase">REVENUE</th>
                  <th className="text-right py-4 px-8 font-accent tracking-widest text-[10px] uppercase">SHARE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {menuStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-sans italic">
                      No data available for this period.
                    </td>
                  </tr>
                ) : (
                  menuStats.map((menu: MenuStats, index: number) => {
                    const percentage = totalSales > 0 ? (menu.revenue / totalSales) * 100 : 0;
                    return (
                      <tr key={menu.menuId} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-8">
                          <span className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full font-accent text-xs",
                            index === 0 ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground border border-white/10"
                          )}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-8 font-display text-lg text-foreground">{menu.name}</td>
                        <td className="py-4 px-8 text-right font-accent text-muted-foreground">{menu.totalSold}</td>
                        <td className="py-4 px-8 text-right font-accent text-primary text-lg">{formatCurrency(menu.revenue)}</td>
                        <td className="py-4 px-8 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="font-accent text-xs min-w-[40px]">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
