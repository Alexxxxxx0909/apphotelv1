import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bed, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wrench,
  Calendar as CalendarIcon,
  Filter,
  RefreshCw,
  Users,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useRooms } from '@/hooks/useRooms';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { useRoomFeatures } from '@/hooks/useRoomFeatures';

const statusConfig = {
  disponible: { label: 'Disponible', color: 'bg-green-500', icon: CheckCircle },
  ocupada: { label: 'Ocupada', color: 'bg-red-500', icon: XCircle },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-yellow-500', icon: Wrench },
  limpieza: { label: 'Limpieza', color: 'bg-blue-500', icon: RefreshCw },
  fuera_servicio: { label: 'Fuera de Servicio', color: 'bg-gray-500', icon: XCircle }
};

const AvailabilityControl: React.FC = () => {
  const { user } = useAuth();
  const hotelId = user?.hotel || '';
  const { rooms, loading } = useRooms(hotelId);
  const { roomTypes } = useRoomTypes(hotelId);
  const { features } = useRoomFeatures(hotelId);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getRoomType = (roomTypeId: string) => {
    return roomTypes.find(rt => rt.id === roomTypeId);
  };

  const filteredRooms = rooms.filter(room => {
    if (filterStatus !== 'all' && room.estado !== filterStatus) return false;
    if (filterFloor !== 'all' && room.piso?.toString() !== filterFloor) return false;
    return true;
  });

  const uniqueFloors = [...new Set(rooms.map(r => r.piso).filter(Boolean))].sort();

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setIsDetailsOpen(true);
  };

  const getStatusStats = () => {
    return {
      total: rooms.length,
      disponible: rooms.filter(r => r.estado === 'disponible').length,
      ocupada: rooms.filter(r => r.estado === 'ocupada').length,
      mantenimiento: rooms.filter(r => r.estado === 'mantenimiento').length,
      limpieza: rooms.filter(r => r.estado === 'limpieza').length,
      fuera_servicio: rooms.filter(r => r.estado === 'fuera_servicio').length
    };
  };

  const stats = getStatusStats();
  const occupancyRate = stats.total > 0 ? ((stats.ocupada / stats.total) * 100).toFixed(1) : '0.0';

  if (loading) {
    return <div className="text-center py-8">Cargando habitaciones...</div>;
  }

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
            <div className="text-2xl font-bold text-green-600">{stats.disponible}</div>
            <div className="text-sm text-muted-foreground">Disponibles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.ocupada}</div>
            <div className="text-sm text-muted-foreground">Ocupadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.mantenimiento}</div>
            <div className="text-sm text-muted-foreground">Mantenimiento</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.limpieza}</div>
            <div className="text-sm text-muted-foreground">Limpieza</div>
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
                    <SelectItem value="disponible">Disponibles</SelectItem>
                    <SelectItem value="ocupada">Ocupadas</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterFloor} onValueChange={setFilterFloor}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Piso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueFloors.map(floor => (
                      <SelectItem key={floor} value={floor.toString()}>
                        Piso {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRooms.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No se encontraron habitaciones con los filtros seleccionados
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const statusInfo = statusConfig[room.estado as keyof typeof statusConfig] || statusConfig.disponible;
                  const StatusIcon = statusInfo.icon;
                  const roomType = getRoomType(room.tipo);
                  
                  return (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => handleRoomClick(room)}
                    >
                      <Card className={`border-l-4 border-l-${statusInfo.color.split('-')[1]}-500`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold text-lg flex items-center space-x-2">
                                <Bed className="h-4 w-4" />
                                <span>{room.numero}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {roomType?.nombre || 'N/A'} {room.piso && `- Piso ${room.piso}`}
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
                          
                          <div className="mt-3 flex justify-between items-center">
                            <div className="text-sm font-medium">
                              ${room.precio}/noche
                            </div>
                            <Button size="sm" variant="outline">
                              Ver Detalles
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
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

      {/* Modal de Detalles */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Habitación {selectedRoom?.numero}</DialogTitle>
            <DialogDescription>
              Información completa de la habitación
            </DialogDescription>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Número:</span>
                      <span className="font-medium">{selectedRoom.numero}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">{getRoomType(selectedRoom.tipo)?.nombre || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Piso:</span>
                      <span className="font-medium">{selectedRoom.piso || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge className={statusConfig[selectedRoom.estado as keyof typeof statusConfig]?.color}>
                        {statusConfig[selectedRoom.estado as keyof typeof statusConfig]?.label || selectedRoom.estado}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Capacidad y Tarifas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacidad:</span>
                      <span className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedRoom.capacidad || 'N/A'} personas
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio/noche:</span>
                      <span className="font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${selectedRoom.precio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRoom.caracteristicas && selectedRoom.caracteristicas.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Características</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.caracteristicas.map((featureId: string) => {
                      const feature = features.find(f => f.id === featureId);
                      return feature ? (
                        <Badge key={featureId} variant="outline">
                          {feature.nombre}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Descripción del Tipo</h4>
                <p className="text-sm text-muted-foreground">
                  {getRoomType(selectedRoom.tipo)?.descripcion || 'Sin descripción'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AvailabilityControl;