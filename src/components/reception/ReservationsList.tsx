import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Users, DollarSign, Phone, Mail, Eye } from 'lucide-react';
import { useReservations } from '@/hooks/useReservations';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-500' },
  confirmada: { label: 'Confirmada', color: 'bg-blue-500' },
  cancelada: { label: 'Cancelada', color: 'bg-red-500' },
  completada: { label: 'Completada', color: 'bg-green-500' }
};

const ReservationsList: React.FC = () => {
  const { user } = useAuth();
  const hotelId = user?.hotel || '';
  const { reservations, loading } = useReservations(hotelId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      total: reservations.length,
      pendiente: reservations.filter(r => r.status === 'pendiente').length,
      confirmada: reservations.filter(r => r.status === 'confirmada').length,
      completada: reservations.filter(r => r.status === 'completada').length,
      cancelada: reservations.filter(r => r.status === 'cancelada').length
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Reservas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendiente}</div>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmada}</div>
            <p className="text-sm text-muted-foreground">Confirmadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completada}</div>
            <p className="text-sm text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelada}</div>
            <p className="text-sm text-muted-foreground">Canceladas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o número de reserva..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No se encontraron reservas</p>
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{reservation.guestName}</h3>
                      <Badge className={`${statusConfig[reservation.status as keyof typeof statusConfig]?.color} text-white`}>
                        {statusConfig[reservation.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{reservation.reservationNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(reservation.checkIn, 'dd/MM/yyyy', { locale: es })}</span>
                        <span>→</span>
                        <span>{format(reservation.checkOut, 'dd/MM/yyyy', { locale: es })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{reservation.adults} adultos, {reservation.children} niños</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">${reservation.totalPrice}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Habitación:</span>{' '}
                      <span className="font-medium">{reservation.roomNumber}</span>
                      {' • '}
                      <span className="text-muted-foreground">Tipo:</span>{' '}
                      <span className="font-medium">{reservation.roomType}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Información General</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número de Reserva:</span>
                    <span className="font-medium">{selectedReservation.reservationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge className={`${statusConfig[selectedReservation.status as keyof typeof statusConfig]?.color} text-white`}>
                      {statusConfig[selectedReservation.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Datos del Huésped</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="font-medium">{selectedReservation.guestName}</span>
                  </div>
                  {selectedReservation.guestEmail && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedReservation.guestEmail}
                      </span>
                    </div>
                  )}
                  {selectedReservation.guestPhone && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Teléfono:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedReservation.guestPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Detalles de Estancia</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span className="font-medium">{format(selectedReservation.checkIn, 'dd/MM/yyyy', { locale: es })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out:</span>
                    <span className="font-medium">{format(selectedReservation.checkOut, 'dd/MM/yyyy', { locale: es })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adultos:</span>
                    <span className="font-medium">{selectedReservation.adults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Niños:</span>
                    <span className="font-medium">{selectedReservation.children}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Habitación y Tarifas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Habitación:</span>
                    <span className="font-medium">{selectedReservation.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número de Habitación:</span>
                    <span className="font-medium">{selectedReservation.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio por Noche:</span>
                    <span className="font-medium">${selectedReservation.pricePerNight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{selectedReservation.plan || 'Sin plan'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Forma de Pago:</span>
                    <span className="font-medium">{selectedReservation.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground font-semibold">Total:</span>
                    <span className="font-bold text-lg">${selectedReservation.totalPrice}</span>
                  </div>
                </div>
              </div>

              {selectedReservation.specialRequests && (
                <div>
                  <h4 className="font-semibold mb-2">Requerimientos Especiales</h4>
                  <p className="text-sm text-muted-foreground">{selectedReservation.specialRequests}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationsList;
