import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Bed, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Ban,
  Wrench,
  User,
  CalendarClock
} from 'lucide-react';

interface Room {
  number: string;
  floor: number;
  type: string;
  status: 'clean' | 'dirty' | 'cleaning' | 'ready' | 'blocked' | 'maintenance';
  guestName?: string;
  checkOut?: string;
  checkIn?: string;
  assignedTo?: string;
  lastCleaned?: string;
  cleaningTime?: number;
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

const mockRooms: Room[] = [
  {
    number: '101',
    floor: 1,
    type: 'Standard',
    status: 'dirty',
    guestName: 'María García',
    checkOut: '11:00',
    checkIn: '15:00',
    priority: 'high',
    notes: 'Check-out tardío, revisar minibar'
  },
  {
    number: '102',
    floor: 1,
    type: 'Standard',
    status: 'cleaning',
    assignedTo: 'Carmen López',
    lastCleaned: '12:30',
    cleaningTime: 25,
    priority: 'normal'
  },
  {
    number: '103',
    floor: 1,
    type: 'Superior',
    status: 'ready',
    lastCleaned: '10:15',
    cleaningTime: 45,
    priority: 'low'
  },
  {
    number: '201',
    floor: 2,
    type: 'Suite',
    status: 'blocked',
    notes: 'Aire acondicionado en reparación',
    priority: 'urgent'
  },
  {
    number: '202',
    floor: 2,
    type: 'Standard',
    status: 'clean',
    checkIn: '14:00',
    priority: 'normal'
  }
];

const RoomStatusManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.includes(searchTerm) || 
                         (room.guestName && room.guestName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesFloor && matchesStatus;
  });

  const updateRoomStatus = (roomNumber: string, newStatus: Room['status'], assignedTo?: string) => {
    setRooms(rooms.map(room => 
      room.number === roomNumber 
        ? { 
            ...room, 
            status: newStatus,
            assignedTo: assignedTo || room.assignedTo,
            lastCleaned: newStatus === 'ready' ? new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : room.lastCleaned
          }
        : room
    ));
  };

  const getStatusColor = (status: Room['status']) => {
    const colors = {
      'clean': 'bg-blue-100 text-blue-800',
      'dirty': 'bg-red-100 text-red-800',
      'cleaning': 'bg-yellow-100 text-yellow-800',
      'ready': 'bg-green-100 text-green-800',
      'blocked': 'bg-gray-100 text-gray-800',
      'maintenance': 'bg-orange-100 text-orange-800'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Room['status']) => {
    const icons = {
      'clean': CheckCircle,
      'dirty': AlertTriangle,
      'cleaning': Clock,
      'ready': CheckCircle,
      'blocked': Ban,
      'maintenance': Wrench
    };
    return icons[status];
  };

  const getStatusLabel = (status: Room['status']) => {
    const labels = {
      'clean': 'Limpia',
      'dirty': 'Sucia',
      'cleaning': 'En Limpieza',
      'ready': 'Lista',
      'blocked': 'Bloqueada',
      'maintenance': 'Mantenimiento'
    };
    return labels[status];
  };

  const getPriorityColor = (priority: Room['priority']) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'normal': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por habitación o huésped..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Piso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los pisos</SelectItem>
                <SelectItem value="1">Piso 1</SelectItem>
                <SelectItem value="2">Piso 2</SelectItem>
                <SelectItem value="3">Piso 3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="dirty">Sucias</SelectItem>
                <SelectItem value="cleaning">En Limpieza</SelectItem>
                <SelectItem value="ready">Listas</SelectItem>
                <SelectItem value="blocked">Bloqueadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const StatusIcon = getStatusIcon(room.status);
          return (
            <Card key={room.number} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span>Habitación {room.number}</span>
                    </CardTitle>
                    <CardDescription>{room.type} - Piso {room.floor}</CardDescription>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge className={getStatusColor(room.status)}>
                      {getStatusLabel(room.status)}
                    </Badge>
                    <Badge className={getPriorityColor(room.priority)} variant="outline">
                      {room.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {room.guestName && (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{room.guestName}</span>
                  </div>
                )}
                
                {(room.checkOut || room.checkIn) && (
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {room.checkOut && `Salida: ${room.checkOut}`}
                      {room.checkOut && room.checkIn && ' | '}
                      {room.checkIn && `Entrada: ${room.checkIn}`}
                    </span>
                  </div>
                )}

                {room.assignedTo && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <User className="h-4 w-4" />
                    <span>Asignada a: {room.assignedTo}</span>
                  </div>
                )}

                {room.lastCleaned && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Limpieza: {room.lastCleaned} ({room.cleaningTime}min)</span>
                  </div>
                )}

                {room.notes && (
                  <div className="bg-yellow-50 p-2 rounded text-sm">
                    <strong>Nota:</strong> {room.notes}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {room.status === 'dirty' && (
                    <Button size="sm" onClick={() => updateRoomStatus(room.number, 'cleaning', 'Camarera disponible')}>
                      Iniciar Limpieza
                    </Button>
                  )}
                  {room.status === 'cleaning' && (
                    <Button size="sm" onClick={() => updateRoomStatus(room.number, 'ready')}>
                      Marcar Lista
                    </Button>
                  )}
                  {room.status === 'clean' && (
                    <Button size="sm" variant="outline" onClick={() => updateRoomStatus(room.number, 'ready')}>
                      Confirmar Lista
                    </Button>
                  )}
                  {room.status === 'ready' && (
                    <Badge className="bg-green-100 text-green-800">Lista para Check-in</Badge>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Cambiar Estado
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cambiar Estado - Habitación {room.number}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Selecciona el nuevo estado para esta habitación.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" onClick={() => updateRoomStatus(room.number, 'clean')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Limpia
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => updateRoomStatus(room.number, 'dirty')}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Sucia
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => updateRoomStatus(room.number, 'cleaning')}>
                          <Clock className="h-4 w-4 mr-2" />
                          En Limpieza
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => updateRoomStatus(room.number, 'blocked')}>
                          <Ban className="h-4 w-4 mr-2" />
                          Bloqueada
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => updateRoomStatus(room.number, 'maintenance')}>
                          <Wrench className="h-4 w-4 mr-2" />
                          Mantenimiento
                        </Button>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron habitaciones con los filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RoomStatusManagement;