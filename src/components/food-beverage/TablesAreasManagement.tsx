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
  Users, 
  MapPin, 
  Clock,
  Calendar,
  User,
  Edit,
  Eye
} from 'lucide-react';

interface Table {
  id: string;
  numero: string;
  capacidad: number;
  area: string;
  estado: 'libre' | 'ocupada' | 'reservada' | 'mantenimiento';
  meseroAsignado?: string;
  clienteActual?: string;
  horaOcupacion?: Date;
  reservas: Reservation[];
}

interface Reservation {
  id: string;
  cliente: string;
  telefono: string;
  fecha: Date;
  hora: string;
  comensales: number;
  estado: 'confirmada' | 'pendiente' | 'cancelada' | 'cumplida';
  observaciones?: string;
}

interface Waiter {
  id: string;
  nombre: string;
  area: string;
  turno: string;
  mesasAsignadas: string[];
  estado: 'activo' | 'descanso' | 'ocupado';
}

const TablesAreasManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Mock data
  const [tables] = useState<Table[]>([
    {
      id: '1',
      numero: 'Mesa 1',
      capacidad: 4,
      area: 'Restaurante Principal',
      estado: 'ocupada',
      meseroAsignado: 'Carlos Rodríguez',
      clienteActual: 'Familia Pérez',
      horaOcupacion: new Date(Date.now() - 45 * 60 * 1000),
      reservas: []
    },
    {
      id: '2',
      numero: 'Mesa 12',
      capacidad: 6,
      area: 'Restaurante Principal',
      estado: 'reservada',
      meseroAsignado: 'María González',
      reservas: [
        {
          id: '1',
          cliente: 'Juan Silva',
          telefono: '300-123-4567',
          fecha: new Date(),
          hora: '19:00',
          comensales: 4,
          estado: 'confirmada'
        }
      ]
    },
    {
      id: '3',
      numero: 'Barra 1',
      capacidad: 2,
      area: 'Bar',
      estado: 'libre',
      meseroAsignado: 'Luis Martínez',
      reservas: []
    },
    {
      id: '4',
      numero: 'Mesa Terraza 5',
      capacidad: 8,
      area: 'Terraza',
      estado: 'mantenimiento',
      reservas: []
    }
  ]);

  const [waiters] = useState<Waiter[]>([
    {
      id: '1',
      nombre: 'Carlos Rodríguez',
      area: 'Restaurante Principal',
      turno: 'Mañana',
      mesasAsignadas: ['Mesa 1', 'Mesa 2', 'Mesa 3'],
      estado: 'ocupado'
    },
    {
      id: '2',
      nombre: 'María González',
      area: 'Restaurante Principal',
      turno: 'Noche',
      mesasAsignadas: ['Mesa 10', 'Mesa 11', 'Mesa 12'],
      estado: 'activo'
    },
    {
      id: '3',
      nombre: 'Luis Martínez',
      area: 'Bar',
      turno: 'Completo',
      mesasAsignadas: ['Barra 1', 'Barra 2', 'Mesa Alta 1', 'Mesa Alta 2'],
      estado: 'activo'
    }
  ]);

  const areas = ['Restaurante Principal', 'Bar', 'Terraza', 'Cafetería', 'Sala VIP'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'libre':
        return 'bg-green-500';
      case 'ocupada':
        return 'bg-red-500';
      case 'reservada':
        return 'bg-blue-500';
      case 'mantenimiento':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'libre':
        return <Users className="h-4 w-4" />;
      case 'ocupada':
        return <Users className="h-4 w-4" />;
      case 'reservada':
        return <Calendar className="h-4 w-4" />;
      case 'mantenimiento':
        return <Edit className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getWaiterStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-500';
      case 'ocupado':
        return 'bg-yellow-500';
      case 'descanso':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOccupationTime = (startTime: Date) => {
    const diff = Date.now() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
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
              placeholder="Buscar mesas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las áreas</SelectItem>
              {areas.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="libre">Libre</SelectItem>
              <SelectItem value="ocupada">Ocupada</SelectItem>
              <SelectItem value="reservada">Reservada</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsReservationDialogOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
          <Button onClick={() => setIsTableDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Mesa
          </Button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tables.map((table) => (
          <motion.div
            key={table.id}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className={`h-full hover:shadow-hotel transition-all duration-300 ${
              table.estado === 'ocupada' ? 'border-red-200' : 
              table.estado === 'reservada' ? 'border-blue-200' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{table.numero}</CardTitle>
                      <Badge className={`${getStatusColor(table.estado)} text-white`}>
                        {getStatusIcon(table.estado)}
                        <span className="ml-1 capitalize">{table.estado}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{table.area}</span>
                      <span>•</span>
                      <Users className="h-4 w-4" />
                      <span>{table.capacidad} personas</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {table.meseroAsignado && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mesero:</span>
                      <span className="font-medium">{table.meseroAsignado}</span>
                    </div>
                  )}
                  
                  {table.clienteActual && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span>{table.clienteActual}</span>
                    </div>
                  )}
                  
                  {table.horaOcupacion && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ocupada desde:</span>
                      <span className="font-medium text-red-600">
                        {calculateOccupationTime(table.horaOcupacion)}
                      </span>
                    </div>
                  )}

                  {table.reservas.length > 0 && (
                    <div className="border-t pt-2">
                      <div className="text-sm font-medium mb-1">Próximas reservas:</div>
                      {table.reservas.slice(0, 2).map((reservation, index) => (
                        <div key={index} className="flex justify-between text-xs text-muted-foreground">
                          <span>{reservation.cliente}</span>
                          <span>{reservation.hora}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {table.estado === 'libre' && (
                    <Button size="sm" className="flex-1">
                      Ocupar Mesa
                    </Button>
                  )}
                  {table.estado === 'ocupada' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      Liberar Mesa
                    </Button>
                  )}
                  {table.estado === 'reservada' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      Ver Reserva
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Waiters Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Personal de Servicio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {waiters.map((waiter) => (
            <Card key={waiter.id} className="hover:shadow-hotel transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{waiter.nombre}</div>
                      <div className="text-sm text-muted-foreground">{waiter.area}</div>
                    </div>
                  </div>
                  <Badge className={`${getWaiterStatusColor(waiter.estado)} text-white`}>
                    {waiter.estado}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Turno:</span>
                    <span>{waiter.turno}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mesas asignadas:</span>
                    <span>{waiter.mesasAsignadas.length}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">Mesas:</div>
                  <div className="flex flex-wrap gap-1">
                    {waiter.mesasAsignadas.slice(0, 3).map((mesa, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {mesa}
                      </Badge>
                    ))}
                    {waiter.mesasAsignadas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{waiter.mesasAsignadas.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tables.filter(t => t.estado === 'libre').length}
              </div>
              <div className="text-sm text-muted-foreground">Mesas Libres</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {tables.filter(t => t.estado === 'ocupada').length}
              </div>
              <div className="text-sm text-muted-foreground">Mesas Ocupadas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tables.filter(t => t.estado === 'reservada').length}
              </div>
              <div className="text-sm text-muted-foreground">Reservadas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round((tables.filter(t => t.estado === 'ocupada').length / tables.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Ocupación</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Table Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Mesa</DialogTitle>
            <DialogDescription>
              Registra una nueva mesa en el sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="numero">Número/Nombre de Mesa</Label>
              <Input id="numero" placeholder="Ej: Mesa 15 o Barra VIP" />
            </div>
            
            <div>
              <Label htmlFor="capacidad">Capacidad</Label>
              <Input id="capacidad" type="number" placeholder="4" />
            </div>
            
            <div>
              <Label htmlFor="area">Área</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setIsTableDialogOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setIsTableDialogOpen(false)} className="flex-1">
              Crear Mesa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Reservation Dialog */}
      <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva Reserva</DialogTitle>
            <DialogDescription>
              Crear una nueva reserva de mesa
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente">Nombre del Cliente</Label>
                <Input id="cliente" placeholder="Juan Pérez" />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" placeholder="300-123-4567" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" type="date" />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input id="hora" type="time" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comensales">Comensales</Label>
                <Input id="comensales" type="number" placeholder="4" />
              </div>
              <div>
                <Label htmlFor="mesa">Mesa Preferida</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Automática" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.filter(t => t.estado === 'libre').map(table => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.numero} ({table.capacidad} personas)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input id="observaciones" placeholder="Celebración especial, alergias, etc." />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setIsReservationDialogOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setIsReservationDialogOpen(false)} className="flex-1">
              Crear Reserva
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TablesAreasManagement;