'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { 
  Settings, 
  Store, 
  Clock, 
  Bell, 
  CreditCard,
  Users,
  Shield,
  Save,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const [shopSettings, setShopSettings] = useState({
    shopName: 'ร้านก๋วยเตี๋ยวเอก',
    phone: '02-123-4567',
    address: '123 ถนนสุขุมวิท กรุงเทพฯ',
    openTime: '10:00',
    closeTime: '21:00',
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    orderStatus: true,
    lowStock: false,
    dailyReport: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">ตั้งค่าระบบ</h2>
          <p className="text-muted-foreground">จัดการการตั้งค่าร้านค้าและระบบ</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              ข้อมูลร้านค้า
            </CardTitle>
            <CardDescription>ข้อมูลพื้นฐานของร้าน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shopName">ชื่อร้าน</Label>
              <Input 
                id="shopName" 
                value={shopSettings.shopName}
                onChange={(e) => setShopSettings({...shopSettings, shopName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input 
                id="phone" 
                value={shopSettings.phone}
                onChange={(e) => setShopSettings({...shopSettings, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="address">ที่อยู่</Label>
              <Input 
                id="address" 
                value={shopSettings.address}
                onChange={(e) => setShopSettings({...shopSettings, address: e.target.value})}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openTime">เวลาเปิด</Label>
                <Input 
                  id="openTime" 
                  type="time"
                  value={shopSettings.openTime}
                  onChange={(e) => setShopSettings({...shopSettings, openTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="closeTime">เวลาปิด</Label>
                <Input 
                  id="closeTime" 
                  type="time"
                  value={shopSettings.closeTime}
                  onChange={(e) => setShopSettings({...shopSettings, closeTime: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              การตั้งค่าคำสั่งซื้อ
            </CardTitle>
            <CardDescription>การตั้งค่าออเดอร์อัตโนมัติ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>รับออเดอร์อัตโนมัติ</Label>
                <p className="text-sm text-muted-foreground">รับออเดอร์โดยอัตโนมัติเมื่อมีคำสั่งซื้อเข้ามา</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>แจ้งเตือนเสียง</Label>
                <p className="text-sm text-muted-foreground">เสียงแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <Label>เวลาเตรียมอาหารโดยประมาณ (นาที)</Label>
              <Input type="number" defaultValue="15" className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              การแจ้งเตือน
            </CardTitle>
            <CardDescription>ตั้งค่าการแจ้งเตือน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>คำสั่งซื้อใหม่</Label>
                <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อมีคำสั่งซื้อใหม่</p>
              </div>
              <Switch 
                checked={notifications.newOrder}
                onCheckedChange={(checked) => setNotifications({...notifications, newOrder: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>เปลี่ยนสถานะคำสั่งซื้อ</Label>
                <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อสถานะคำสั่งซื้อเปลี่ยน</p>
              </div>
              <Switch 
                checked={notifications.orderStatus}
                onCheckedChange={(checked) => setNotifications({...notifications, orderStatus: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>สินค้าใกล้หมด</Label>
                <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อสินค้าใกล้หมด</p>
              </div>
              <Switch 
                checked={notifications.lowStock}
                onCheckedChange={(checked) => setNotifications({...notifications, lowStock: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>รายงานประจำวัน</Label>
                <p className="text-sm text-muted-foreground">ส่งรายงานยอดขายประจำวัน</p>
              </div>
              <Switch 
                checked={notifications.dailyReport}
                onCheckedChange={(checked) => setNotifications({...notifications, dailyReport: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              บัญชีผู้ดูแล
            </CardTitle>
            <CardDescription>จัดการบัญชีผู้ดูแลระบบ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>ชื่อผู้ใช้</Label>
              <Input defaultValue="admin" disabled className="mt-2" />
            </div>
            <div>
              <Label>เปลี่ยนรหัสผ่าน</Label>
              <Input type="password" placeholder="รหัสผ่านใหม่" className="mt-2" />
            </div>
            <div>
              <Label>ยืนยันรหัสผ่าน</Label>
              <Input type="password" placeholder="ยืนยันรหัสผ่าน" className="mt-2" />
            </div>
            <Button variant="outline" className="w-full">
              เปลี่ยนรหัสผ่าน
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            ข้อมูลแพลตฟอร์ม
          </CardTitle>
          <CardDescription>สถานะการเชื่อมต่อกับแพลตฟอร์ม Delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">L</span>
                </div>
                <div>
                  <p className="font-medium">Lineman</p>
                  <p className="text-sm text-muted-foreground">เชื่อมต่อแล้ว</p>
                </div>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">G</span>
                </div>
                <div>
                  <p className="font-medium">GrabFood</p>
                  <p className="text-sm text-muted-foreground">เชื่อมต่อแล้ว</p>
                </div>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">F</span>
                </div>
                <div>
                  <p className="font-medium">Foodpanda</p>
                  <p className="text-sm text-muted-foreground">ยังไม่เชื่อมต่อ</p>
                </div>
              </div>
              <Badge variant="outline">Inactive</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
