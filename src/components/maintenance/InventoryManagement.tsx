import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Minus,
  Edit,
  BarChart3,
  TrendingDown,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  totalValue: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  usageRate: number; // items per month
  status: 'ok' | 'low' | 'critical' | 'overstock';
}

const mockInventory: InventoryItem[] = [
  {
    id: 'INV-001',
    name: 'Filtro HEPA Aire Acondicionado',
    category: 'HVAC',
    brand: 'Carrier',
    currentStock: 8,
    minimumStock: 5,
    maximumStock: 20,
    unitCost: 45.50,
    totalValue: 364.00,
    supplier: 'Climatización S.A.',
    location: 'Almacén A - Estante 3',
    lastRestocked: '2024-01-10',
    usageRate: 3,
    status: 'ok'
  },
  {
    id: 'INV-002',
    name: 'Compresor AC 2HP',
    category: 'HVAC',
    brand: 'Copeland',
    currentStock: 2,
    minimumStock: 2,
    maximumStock: 6,
    unitCost: 485.00,
    totalValue: 970.00,
    supplier: 'Refrigeración Total',
    location: 'Almacén B - Sección 1',
    lastRestocked: '2023-12-15',
    usageRate: 1,
    status: 'low'
  },
  {
    id: 'INV-003',
    name: 'Juntas de Goma Plomería',
    category: 'Plomería',
    brand: 'Universal',
    currentStock: 1,
    minimumStock: 10,
    maximumStock: 50,
    unitCost: 2.25,
    totalValue: 2.25,
    supplier: 'Ferretería Central',
    location: 'Almacén A - Cajón 5',
    lastRestocked: '2024-01-05',
    usageRate: 8,
    status: 'critical'
  },
  {
    id: 'INV-004',
    name: 'Lámparas LED 12W',
    category: 'Electricidad',
    brand: 'Philips',
    currentStock: 45,
    minimumStock: 15,
    maximumStock: 30,
    unitCost: 12.80,
    totalValue: 576.00,
    supplier: 'Eléctricos del Norte',
    location: 'Almacén A - Estante 1',
    lastRestocked: '2024-01-08',
    usageRate: 5,
    status: 'overstock'
  }
];

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [activeTab, setActiveTab] = useState('inventory');
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'overstock': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'overstock': return <TrendingUp className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'todas' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const criticalItems = inventory.filter(item => item.status === 'critical').length;
  const lowStockItems = inventory.filter(item => item.status === 'low').length;

  const handleAddStock = (itemId: string, quantity: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            currentStock: item.currentStock + quantity,
            totalValue: (item.currentStock + quantity) * item.unitCost,
            status: (item.currentStock + quantity) <= item.minimumStock ? 'low' : 
                   (item.currentStock + quantity) >= item.maximumStock ? 'overstock' : 'ok'
          }
        : item
    ));
    
    toast({
      title: "Stock actualizado",
      description: `Se agregaron ${quantity} unidades al inventario.`,
    });
  };

  const handleReduceStock = (itemId: string, quantity: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            currentStock: Math.max(0, item.currentStock - quantity),
            totalValue: Math.max(0, item.currentStock - quantity) * item.unitCost,
            status: (item.currentStock - quantity) <= 0 ? 'critical' :
                   (item.currentStock - quantity) <= item.minimumStock ? 'low' : 'ok'
          }
        : item
    ));
    
    toast({
      title: "Stock actualizado",
      description: `Se consumieron ${quantity} unidades del inventario.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-muted-foreground">Artículos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{criticalItems}</p>
                <p className="text-sm text-muted-foreground">Stock Crítico</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{lowStockItems}</p>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nuevo Artículo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Artículo al Inventario</DialogTitle>
                <DialogDescription>
                  Registrar un nuevo repuesto o herramienta
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Nombre del Artículo</Label>
                  <Input id="itemName" placeholder="Ej: Filtro HEPA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="plomeria">Plomería</SelectItem>
                      <SelectItem value="electricidad">Electricidad</SelectItem>
                      <SelectItem value="herramientas">Herramientas</SelectItem>
                      <SelectItem value="limpieza">Limpieza</SelectItem>
                      <SelectItem value="seguridad">Seguridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" placeholder="Marca del producto" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Input id="supplier" placeholder="Nombre del proveedor" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Stock Inicial</Label>
                  <Input id="currentStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Stock Máximo</Label>
                  <Input id="maxStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitCost">Costo Unitario</Label>
                  <Input id="unitCost" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="location">Ubicación en Almacén</Label>
                  <Input id="location" placeholder="Ej: Almacén A - Estante 3" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Agregar Artículo</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar artículos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las categorías</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Plomería">Plomería</SelectItem>
                    <SelectItem value="Electricidad">Electricidad</SelectItem>
                    <SelectItem value="Herramientas">Herramientas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los estados</SelectItem>
                    <SelectItem value="ok">Stock Normal</SelectItem>
                    <SelectItem value="low">Stock Bajo</SelectItem>
                    <SelectItem value="critical">Stock Crítico</SelectItem>
                    <SelectItem value="overstock">Sobrestock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventario de Repuestos</CardTitle>
              <CardDescription>
                Control de stock de herramientas y materiales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artículo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Min/Max</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="font-medium">{item.currentStock}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span>{item.minimumStock} / {item.maximumStock}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status.toUpperCase()}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>${item.totalValue.toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{item.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddStock(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReduceStock(item.id, 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Stock Crítico</CardTitle>
                <CardDescription>
                  Artículos que requieren reposición inmediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory.filter(item => item.status === 'critical' || item.status === 'low').map((item) => (
                    <div key={item.id} className={`border-l-4 p-4 ${
                      item.status === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-semibold ${
                            item.status === 'critical' ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            {item.name}
                          </h4>
                          <p className={`text-sm ${
                            item.status === 'critical' ? 'text-red-700' : 'text-yellow-700'
                          }`}>
                            Stock actual: {item.currentStock} | Mínimo: {item.minimumStock}
                          </p>
                        </div>
                        <Button size="sm" variant={item.status === 'critical' ? 'destructive' : 'default'}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Ordenar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Compra</CardTitle>
                <CardDescription>
                  Sugerencias basadas en consumo y tendencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory.filter(item => item.status === 'critical' || item.status === 'low').map((item) => {
                    const suggestedOrder = Math.max(item.maximumStock - item.currentStock, item.usageRate * 2);
                    return (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.name}</h4>
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Cantidad sugerida</p>
                            <p className="font-medium">{suggestedOrder} unidades</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Costo estimado</p>
                            <p className="font-medium">${(suggestedOrder * item.unitCost).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Proveedor</p>
                            <p className="font-medium">{item.supplier}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duración estimada</p>
                            <p className="font-medium">{Math.round(suggestedOrder / item.usageRate)} meses</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Consumo</CardTitle>
                <CardDescription>
                  Tendencias de uso por categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['HVAC', 'Plomería', 'Electricidad'].map((category) => {
                    const categoryItems = inventory.filter(item => item.category === category);
                    const totalValue = categoryItems.reduce((sum, item) => sum + item.totalValue, 0);
                    const totalUsage = categoryItems.reduce((sum, item) => sum + item.usageRate, 0);
                    
                    return (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{category}</h4>
                          <span className="text-sm text-muted-foreground">
                            {categoryItems.length} artículos
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Valor total</p>
                            <p className="font-medium">${totalValue.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Uso mensual</p>
                            <p className="font-medium">{totalUsage} unidades</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Costo mensual</p>
                            <p className="font-medium">
                              ${categoryItems.reduce((sum, item) => sum + (item.usageRate * item.unitCost), 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimización de Inventario</CardTitle>
                <CardDescription>
                  Sugerencias para mejorar la gestión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                    <h4 className="font-medium text-blue-800">Reducir Sobrestock</h4>
                    <p className="text-sm text-blue-700">
                      4 artículos tienen stock excesivo, considerar ajustar niveles máximos
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 bg-green-50 p-4">
                    <h4 className="font-medium text-green-800">Consolidar Proveedores</h4>
                    <p className="text-sm text-green-700">
                      Oportunidad de negociar mejores precios con proveedores principales
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                    <h4 className="font-medium text-yellow-800">Automatizar Reorden</h4>
                    <p className="text-sm text-yellow-700">
                      Implementar alertas automáticas para artículos de uso frecuente
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                    <h4 className="font-medium text-purple-800">Análisis ABC</h4>
                    <p className="text-sm text-purple-700">
                      Clasificar inventario por valor e importancia para mejor control
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default InventoryManagement;