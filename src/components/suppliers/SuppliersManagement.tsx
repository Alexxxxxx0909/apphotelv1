import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuppliersManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Distribuidora de Alimentos SA', nit: '123456789-1', category: 'Alimentos', contact: 'Juan Pérez', phone: '555-0101', status: 'Activo', rating: 4.5 },
    { id: 2, name: 'Licores Premium Ltda', nit: '987654321-9', category: 'Bebidas', contact: 'María García', phone: '555-0102', status: 'Activo', rating: 4.8 },
  ]);

  const [formData, setFormData] = useState({
    name: '', nit: '', category: '', contact: '', email: '', phone: '', address: '', status: 'Activo'
  });

  const handleSubmit = () => {
    toast({ title: 'Proveedor registrado', description: 'El proveedor ha sido agregado exitosamente.' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar proveedores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nuevo Proveedor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Proveedor</DialogTitle>
              <DialogDescription>Complete la información del proveedor</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razón Social</Label>
                <Input placeholder="Nombre del proveedor" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>NIT</Label>
                <Input placeholder="123456789-1" value={formData.nit} onChange={(e) => setFormData({...formData, nit: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimentos">Alimentos</SelectItem>
                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                    <SelectItem value="Insumos">Insumos</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="Servicios">Servicios</SelectItem>
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
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
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.nit}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>⭐ {supplier.rating}</TableCell>
                  <TableCell><Badge variant={supplier.status === 'Activo' ? 'default' : 'secondary'}>{supplier.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersManagement;
