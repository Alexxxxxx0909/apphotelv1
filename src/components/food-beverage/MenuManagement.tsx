import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Star,
  DollarSign,
  Clock
} from 'lucide-react';

interface MenuItem {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
  categoria: string;
  tipo: 'plato' | 'bebida';
  activo: boolean;
  especial: boolean;
  tiempoPreparacion: number;
  ingredientes: string[];
}

const MenuManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Mock data
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      nombre: 'Filete de Res Premium',
      descripcion: 'Filete de res 300g con salsa de vino tinto y papas gratinadas',
      precio: 45000,
      costo: 25000,
      categoria: 'Carnes',
      tipo: 'plato',
      activo: true,
      especial: true,
      tiempoPreparacion: 25,
      ingredientes: ['Filete de res', 'Papas', 'Vino tinto', 'Mantequilla']
    },
    {
      id: '2',
      nombre: 'Mojito Clásico',
      descripcion: 'Ron blanco, menta fresca, limón y agua con gas',
      precio: 15000,
      costo: 4000,
      categoria: 'Cócteles',
      tipo: 'bebida',
      activo: true,
      especial: false,
      tiempoPreparacion: 5,
      ingredientes: ['Ron blanco', 'Menta', 'Limón', 'Azúcar']
    }
  ]);

  const categories = ['Entradas', 'Carnes', 'Pescados', 'Pastas', 'Postres', 'Bebidas Frías', 'Bebidas Calientes', 'Cócteles'];

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

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

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="h-full hover:shadow-hotel transition-all duration-300">
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
                  <Switch checked={item.activo} />
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
                  <strong>Margen:</strong> {Math.round(((item.precio - item.costo) / item.precio) * 100)}%
                </div>

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
                    className="text-red-600 hover:text-red-700"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Item del Menú' : 'Crear Nuevo Item'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modifica los detalles del item' : 'Completa la información del nuevo item del menú'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Item</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Filete de Res Premium"
                  defaultValue={editingItem?.nombre}
                />
              </div>
              
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del plato o bebida"
                  defaultValue={editingItem?.descripcion}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="precio">Precio de Venta</Label>
                  <Input
                    id="precio"
                    type="number"
                    placeholder="45000"
                    defaultValue={editingItem?.precio}
                  />
                </div>
                <div>
                  <Label htmlFor="costo">Costo</Label>
                  <Input
                    id="costo"
                    type="number"
                    placeholder="25000"
                    defaultValue={editingItem?.costo}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select defaultValue={editingItem?.tipo || 'plato'}>
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
                <Label htmlFor="categoria">Categoría</Label>
                <Select defaultValue={editingItem?.categoria}>
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
                  defaultValue={editingItem?.tiempoPreparacion}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="activo" defaultChecked={editingItem?.activo ?? true} />
                <Label htmlFor="activo">Activo</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="especial" defaultChecked={editingItem?.especial ?? false} />
                <Label htmlFor="especial">Menú Especial</Label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
              {editingItem ? 'Actualizar' : 'Crear'} Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MenuManagement;