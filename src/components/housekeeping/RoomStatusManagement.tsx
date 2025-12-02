import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bed, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Ban,
  Wrench,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRooms, Room } from '@/hooks/useRooms';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { toast } from 'sonner';

const RoomStatusManagement: React.FC = () => {
  const { user } = useAuth();
  const { rooms, loading, updateRoom } = useRooms(user?.hotel);
  const { roomTypes } = useRoomTypes(user?.hotel);
  const [searchTerm, setSearchTerm] = useState('');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingRoom, setUpdatingRoom] = useState<string | null>(null);

  // Get unique floors from rooms
  const uniqueFloors = [...new Set(rooms.map(room => room.piso))].sort((a, b) => a - b);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.numero.includes(searchTerm);
    const matchesFloor = floorFilter === 'all' || room.piso.toString() === floorFilter;
    const matchesStatus = statusFilter === 'all' || room.estado === statusFilter;
    return matchesSearch && matchesFloor && matchesStatus;
  });

  const getRoomTypeName = (tipoId?: string) => {
    if (!tipoId) return 'Sin tipo';
    const roomType = roomTypes.find(rt => rt.id === tipoId);
    return roomType?.nombre || 'Sin tipo';
  };

  const handleMarkAsReady = async (room: Room) => {
    setUpdatingRoom(room.id);
    try {
      await updateRoom(room.id, { estado: 'disponible' });
      toast.success(`Habitación ${room.numero} marcada como disponible`);
    } catch (error) {
      toast.error('Error al actualizar el estado de la habitación');
    } finally {
      setUpdatingRoom(null);
    }
  };

  const getStatusColor = (status: Room['estado']) => {
    const colors = {
      'disponible': 'bg-green-100 text-green-800',
      'ocupada': 'bg-blue-100 text-blue-800',
      'limpieza': 'bg-yellow-100 text-yellow-800',
      'mantenimiento': 'bg-orange-100 text-orange-800',
      'fuera_servicio': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: Room['estado']) => {
    const icons = {
      'disponible': CheckCircle,
      'ocupada': Bed,
      'limpieza': Clock,
      'mantenimiento': Wrench,
      'fuera_servicio': Ban
    };
    return icons[status] || AlertTriangle;
  };

  const getStatusLabel = (status: Room['estado']) => {
    const labels = {
      'disponible': 'Disponible',
      'ocupada': 'Ocupada',
      'limpieza': 'En Limpieza',
      'mantenimiento': 'Mantenimiento',
      'fuera_servicio': 'Fuera de Servicio'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando habitaciones...</span>
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
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Gestión de Estado de Habitaciones</h3>
        <p className="text-muted-foreground">Control en tiempo real del estado de todas las habitaciones</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {rooms.filter(r => r.estado === 'disponible').length}
              </p>
              <p className="text-sm text-muted-foreground">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {rooms.filter(r => r.estado === 'ocupada').length}
              </p>
              <p className="text-sm text-muted-foreground">Ocupadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {rooms.filter(r => r.estado === 'limpieza').length}
              </p>
              <p className="text-sm text-muted-foreground">Limpieza</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {rooms.filter(r => r.estado === 'mantenimiento').length}
              </p>
              <p className="text-sm text-muted-foreground">Mantenimiento</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {rooms.filter(r => r.estado === 'fuera_servicio').length}
              </p>
              <p className="text-sm text-muted-foreground">Fuera de Servicio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de habitación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Piso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los pisos</SelectItem>
                {uniqueFloors.map(floor => (
                  <SelectItem key={floor} value={floor.toString()}>Piso {floor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponibles</SelectItem>
                <SelectItem value="ocupada">Ocupadas</SelectItem>
                <SelectItem value="limpieza">En Limpieza</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const StatusIcon = getStatusIcon(room.estado);
          const showMarkAsReadyButton = room.estado === 'limpieza' || room.estado === 'mantenimiento';
          
          return (
            <Card key={room.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span>Habitación {room.numero}</span>
                    </CardTitle>
                    <CardDescription>
                      {getRoomTypeName(room.tipoId)} - Piso {room.piso}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(room.estado)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {getStatusLabel(room.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>Capacidad: {room.capacidad} personas</p>
                  <p>Precio: ${room.precio.toLocaleString()}/noche</p>
                </div>

                {room.caracteristicas && room.caracteristicas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {room.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {caracteristica}
                      </Badge>
                    ))}
                    {room.caracteristicas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.caracteristicas.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {room.ultimaLimpieza && (
                  <div className="text-xs text-muted-foreground">
                    Última limpieza: {room.ultimaLimpieza.toLocaleDateString('es-ES')}
                  </div>
                )}

                {/* Action Button for rooms in cleaning or maintenance */}
                {showMarkAsReadyButton && (
                  <Button 
                    className="w-full mt-2" 
                    onClick={() => handleMarkAsReady(room)}
                    disabled={updatingRoom === room.id}
                  >
                    {updatingRoom === room.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Lista
                      </>
                    )}
                  </Button>
                )}

                {room.estado === 'disponible' && (
                  <div className="flex items-center justify-center py-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Lista para Check-in
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {rooms.length === 0 
                ? 'No hay habitaciones registradas en este hotel.' 
                : 'No se encontraron habitaciones con los filtros aplicados.'}
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RoomStatusManagement;
