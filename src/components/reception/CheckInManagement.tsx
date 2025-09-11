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
  Search, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface PendingReservation {
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
  totalAmount: number;
  status: 'pendiente' | 'confirmada';
  arrivalTime?: string;
  specialRequests?: string;
}

const mockPendingReservations: PendingReservation[] = [
  {
    id: '1',
    reservationNumber: 'RES-2024-0001',
    guestName: 'Juan Pérez García',
    guestEmail: 'juan.perez@email.com',
    guestPhone: '+34 666 123 456',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    roomType: 'Doble',
    roomNumber: '205',
    adults: 2,
    children: 0,
    plan: 'Alojamiento + Desayuno',
    totalAmount: 360,
    status: 'confirmada',
    arrivalTime: '15:30',
    specialRequests: 'Habitación con vista al mar'
  },
  {
    id: '2',
    reservationNumber: 'RES-2024-0002',
    guestName: 'María González López',
    guestEmail: 'maria.gonzalez@email.com',
    guestPhone: '+34 677 987 654',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    roomType: 'Suite',
    roomNumber: '301',
    adults: 2,
    children: 1,
    plan: 'All Inclusive',
    totalAmount: 1000,
    status: 'confirmada',
    arrivalTime: '16:00'
  }
];

const CheckInManagement: React.FC = () => {
  const { toast } = useToast();
  const [pendingReservations, setPendingReservations] = useState<PendingReservation[]>(mockPendingReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<PendingReservation | null>(null);
  const [checkInForm, setCheckInForm] = useState({
    actualArrivalTime: '',
    guestDocuments: '',
    paymentStatus: '',
    roomCondition: 'ready',
    specialNotes: '',
    additionalGuests: []
  });

  const filteredReservations = pendingReservations.filter(reservation =>
    reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = async (reservationId: string) => {
    const reservation = pendingReservations.find(r => r.id === reservationId);
    if (!reservation) return;

    // Simular proceso de check-in
    setPendingReservations(prev => prev.filter(r => r.id !== reservationId));
    setSelectedReservation(null);
    
    toast({
      title: "Check-in Completado",
      description: `${reservation.guestName} se ha registrado exitosamente en la habitación ${reservation.roomNumber}`,
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isLate = (arrivalTime: string) => {
    if (!arrivalTime) return false;
    const now = new Date();
    const [hours, minutes] = arrivalTime.split(':').map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(hours, minutes, 0, 0);
    return now > arrivalDate;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Búsqueda y filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in de Huéspedes</CardTitle>
          <CardDescription>
            Gestiona las llegadas programadas para hoy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, número de reserva o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de llegadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Llegadas Programadas ({filteredReservations.length})</h3>
          {filteredReservations.map((reservation) => (
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
                      {isToday(reservation.checkIn) && (
                        <Badge variant="default">
                          <Calendar className="h-3 w-3 mr-1" />
                          Hoy
                        </Badge>
                      )}
                      {reservation.arrivalTime && isLate(reservation.arrivalTime) && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Retraso
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.roomType} - {reservation.roomNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.arrivalTime || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.adults} adultos{reservation.children > 0 && `, ${reservation.children} niños`}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>${reservation.totalAmount}</span>
                    </div>
                  </div>
                  
                  {reservation.specialRequests && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm">
                      <strong>Solicitudes:</strong> {reservation.specialRequests}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredReservations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay llegadas programadas</h3>
                <p className="text-muted-foreground">
                  No se encontraron reservas para check-in con los filtros aplicados.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Formulario de check-in */}
        <div>
          {selectedReservation ? (
            <Card>
              <CardHeader>
                <CardTitle>Realizar Check-in</CardTitle>
                <CardDescription>
                  {selectedReservation.guestName} - {selectedReservation.reservationNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrival-time">Hora de llegada real</Label>
                    <Input
                      id="arrival-time"
                      type="time"
                      value={checkInForm.actualArrivalTime}
                      onChange={(e) => setCheckInForm(prev => ({
                        ...prev,
                        actualArrivalTime: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="room-condition">Estado de habitación</Label>
                    <Select 
                      value={checkInForm.roomCondition}
                      onValueChange={(value) => setCheckInForm(prev => ({
                        ...prev,
                        roomCondition: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready">Lista</SelectItem>
                        <SelectItem value="cleaning">En limpieza</SelectItem>
                        <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="documents">Documentos verificados</Label>
                  <Input
                    id="documents"
                    placeholder="DNI, Pasaporte, etc."
                    value={checkInForm.guestDocuments}
                    onChange={(e) => setCheckInForm(prev => ({
                      ...prev,
                      guestDocuments: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="payment-status">Estado de pago</Label>
                  <Select 
                    value={checkInForm.paymentStatus}
                    onValueChange={(value) => setCheckInForm(prev => ({
                      ...prev,
                      paymentStatus: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Pagado completo</SelectItem>
                      <SelectItem value="partial">Pago parcial</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notas especiales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observaciones del check-in..."
                    value={checkInForm.specialNotes}
                    onChange={(e) => setCheckInForm(prev => ({
                      ...prev,
                      specialNotes: e.target.value
                    }))}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleCheckIn(selectedReservation.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar Check-in
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedReservation(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona una reserva</h3>
                <p className="text-muted-foreground">
                  Elige una reserva de la lista para realizar el check-in.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CheckInManagement;