'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft,
  ToggleRight,
  DollarSign,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { mockMenuStats } from '@/lib/mock-data';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  soldCount: number;
}

// Extended menu with mock data
const initialMenuItems: MenuItem[] = [
  { id: '1', name: 'ก๋วยเตี๋ยวเนื้อ', description: 'ก๋วยเตี๋ยวเนื้อวัวสดใหม่ น้ำซุปเข้มข้น', price: 60, category: 'ก๋วยเตี๋ยว', available: true, soldCount: 156 },
  { id: '2', name: 'ก๋วยเตี๋ยวต้มยำ', description: 'ก๋วยเตี๋ยวรสชาติจัดจ้าน ต้มยำร้อน', price: 65, category: 'ก๋วยเตี๋ยว', available: true, soldCount: 89 },
  { id: '3', name: 'ก๋วยเตี๋ยวไก่', description: 'ก๋วยเตี๋ยวเนื้อไก่ น้ำซุปใส', price: 55, category: 'ก๋วยเตี๋ยว', available: true, soldCount: 124 },
  { id: '4', name: 'ลูกชิ้นปิ้ง', description: 'ลูกชิ้นปิ้งสดใหม่ 5 เหล่า', price: 15, category: 'อื่นๆ', available: true, soldCount: 200 },
  { id: '5', name: 'น้ำแข็งใส', description: 'น้ำแข็งใสผลไม้สด', price: 15, category: 'เครื่องดื่ม', available: true, soldCount: 180 },
  { id: '6', name: 'ข้าวไก่เทศ', description: 'ข้าวไก่เทศราดซอสพิเศษ', price: 49, category: 'อาหารจานเดียว', available: false, soldCount: 45 },
  { id: '7', name: 'น้ำเต้าหู้', description: 'น้ำเต้าหู้เย็นหวานน้อย', price: 20, category: 'เครื่องดื่ม', available: true, soldCount: 95 },
  { id: '8', name: 'น้ำมะตูม', description: 'น้ำมะตูมสดชื่น', price: 25, category: 'เครื่องดื่ม', available: true, soldCount: 67 },
];

const categories = ['ทั้งหมด', 'ก๋วยเตี๋ยว', 'อาหารจานเดียว', 'เครื่องดื่ม', 'อื่นๆ'];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ทั้งหมด');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'ก๋วยเตี๋ยว',
    available: true,
  });

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ทั้งหมด' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Toggle availability
  const toggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  // Delete item
  const deleteItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // Save edit
  const saveEdit = () => {
    if (editingItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
    }
  };

  // Add new item
  const addNewItem = () => {
    if (newItem.name && newItem.price) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        description: newItem.description || '',
        price: newItem.price,
        category: newItem.category || 'ก๋วยเตี๋ยว',
        available: newItem.available ?? true,
        soldCount: 0,
      };
      setMenuItems(prev => [...prev, item]);
      setNewItem({ name: '', description: '', price: 0, category: 'ก๋วยเตี๋ยว', available: true });
      setIsAddDialogOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">จัดการเมนู</h2>
          <p className="text-muted-foreground">เพิ่ม แก้ไข หรือลบเมนูอาหาร</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มเมนูใหม่
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มเมนูใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลเมนูอาหารใหม่
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อเมนู</Label>
                <Input 
                  id="name" 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="เช่น ก๋วยเตี๋ยวเนื้อ"
                />
              </div>
              <div>
                <Label htmlFor="description">รายละเอียด</Label>
                <Textarea 
                  id="description"
                  value={newItem.description} 
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="รายละเอียดเมนู..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">ราคา (บาท)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={newItem.price} 
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">หมวดหมู่</Label>
                  <select 
                    id="category"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="available">เปิดให้สั่งซื้อ</Label>
                <Switch 
                  id="available"
                  checked={newItem.available}
                  onCheckedChange={(checked: boolean) => setNewItem({...newItem, available: checked})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ยกเลิก</Button>
              <Button onClick={addNewItem}>บันทึก</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <div className="text-sm text-muted-foreground">เมนูทั้งหมด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {menuItems.filter(i => i.available).length}
            </div>
            <div className="text-sm text-muted-foreground">พร้อมสั่ง</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {menuItems.filter(i => !i.available).length}
            </div>
            <div className="text-sm text-muted-foreground">หมด/ปิด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatCurrency(menuItems.reduce((sum, i) => sum + i.price, 0) / menuItems.length)}
            </div>
            <div className="text-sm text-muted-foreground">ราคาเฉลี่ย</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาเมนู..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card key={item.id} className={!item.available ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <Switch 
                  checked={item.available}
                  onCheckedChange={() => toggleAvailability(item.id)}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-orange-600">{formatCurrency(item.price)}</span>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>แก้ไขเมนู</DialogTitle>
                      </DialogHeader>
                      {editingItem && (
                        <div className="space-y-4">
                          <div>
                            <Label>ชื่อเมนู</Label>
                            <Input 
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>รายละเอียด</Label>
                            <Textarea 
                              value={editingItem.description}
                              onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>ราคา</Label>
                              <Input 
                                type="number"
                                value={editingItem.price}
                                onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                              />
                            </div>
                            <div>
                              <Label>หมวดหมู่</Label>
                              <select 
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                              >
                                {categories.slice(1).map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingItem(null)}>ยกเลิก</Button>
                        <Button onClick={saveEdit}>บันทึก</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                ขายแล้ว: {item.soldCount} จาน
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">ไม่พบเมนูที่ค้นหา</p>
        </div>
      )}
    </div>
  );
}
