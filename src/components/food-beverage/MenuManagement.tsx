import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useMenuItems, MenuItem, MenuItemIngredient } from '@/hooks/useMenuItems';
import { useInventoryProducts } from '@/hooks/useInventoryProducts';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star,
  DollarSign,
  Clock,
  Package,
  X,
  Loader2
} from 'lucide-react';

const MenuManagement: React.FC = () => {
  const { user } = useAuth();
  const hotelId = user?.hotel;
  const { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems(hotelId);
  const { products: inventoryProducts } = useInventoryProducts(hotelId);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    costo: 0,
    categoria: '',
    tipo: 'plato' as 'plato' | 'bebida',
    activo: true,
    especial: false,
    tiempoPreparacion: 0
  });
  const [selectedIngredients, setSelectedIngredients] = useState<MenuItemIngredient[]>([]);

  const categories = ['Entradas', 'Carnes', 'Pescados', 'Pastas', 'Postres', 'Bebidas Frías', 'Bebidas Calientes', 'Cócteles', 'Ensaladas', 'Sopas'];

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen && editingItem) {
      setFormData({
        nombre: editingItem.nombre,
        descripcion: editingItem.descripcion,
        precio: editingItem.precio,
        costo: editingItem.costo,
        categoria: editingItem.categoria,
        tipo: editingItem.tipo,
        activo: editingItem.activo,
        especial: editingItem.especial,
        tiempoPreparacion: editingItem.tiempoPreparacion
      });
      setSelectedIngredients(editingItem.ingredientes || []);
    } else if (isDialogOpen && !editingItem) {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        costo: 0,
        categoria: '',
        tipo: 'plato',
        activo: true,
        especial: false,
        tiempoPreparacion: 0
      });
      setSelectedIngredients([]);
    }
  }, [isDialogOpen, editingItem]);

  // Calculate total cost from ingredients
  useEffect(() => {
    const totalCost = selectedIngredients.reduce((sum, ing) => {
      return sum + (ing.cantidad * ing.costoUnitario);
    }, 0);
    setFormData(prev => ({ ...prev, costo: totalCost }));
  }, [selectedIngredients]);

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMenuItem(itemToDelete.id);
      toast({
        title: "Item eliminado",
        description: `${itemToDelete.nombre} ha sido eliminado del menú.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el item.",
        variant: "destructive"
      });
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleToggleActive = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.id, { activo: !item.activo });
      toast({
        title: item.activo ? "Item desactivado" : "Item activado",
        description: `${item.nombre} ha sido ${item.activo ? 'desactivado' : 'activado'}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive"
      });
    }
  };

  const handleAddIngredient = (productId: string) => {
    const product = inventoryProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Check if already added
    if (selectedIngredients.some(ing => ing.productoId === productId)) {
      toast({
        title: "Ingrediente ya agregado",
        description: "Este ingrediente ya está en la lista.",
        variant: "destructive"
      });
      return;
    }

    const newIngredient: MenuItemIngredient = {
      productoId: product.id,
      nombre: product.nombre,
      cantidad: 1,
      unidadMedida: product.unidadMedida,
      costoUnitario: product.costoUnitario
    };
    setSelectedIngredients([...selectedIngredients, newIngredient]);
  };

  const handleUpdateIngredientQuantity = (index: number, cantidad: number) => {
    const updated = [...selectedIngredients];
    updated[index] = { ...updated[index], cantidad };
    setSelectedIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.categoria) {
      toast({
        title: "Error",
        description: "La categoría es requerida.",
        variant: "destructive"
      });
      return;
    }

    if (formData.precio <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser mayor a 0.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const itemData = {
        ...formData,
        ingredientes: selectedIngredients,
        hotelId: hotelId!
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
        toast({
          title: "Item actualizado",
          description: `${formData.nombre} ha sido actualizado.`
        });
      } else {
        await addMenuItem(itemData);
        toast({
          title: "Item creado",
          description: `${formData.nombre} ha sido agregado al menú.`
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el item.",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || item.categoria === filterCategory;
    const matchesType = filterType === 'todos' || item.tipo === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar platos o bebidas..."
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
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="plato">Platos</SelectItem>
              <SelectItem value="bebida">Bebidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreateItem} className="w-full lg:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Item
        </Button>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay items en el menú</h3>
          <p className="text-muted-foreground mb-4">Comienza agregando platos y bebidas al menú</p>
          <Button onClick={handleCreateItem}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer item
          </Button>
        </Card>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{item.nombre}</CardTitle>
                      {item.especial && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <Badge variant={item.tipo === 'plato' ? 'default' : 'secondary'}>
                      {item.tipo === 'plato' ? 'Plato' : 'Bebida'}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {item.categoria}
                    </Badge>
                  </div>
                  <Switch 
                    checked={item.activo} 
                    onCheckedChange={() => handleToggleActive(item)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm line-clamp-2">
                  {item.descripcion}
                </CardDescription>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{formatCurrency(item.precio)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{item.tiempoPreparacion} min</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <strong>Costo:</strong> {formatCurrency(item.costo)} | 
                  <strong> Margen:</strong> {item.precio > 0 ? Math.round(((item.precio - item.costo) / item.precio) * 100) : 0}%
                </div>

                {item.ingredientes && item.ingredientes.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Ingredientes:</strong> {item.ingredientes.map(i => i.nombre).join(', ')}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditItem(item)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Item del Menú' : 'Crear Nuevo Item'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modifica los detalles del item' : 'Completa la información del nuevo item del menú'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del Item *</Label>
                    <Input
                      id="nombre"
                      placeholder="Ej: Filete de Res Premium"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Descripción detallada del plato o bebida"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precio">Precio de Venta *</Label>
                      <Input
                        id="precio"
                        type="number"
                        placeholder="45000"
                        value={formData.precio || ''}
                        onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="costo">Costo (calculado)</Label>
                      <Input
                        id="costo"
                        type="number"
                        value={formData.costo}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Calculado automáticamente según ingredientes
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tipo">Tipo *</Label>
                    <Select 
                      value={formData.tipo} 
                      onValueChange={(value: 'plato' | 'bebida') => setFormData({ ...formData, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plato">Plato</SelectItem>
                        <SelectItem value="bebida">Bebida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    >
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
                    <Label htmlFor="tiempo">Tiempo de Preparación (minutos)</Label>
                    <Input
                      id="tiempo"
                      type="number"
                      placeholder="25"
                      value={formData.tiempoPreparacion || ''}
                      onChange={(e) => setFormData({ ...formData, tiempoPreparacion: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="activo" 
                      checked={formData.activo}
                      onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                    />
                    <Label htmlFor="activo">Activo</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="especial" 
                      checked={formData.especial}
                      onCheckedChange={(checked) => setFormData({ ...formData, especial: checked })}
                    />
                    <Label htmlFor="especial">Menú Especial</Label>
                  </div>
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="border-t pt-4">
                <Label className="text-base font-semibold mb-3 block">
                  <Package className="h-4 w-4 inline mr-2" />
                  Ingredientes del Inventario
                </Label>
                
                <div className="mb-4">
                  <Label>Agregar ingrediente del inventario</Label>
                  <Select onValueChange={handleAddIngredient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto del inventario" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.nombre} - {formatCurrency(product.costoUnitario)}/{product.unidadMedida}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedIngredients.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay ingredientes agregados. Selecciona productos del inventario.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedIngredients.map((ingredient, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{ingredient.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(ingredient.costoUnitario)} por {ingredient.unidadMedida}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={ingredient.cantidad}
                            onChange={(e) => handleUpdateIngredientQuantity(index, Number(e.target.value))}
                            className="w-20 h-8"
                            min={0.1}
                            step={0.1}
                          />
                          <span className="text-sm text-muted-foreground w-16">
                            {ingredient.unidadMedida}
                          </span>
                          <span className="text-sm font-medium w-24 text-right">
                            {formatCurrency(ingredient.cantidad * ingredient.costoUnitario)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveIngredient(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end pt-2 border-t">
                      <p className="font-semibold">
                        Costo Total: {formatCurrency(formData.costo)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Margin Preview */}
              {formData.precio > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Margen de Ganancia:</span>
                    <span className={`font-bold ${
                      ((formData.precio - formData.costo) / formData.precio) * 100 >= 30 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {Math.round(((formData.precio - formData.costo) / formData.precio) * 100)}% 
                      ({formatCurrency(formData.precio - formData.costo)})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1" disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Actualizar' : 'Crear'} Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar item del menú?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente "{itemToDelete?.nombre}" del menú.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default MenuManagement;
