import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Package, 
  TrendingDown,
  Edit,
  History,
  Truck
} from 'lucide-react';

interface SupplyItem {
  id: string;
  nombre: string;
  categoria: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  costoUnitario: number;
  proveedor: string;
  ubicacion: string;
  fechaVencimiento?: Date;
  estado: 'disponible' | 'agotado' | 'bajo_stock' | 'vencido';
}

interface MovementRecord {
  id: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  fecha: Date;
  motivo: string;
  usuario: string;
}

const SuppliesInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMovements, setShowMovements] = useState(false);

  // Mock data
  const [supplies] = useState<SupplyItem[]>([
    {
      id: '1',
      nombre: 'Filete de Res',
      categoria: 'Carnes',
      unidadMedida: 'kg',
      stockActual: 5,
      stockMinimo: 10,
      stockMaximo: 50,
      costoUnitario: 35000,
      proveedor: 'Frigorífico Premium',
      ubicacion: 'Refrigerador Principal',
      fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estado: 'bajo_stock'
    },
    {
      id: '2',
      nombre: 'Ron Blanco Premium',
      categoria: 'Licores',
      unidadMedida: 'botella',
      stockActual: 25,
      stockMinimo: 15,
      stockMaximo: 100,
      costoUnitario: 85000,
      proveedor: 'Distribuidora Licores SA',
      ubicacion: 'Bodega Bar',
      estado: 'disponible'
    },
    {
      id: '3',
      nombre: 'Leche Entera',
      categoria: 'Lácteos',
      unidadMedida: 'litro',
      stockActual: 0,
      stockMinimo: 20,
      stockMaximo: 80,
      costoUnitario: 3500,
      proveedor: 'Lácteos del Valle',
      ubicacion: 'Refrigerador Lácteos',
      fechaVencimiento: new Date(Date.now() - 24 * 60 * 60 * 1000),
      estado: 'agotado'
    }
  ]);

  const categories = ['Carnes', 'Pescados', 'Vegetales', 'Lácteos', 'Granos', 'Condimentos', 'Licores', 'Bebidas'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-500';
      case 'bajo_stock':
        return 'bg-yellow-500';
      case 'agotado':
        return 'bg-red-500';
      case 'vencido':
        return 'bg-red-700';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'bajo_stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'agotado':
        return <Package className="h-4 w-4" />;
      case 'vencido':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const lowStockItems = supplies.filter(item => item.estado === 'bajo_stock' || item.estado === 'agotado');
  const expiringSoon = supplies.filter(item => 
    item.fechaVencimiento && 
    item.fechaVencimiento <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <strong>{lowStockItems.length} productos</strong> tienen stock bajo o están agotados.
            <Button variant="link" className="p-0 ml-2 h-auto">
              Ver detalles
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {expiringSoon.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>{expiringSoon.length} productos</strong> vencen en los próximos 7 días.
            <Button variant="link" className="p-0 ml-2 h-auto">
              Ver productos
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="bajo_stock">Bajo Stock</SelectItem>
              <SelectItem value="agotado">Agotado</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowMovements(true)}>
            <History className="h-4 w-4 mr-2" />
            Movimientos
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Supplies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {supplies.map((supply) => (
          <motion.div
            key={supply.id}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className={`h-full hover:shadow-hotel transition-all duration-300 ${
              supply.estado === 'agotado' ? 'border-red-200' : 
              supply.estado === 'bajo_stock' ? 'border-yellow-200' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{supply.nombre}</CardTitle>
                      <Badge className={`${getStatusColor(supply.estado)} text-white`}>
                        {getStatusIcon(supply.estado)}
                        <span className="ml-1 capitalize">{supply.estado.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <Badge variant="outline">{supply.categoria}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Stock Actual:</span>
                    <div className="font-medium text-lg">
                      {supply.stockActual} {supply.unidadMedida}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock Mínimo:</span>
                    <div className="font-medium text-lg text-red-600">
                      {supply.stockMinimo} {supply.unidadMedida}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Costo Unitario:</span>
                    <span className="font-medium">{formatCurrency(supply.costoUnitario)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Proveedor:</span>
                    <span className="text-right">{supply.proveedor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ubicación:</span>
                    <span className="text-right">{supply.ubicacion}</span>
                  </div>
                  {supply.fechaVencimiento && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vence:</span>
                      <span className={`text-right ${
                        supply.fechaVencimiento <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) 
                          ? 'text-red-600 font-medium' : ''
                      }`}>
                        {supply.fechaVencimiento.toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stock</span>
                    <span>{Math.round((supply.stockActual / supply.stockMaximo) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        supply.stockActual <= supply.stockMinimo 
                          ? 'bg-red-500' 
                          : supply.stockActual <= supply.stockMinimo * 1.5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((supply.stockActual / supply.stockMaximo) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Truck className="h-4 w-4 mr-1" />
                    Reabastecer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {supplies.filter(s => s.estado === 'disponible').length}
              </div>
              <div className="text-sm text-muted-foreground">Productos Disponibles</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {supplies.filter(s => s.estado === 'bajo_stock').length}
              </div>
              <div className="text-sm text-muted-foreground">Bajo Stock</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {supplies.filter(s => s.estado === 'agotado').length}
              </div>
              <div className="text-sm text-muted-foreground">Agotados</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(supplies.reduce((sum, s) => sum + (s.stockActual * s.costoUnitario), 0))}
              </div>
              <div className="text-sm text-muted-foreground">Valor Inventario</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Producto de Inventario</DialogTitle>
            <DialogDescription>
              Registra un nuevo producto en el inventario de insumos
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input id="nombre" placeholder="Ej: Filete de Res" />
              </div>
              
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="unidad">Unidad de Medida</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                    <SelectItem value="g">Gramos (g)</SelectItem>
                    <SelectItem value="litro">Litros (L)</SelectItem>
                    <SelectItem value="ml">Mililitros (ml)</SelectItem>
                    <SelectItem value="unidad">Unidad</SelectItem>
                    <SelectItem value="botella">Botella</SelectItem>
                    <SelectItem value="caja">Caja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input id="proveedor" placeholder="Nombre del proveedor" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockActual">Stock Actual</Label>
                  <Input id="stockActual" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                  <Input id="stockMinimo" type="number" placeholder="10" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockMaximo">Stock Máximo</Label>
                  <Input id="stockMaximo" type="number" placeholder="100" />
                </div>
                <div>
                  <Label htmlFor="costo">Costo Unitario</Label>
                  <Input id="costo" type="number" placeholder="35000" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input id="ubicacion" placeholder="Ej: Refrigerador Principal" />
              </div>
              
              <div>
                <Label htmlFor="vencimiento">Fecha de Vencimiento (Opcional)</Label>
                <Input id="vencimiento" type="date" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
              Crear Producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SuppliesInventory;