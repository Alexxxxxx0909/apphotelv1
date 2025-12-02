import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Plus,
  Minus,
  RotateCcw,
  ShoppingCart,
  Box,
  Shirt,
  Sparkles,
  Loader2,
  FolderPlus,
  Tags,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHousekeepingCategories, HousekeepingCategory } from '@/hooks/useHousekeepingCategories';
import { useHousekeepingProducts, HousekeepingProduct } from '@/hooks/useHousekeepingProducts';
import { toast } from 'sonner';

const InventoryControl: React.FC = () => {
  const { user } = useAuth();
  const { categories, addCategory, updateCategory, deleteCategory, loading: loadingCategories } = useHousekeepingCategories(user?.hotel);
  const { products, addProduct, updateProduct, deleteProduct, loading: loadingProducts } = useHousekeepingProducts(user?.hotel);
  
  // Dialog states
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HousekeepingCategory | null>(null);
  const [editingProduct, setEditingProduct] = useState<HousekeepingProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<HousekeepingProduct | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [saving, setSaving] = useState(false);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'linen' as HousekeepingCategory['tipo']
  });

  // Product form state
  const [productForm, setProductForm] = useState({
    nombre: '',
    categoriaId: '',
    tipo: 'linen' as HousekeepingProduct['tipo'],
    unidadMedida: '',
    stockActual: 0,
    stockMinimo: 0,
    stockMaximo: 0,
    costoUnitario: 0,
    proveedor: '',
    ubicacion: '',
    autoReorder: true,
    usoDiario: 0
  });

  const filteredProducts = products.filter(product => 
    categoryFilter === 'all' || product.tipo === categoryFilter
  );

  const getStockLevel = (product: HousekeepingProduct) => {
    const percentage = (product.stockActual / product.stockMaximo) * 100;
    if (product.stockActual <= product.stockMinimo) return 'critical';
    if (percentage <= 30) return 'low';
    if (percentage <= 60) return 'medium';
    return 'high';
  };

  const getCategoryIcon = (tipo: string) => {
    const icons: Record<string, any> = {
      'linen': Shirt,
      'amenities': Box,
      'cleaning': Sparkles,
      'maintenance': Package
    };
    return icons[tipo] || Package;
  };

  const getCategoryLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'linen': 'Ropa Blanca',
      'amenities': 'Amenities',
      'cleaning': 'Limpieza',
      'maintenance': 'Mantenimiento'
    };
    return labels[tipo] || tipo;
  };

  const getCategoryName = (categoriaId: string) => {
    const category = categories.find(c => c.id === categoriaId);
    return category?.nombre || 'Sin categoría';
  };

  // Handle Category Save
  const handleSaveCategory = async () => {
    if (!categoryForm.nombre.trim()) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          nombre: categoryForm.nombre,
          descripcion: categoryForm.descripcion,
          tipo: categoryForm.tipo
        });
        toast.success('Categoría actualizada correctamente');
      } else {
        await addCategory({
          nombre: categoryForm.nombre,
          descripcion: categoryForm.descripcion,
          tipo: categoryForm.tipo,
          hotelId: user?.hotel || ''
        });
        toast.success('Categoría creada correctamente');
      }
      resetCategoryForm();
      setShowCategoryDialog(false);
    } catch (error) {
      toast.error('Error al guardar la categoría');
    } finally {
      setSaving(false);
    }
  };

  // Handle Product Save
  const handleSaveProduct = async () => {
    if (!productForm.nombre.trim()) {
      toast.error('El nombre del producto es requerido');
      return;
    }
    if (!productForm.categoriaId) {
      toast.error('Debe seleccionar una categoría');
      return;
    }

    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        toast.success('Producto actualizado correctamente');
      } else {
        await addProduct({
          ...productForm,
          hotelId: user?.hotel || ''
        });
        toast.success('Producto creado correctamente');
      }
      resetProductForm();
      setShowProductDialog(false);
    } catch (error) {
      toast.error('Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  // Handle Stock Adjustment
  const handleAdjustStock = async () => {
    if (!selectedProduct) return;

    const newStock = adjustmentType === 'add' 
      ? selectedProduct.stockActual + adjustmentQuantity
      : selectedProduct.stockActual - adjustmentQuantity;

    try {
      await updateProduct(selectedProduct.id, { 
        stockActual: Math.max(0, newStock),
        ultimoRestock: adjustmentType === 'add' ? new Date() : selectedProduct.ultimoRestock
      });
      toast.success(`Stock ${adjustmentType === 'add' ? 'añadido' : 'reducido'} correctamente`);
      setShowAdjustDialog(false);
      setSelectedProduct(null);
      setAdjustmentQuantity(0);
    } catch (error) {
      toast.error('Error al ajustar el stock');
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id: string) => {
    const hasProducts = products.some(p => p.categoriaId === id);
    if (hasProducts) {
      toast.error('No se puede eliminar una categoría que tiene productos');
      return;
    }
    
    try {
      await deleteCategory(id);
      toast.success('Categoría eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la categoría');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ nombre: '', descripcion: '', tipo: 'linen' });
    setEditingCategory(null);
  };

  const resetProductForm = () => {
    setProductForm({
      nombre: '',
      categoriaId: '',
      tipo: 'linen',
      unidadMedida: '',
      stockActual: 0,
      stockMinimo: 0,
      stockMaximo: 0,
      costoUnitario: 0,
      proveedor: '',
      ubicacion: '',
      autoReorder: true,
      usoDiario: 0
    });
    setEditingProduct(null);
  };

  const openEditCategory = (category: HousekeepingCategory) => {
    setCategoryForm({
      nombre: category.nombre,
      descripcion: category.descripcion || '',
      tipo: category.tipo
    });
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const openEditProduct = (product: HousekeepingProduct) => {
    setProductForm({
      nombre: product.nombre,
      categoriaId: product.categoriaId,
      tipo: product.tipo,
      unidadMedida: product.unidadMedida,
      stockActual: product.stockActual,
      stockMinimo: product.stockMinimo,
      stockMaximo: product.stockMaximo,
      costoUnitario: product.costoUnitario,
      proveedor: product.proveedor,
      ubicacion: product.ubicacion,
      autoReorder: product.autoReorder,
      usoDiario: product.usoDiario
    });
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const criticalItems = products.filter(p => getStockLevel(p) === 'critical');
  const lowStockItems = products.filter(p => getStockLevel(p) === 'low');

  if (loadingCategories || loadingProducts) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando inventario...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Control de Inventario</h3>
          <p className="text-muted-foreground">Gestión de ropa blanca, amenities e insumos de limpieza</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              resetCategoryForm();
              setShowCategoryDialog(true);
            }}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
          <Button 
            onClick={() => {
              resetProductForm();
              setShowProductDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {criticalItems.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Stock Crítico</AlertTitle>
          <AlertDescription className="text-red-700">
            {criticalItems.length} artículo{criticalItems.length > 1 ? 's' : ''} con stock crítico: {' '}
            {criticalItems.map(item => item.nombre).join(', ')}
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
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-muted-foreground">Total Productos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Tags className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categorías</p>
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
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorías</CardTitle>
            <CardDescription>Categorías de productos de housekeeping</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const CategoryIcon = getCategoryIcon(category.tipo);
                return (
                  <div 
                    key={category.id} 
                    className="flex items-center gap-2 p-2 border rounded-lg bg-background"
                  >
                    <CategoryIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{category.nombre}</span>
                    <Badge variant="outline">{getCategoryLabel(category.tipo)}</Badge>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6"
                      onClick={() => openEditCategory(category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Label>Filtrar por tipo:</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="linen">Ropa Blanca</SelectItem>
                <SelectItem value="amenities">Amenities</SelectItem>
                <SelectItem value="cleaning">Limpieza</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const stockLevel = getStockLevel(product);
            const stockPercentage = (product.stockActual / product.stockMaximo) * 100;
            const CategoryIcon = getCategoryIcon(product.tipo);
            const daysRemaining = product.usoDiario > 0 ? Math.floor(product.stockActual / product.usoDiario) : 0;
            
            return (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                        <span className="text-lg">{product.nombre}</span>
                      </CardTitle>
                      <CardDescription>
                        {getCategoryName(product.categoriaId)} - {product.ubicacion}
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
                      <span>Stock actual: {product.stockActual} {product.unidadMedida}</span>
                      <span>{stockPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(stockPercentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mín: {product.stockMinimo}</span>
                      <span>Máx: {product.stockMaximo}</span>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  {product.usoDiario > 0 && (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Uso diario:</span>
                        <span>{product.usoDiario} {product.unidadMedida}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Días restantes:</span>
                        <span className={daysRemaining < 7 ? 'text-red-600 font-semibold' : ''}>
                          {daysRemaining} días
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Item Details */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Proveedor: {product.proveedor || 'No especificado'}</div>
                    {product.ultimoRestock && (
                      <div>Último restock: {product.ultimoRestock.toLocaleDateString('es-ES')}</div>
                    )}
                    <div>Costo unitario: ${product.costoUnitario}</div>
                    {product.fechaVencimiento && (
                      <div>Vence: {product.fechaVencimiento.toLocaleDateString('es-ES')}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
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
                        setSelectedProduct(product);
                        setAdjustmentType('subtract');
                        setShowAdjustDialog(true);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Usar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {products.length === 0 
                ? 'No hay productos registrados en el inventario.' 
                : 'No se encontraron productos con el filtro aplicado.'}
            </p>
            <Button onClick={() => {
              resetProductForm();
              setShowProductDialog(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Producto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Modifica los datos de la categoría' : 'Crea una nueva categoría para organizar productos'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-nombre">Nombre de la categoría *</Label>
              <Input
                id="cat-nombre"
                value={categoryForm.nombre}
                onChange={(e) => setCategoryForm({ ...categoryForm, nombre: e.target.value })}
                placeholder="Ej: Toallas, Jabones, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-descripcion">Descripción</Label>
              <Textarea
                id="cat-descripcion"
                value={categoryForm.descripcion}
                onChange={(e) => setCategoryForm({ ...categoryForm, descripcion: e.target.value })}
                placeholder="Descripción opcional de la categoría"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-tipo">Tipo</Label>
              <Select 
                value={categoryForm.tipo} 
                onValueChange={(value: HousekeepingCategory['tipo']) => setCategoryForm({ ...categoryForm, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linen">Ropa Blanca</SelectItem>
                  <SelectItem value="amenities">Amenities</SelectItem>
                  <SelectItem value="cleaning">Limpieza</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCategory} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifica los datos del producto' : 'Registra un nuevo producto en el inventario'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prod-nombre">Nombre del producto *</Label>
              <Input
                id="prod-nombre"
                value={productForm.nombre}
                onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })}
                placeholder="Ej: Sábanas individuales"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-categoria">Categoría *</Label>
              <Select 
                value={productForm.categoriaId} 
                onValueChange={(value) => setProductForm({ ...productForm, categoriaId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-tipo">Tipo</Label>
              <Select 
                value={productForm.tipo} 
                onValueChange={(value: HousekeepingProduct['tipo']) => setProductForm({ ...productForm, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linen">Ropa Blanca</SelectItem>
                  <SelectItem value="amenities">Amenities</SelectItem>
                  <SelectItem value="cleaning">Limpieza</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-unidad">Unidad de medida</Label>
              <Input
                id="prod-unidad"
                value={productForm.unidadMedida}
                onChange={(e) => setProductForm({ ...productForm, unidadMedida: e.target.value })}
                placeholder="Ej: unidades, litros, kg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-stock">Stock actual</Label>
              <Input
                id="prod-stock"
                type="number"
                value={productForm.stockActual}
                onChange={(e) => setProductForm({ ...productForm, stockActual: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-min">Stock mínimo</Label>
              <Input
                id="prod-min"
                type="number"
                value={productForm.stockMinimo}
                onChange={(e) => setProductForm({ ...productForm, stockMinimo: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-max">Stock máximo</Label>
              <Input
                id="prod-max"
                type="number"
                value={productForm.stockMaximo}
                onChange={(e) => setProductForm({ ...productForm, stockMaximo: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-costo">Costo unitario ($)</Label>
              <Input
                id="prod-costo"
                type="number"
                step="0.01"
                value={productForm.costoUnitario}
                onChange={(e) => setProductForm({ ...productForm, costoUnitario: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-proveedor">Proveedor</Label>
              <Input
                id="prod-proveedor"
                value={productForm.proveedor}
                onChange={(e) => setProductForm({ ...productForm, proveedor: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-ubicacion">Ubicación</Label>
              <Input
                id="prod-ubicacion"
                value={productForm.ubicacion}
                onChange={(e) => setProductForm({ ...productForm, ubicacion: e.target.value })}
                placeholder="Ej: Almacén A-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-uso">Uso diario promedio</Label>
              <Input
                id="prod-uso"
                type="number"
                value={productForm.usoDiario}
                onChange={(e) => setProductForm({ ...productForm, usoDiario: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="prod-autoreorder"
                checked={productForm.autoReorder}
                onCheckedChange={(checked) => setProductForm({ ...productForm, autoReorder: checked })}
              />
              <Label htmlFor="prod-autoreorder">Reorden automático</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === 'add' ? 'Añadir Stock' : 'Usar Stock'} - {selectedProduct?.nombre}
            </DialogTitle>
            <DialogDescription>
              Stock actual: {selectedProduct?.stockActual} {selectedProduct?.unidadMedida}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adjust-qty">Cantidad</Label>
              <Input
                id="adjust-qty"
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                min={0}
              />
            </div>
            {selectedProduct && (
              <div className="text-sm text-muted-foreground">
                Nuevo stock: {adjustmentType === 'add' 
                  ? selectedProduct.stockActual + adjustmentQuantity 
                  : Math.max(0, selectedProduct.stockActual - adjustmentQuantity)} {selectedProduct.unidadMedida}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjustStock}>
              {adjustmentType === 'add' ? 'Añadir' : 'Usar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InventoryControl;
