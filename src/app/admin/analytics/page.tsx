'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Download
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
import { 
  mockDailyStats, 
  mockMenuStats, 
  mockHourlyStats 
} from '@/data/lineman-orders';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Calculate totals
  const totalSales = mockDailyStats.reduce((sum, d) => sum + d.totalSales, 0);
  const totalOrders = mockDailyStats.reduce((sum, d) => sum + d.totalOrders, 0);
  const totalFees = mockDailyStats.reduce((sum, d) => sum + d.platformFees, 0);
  const netSales = mockDailyStats.reduce((sum, d) => sum + d.netSales, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">วิเคราะห์ยอดขาย</h2>
          <p className="text-muted-foreground">ติดตามและวิเคราะห์ผลการดำเนินงาน</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPeriod('week')}>
            สัปดาห์
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPeriod('month')}>
            เดือน
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPeriod('year')}>
            ปี
          </Button>
          <Button variant="default" size="sm">
            <Download className="w-4 h-4 mr-2" />
            ส่งออก
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ยอดขายรวม</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% จากช่วงก่อน
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">จำนวนคำสั่งซื้อ</p>
                <p className="text-2xl font-bold">{totalOrders} รายการ</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% จากช่วงก่อน
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ค่าธรรมเนียม</p>
                <p className="text-2xl font-bold">{formatCurrency(totalFees)}</p>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  -5% จากช่วงก่อน
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">กำไรสุทธิ</p>
                <p className="text-2xl font-bold">{formatCurrency(netSales)}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% จากช่วงก่อน
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>แนวโน้มยอดขาย</CardTitle>
            <CardDescription>เปรียบเทียบยอดขายและกำไรสุทธิ</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockDailyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
                <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} className="text-xs" />
                <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                <Legend />
                <Line type="monotone" dataKey="totalSales" stroke="#f97316" strokeWidth={2} name="ยอดขาย" />
                <Line type="monotone" dataKey="netSales" stroke="#22c55e" strokeWidth={2} name="กำไรสุทธิ" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ค่าธรรมเนียมแพลตฟอร์ม</CardTitle>
            <CardDescription>ค่าธรรมเนียมรายวัน</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDailyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                <Bar dataKey="platformFees" fill="#ef4444" radius={[4, 4, 0, 0]} name="ค่าธรรมเนียม" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Menu Performance */}
      <Card>
        <CardHeader>
          <CardTitle>ประสิทธิภาพเมนู</CardTitle>
          <CardDescription>ยอดขายและรายได้ของแต่ละเมนู</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">อันดับ</th>
                  <th className="text-left py-3 px-4 font-medium">เมนู</th>
                  <th className="text-right py-3 px-4 font-medium">จำนวนที่ขาย</th>
                  <th className="text-right py-3 px-4 font-medium">รายได้</th>
                  <th className="text-right py-3 px-4 font-medium">สัดส่วน</th>
                </tr>
              </thead>
              <tbody>
                {mockMenuStats.map((menu, index) => {
                  const percentage = (menu.revenue / totalSales) * 100;
                  return (
                    <tr key={menu.menuId} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <Badge variant={index < 3 ? 'default' : 'outline'} className={index === 0 ? 'bg-yellow-500' : ''}>
                          #{index + 1}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">{menu.name}</td>
                      <td className="py-3 px-4 text-right">{menu.totalSold} จาน</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(menu.revenue)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
