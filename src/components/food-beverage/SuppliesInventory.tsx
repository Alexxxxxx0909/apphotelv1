import React, { useState, useMemo } from 'react';
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
  Truck,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInventoryProducts } from '@/hooks/useInventoryProducts';
import { useInventoryCategories } from '@/hooks/useInventoryCategories';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useToast } from '@/hooks/use-toast';
import CategoriesManagementDialog from './CategoriesManagementDialog';

const SuppliesInventory: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const hotelId = user?.hotel;
  
  const { products, loading: loadingProducts, addProduct, updateProduct, deleteProduct } = useInventoryProducts(hotelId);
  const { categories, loading: loadingCategories } = useInventoryCategories(hotelId);
  const { suppliers, loading: loadingSuppliers } = useSuppliers(hotelId);

  const [formData, setFormData] = useState({
    nombre: '',
    categoriaId: '',
    unidadMedida: 'kg',
    stockActual: 0,
    stockMinimo: 10,
    stockMaximo: 100,
    costoUnitario: 0,
    proveedorId: '',
    ubicacion: '',
    fechaVencimiento: ''
  });

  // Calculate product state based on stock levels and expiration
  const getProductState = (product: any) => {
    const now = new Date();
    if (product.fechaVencimiento && product.fechaVencimiento < now) {
      return 'vencido';
    }
    if (product.stockActual <= 0) {
      return 'agotado';
    }
    if (product.stockActual <= product.stockMinimo) {
      return 'bajo_stock';
    }
    return 'disponible';
  };

  // Get category IDs for Food & Beverage inventory to filter suppliers
  const foodBeverageCategoryIds = useMemo(() => {
    return categories.map(c => c.id);
  }, [categories]);

  // Filter suppliers to only show those from Food & Beverage categories
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.estado === 'activo' && foodBeverageCategoryIds.includes(s.categoria)
    );
  }, [suppliers, foodBeverageCategoryIds]);

  // Enrich products with category and supplier names
  const enrichedProducts = useMemo(() => {
    return products.map(product => {
      const category = categories.find(c => c.id === product.categoriaId);
      const supplier = suppliers.find(s => s.id === product.proveedorId);
      const estado = getProductState(product);
      
      return {
        ...product,
        categoriaNombre: category?.nombre || 'Sin categoría',
        proveedorNombre: supplier?.nombre || 'Sin proveedor',
        estado
      };
    });
  }, [products, categories, suppliers]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return enrichedProducts.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'todos' || product.categoriaId === filterCategory;
      const matchesStatus = filterStatus === 'todos' || product.estado === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [enrichedProducts, searchTerm, filterCategory, filterStatus]);

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

  const lowStockItems = filteredProducts.filter(item => item.estado === 'bajo_stock' || item.estado === 'agotado');
  const expiringSoon = filteredProducts.filter(item => 
    item.fechaVencimiento && 
    item.fechaVencimiento <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoriaId || !formData.proveedorId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    try {
      const productData = {
        nombre: formData.nombre,
        categoriaId: formData.categoriaId,
        unidadMedida: formData.unidadMedida,
        stockActual: Number(formData.stockActual),
        stockMinimo: Number(formData.stockMinimo),
        stockMaximo: Number(formData.stockMaximo),
        costoUnitario: Number(formData.costoUnitario),
        proveedorId: formData.proveedorId,
        ubicacion: formData.ubicacion,
        fechaVencimiento: formData.fechaVencimiento ? new Date(formData.fechaVencimiento) : undefined,
        estado: 'disponible' as const,
        hotelId: hotelId!
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: "Producto actualizado",
          description: "El producto se actualizó correctamente"
        });
      } else {
        await addProduct(productData);
        toast({
          title: "Producto agregado",
          description: "El producto se agregó al inventario correctamente"
        });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        nombre: '',
        categoriaId: '',
        unidadMedida: 'kg',
        stockActual: 0,
        stockMinimo: 10,
        stockMaximo: 100,
        costoUnitario: 0,
        proveedorId: '',
        ubicacion: '',
        fechaVencimiento: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      categoriaId: product.categoriaId,
      unidadMedida: product.unidadMedida,
      stockActual: product.stockActual,
      stockMinimo: product.stockMinimo,
      stockMaximo: product.stockMaximo,
      costoUnitario: product.costoUnitario,
      proveedorId: product.proveedorId,
      ubicacion: product.ubicacion,
      fechaVencimiento: product.fechaVencimiento ? product.fechaVencimiento.toISOString().split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await deleteProduct(id);
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del inventario"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      });
    }
  };

  const handleOpenDialog = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      categoriaId: '',
      unidadMedida: 'kg',
      stockActual: 0,
      stockMinimo: 10,
      stockMaximo: 100,
      costoUnitario: 0,
      proveedorId: '',
      ubicacion: '',
      fechaVencimiento: ''
    });
    setIsDialogOpen(true);
  };

  if (loadingProducts || loadingCategories || loadingSuppliers) {
    return <div className="flex justify-center items-center h-64">Cargando inventario...</div>;
  }

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
                <SelectItem key={category.id} value={category.id}>{category.nombre}</SelectItem>
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
          <Button variant="outline" onClick={() => setShowCategoriesDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Categorías
          </Button>
          <Button onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Supplies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {products.length === 0 ? 'No hay productos en el inventario' : 'No se encontraron productos con los filtros aplicados'}
          </div>
        ) : (
          filteredProducts.map((supply) => (
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
                    <Badge variant="outline">{supply.categoriaNombre}</Badge>
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
                    <span className="text-right">{supply.proveedorNombre}</span>
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
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(supply)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(supply.id)}>
                    <Package className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {enrichedProducts.filter(s => s.estado === 'disponible').length}
              </div>
              <div className="text-sm text-muted-foreground">Productos Disponibles</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {enrichedProducts.filter(s => s.estado === 'bajo_stock').length}
              </div>
              <div className="text-sm text-muted-foreground">Bajo Stock</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {enrichedProducts.filter(s => s.estado === 'agotado').length}
              </div>
              <div className="text-sm text-muted-foreground">Agotados</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(enrichedProducts.reduce((sum, s) => sum + (s.stockActual * s.costoUnitario), 0))}
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
            <DialogTitle>{editingProduct ? 'Editar' : 'Nuevo'} Producto de Inventario</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Actualiza los datos del producto' : 'Registra un nuevo producto en el inventario de insumos'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Producto</Label>
                  <Input 
                    id="nombre" 
                    placeholder="Ej: Filete de Res"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoriaId}
                    onValueChange={(value) => setFormData({ ...formData, categoriaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No hay categorías. Créalas primero.
                        </div>
                      ) : (
                        categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="unidad">Unidad de Medida</Label>
                  <Select
                    value={formData.unidadMedida}
                    onValueChange={(value) => setFormData({ ...formData, unidadMedida: value })}
                  >
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
                  <Select
                    value={formData.proveedorId}
                    onValueChange={(value) => setFormData({ ...formData, proveedorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSuppliers.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No hay proveedores de alimentos y bebidas
                        </div>
                      ) : (
                        filteredSuppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stockActual">Stock Actual</Label>
                    <Input 
                      id="stockActual" 
                      type="number" 
                      placeholder="0"
                      value={formData.stockActual}
                      onChange={(e) => setFormData({ ...formData, stockActual: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                    <Input 
                      id="stockMinimo" 
                      type="number" 
                      placeholder="10"
                      value={formData.stockMinimo}
                      onChange={(e) => setFormData({ ...formData, stockMinimo: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stockMaximo">Stock Máximo</Label>
                    <Input 
                      id="stockMaximo" 
                      type="number" 
                      placeholder="100"
                      value={formData.stockMaximo}
                      onChange={(e) => setFormData({ ...formData, stockMaximo: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="costo">Costo Unitario</Label>
                    <Input 
                      id="costo" 
                      type="number" 
                      placeholder="35000"
                      value={formData.costoUnitario}
                      onChange={(e) => setFormData({ ...formData, costoUnitario: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input 
                    id="ubicacion" 
                    placeholder="Ej: Refrigerador Principal"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="vencimiento">Fecha de Vencimiento (Opcional)</Label>
                  <Input 
                    id="vencimiento" 
                    type="date"
                    value={formData.fechaVencimiento}
                    onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories Management Dialog */}
      <CategoriesManagementDialog
        open={showCategoriesDialog}
        onOpenChange={setShowCategoriesDialog}
        hotelId={hotelId!}
      />
    </motion.div>
  );
};

export default SuppliesInventory;