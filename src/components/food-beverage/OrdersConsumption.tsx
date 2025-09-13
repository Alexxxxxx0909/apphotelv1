import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  DollarSign,
  Users,
  BedDouble,
  Coffee
} from 'lucide-react';

interface Order {
  id: string;
  numeroOrden: string;
  fechaHora: Date;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  tipo: 'restaurante' | 'bar' | 'cafeteria' | 'room-service';
  mesa?: string;
  habitacion?: string;
  mesero: string;
  cliente: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  observaciones?: string;
}

interface OrderItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  observaciones?: string;
}

const OrdersConsumption: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data
  const [orders] = useState<Order[]>([
    {
      id: '1',
      numeroOrden: 'ORD-2024-001',
      fechaHora: new Date(),
      estado: 'preparando',
      tipo: 'restaurante',
      mesa: 'Mesa 12',
      mesero: 'Carlos Rodríguez',
      cliente: 'Juan Pérez',
      items: [
        { id: '1', nombre: 'Filete Premium', precio: 45000, cantidad: 2 },
        { id: '2', nombre: 'Vino Tinto Copa', precio: 12000, cantidad: 2 }
      ],
      subtotal: 114000,
      total: 114000,
      observaciones: 'Término medio, sin sal'
    },
    {
      id: '2',
      numeroOrden: 'ORD-2024-002',
      fechaHora: new Date(Date.now() - 30 * 60 * 1000),
      estado: 'pendiente',
      tipo: 'room-service',
      habitacion: '205',
      mesero: 'María González',
      cliente: 'Ana Silva - Habitación 205',
      items: [
        { id: '3', nombre: 'Desayuno Continental', precio: 25000, cantidad: 1 },
        { id: '4', nombre: 'Jugo de Naranja', precio: 8000, cantidad: 2 }
      ],
      subtotal: 41000,
      total: 41000
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500';
      case 'preparando':
        return 'bg-blue-500';
      case 'listo':
        return 'bg-green-500';
      case 'entregado':
        return 'bg-gray-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="h-4 w-4" />;
      case 'preparando':
        return <Clock className="h-4 w-4" />;
      case 'listo':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'entregado':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurante':
        return <Users className="h-4 w-4" />;
      case 'bar':
        return <Coffee className="h-4 w-4" />;
      case 'cafeteria':
        return <Coffee className="h-4 w-4" />;
      case 'room-service':
        return <BedDouble className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
              placeholder="Buscar órdenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="preparando">Preparando</SelectItem>
              <SelectItem value="listo">Listo</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Tipo de servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los servicios</SelectItem>
              <SelectItem value="restaurante">Restaurante</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="cafeteria">Cafetería</SelectItem>
              <SelectItem value="room-service">Room Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full lg:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="h-full hover:shadow-hotel transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{order.numeroOrden}</CardTitle>
                      <Badge className={`${getStatusColor(order.estado)} text-white`}>
                        {getStatusIcon(order.estado)}
                        <span className="ml-1 capitalize">{order.estado}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getTypeIcon(order.tipo)}
                      <span className="capitalize">{order.tipo}</span>
                      <span>•</span>
                      <span>{formatTime(order.fechaHora)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-medium">{order.cliente}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mesero:</span>
                    <span>{order.mesero}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {order.tipo === 'room-service' ? 'Habitación:' : 'Mesa:'}
                    </span>
                    <span>{order.habitacion || order.mesa}</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.cantidad}x {item.nombre}</span>
                        <span>{formatCurrency(item.precio * item.cantidad)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {order.observaciones && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    <strong>Observaciones:</strong> {order.observaciones}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {order.estado === 'pendiente' && (
                    <Button size="sm" className="flex-1">
                      Iniciar Preparación
                    </Button>
                  )}
                  {order.estado === 'preparando' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      Marcar Listo
                    </Button>
                  )}
                  {order.estado === 'listo' && (
                    <Button size="sm" variant="default" className="flex-1">
                      Entregar
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Ver Detalles
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
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-muted-foreground">Órdenes Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-muted-foreground">En Preparación</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-muted-foreground">Entregadas Hoy</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">$456,000</div>
              <div className="text-sm text-muted-foreground">Ventas del Día</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Orden</DialogTitle>
            <DialogDescription>
              Registra una nueva orden de consumo
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de Servicio</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurante">Restaurante</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="cafeteria">Cafetería</SelectItem>
                    <SelectItem value="room-service">Room Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  placeholder="Nombre del cliente"
                />
              </div>
              
              <div>
                <Label htmlFor="mesero">Mesero Asignado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mesero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carlos">Carlos Rodríguez</SelectItem>
                    <SelectItem value="maria">María González</SelectItem>
                    <SelectItem value="luis">Luis Martínez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="mesa">Mesa/Habitación</Label>
                <Input
                  id="mesa"
                  placeholder="Ej: Mesa 12 o Habitación 205"
                />
              </div>
              
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  id="observaciones"
                  placeholder="Instrucciones especiales"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
              Crear Orden
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrdersConsumption;