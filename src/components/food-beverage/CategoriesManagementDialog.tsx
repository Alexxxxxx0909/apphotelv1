import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInventoryCategories, InventoryCategory } from '@/hooks/useInventoryCategories';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Folder } from 'lucide-react';

interface CategoriesManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string;
}

const CategoriesManagementDialog: React.FC<CategoriesManagementDialogProps> = ({ open, onOpenChange, hotelId }) => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useInventoryCategories(hotelId);
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'alimentos' as 'alimentos' | 'bebidas' | 'suministros'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast({
          title: "Categoría actualizada",
          description: "La categoría se actualizó correctamente"
        });
        setEditingId(null);
      } else {
        await addCategory({
          ...formData,
          hotelId
        });
        toast({
          title: "Categoría creada",
          description: "La nueva categoría se creó correctamente"
        });
      }
      
      setFormData({ nombre: '', descripcion: '', tipo: 'alimentos' });
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la categoría",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: InventoryCategory) => {
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || '',
      tipo: category.tipo
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await deleteCategory(id);
      toast({
        title: "Categoría eliminada",
        description: "La categoría se eliminó correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '', tipo: 'alimentos' });
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'alimentos':
        return 'bg-green-500';
      case 'bebidas':
        return 'bg-blue-500';
      case 'suministros':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Categorías</DialogTitle>
          <DialogDescription>
            Administra las categorías del inventario de alimentos y bebidas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre de la Categoría</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Carnes, Lácteos, Licores..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alimentos">Alimentos</SelectItem>
                        <SelectItem value="bebidas">Bebidas</SelectItem>
                        <SelectItem value="suministros">Suministros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Descripción de la categoría..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingId ? 'Actualizar' : 'Crear'} Categoría
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Categorías Existentes ({categories.length})</h3>
            {loading ? (
              <p className="text-muted-foreground text-center py-4">Cargando categorías...</p>
            ) : categories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay categorías registradas</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Folder className="h-5 w-5 text-muted-foreground mt-1" />
                          <div className="flex-1">
                            <div className="font-medium">{category.nombre}</div>
                            {category.descripcion && (
                              <p className="text-sm text-muted-foreground">{category.descripcion}</p>
                            )}
                            <Badge className={`${getTipoColor(category.tipo)} text-white mt-2`}>
                              {category.tipo}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesManagementDialog;
