import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bed, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Plus,
  Wrench,
  Sparkles,
  Users,
  Calendar
} from 'lucide-react';

interface HousekeepingRequest {
  id: string;
  roomNumber: string;
  requestType: 'liberar' | 'habilitar' | 'limpieza-extra' | 'mantenimiento' | 'inspeccion';
  priority: 'urgente' | 'alta' | 'normal' | 'baja';
  status: 'pendiente' | 'asignada' | 'en-proceso' | 'completada' | 'inspeccion';
  description: string;
  requestedBy: string;
  requestedAt: string;
  assignedTo?: string;
  estimatedTime: number; // en minutos
  completedAt?: string;
  notes?: string;
  guestName?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

const mockRequests: HousekeepingRequest[] = [
  {
    id: '1',
    roomNumber: '205',
    requestType: 'liberar',
    priority: 'urgente',
    status: 'en-proceso',
    description: 'Huésped realizó check-out, liberar habitación para nuevo huésped que llega en 2 horas',
    requestedBy: 'Recepción - Ana García',
    requestedAt: '2024-01-15 12:30',
    assignedTo: 'María López',
    estimatedTime: 45,
    guestName: 'Carlos Mendez',
    checkOutTime: '12:00',
    checkInTime: '15:00'
  },
  {
    id: '2',
    roomNumber: '312',
    requestType: 'habilitar',
    priority: 'alta',
    status: 'pendiente',
    description: 'Habilitar habitación después de reparación de aire acondicionado',
    requestedBy: 'Mantenimiento',
    requestedAt: '2024-01-15 14:15',
    estimatedTime: 30
  },
  {
    id: '3',
    roomNumber: '108',
    requestType: 'limpieza-extra',
    priority: 'normal',
    status: 'completada',
    description: 'Limpieza profunda solicitada por huésped - derrame de vino',
    requestedBy: 'Atención al Cliente',
    requestedAt: '2024-01-15 10:20',
    assignedTo: 'Carmen Ruiz',
    estimatedTime: 60,
    completedAt: '2024-01-15 11:45',
    guestName: 'Laura Jiménez'
  }
];

const HousekeepingCoordination: React.FC = () => {
  const [requests, setRequests] = useState<HousekeepingRequest[]>(mockRequests);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newRequest, setNewRequest] = useState({
    roomNumber: '',
    requestType: 'liberar' as const,
    priority: 'normal' as const,
    description: '',
    estimatedTime: 45,
    guestName: '',
    checkInTime: '',
    checkOutTime: ''
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.roomNumber.includes(searchTerm) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (request.guestName && request.guestName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateRequest = () => {
    const request: HousekeepingRequest = {
      id: Date.now().toString(),
      ...newRequest,
      status: 'pendiente',
      requestedBy: 'Atención al Cliente',
      requestedAt: new Date().toLocaleString('es-ES')
    };
    
    setRequests([request, ...requests]);
    setNewRequest({
      roomNumber: '',
      requestType: 'liberar',
      priority: 'normal',
      description: '',
      estimatedTime: 45,
      guestName: '',
      checkInTime: '',
      checkOutTime: ''
    });
    setShowForm(false);
  };

  const updateRequestStatus = (id: string, status: HousekeepingRequest['status'], assignedTo?: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { 
        ...req, 
        status,
        assignedTo: assignedTo || req.assignedTo,
        completedAt: status === 'completada' ? new Date().toLocaleString('es-ES') : req.completedAt
      } : req
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'asignada': 'bg-blue-100 text-blue-800',
      'en-proceso': 'bg-purple-100 text-purple-800',
      'completada': 'bg-green-100 text-green-800',
      'inspeccion': 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || variants.pendiente;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'urgente': 'bg-red-100 text-red-800',
      'alta': 'bg-orange-100 text-orange-800',
      'normal': 'bg-blue-100 text-blue-800',
      'baja': 'bg-green-100 text-green-800'
    };
    return variants[priority as keyof typeof variants] || variants.normal;
  };

  const getRequestTypeIcon = (type: string) => {
    const icons = {
      'liberar': Bed,
      'habilitar': CheckCircle,
      'limpieza-extra': Sparkles,
      'mantenimiento': Wrench,
      'inspeccion': AlertCircle
    };
    return icons[type as keyof typeof icons] || Bed;
  };

  const getRequestTypeLabel = (type: string) => {
    const labels = {
      'liberar': 'Liberar Habitación',
      'habilitar': 'Habilitar Habitación',
      'limpieza-extra': 'Limpieza Extra',
      'mantenimiento': 'Mantenimiento',
      'inspeccion': 'Inspección'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Estadísticas
  const stats = {
    pendientes: requests.filter(r => r.status === 'pendiente').length,
    enProceso: requests.filter(r => r.status === 'en-proceso' || r.status === 'asignada').length,
    completadas: requests.filter(r => r.status === 'completada').length,
    urgentes: requests.filter(r => r.priority === 'urgente' && r.status !== 'completada').length
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pendientes}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.enProceso}</p>
                <p className="text-sm text-muted-foreground">En Proceso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completadas}</p>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.urgentes}</p>
                <p className="text-sm text-muted-foreground">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Coordinación con Housekeeping</h2>
          <p className="text-muted-foreground">Gestiona solicitudes para liberar y habilitar habitaciones</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por habitación, huésped o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="asignada">Asignada</SelectItem>
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="inspeccion">Inspección</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario nueva solicitud */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Solicitud a Housekeeping</CardTitle>
            <CardDescription>Crea una nueva solicitud para el equipo de housekeeping</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room-number">Habitación</Label>
                <Input
                  id="room-number"
                  value={newRequest.roomNumber}
                  onChange={(e) => setNewRequest({...newRequest, roomNumber: e.target.value})}
                  placeholder="Número de habitación"
                />
              </div>
              <div>
                <Label htmlFor="guest-name">Huésped (opcional)</Label>
                <Input
                  id="guest-name"
                  value={newRequest.guestName}
                  onChange={(e) => setNewRequest({...newRequest, guestName: e.target.value})}
                  placeholder="Nombre del huésped"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="request-type">Tipo de Solicitud</Label>
                <Select value={newRequest.requestType} onValueChange={(value: any) => setNewRequest({...newRequest, requestType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liberar">Liberar Habitación</SelectItem>
                    <SelectItem value="habilitar">Habilitar Habitación</SelectItem>
                    <SelectItem value="limpieza-extra">Limpieza Extra</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="inspeccion">Inspección</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select value={newRequest.priority} onValueChange={(value: any) => setNewRequest({...newRequest, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(newRequest.requestType === 'liberar') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkout-time">Hora Check-out</Label>
                  <Input
                    id="checkout-time"
                    type="time"
                    value={newRequest.checkOutTime}
                    onChange={(e) => setNewRequest({...newRequest, checkOutTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="checkin-time">Hora Check-in Programado</Label>
                  <Input
                    id="checkin-time"
                    type="time"
                    value={newRequest.checkInTime}
                    onChange={(e) => setNewRequest({...newRequest, checkInTime: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="estimated-time">Tiempo Estimado (minutos)</Label>
              <Input
                id="estimated-time"
                type="number"
                value={newRequest.estimatedTime}
                onChange={(e) => setNewRequest({...newRequest, estimatedTime: parseInt(e.target.value) || 45})}
                placeholder="45"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                placeholder="Describe los detalles de la solicitud..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateRequest}>
                Crear Solicitud
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const RequestIcon = getRequestTypeIcon(request.requestType);
          return (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <RequestIcon className="h-5 w-5 text-blue-500" />
                      <span>Habitación {request.roomNumber}</span>
                      {request.guestName && (
                        <span className="text-muted-foreground">- {request.guestName}</span>
                      )}
                    </CardTitle>
                    <CardDescription>{getRequestTypeLabel(request.requestType)}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityBadge(request.priority)}>
                      {request.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusBadge(request.status)}>
                      {request.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{request.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Solicitado: {request.requestedAt}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Por: {request.requestedBy}
                  </div>
                  <div>
                    Tiempo estimado: {request.estimatedTime} min
                  </div>
                </div>

                {(request.checkOutTime || request.checkInTime) && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {request.checkOutTime && (
                        <div>
                          <strong>Check-out:</strong> {request.checkOutTime}
                        </div>
                      )}
                      {request.checkInTime && (
                        <div>
                          <strong>Check-in programado:</strong> {request.checkInTime}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {request.assignedTo && (
                  <div className="text-sm text-muted-foreground mb-4">
                    <strong>Asignado a:</strong> {request.assignedTo}
                  </div>
                )}

                {request.completedAt && (
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="text-sm text-green-700">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Completado el {request.completedAt}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {request.status === 'pendiente' && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const assignedTo = prompt('¿A quién asignar esta tarea?');
                        if (assignedTo) {
                          updateRequestStatus(request.id, 'asignada', assignedTo);
                        }
                      }}
                    >
                      Asignar
                    </Button>
                  )}
                  {request.status === 'asignada' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateRequestStatus(request.id, 'en-proceso')}
                    >
                      Iniciar
                    </Button>
                  )}
                  {request.status === 'en-proceso' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => updateRequestStatus(request.id, 'inspeccion')}
                      >
                        Enviar a Inspección
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => updateRequestStatus(request.id, 'completada')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completar
                      </Button>
                    </>
                  )}
                  {request.status === 'inspeccion' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateRequestStatus(request.id, 'completada')}
                    >
                      Aprobar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay solicitudes pendientes</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron solicitudes con los filtros aplicados'
                : 'Todas las habitaciones están al día'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default HousekeepingCoordination;