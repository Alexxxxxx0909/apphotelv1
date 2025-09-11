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
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  MessageCircle,
  Search,
  Filter,
  Calendar,
  User
} from 'lucide-react';

interface Complaint {
  id: string;
  guestName: string;
  roomNumber: string;
  category: string;
  subject: string;
  description: string;
  severity: 'critica' | 'alta' | 'media' | 'baja';
  status: 'abierta' | 'en-proceso' | 'resuelta' | 'escalada';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  solution?: string;
  compensation?: string;
}

const mockComplaints: Complaint[] = [
  {
    id: '1',
    guestName: 'Roberto Fernández',
    roomNumber: '402',
    category: 'Limpieza',
    subject: 'Habitación no limpia al check-in',
    description: 'La habitación tenía toallas sucias y el baño no estaba limpio cuando llegamos',
    severity: 'alta',
    status: 'resuelta',
    createdAt: '2024-01-14 16:30',
    resolvedAt: '2024-01-14 18:45',
    assignedTo: 'Ana García',
    solution: 'Se limpió inmediatamente la habitación y se cambiaron todas las amenities',
    compensation: 'Descuento del 15% en la factura'
  },
  {
    id: '2',
    guestName: 'Elena Morales',
    roomNumber: '208',
    category: 'Ruido',
    subject: 'Ruido excesivo de obras en construcción',
    description: 'Desde las 7 AM hay ruido de construcción que impide descansar',
    severity: 'media',
    status: 'en-proceso',
    createdAt: '2024-01-15 08:15',
    assignedTo: 'Carlos Ruiz'
  },
  {
    id: '3',
    guestName: 'José Martínez',
    roomNumber: '315',
    category: 'Servicio',
    subject: 'Demora excesiva en room service',
    description: 'Pedido de desayuno hace 2 horas y aún no llega',
    severity: 'media',
    status: 'abierta',
    createdAt: '2024-01-15 10:30'
  }
];

const ComplaintsManagement: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newComplaint, setNewComplaint] = useState({
    guestName: '',
    roomNumber: '',
    category: '',
    subject: '',
    description: '',
    severity: 'media' as const
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.roomNumber.includes(searchTerm) ||
                         complaint.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateComplaint = () => {
    const complaint: Complaint = {
      id: Date.now().toString(),
      ...newComplaint,
      status: 'abierta',
      createdAt: new Date().toLocaleString('es-ES')
    };
    
    setComplaints([complaint, ...complaints]);
    setNewComplaint({
      guestName: '',
      roomNumber: '',
      category: '',
      subject: '',
      description: '',
      severity: 'media'
    });
    setShowForm(false);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], solution?: string, compensation?: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { 
        ...complaint, 
        status,
        resolvedAt: status === 'resuelta' ? new Date().toLocaleString('es-ES') : complaint.resolvedAt,
        solution: solution || complaint.solution,
        compensation: compensation || complaint.compensation
      } : complaint
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'abierta': 'bg-red-100 text-red-800',
      'en-proceso': 'bg-blue-100 text-blue-800',
      'resuelta': 'bg-green-100 text-green-800',
      'escalada': 'bg-purple-100 text-purple-800'
    };
    return variants[status as keyof typeof variants] || variants.abierta;
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      'critica': 'bg-red-100 text-red-800',
      'alta': 'bg-orange-100 text-orange-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baja': 'bg-green-100 text-green-800'
    };
    return variants[severity as keyof typeof variants] || variants.media;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Quejas y Reclamos</h2>
          <p className="text-muted-foreground">Gestiona las quejas y encuentra soluciones efectivas</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Queja
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
                  placeholder="Buscar por huésped, habitación o asunto..."
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
                  <SelectItem value="abierta">Abierta</SelectItem>
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="resuelta">Resuelta</SelectItem>
                  <SelectItem value="escalada">Escalada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario nueva queja */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nueva Queja</CardTitle>
            <CardDescription>Registra una queja o reclamo del huésped</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guest-name">Nombre del Huésped</Label>
                <Input
                  id="guest-name"
                  value={newComplaint.guestName}
                  onChange={(e) => setNewComplaint({...newComplaint, guestName: e.target.value})}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="room-number">Habitación</Label>
                <Input
                  id="room-number"
                  value={newComplaint.roomNumber}
                  onChange={(e) => setNewComplaint({...newComplaint, roomNumber: e.target.value})}
                  placeholder="Número de habitación"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint({...newComplaint, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="servicio">Servicio</SelectItem>
                    <SelectItem value="ruido">Ruido</SelectItem>
                    <SelectItem value="instalaciones">Instalaciones</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="severity">Severidad</Label>
                <Select value={newComplaint.severity} onValueChange={(value: any) => setNewComplaint({...newComplaint, severity: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critica">Crítica</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                value={newComplaint.subject}
                onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
                placeholder="Breve descripción del problema"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción Detallada</Label>
              <Textarea
                id="description"
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                placeholder="Describe detalladamente la queja o reclamo..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateComplaint}>
                Registrar Queja
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de quejas */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>{complaint.guestName} - Habitación {complaint.roomNumber}</span>
                  </CardTitle>
                  <CardDescription>{complaint.category}: {complaint.subject}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getSeverityBadge(complaint.severity)}>
                    {complaint.severity.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusBadge(complaint.status)}>
                    {complaint.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{complaint.description}</p>
              
              {complaint.solution && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">Solución aplicada:</h4>
                  <p className="text-green-700">{complaint.solution}</p>
                  {complaint.compensation && (
                    <p className="text-green-700 mt-2"><strong>Compensación:</strong> {complaint.compensation}</p>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Registrada: {complaint.createdAt}
                  </span>
                  {complaint.resolvedAt && (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resuelta: {complaint.resolvedAt}
                    </span>
                  )}
                </div>
                {complaint.assignedTo && (
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {complaint.assignedTo}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                {complaint.status === 'abierta' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateComplaintStatus(complaint.id, 'en-proceso')}
                  >
                    Tomar Caso
                  </Button>
                )}
                {complaint.status === 'en-proceso' && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const solution = prompt('Describe la solución aplicada:');
                        const compensation = prompt('Compensación ofrecida (opcional):');
                        if (solution) {
                          updateComplaintStatus(complaint.id, 'resuelta', solution, compensation || undefined);
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateComplaintStatus(complaint.id, 'escalada')}
                    >
                      Escalar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay quejas registradas</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron quejas con los filtros aplicados'
                : 'Excelente! No hay quejas pendientes'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ComplaintsManagement;