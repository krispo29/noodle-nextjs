'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreHorizontal
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
import { 
  getAdminMenuItems, 
  getAdminCategories, 
  getAdminCategoryGroups,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  createCategory,
  createCategoryGroup
} from '@/actions/admin-menu';
import { 
  getMenuItemOptions, 
  createOptionGroup, 
  createMenuOption 
} from '@/actions/admin-menu';

interface MenuItemAdmin {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  isRecommended: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime: number;
  sortOrder: number;
  categoryId: string;
  categoryName: string | null;
  categoryGroupName: string | null;
}

interface CategoryGroupAdmin {
  id: string;
  name: string;
  slug: string;
}

interface CategoryAdmin {
  id: string;
  name: string;
  groupId: string;
  groupName: string | null;
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItemAdmin[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroupAdmin[]>([]);
  const [categories, setCategories] = useState<CategoryAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');
  
  // Add/Edit Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemAdmin | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    basePrice: '',
    categoryId: '',
    imageUrl: '',
    isRecommended: false,
    isSpicy: false,
    isAvailable: true,
    preparationTime: 15,
  });

  // Category Dialog
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    groupId: '',
    description: '',
  });

  // Category Group Dialog
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [items, groups, cats] = await Promise.all([
        getAdminMenuItems(),
        getAdminCategoryGroups(),
        getAdminCategories()
      ]);
      
      setMenuItems(items as MenuItemAdmin[]);
      setCategoryGroups(groups);
      setCategories(cats as CategoryAdmin[]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter menu items
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(i => i.isAvailable).length;
  const unavailableItems = totalItems - availableItems;

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Handlers
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.basePrice || !newItem.categoryId) return;
    
    const result = await createMenuItem({
      name: newItem.name,
      description: newItem.description || undefined,
      basePrice: newItem.basePrice,
      categoryId: newItem.categoryId,
      imageUrl: newItem.imageUrl || undefined,
      isRecommended: newItem.isRecommended,
      isSpicy: newItem.isSpicy,
      isAvailable: newItem.isAvailable,
      preparationTime: newItem.preparationTime,
    });

    if (result.success) {
      loadData();
      setIsAddDialogOpen(false);
      setNewItem({
        name: '',
        description: '',
        basePrice: '',
        categoryId: '',
        imageUrl: '',
        isRecommended: false,
        isSpicy: false,
        isAvailable: true,
        preparationTime: 15,
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    
    const result = await updateMenuItem(editingItem.id, {
      name: editingItem.name,
      description: editingItem.description || undefined,
      basePrice: editingItem.basePrice,
      categoryId: editingItem.categoryId,
      imageUrl: editingItem.imageUrl || undefined,
      isRecommended: editingItem.isRecommended,
      isSpicy: editingItem.isSpicy,
      isAvailable: editingItem.isAvailable,
      preparationTime: editingItem.preparationTime,
    });

    if (result.success) {
      loadData();
      setEditingItem(null);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    const result = await toggleMenuItemAvailability(id);
    if (result.success) {
      loadData();
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('คุณต้องการลบเมนูนี้ใช่หรือไม่?')) return;
    
    const result = await deleteMenuItem(id);
    if (result.success) {
      loadData();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug || !newCategory.groupId) return;
    
    const result = await createCategory({
      name: newCategory.name,
      slug: newCategory.slug,
      groupId: newCategory.groupId,
      description: newCategory.description || undefined,
    });

    if (result.success) {
      loadData();
      setIsCategoryDialogOpen(false);
      setNewCategory({ name: '', slug: '', groupId: '', description: '' });
    }
  };

  const handleAddGroup = async () => {
    if (!newGroup.name || !newGroup.slug) return;
    
    const result = await createCategoryGroup({
      name: newGroup.name,
      slug: newGroup.slug,
      description: newGroup.description || undefined,
    });

    if (result.success) {
      loadData();
      setIsGroupDialogOpen(false);
      setNewGroup({ name: '', slug: '', description: '' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">จัดการเมนู</h2>
          <p className="text-muted-foreground">เพิ่ม แก้ไข หรือลบเมนูอาหาร</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'menu' ? 'default' : 'outline'}
            onClick={() => setActiveTab('menu')}
          >
            เมนูอาหาร
          </Button>
          <Button 
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            หมวดหมู่
          </Button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{totalItems}</div>
                <div className="text-sm text-muted-foreground">เมนูทั้งหมด</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{availableItems}</div>
                <div className="text-sm text-muted-foreground">พร้อมสั่ง</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{unavailableItems}</div>
                <div className="text-sm text-muted-foreground">หมด/ปิด</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {formatCurrency(menuItems.reduce((sum, i) => sum + parseFloat(i.basePrice), 0) / (totalItems || 1))}
                </div>
                <div className="text-sm text-muted-foreground">ราคาเฉลี่ย</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add */}
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มเมนูใหม่
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>เพิ่มเมนูใหม่</DialogTitle>
                  <DialogDescription>
                    กรอกข้อมูลเมนูอาหารใหม่
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <Label htmlFor="name">ชื่อเมนู *</Label>
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
                      placeholder="รายละเเอียดเมนู..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">ราคา (บาท) *</Label>
                      <Input 
                        id="price" 
                        type="number"
                        value={newItem.basePrice} 
                        onChange={(e) => setNewItem({...newItem, basePrice: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">หมวดหมู่ *</Label>
                      <select 
                        id="category"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={newItem.categoryId}
                        onChange={(e) => setNewItem({...newItem, categoryId: e.target.value})}
                      >
                        <option value="">เลือกหมวดหมู่</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.groupName} - {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">URL รูปภาพ</Label>
                    <Input 
                      id="imageUrl" 
                      value={newItem.imageUrl} 
                      onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="recommended">เมนูแนะนำ</Label>
                      <Switch 
                        id="recommended"
                        checked={newItem.isRecommended}
                        onCheckedChange={(checked: boolean) => setNewItem({...newItem, isRecommended: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="spicy">เผ็ด</Label>
                      <Switch 
                        id="spicy"
                        checked={newItem.isSpicy}
                        onCheckedChange={(checked: boolean) => setNewItem({...newItem, isSpicy: checked})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="available">เปิดให้สั่งซื้อ</Label>
                    <Switch 
                      id="available"
                      checked={newItem.isAvailable}
                      onCheckedChange={(checked: boolean) => setNewItem({...newItem, isAvailable: checked})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ยกเลิก</Button>
                  <Button onClick={handleAddItem}>บันทึก</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Menu Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">ชื่อเมนู</th>
                      <th className="text-left p-4 font-medium">หมวดหมู่</th>
                      <th className="text-left p-4 font-medium">ราคา</th>
                      <th className="text-center p-4 font-medium">สถานะ</th>
                      <th className="text-center p-4 font-medium">ตัวเลือก</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      <tr key={item.id} className="border-t hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs text-muted-foreground">ไม่มีรูป</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {item.name}
                                {item.isSpicy && <Badge variant="destructive" className="text-xs">เผ็ด</Badge>}
                                {item.isRecommended && <Badge className="bg-amber-500 text-xs">แนะนำ</Badge>}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{item.categoryName}</div>
                            <div className="text-muted-foreground text-xs">{item.categoryGroupName}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-orange-600">{formatCurrency(item.basePrice)}</span>
                        </td>
                        <td className="p-4 text-center">
                          <Switch 
                            checked={item.isAvailable}
                            onCheckedChange={() => handleToggleAvailability(item.id)}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-1 justify-center">
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
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>แก้ไขเมนู</DialogTitle>
                                </DialogHeader>
                                {editingItem && (
                                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                    <div>
                                      <Label>ชื่อเมนู *</Label>
                                      <Input 
                                        value={editingItem.name}
                                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label>รายละเอียด</Label>
                                      <Textarea 
                                        value={editingItem.description || ''}
                                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>ราคา *</Label>
                                        <Input 
                                          type="number"
                                          value={editingItem.basePrice}
                                          onChange={(e) => setEditingItem({...editingItem, basePrice: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label>หมวดหมู่</Label>
                                        <select 
                                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                                          value={editingItem.categoryId}
                                          onChange={(e) => setEditingItem({...editingItem, categoryId: e.target.value})}
                                        >
                                          {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.groupName} - {cat.name}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="flex gap-4">
                                      <div className="flex items-center gap-2">
                                        <Switch 
                                          checked={editingItem.isRecommended}
                                          onCheckedChange={(checked: boolean) => setEditingItem({...editingItem, isRecommended: checked})}
                                        />
                                        <Label>แนะนำ</Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Switch 
                                          checked={editingItem.isSpicy}
                                          onCheckedChange={(checked: boolean) => setEditingItem({...editingItem, isSpicy: checked})}
                                        />
                                        <Label>เผ็ด</Label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingItem(null)}>ยกเลิก</Button>
                                  <Button onClick={handleUpdateItem}>บันทึก</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ไม่พบเมนู</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Category Management */}
          <div className="flex gap-4 mb-6">
            <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มกลุ่มหมวดหมู่
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มกลุ่มหมวดหมู่</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>ชื่อกลุ่ม</Label>
                    <Input 
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      placeholder="เช่น เมนูก๋วยเตี๋ยว"
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input 
                      value={newGroup.slug}
                      onChange={(e) => setNewGroup({...newGroup, slug: e.target.value})}
                      placeholder="เช่น noodle"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>ยกเลิก</Button>
                  <Button onClick={handleAddGroup}>บันทึก</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มหมวดหมู่
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มหมวดหมู่</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>ชื่อหมวดหมู่</Label>
                    <Input 
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="เช่น ก๋วยเตี๋ยวน้ำ"
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input 
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                      placeholder="เช่น noodle-soup"
                    />
                  </div>
                  <div>
                    <Label>กลุ่มหมวดหมู่</Label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={newCategory.groupId}
                      onChange={(e) => setNewCategory({...newCategory, groupId: e.target.value})}
                    >
                      <option value="">เลือกกลุ่ม</option>
                      {categoryGroups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>ยกเลิก</Button>
                  <Button onClick={handleAddCategory}>บันทึก</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category Groups */}
          <div className="space-y-6">
            {categoryGroups.map(group => (
              <Card key={group.id}>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .filter(cat => cat.groupId === group.id)
                      .map(cat => (
                        <Badge key={cat.id} variant="outline" className="px-4 py-2">
                          {cat.name}
                        </Badge>
                      ))}
                    {categories.filter(cat => cat.groupId === group.id).length === 0 && (
                      <span className="text-muted-foreground text-sm">ยังไม่มีหมวดหมู่</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
