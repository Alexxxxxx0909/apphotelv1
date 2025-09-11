import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
  id: string;
  reservationNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  roomType: string;
  roomNumber: string;
  adults: number;
  children: number;
  plan: string;
  pricePerNight: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'no-show' | 'en-curso' | 'finalizada';
  createdAt: Date;
  notes?: string;
}

const mockReservations: Reservation[] = [
  {
    id: '1',
    reservationNumber: 'RES-2024-0001',
    guestName: 'Juan Pérez García',
    guestEmail: 'juan.perez@email.com',
    guestPhone: '+34 666 123 456',
    checkIn: new Date('2024-01-20'),
    checkOut: new Date('2024-01-23'),
    roomType: 'Doble',
    roomNumber: '205',
    adults: 2,
    children: 0,
    plan: 'Alojamiento + Desayuno',
    pricePerNight: 120,
    totalAmount: 360,
    paymentMethod: 'Tarjeta de Crédito',
    status: 'confirmada',
    createdAt: new Date('2024-01-10'),
    notes: 'Cliente VIP - Habitación con vista al mar'
  },
  {
    id: '2',
    reservationNumber: 'RES-2024-0002',
    guestName: 'María González López',
    guestEmail: 'maria.gonzalez@email.com',
    guestPhone: '+34 677 987 654',
    checkIn: new Date('2024-01-25'),
    checkOut: new Date('2024-01-28'),
    roomType: 'Suite',
    roomNumber: '301',
    adults: 2,
    children: 1,
    plan: 'All Inclusive',
    pricePerNight: 250,
    totalAmount: 750,
    paymentMethod: 'Transferencia',
    status: 'pendiente',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    reservationNumber: 'RES-2024-0003',
    guestName: 'Carlos Rodríguez Martín',
    guestEmail: 'carlos.rodriguez@email.com',
    guestPhone: '+34 688 555 123',
    checkIn: new Date('2024-01-18'),
    checkOut: new Date('2024-01-20'),
    roomType: 'Individual',
    roomNumber: '102',
    adults: 1,
    children: 0,
    plan: 'Solo Alojamiento',
    pricePerNight: 80,
    totalAmount: 160,
    paymentMethod: 'Efectivo',
    status: 'en-curso',
    createdAt: new Date('2024-01-12'),
  }
];

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmada: { label: 'Confirmada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle },
  'no-show': { label: 'No Show', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  'en-curso': { label: 'En Curso', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  finalizada: { label: 'Finalizada', color: 'bg-purple-100 text-purple-800', icon: CheckCircle }
};

const ReservationManagement: React.FC = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (reservationId: string, newStatus: string) => {
    setReservations(prev => prev.map(res => 
      res.id === reservationId ? { ...res, status: newStatus as any } : res
    ));
    
    toast({
      title: "Estado Actualizado",
      description: "El estado de la reserva ha sido actualizado",
    });
  };

  const handleCancelReservation = (reservationId: string) => {
    handleStatusChange(reservationId, 'cancelada');
  };

  const handleDeleteReservation = (reservationId: string) => {
    setReservations(prev => prev.filter(res => res.id !== reservationId));
    toast({
      title: "Reserva Eliminada",
      description: "La reserva ha sido eliminada del sistema",
    });
  };

  const getStatusStats = () => {
    return {
      total: reservations.length,
      pendiente: reservations.filter(r => r.status === 'pendiente').length,
      confirmada: reservations.filter(r => r.status === 'confirmada').length,
      cancelada: reservations.filter(r => r.status === 'cancelada').length,
      'en-curso': reservations.filter(r => r.status === 'en-curso').length,
      finalizada: reservations.filter(r => r.status === 'finalizada').length
    };
  };

  const stats = getStatusStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendiente}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.confirmada}</div>
            <div className="text-sm text-muted-foreground">Confirmadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats['en-curso']}</div>
            <div className="text-sm text-muted-foreground">En Curso</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelada}</div>
            <div className="text-sm text-muted-foreground">Canceladas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.finalizada}</div>
            <div className="text-sm text-muted-foreground">Finalizadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Reservas</CardTitle>
          <CardDescription>
            Busca, modifica y cancela reservas existentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, número de reserva o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="en-curso">En Curso</SelectItem>
                  <SelectItem value="finalizada">Finalizadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => {
          const statusInfo = statusConfig[reservation.status];
          const StatusIcon = statusInfo.icon;
          const nights = Math.ceil((reservation.checkOut.getTime() - reservation.checkIn.getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <motion.div
              key={reservation.id}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-lg">{reservation.reservationNumber}</h4>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{reservation.guestName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.guestEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.guestPhone}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(reservation.checkIn, "dd/MM/yyyy")} - {format(reservation.checkOut, "dd/MM/yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.roomType} - Hab. {reservation.roomNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.adults} adultos{reservation.children > 0 && `, ${reservation.children} niños`}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="font-medium">Plan:</span> {reservation.plan}
                          </div>
                          <div>
                            <span className="font-medium">Total:</span> ${reservation.totalAmount} ({nights} noches)
                          </div>
                        </div>
                      </div>
                      
                      {reservation.notes && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <div className="text-sm">
                            <strong>Notas:</strong> {reservation.notes}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Implementar edición */}}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      
                      {reservation.status !== 'cancelada' && reservation.status !== 'finalizada' && (
                        <div className="space-y-1">
                          <Select
                            value={reservation.status}
                            onValueChange={(value) => handleStatusChange(reservation.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendiente">Pendiente</SelectItem>
                              <SelectItem value="confirmada">Confirmada</SelectItem>
                              <SelectItem value="en-curso">En Curso</SelectItem>
                              <SelectItem value="finalizada">Finalizada</SelectItem>
                              <SelectItem value="cancelada">Cancelada</SelectItem>
                              <SelectItem value="no-show">No Show</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReservation(reservation.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredReservations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron reservas</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay reservas registradas en el sistema'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ReservationManagement;