import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bed, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wrench,
  Calendar as CalendarIcon,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'dirty' | 'cleaning';
  checkOut?: string;
  checkIn?: string;
  guest?: string;
  price: number;
}

const mockRooms: Room[] = [
  { id: '1', number: '101', type: 'Individual', floor: 1, status: 'available', price: 80 },
  { id: '2', number: '102', type: 'Individual', floor: 1, status: 'occupied', guest: 'Juan Pérez', checkOut: '2024-01-15', price: 80 },
  { id: '3', number: '103', type: 'Doble', floor: 1, status: 'dirty', price: 120 },
  { id: '4', number: '201', type: 'Suite', floor: 2, status: 'available', price: 200 },
  { id: '5', number: '202', type: 'Doble', floor: 2, status: 'maintenance', price: 120 },
  { id: '6', number: '203', type: 'Suite', floor: 2, status: 'cleaning', price: 200 },
  { id: '7', number: '301', type: 'Deluxe', floor: 3, status: 'available', price: 150 },
  { id: '8', number: '302', type: 'Familiar', floor: 3, status: 'occupied', guest: 'María García', checkOut: '2024-01-16', price: 180 },
];

const statusConfig = {
  available: { label: 'Disponible', color: 'bg-green-500', icon: CheckCircle },
  occupied: { label: 'Ocupada', color: 'bg-red-500', icon: XCircle },
  maintenance: { label: 'Mantenimiento', color: 'bg-yellow-500', icon: Wrench },
  dirty: { label: 'Sucia', color: 'bg-orange-500', icon: Clock },
  cleaning: { label: 'Limpieza', color: 'bg-blue-500', icon: RefreshCw }
};

const AvailabilityControl: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [rooms, setRooms] = useState<Room[]>(mockRooms);

  const filteredRooms = rooms.filter(room => {
    if (filterStatus !== 'all' && room.status !== filterStatus) return false;
    if (filterFloor !== 'all' && room.floor.toString() !== filterFloor) return false;
    return true;
  });

  const getStatusStats = () => {
    return {
      total: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      occupied: rooms.filter(r => r.status === 'occupied').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
      dirty: rooms.filter(r => r.status === 'dirty').length,
      cleaning: rooms.filter(r => r.status === 'cleaning').length
    };
  };

  const stats = getStatusStats();
  const occupancyRate = ((stats.occupied / stats.total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-muted-foreground">Disponibles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
            <div className="text-sm text-muted-foreground">Ocupadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
            <div className="text-sm text-muted-foreground">Mantenimiento</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.dirty}</div>
            <div className="text-sm text-muted-foreground">Sucias</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{occupancyRate}%</div>
            <div className="text-sm text-muted-foreground">Ocupación</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Fecha</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">
                {format(selectedDate, "EEEE, d MMMM yyyy", { locale: es })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Habitaciones */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Estado de Habitaciones</CardTitle>
                <CardDescription>
                  Control en tiempo real - {format(selectedDate, "d MMM yyyy", { locale: es })}
                </CardDescription>
              </div>
              <div className="flex space-x-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="available">Disponibles</SelectItem>
                    <SelectItem value="occupied">Ocupadas</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="dirty">Sucias</SelectItem>
                    <SelectItem value="cleaning">Limpieza</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterFloor} onValueChange={setFilterFloor}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Piso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="1">Piso 1</SelectItem>
                    <SelectItem value="2">Piso 2</SelectItem>
                    <SelectItem value="3">Piso 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const statusInfo = statusConfig[room.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                  >
                    <Card className={`border-l-4 border-l-${statusInfo.color.split('-')[1]}-500`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-lg flex items-center space-x-2">
                              <Bed className="h-4 w-4" />
                              <span>{room.number}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {room.type} - Piso {room.floor}
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`${statusInfo.color} text-white`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        {room.guest && (
                          <div className="space-y-1 text-sm">
                            <div className="text-muted-foreground">Huésped:</div>
                            <div className="font-medium">{room.guest}</div>
                            {room.checkOut && (
                              <div className="text-muted-foreground">
                                Check-out: {room.checkOut}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-sm font-medium">
                            ${room.price}/noche
                          </div>
                          <Button size="sm" variant="outline">
                            Ver Detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leyenda de Estados */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              return (
                <div key={status} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${config.color}`}></div>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{config.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AvailabilityControl;