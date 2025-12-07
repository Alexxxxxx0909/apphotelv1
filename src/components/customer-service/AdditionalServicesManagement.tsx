import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAdditionalServices, NewAdditionalService } from '@/hooks/useAdditionalServices';
import { 
  Plus, 
  Car, 
  MapPin, 
  Sparkles, 
  Coffee,
  Clock, 
  CheckCircle, 
  Search,
  DollarSign,
  Calendar,
  Trash2,
  Loader2
} from 'lucide-react';

const serviceTypes = [
  { value: 'transporte', label: 'Transporte', icon: Car },
  { value: 'tours', label: 'Tours', icon: MapPin },
  { value: 'spa', label: 'Spa & Wellness', icon: Sparkles },
  { value: 'restaurante', label: 'Restaurante', icon: Coffee }
];

const AdditionalServicesManagement: React.FC = () => {
  const { services, loading, addService, updateServiceStatus, deleteService } = useAdditionalServices();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState<NewAdditionalService>({
    guestName: '',
    roomNumber: '',
    serviceType: '',
    serviceName: '',
    description: '',
    price: 0,
    serviceDate: '',
    notes: ''
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.roomNumber.includes(searchTerm) ||
                         service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateService = async () => {
    if (!newService.guestName || !newService.roomNumber || !newService.serviceType || !newService.serviceName) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const success = await addService(newService);
    setIsSubmitting(false);

    if (success) {
      toast({
        title: "Servicio registrado",
        description: "El servicio adicional ha sido registrado correctamente"
      });
      setNewService({
        guestName: '',
        roomNumber: '',
        serviceType: '',
        serviceName: '',
        description: '',
        price: 0,
        serviceDate: '',
        notes: ''
      });
      setShowForm(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo registrar el servicio",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: 'solicitado' | 'confirmado' | 'en-proceso' | 'completado' | 'cancelado') => {
    const success = await updateServiceStatus(id, status);
    if (success) {
      toast({
        title: "Estado actualizado",
        description: `El servicio ha sido marcado como ${status.replace('-', ' ')}`
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    const success = await deleteService(id);
    if (success) {
      toast({
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado correctamente"
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el servicio",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'solicitado': 'bg-yellow-100 text-yellow-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'en-proceso': 'bg-purple-100 text-purple-800',
      'completado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.solicitado;
  };

  const getServiceIcon = (serviceType: string) => {
    const type = serviceTypes.find(t => t.value === serviceType);
    return type ? type.icon : Car;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('es-ES');
    }
    return timestamp;
  };

  const totalRevenue = services
    .filter(s => s.status === 'completado')
    .reduce((sum, service) => sum + (service.price || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando servicios...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header y estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{services.filter(s => s.status === 'solicitado').length}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{services.filter(s => s.status === 'en-proceso').length}</p>
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
                <p className="text-2xl font-bold">{services.filter(s => s.status === 'completado').length}</p>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Ingresos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header y controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Servicios Adicionales</h2>
          <p className="text-muted-foreground">Gestiona solicitudes de transporte, tours, spa y otros servicios</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
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
                  placeholder="Buscar por huésped, habitación o servicio..."
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
                  <SelectItem value="solicitado">Solicitado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario nuevo servicio */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Servicio Adicional</CardTitle>
            <CardDescription>Registra una solicitud de servicio adicional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guest-name">Nombre del Huésped *</Label>
                <Input
                  id="guest-name"
                  value={newService.guestName}
                  onChange={(e) => setNewService({...newService, guestName: e.target.value})}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="room-number">Habitación *</Label>
                <Input
                  id="room-number"
                  value={newService.roomNumber}
                  onChange={(e) => setNewService({...newService, roomNumber: e.target.value})}
                  placeholder="Número de habitación"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service-type">Tipo de Servicio *</Label>
                <Select value={newService.serviceType} onValueChange={(value) => setNewService({...newService, serviceType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="service-name">Nombre del Servicio *</Label>
              <Input
                id="service-name"
                value={newService.serviceName}
                onChange={(e) => setNewService({...newService, serviceName: e.target.value})}
                placeholder="Ej: Traslado al aeropuerto, Tour ciudad, Masaje relajante"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                placeholder="Detalles del servicio solicitado..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="service-date">Fecha y Hora del Servicio</Label>
              <Input
                id="service-date"
                type="datetime-local"
                value={newService.serviceDate}
                onChange={(e) => setNewService({...newService, serviceDate: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={newService.notes}
                onChange={(e) => setNewService({...newService, notes: e.target.value})}
                placeholder="Notas especiales o instrucciones..."
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateService} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Crear Servicio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de servicios */}
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const ServiceIcon = getServiceIcon(service.serviceType);
          return (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <ServiceIcon className="h-5 w-5 text-blue-500" />
                      <span>{service.guestName} - Habitación {service.roomNumber}</span>
                    </CardTitle>
                    <CardDescription>{service.serviceName}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      ${(service.price || 0).toFixed(2)}
                    </Badge>
                    <Badge className={getStatusBadge(service.status)}>
                      {service.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{service.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Solicitado: {formatDate(service.requestedDate)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Programado: {service.serviceDate || 'No definido'}
                  </div>
                  {service.provider && (
                    <div>
                      Proveedor: {service.provider}
                    </div>
                  )}
                </div>

                {service.notes && (
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="text-sm"><strong>Notas:</strong> {service.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {service.status === 'solicitado' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStatus(service.id, 'confirmado')}
                      >
                        Confirmar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleUpdateStatus(service.id, 'cancelado')}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  {service.status === 'confirmado' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(service.id, 'en-proceso')}
                    >
                      Iniciar Servicio
                    </Button>
                  )}
                  {service.status === 'en-proceso' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(service.id, 'completado')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completar
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay servicios registrados</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron servicios con los filtros aplicados'
                : 'Aún no hay servicios adicionales solicitados'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AdditionalServicesManagement;
