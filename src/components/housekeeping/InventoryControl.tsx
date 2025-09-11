import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Plus,
  Minus,
  RotateCcw,
  ShoppingCart,
  Box,
  Shirt,
  Sparkles,
  Droplets
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'linen' | 'amenities' | 'cleaning' | 'maintenance';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  cost: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  autoReorder: boolean;
  usage: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface RestockRequest {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  urgency: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'ordered' | 'received';
  requestedBy: string;
  requestedAt: string;
  notes?: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Sábanas Individuales',
    category: 'linen',
    currentStock: 45,
    minStock: 30,
    maxStock: 100,
    unit: 'unidades',
    location: 'Almacén A-2',
    cost: 25.50,
    supplier: 'Textiles Premium',
    lastRestocked: '2024-01-10',
    autoReorder: true,
    usage: { daily: 8, weekly: 56, monthly: 240 }
  },
  {
    id: '2',
    name: 'Toallas de Baño',
    category: 'linen',
    currentStock: 28,
    minStock: 40,
    maxStock: 120,
    unit: 'unidades',
    location: 'Almacén A-3',
    cost: 15.75,
    supplier: 'Textiles Premium',
    lastRestocked: '2024-01-08',
    autoReorder: true,
    usage: { daily: 12, weekly: 84, monthly: 360 }
  },
  {
    id: '3',
    name: 'Shampoo Individual',
    category: 'amenities',
    currentStock: 85,
    minStock: 50,
    maxStock: 200,
    unit: 'unidades',
    location: 'Almacén B-1',
    cost: 2.30,
    supplier: 'Hotel Amenities Co.',
    lastRestocked: '2024-01-12',
    expiryDate: '2025-06-15',
    autoReorder: true,
    usage: { daily: 15, weekly: 105, monthly: 450 }
  },
  {
    id: '4',
    name: 'Desinfectante Multiusos',
    category: 'cleaning',
    currentStock: 12,
    minStock: 20,
    maxStock: 60,
    unit: 'litros',
    location: 'Almacén C-1',
    cost: 8.90,
    supplier: 'Limpieza Industrial SA',
    lastRestocked: '2024-01-05',
    expiryDate: '2025-12-31',
    autoReorder: true,
    usage: { daily: 3, weekly: 21, monthly: 90 }
  },
  {
    id: '5',
    name: 'Papel Higiénico',
    category: 'amenities',
    currentStock: 156,
    minStock: 100,
    maxStock: 300,
    unit: 'rollos',
    location: 'Almacén B-2',
    cost: 1.20,
    supplier: 'Distribuidora Central',
    lastRestocked: '2024-01-14',
    autoReorder: true,
    usage: { daily: 24, weekly: 168, monthly: 720 }
  }
];

const mockRequests: RestockRequest[] = [
  {
    id: '1',
    itemId: '2',
    itemName: 'Toallas de Baño',
    quantity: 50,
    urgency: 'high',
    status: 'pending',
    requestedBy: 'Sistema Automático',
    requestedAt: '2024-01-15 08:30',
    notes: 'Stock por debajo del mínimo'
  },
  {
    id: '2',
    itemId: '4',
    itemName: 'Desinfectante Multiusos',
    quantity: 30,
    urgency: 'critical',
    status: 'approved',
    requestedBy: 'María López',
    requestedAt: '2024-01-14 14:20',
    notes: 'Urgente para limpieza profunda'
  }
];

const InventoryControl: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [requests, setRequests] = useState<RestockRequest[]>(mockRequests);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredInventory = inventory.filter(item => 
    categoryFilter === 'all' || item.category === categoryFilter
  );

  const getStockLevel = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (item.currentStock <= item.minStock) return 'critical';
    if (percentage <= 30) return 'low';
    if (percentage <= 60) return 'medium';
    return 'high';
  };

  const getStockColor = (level: string) => {
    const colors = {
      'critical': 'bg-red-500',
      'low': 'bg-orange-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-green-500'
    };
    return colors[level as keyof typeof colors];
  };

  const getCategoryIcon = (category: InventoryItem['category']) => {
    const icons = {
      'linen': Shirt,
      'amenities': Box,
      'cleaning': Sparkles,
      'maintenance': Package
    };
    return icons[category];
  };

  const getCategoryLabel = (category: InventoryItem['category']) => {
    const labels = {
      'linen': 'Ropa Blanca',
      'amenities': 'Amenities',
      'cleaning': 'Limpieza',
      'maintenance': 'Mantenimiento'
    };
    return labels[category];
  };

  const adjustStock = () => {
    if (!selectedItem) return;

    const newStock = adjustmentType === 'add' 
      ? selectedItem.currentStock + adjustmentQuantity
      : selectedItem.currentStock - adjustmentQuantity;

    setInventory(inventory.map(item =>
      item.id === selectedItem.id
        ? { ...item, currentStock: Math.max(0, newStock) }
        : item
    ));

    // Check if auto-reorder is needed
    const updatedItem = { ...selectedItem, currentStock: Math.max(0, newStock) };
    if (updatedItem.autoReorder && updatedItem.currentStock <= updatedItem.minStock) {
      createAutoReorderRequest(updatedItem);
    }

    setShowAdjustDialog(false);
    setSelectedItem(null);
    setAdjustmentQuantity(0);
  };

  const createAutoReorderRequest = (item: InventoryItem) => {
    const request: RestockRequest = {
      id: Date.now().toString(),
      itemId: item.id,
      itemName: item.name,
      quantity: item.maxStock - item.currentStock,
      urgency: item.currentStock === 0 ? 'critical' : 'high',
      status: 'pending',
      requestedBy: 'Sistema Automático',
      requestedAt: new Date().toLocaleString('es-ES'),
      notes: 'Reabastecimiento automático - stock por debajo del mínimo'
    };

    setRequests([request, ...requests]);
  };

  const getUrgencyColor = (urgency: RestockRequest['urgency']) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'normal': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[urgency];
  };

  const getStatusColor = (status: RestockRequest['status']) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-blue-100 text-blue-800',
      'ordered': 'bg-purple-100 text-purple-800',
      'received': 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const criticalItems = inventory.filter(item => getStockLevel(item) === 'critical');
  const lowStockItems = inventory.filter(item => getStockLevel(item) === 'low');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Control de Inventario</h3>
        <p className="text-muted-foreground">Gestión de ropa blanca, amenities e insumos de limpieza</p>
      </div>

      {/* Alerts */}
      {criticalItems.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Stock Crítico</AlertTitle>
          <AlertDescription className="text-red-700">
            {criticalItems.length} artículo{criticalItems.length > 1 ? 's' : ''} con stock crítico: {' '}
            {criticalItems.map(item => item.name).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{inventory.length}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{criticalItems.length}</p>
                <p className="text-sm text-muted-foreground">Stock Crítico</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Solicitudes Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Label>Filtrar por categoría:</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="linen">Ropa Blanca</SelectItem>
                <SelectItem value="amenities">Amenities</SelectItem>
                <SelectItem value="cleaning">Limpieza</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const stockLevel = getStockLevel(item);
          const stockPercentage = (item.currentStock / item.maxStock) * 100;
          const CategoryIcon = getCategoryIcon(item.category);
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                      <span className="text-lg">{item.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {getCategoryLabel(item.category)} - {item.location}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={
                      stockLevel === 'critical' ? 'bg-red-100 text-red-800' :
                      stockLevel === 'low' ? 'bg-orange-100 text-orange-800' :
                      stockLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }
                  >
                    {stockLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stock Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stock actual: {item.currentStock} {item.unit}</span>
                    <span>{stockPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={stockPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mín: {item.minStock}</span>
                    <span>Máx: {item.maxStock}</span>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Uso diario:</span>
                    <span>{item.usage.daily} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Días restantes:</span>
                    <span className={item.currentStock / item.usage.daily < 7 ? 'text-red-600 font-semibold' : ''}>
                      {Math.floor(item.currentStock / item.usage.daily)} días
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Proveedor: {item.supplier}</div>
                  <div>Último restock: {item.lastRestocked}</div>
                  <div>Costo unitario: ${item.cost}</div>
                  {item.expiryDate && (
                    <div>Vence: {item.expiryDate}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(item);
                      setAdjustmentType('add');
                      setShowAdjustDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(item);
                      setAdjustmentType('subtract');
                      setShowAdjustDialog(true);
                    }}
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Usar
                  </Button>
                  {item.autoReorder && item.currentStock <= item.minStock && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => createAutoReorderRequest(item)}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reabastecer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Restock Requests */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Reabastecimiento</CardTitle>
            <CardDescription>Pendientes y en proceso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">{request.itemName}</h4>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {request.quantity} | Solicitado por: {request.requestedBy} | {request.requestedAt}
                    </p>
                    {request.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Nota: {request.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline">Aprobar</Button>
                        <Button size="sm" variant="outline">Rechazar</Button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <Button size="sm">Ordenar</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adjustment Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === 'add' ? 'Agregar Stock' : 'Usar Stock'} - {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              Stock actual: {selectedItem?.currentStock} {selectedItem?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                placeholder="Ingresa la cantidad"
              />
            </div>
            {selectedItem && (
              <div className="text-sm text-muted-foreground">
                Stock resultante: {adjustmentType === 'add' 
                  ? selectedItem.currentStock + adjustmentQuantity
                  : Math.max(0, selectedItem.currentStock - adjustmentQuantity)
                } {selectedItem.unit}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={adjustStock}>
              {adjustmentType === 'add' ? 'Agregar' : 'Usar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InventoryControl;