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
  Plus, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

interface SpecialRequest {
  id: string;
  guestName: string;
  roomNumber: string;
  requestType: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'en-proceso' | 'completada' | 'cancelada';
  createdAt: string;
  dueDate: string;
  assignedTo?: string;
}

const mockRequests: SpecialRequest[] = [
  {
    id: '1',
    guestName: 'María González',
    roomNumber: '205',
    requestType: 'Decoración especial',
    description: 'Decoración romántica para aniversario - pétalos de rosa y champagne',
    priority: 'alta',
    status: 'en-proceso',
    createdAt: '2024-01-15 14:30',
    dueDate: '2024-01-15 18:00',
    assignedTo: 'Ana Martínez'
  },
  {
    id: '2',
    guestName: 'Carlos Ruiz',
    roomNumber: '312',
    requestType: 'Alimentos especiales',
    description: 'Menú vegano para cena en habitación',
    priority: 'media',
    status: 'pendiente',
    createdAt: '2024-01-15 16:15',
    dueDate: '2024-01-15 20:00'
  },
  {
    id: '3',
    guestName: 'Laura Jiménez',
    roomNumber: '108',
    requestType: 'Almohadas adicionales',
    description: 'Solicita almohadas hipoalergénicas adicionales',
    priority: 'baja',
    status: 'completada',
    createdAt: '2024-01-15 10:20',
    dueDate: '2024-01-15 15:00',
    assignedTo: 'Housekeeping'
  }
];

const SpecialRequestsManagement: React.FC = () => {
  const [requests, setRequests] = useState<SpecialRequest[]>(mockRequests);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newRequest, setNewRequest] = useState({
    guestName: '',
    roomNumber: '',
    requestType: '',
    description: '',
    priority: 'media' as const,
    dueDate: ''
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.roomNumber.includes(searchTerm) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateRequest = () => {
    const request: SpecialRequest = {
      id: Date.now().toString(),
      ...newRequest,
      status: 'pendiente',
      createdAt: new Date().toLocaleString('es-ES')
    };
    
    setRequests([request, ...requests]);
    setNewRequest({
      guestName: '',
      roomNumber: '',
      requestType: '',
      description: '',
      priority: 'media',
      dueDate: ''
    });
    setShowForm(false);
  };

  const updateRequestStatus = (id: string, status: SpecialRequest['status']) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'en-proceso': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pendiente;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-orange-100 text-orange-800',
      'baja': 'bg-green-100 text-green-800'
    };
    return variants[priority as keyof typeof variants] || variants.media;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header y controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Solicitudes Especiales</h2>
          <p className="text-muted-foreground">Gestiona las peticiones especiales de los huéspedes</p>
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
                  placeholder="Buscar por huésped, habitación o descripción..."
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
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de nueva solicitud */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Solicitud Especial</CardTitle>
            <CardDescription>Registra una nueva petición especial del huésped</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guest-name">Nombre del Huésped</Label>
                <Input
                  id="guest-name"
                  value={newRequest.guestName}
                  onChange={(e) => setNewRequest({...newRequest, guestName: e.target.value})}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="room-number">Habitación</Label>
                <Input
                  id="room-number"
                  value={newRequest.roomNumber}
                  onChange={(e) => setNewRequest({...newRequest, roomNumber: e.target.value})}
                  placeholder="Número de habitación"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="request-type">Tipo de Solicitud</Label>
                <Select value={newRequest.requestType} onValueChange={(value) => setNewRequest({...newRequest, requestType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decoracion">Decoración especial</SelectItem>
                    <SelectItem value="alimentos">Alimentos especiales</SelectItem>
                    <SelectItem value="amenities">Amenities adicionales</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
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
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                placeholder="Describe detalladamente la solicitud..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="due-date">Fecha y Hora Límite</Label>
              <Input
                id="due-date"
                type="datetime-local"
                value={newRequest.dueDate}
                onChange={(e) => setNewRequest({...newRequest, dueDate: e.target.value})}
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
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>{request.guestName} - Habitación {request.roomNumber}</span>
                  </CardTitle>
                  <CardDescription>{request.requestType}</CardDescription>
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
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Creado: {request.createdAt}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Vence: {request.dueDate}
                  </span>
                </div>
                {request.assignedTo && (
                  <span>Asignado a: {request.assignedTo}</span>
                )}
              </div>

              <div className="flex space-x-2">
                {request.status === 'pendiente' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateRequestStatus(request.id, 'en-proceso')}
                  >
                    Iniciar Proceso
                  </Button>
                )}
                {request.status === 'en-proceso' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateRequestStatus(request.id, 'completada')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateRequestStatus(request.id, 'cancelada')}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay solicitudes especiales</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron solicitudes con los filtros aplicados'
                : 'Aún no hay solicitudes especiales registradas'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SpecialRequestsManagement;