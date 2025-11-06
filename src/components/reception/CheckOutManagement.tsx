import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign,
  Receipt,
  Coffee,
  Wifi,
  Car,
  Phone,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useReservations } from '@/hooks/useReservations';
import { useRooms } from '@/hooks/useRooms';
import { useConsumptions } from '@/hooks/useConsumptions';
import { toast } from 'sonner';

const categoryIcons = {
  restaurant: Coffee,
  minibar: Coffee,
  spa: User,
  laundry: User,
  parking: Car,
  phone: Phone,
  other: Receipt
};

const CheckOutManagement: React.FC = () => {
  const { user } = useAuth();
  const hotelId = user?.hotel;
  const { reservations, updateReservation } = useReservations(hotelId);
  const { rooms, updateRoom } = useRooms(hotelId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [selectedConsumptions, setSelectedConsumptions] = useState<any[]>([]);
  const { consumptions } = useConsumptions(selectedReservation?.id);
  const [checkOutForm, setCheckOutForm] = useState({
    actualCheckOutTime: '',
    roomCondition: '',
    finalNotes: '',
    paymentMethod: 'cash'
  });

  // Filtrar reservas completadas (en curso) con check-out para hoy
  const activeGuests = useMemo(() => {
    return reservations.filter(reservation => 
      reservation.status === 'completada' && 
      isToday(reservation.checkOut)
    );
  }, [reservations]);

  // Actualizar consumos cuando cambia la reserva seleccionada
  React.useEffect(() => {
    if (selectedReservation) {
      setSelectedConsumptions(consumptions);
    }
  }, [selectedReservation, consumptions]);

  const filteredGuests = activeGuests.filter(reservation =>
    reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.roomNumber.includes(searchTerm)
  );

  const calculateTotalConsumptions = (consumptions: any[]) => {
    return consumptions.reduce((total, consumption) => total + consumption.total, 0);
  };

  const calculateFinalTotal = (reservation: any, consumptions: any[]) => {
    return reservation.totalPrice + calculateTotalConsumptions(consumptions);
  };

  const handleCheckOut = async (reservationId: string) => {
    try {
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) return;

      // Actualizar estado de reserva a 'cancelada' (reutilizando estado)
      await updateReservation(reservationId, {
        status: 'cancelada',
        ...checkOutForm
      });

      // Actualizar estado de habitación a 'limpieza'
      const room = rooms.find(r => r.id === reservation.roomId);
      if (room) {
        await updateRoom(room.id, {
          estado: 'limpieza'
        });
      }

      setSelectedReservation(null);
      setCheckOutForm({
        actualCheckOutTime: '',
        roomCondition: '',
        finalNotes: '',
        paymentMethod: 'cash'
      });
      
      toast.success('Check-out completado', {
        description: `${reservation.guestName} ha completado su estancia. Factura generada.`
      });
    } catch (error) {
      console.error('Error en check-out:', error);
      toast.error('Error al completar check-out');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Check-out de Huéspedes</CardTitle>
          <CardDescription>
            Gestiona las salidas programadas y procesa facturas consolidadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, número de reserva o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de huéspedes activos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Huéspedes Activos ({filteredGuests.length})</h3>
          {filteredGuests.map((reservation) => {
            const totalConsumptions = 0; // Se calculará cuando se seleccione
            const finalTotal = reservation.totalPrice + totalConsumptions;
            
            return (
              <motion.div
                key={reservation.id}
                whileHover={{ scale: 1.02 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedReservation?.id === reservation.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{reservation.guestName}</h4>
                        <p className="text-sm text-muted-foreground">{reservation.reservationNumber}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="default">
                          <Calendar className="h-3 w-3 mr-1" />
                          Salida Hoy
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.roomType} - {reservation.roomNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(reservation.checkOut, "dd/MM/yyyy")}</span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Alojamiento:</span>
                        <span>${reservation.totalPrice}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total final:</span>
                        <span>${finalTotal}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Detalle y check-out */}
        <div>
          {selectedReservation ? (
            <Card>
              <CardHeader>
                <CardTitle>Procesar Check-out</CardTitle>
                <CardDescription>
                  {selectedReservation.guestName} - Habitación {selectedReservation.roomNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Desglose de consumos */}
                <div>
                  <h4 className="font-medium mb-3">Desglose de Consumos</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Alojamiento ({selectedReservation.plan})</span>
                      <span>${selectedReservation.totalPrice}</span>
                    </div>
                    
                    {selectedConsumptions.map((consumption) => {
                      const CategoryIcon = categoryIcons[consumption.category];
                      return (
                        <div key={consumption.id} className="flex justify-between items-center p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{consumption.service}</div>
                              <div className="text-sm text-muted-foreground">
                                {consumption.description} - {format(consumption.date, "dd/MM")}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${consumption.total}</div>
                            <div className="text-sm text-muted-foreground">
                              {consumption.quantity} x ${consumption.unitPrice}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Final:</span>
                    <span>${calculateFinalTotal(selectedReservation, selectedConsumptions)}</span>
                  </div>
                </div>

                {/* Formulario de check-out */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkout-time">Hora de salida</Label>
                      <Input
                        id="checkout-time"
                        type="time"
                        value={checkOutForm.actualCheckOutTime}
                        onChange={(e) => setCheckOutForm(prev => ({
                          ...prev,
                          actualCheckOutTime: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-method">Método de pago</Label>
                      <Select 
                        value={checkOutForm.paymentMethod}
                        onValueChange={(value) => setCheckOutForm(prev => ({
                          ...prev,
                          paymentMethod: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Efectivo</SelectItem>
                          <SelectItem value="card">Tarjeta</SelectItem>
                          <SelectItem value="transfer">Transferencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="room-condition">Estado de habitación</Label>
                    <Select 
                      value={checkOutForm.roomCondition}
                      onValueChange={(value) => setCheckOutForm(prev => ({
                        ...prev,
                        roomCondition: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Buen estado</SelectItem>
                        <SelectItem value="cleaning">Requiere limpieza</SelectItem>
                        <SelectItem value="maintenance">Requiere mantenimiento</SelectItem>
                        <SelectItem value="damage">Daños reportados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="final-notes">Notas finales</Label>
                    <Textarea
                      id="final-notes"
                      placeholder="Observaciones del check-out..."
                      value={checkOutForm.finalNotes}
                      onChange={(e) => setCheckOutForm(prev => ({
                        ...prev,
                        finalNotes: e.target.value
                      }))}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleCheckOut(selectedReservation.id)}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Completar Check-out
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedReservation(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona un huésped</h3>
                <p className="text-muted-foreground">
                  Elige un huésped de la lista para procesar su check-out.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CheckOutManagement;