import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useInventoryCategories } from '@/hooks/useInventoryCategories';
import { useHousekeepingCategories } from '@/hooks/useHousekeepingCategories';

const SuppliersManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const hotelId = user?.hotel;
  
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers(hotelId);
  const { categories: inventoryCategories } = useInventoryCategories(hotelId);
  const { categories: housekeepingCategories } = useHousekeepingCategories(hotelId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', nit: '', category: '', contact: '', email: '', phone: '', address: '', status: 'activo' as 'activo' | 'inactivo'
  });

  const resetForm = () => {
    setFormData({
      name: '', nit: '', category: '', contact: '', email: '', phone: '', address: '', status: 'activo'
    });
    setEditingSupplier(null);
  };

  const handleSubmit = async () => {
    if (!hotelId) {
      toast({ title: 'Error', description: 'No se encontró el hotel', variant: 'destructive' });
      return;
    }

    if (!formData.name || !formData.nit || !formData.category) {
      toast({ title: 'Error', description: 'Complete los campos requeridos', variant: 'destructive' });
      return;
    }

    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier, {
          nombre: formData.name,
          nit: formData.nit,
          categoria: formData.category,
          contacto: formData.contact,
          email: formData.email,
          telefono: formData.phone,
          direccion: formData.address,
          estado: formData.status
        });
        toast({ title: 'Proveedor actualizado', description: 'El proveedor ha sido actualizado exitosamente.' });
      } else {
        await addSupplier({
          nombre: formData.name,
          nit: formData.nit,
          categoria: formData.category,
          contacto: formData.contact,
          email: formData.email,
          telefono: formData.phone,
          direccion: formData.address,
          estado: formData.status,
          hotelId
        });
        toast({ title: 'Proveedor registrado', description: 'El proveedor ha sido agregado exitosamente.' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar el proveedor', variant: 'destructive' });
    }
  };

  const handleEdit = (supplier: any) => {
    setFormData({
      name: supplier.nombre,
      nit: supplier.nit,
      category: supplier.categoria,
      contact: supplier.contacto,
      email: supplier.email,
      phone: supplier.telefono,
      address: supplier.direccion,
      status: supplier.estado
    });
    setEditingSupplier(supplier.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      toast({ title: 'Proveedor eliminado', description: 'El proveedor ha sido eliminado exitosamente.' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el proveedor', variant: 'destructive' });
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Map category types to Spanish labels
  const getInventoryCategoryTypeLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'alimentos': 'Alimentos',
      'bebidas': 'Bebidas',
      'suministros': 'Suministros'
    };
    return labels[tipo] || tipo;
  };

  const getHousekeepingCategoryTypeLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'linen': 'Lencería',
      'amenities': 'Amenidades',
      'cleaning': 'Limpieza',
      'maintenance': 'Mantenimiento'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar proveedores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nuevo Proveedor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSupplier ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}</DialogTitle>
              <DialogDescription>Complete la información del proveedor</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razón Social *</Label>
                <Input placeholder="Nombre del proveedor" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>NIT *</Label>
                <Input placeholder="123456789-1" value={formData.nit} onChange={(e) => setFormData({...formData, nit: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                  <SelectContent className="bg-background">
                    {/* Categorías de Inventario de Alimentos y Bebidas */}
                    {inventoryCategories.length > 0 && (
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                          📦 Inventario Alimentos y Bebidas
                        </SelectLabel>
                        {inventoryCategories.map((cat) => (
                          <SelectItem key={`inv-${cat.id}`} value={`inv-${cat.nombre}`}>
                            {cat.nombre} ({getInventoryCategoryTypeLabel(cat.tipo)})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    
                    {/* Categorías de Inventario de Housekeeping */}
                    {housekeepingCategories.length > 0 && (
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                          🧹 Inventario Housekeeping
                        </SelectLabel>
                        {housekeepingCategories.map((cat) => (
                          <SelectItem key={`hk-${cat.id}`} value={`hk-${cat.nombre}`}>
                            {cat.nombre} ({getHousekeepingCategoryTypeLabel(cat.tipo)})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}

                    {/* Categorías generales si no hay categorías en la base de datos */}
                    {inventoryCategories.length === 0 && housekeepingCategories.length === 0 && (
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                          Categorías Generales
                        </SelectLabel>
                        <SelectItem value="Alimentos">Alimentos</SelectItem>
                        <SelectItem value="Bebidas">Bebidas</SelectItem>
                        <SelectItem value="Insumos">Insumos</SelectItem>
                        <SelectItem value="Limpieza">Limpieza</SelectItem>
                        <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                        <SelectItem value="Servicios">Servicios</SelectItem>
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contacto</Label>
                <Input placeholder="Nombre del contacto" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@ejemplo.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input placeholder="555-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Dirección</Label>
                <Textarea placeholder="Dirección completa" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editingSupplier ? 'Actualizar' : 'Guardar'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando proveedores...</div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay proveedores registrados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.nombre}</TableCell>
                    <TableCell>{supplier.nit}</TableCell>
                    <TableCell>{supplier.categoria.replace(/^(inv-|hk-)/, '')}</TableCell>
                    <TableCell>{supplier.contacto}</TableCell>
                    <TableCell>{supplier.telefono}</TableCell>
                    <TableCell>⭐ {supplier.calificacion || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.estado === 'activo' ? 'default' : 'secondary'}>
                        {supplier.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(supplier.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersManagement;
