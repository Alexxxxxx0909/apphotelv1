import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Clock,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useReservations } from '@/hooks/useReservations';
import { useAuth } from '@/contexts/AuthContext';

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-500 text-white', icon: Clock },
  confirmada: { label: 'Confirmada', color: 'bg-green-500 text-white', icon: CheckCircle },
  cancelada: { label: 'Cancelada', color: 'bg-red-500 text-white', icon: XCircle },
  completada: { label: 'Completada', color: 'bg-purple-500 text-white', icon: CheckCircle }
};

const ReservationManagement: React.FC = () => {
  const { user } = useAuth();
  const hotelId = user?.hotel || '';
  const { reservations, loading, updateReservation, deleteReservation } = useReservations(hotelId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reservation.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      await updateReservation(reservationId, { status: newStatus as any });
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reserva?')) return;
    
    try {
      await deleteReservation(reservationId);
      toast.success('Reserva eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la reserva');
    }
  };

  const handleEdit = (reservation: any) => {
    setEditData({
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail || '',
      guestPhone: reservation.guestPhone || '',
      adults: reservation.adults,
      children: reservation.children,
      specialRequests: reservation.specialRequests || '',
      status: reservation.status
    });
    setSelectedReservation(reservation);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedReservation) return;
    
    try {
      await updateReservation(selectedReservation.id, editData);
      toast.success('Reserva actualizada correctamente');
      setIsEditOpen(false);
    } catch (error) {
      toast.error('Error al actualizar la reserva');
    }
  };

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            <div className="text-2xl font-bold text-purple-600">{stats.completada}</div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelada}</div>
            <div className="text-sm text-muted-foreground">Canceladas</div>
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
                  <SelectItem value="completada">Completadas</SelectItem>
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
          const statusInfo = statusConfig[reservation.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo?.icon || Clock;
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
                        <Badge className={statusInfo?.color || 'bg-gray-500 text-white'}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo?.label || reservation.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{reservation.guestName}</span>
                          </div>
                          {reservation.guestEmail && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{reservation.guestEmail}</span>
                            </div>
                          )}
                          {reservation.guestPhone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{reservation.guestPhone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(reservation.checkIn, "dd/MM/yyyy", { locale: es })} - {format(reservation.checkOut, "dd/MM/yyyy", { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.roomType} - Hab. {reservation.roomNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.adults} adultos{reservation.children > 0 && `, ${reservation.children} niños`}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>{reservation.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="font-medium">Plan:</span> {reservation.plan || 'Sin plan'}
                          </div>
                          <div>
                            <span className="font-medium">Total:</span> ${reservation.totalPrice} ({nights} {nights === 1 ? 'noche' : 'noches'})
                          </div>
                        </div>
                      </div>
                      
                      {reservation.specialRequests && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <div className="text-sm">
                            <strong>Notas:</strong> {reservation.specialRequests}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setIsViewOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(reservation)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      
                      {reservation.status !== 'cancelada' && reservation.status !== 'completada' && (
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
                              <SelectItem value="completada">Completada</SelectItem>
                              <SelectItem value="cancelada">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReservation(reservation.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Número:</span>
                  <p className="font-medium">{selectedReservation.reservationNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge className={statusConfig[selectedReservation.status as keyof typeof statusConfig]?.color || 'bg-gray-500 text-white'}>
                    {statusConfig[selectedReservation.status as keyof typeof statusConfig]?.label || selectedReservation.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Huésped:</span>
                  <p className="font-medium">{selectedReservation.guestName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{selectedReservation.guestEmail || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Teléfono:</span>
                  <p className="font-medium">{selectedReservation.guestPhone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Habitación:</span>
                  <p className="font-medium">{selectedReservation.roomType} - {selectedReservation.roomNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Check-in:</span>
                  <p className="font-medium">{format(selectedReservation.checkIn, 'dd/MM/yyyy', { locale: es })}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Check-out:</span>
                  <p className="font-medium">{format(selectedReservation.checkOut, 'dd/MM/yyyy', { locale: es })}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Huéspedes:</span>
                  <p className="font-medium">{selectedReservation.adults} adultos, {selectedReservation.children} niños</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Plan:</span>
                  <p className="font-medium">{selectedReservation.plan || 'Sin plan'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pago:</span>
                  <p className="font-medium">{selectedReservation.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <p className="font-bold text-lg">${selectedReservation.totalPrice}</p>
                </div>
              </div>
              {selectedReservation.specialRequests && (
                <div>
                  <span className="text-muted-foreground">Requerimientos especiales:</span>
                  <p className="mt-1 p-3 bg-muted rounded">{selectedReservation.specialRequests}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del Huésped</Label>
                <Input
                  value={editData.guestName || ''}
                  onChange={(e) => setEditData({ ...editData, guestName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editData.guestEmail || ''}
                  onChange={(e) => setEditData({ ...editData, guestEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  value={editData.guestPhone || ''}
                  onChange={(e) => setEditData({ ...editData, guestPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Adultos</Label>
                <Input
                  type="number"
                  min="1"
                  value={editData.adults || 1}
                  onChange={(e) => setEditData({ ...editData, adults: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Niños</Label>
                <Input
                  type="number"
                  min="0"
                  value={editData.children || 0}
                  onChange={(e) => setEditData({ ...editData, children: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value) => setEditData({ ...editData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="confirmada">Confirmada</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Requerimientos Especiales</Label>
              <Textarea
                value={editData.specialRequests || ''}
                onChange={(e) => setEditData({ ...editData, specialRequests: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ReservationManagement;