import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Save, Plus, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ReservationData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  roomType: string;
  roomNumber: string;
  adults: number;
  children: number;
  plan: string;
  pricePerNight: number;
  paymentMethod: string;
  status: string;
  specialRequests: string;
}

const RegisterReservation: React.FC = () => {
  const { toast } = useToast();
  const [reservationData, setReservationData] = useState<ReservationData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: undefined,
    checkOut: undefined,
    roomType: '',
    roomNumber: '',
    adults: 1,
    children: 0,
    plan: '',
    pricePerNight: 0,
    paymentMethod: '',
    status: 'pendiente',
    specialRequests: ''
  });

  const [reservationNumber] = useState(() => 
    `RES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
  );

  const roomTypes = [
    { value: 'individual', label: 'Individual', price: 80 },
    { value: 'doble', label: 'Doble', price: 120 },
    { value: 'suite', label: 'Suite', price: 200 },
    { value: 'deluxe', label: 'Deluxe', price: 150 },
    { value: 'familiar', label: 'Familiar', price: 180 }
  ];

  const plans = [
    { value: 'solo-alojamiento', label: 'Solo Alojamiento' },
    { value: 'desayuno', label: 'Alojamiento + Desayuno' },
    { value: 'media-pension', label: 'Media Pensión' },
    { value: 'pension-completa', label: 'Pensión Completa' },
    { value: 'all-inclusive', label: 'All Inclusive' }
  ];

  const paymentMethods = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
    { value: 'transferencia', label: 'Transferencia Bancaria' },
    { value: 'cheque', label: 'Cheque' }
  ];

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente', color: 'text-yellow-600' },
    { value: 'confirmada', label: 'Confirmada', color: 'text-green-600' },
    { value: 'cancelada', label: 'Cancelada', color: 'text-red-600' }
  ];

  const handleRoomTypeChange = (value: string) => {
    const selectedRoom = roomTypes.find(room => room.value === value);
    setReservationData(prev => ({
      ...prev,
      roomType: value,
      pricePerNight: selectedRoom?.price || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationData.guestName || !reservationData.checkIn || !reservationData.checkOut) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reserva Registrada",
      description: `Reserva ${reservationNumber} creada exitosamente`,
    });

    console.log('Reserva creada:', { ...reservationData, reservationNumber });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Nueva Reserva</span>
          </CardTitle>
          <CardDescription>
            Número de Reserva: <span className="font-mono font-semibold">{reservationNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del Huésped */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Datos del Huésped</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="guestName">Nombre Completo *</Label>
                    <Input
                      id="guestName"
                      value={reservationData.guestName}
                      onChange={(e) => setReservationData(prev => ({ ...prev, guestName: e.target.value }))}
                      placeholder="Nombre del huésped"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={reservationData.guestEmail}
                      onChange={(e) => setReservationData(prev => ({ ...prev, guestEmail: e.target.value }))}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestPhone">Teléfono</Label>
                    <Input
                      id="guestPhone"
                      value={reservationData.guestPhone}
                      onChange={(e) => setReservationData(prev => ({ ...prev, guestPhone: e.target.value }))}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Detalles de la Reserva */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Detalles de Estancia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reservationData.checkIn && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reservationData.checkIn ? (
                              format(reservationData.checkIn, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reservationData.checkIn}
                            onSelect={(date) => setReservationData(prev => ({ ...prev, checkIn: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Check-out *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reservationData.checkOut && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reservationData.checkOut ? (
                              format(reservationData.checkOut, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reservationData.checkOut}
                            onSelect={(date) => setReservationData(prev => ({ ...prev, checkOut: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adults">Adultos</Label>
                      <Input
                        id="adults"
                        type="number"
                        min="1"
                        value={reservationData.adults}
                        onChange={(e) => setReservationData(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="children">Niños</Label>
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        value={reservationData.children}
                        onChange={(e) => setReservationData(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Habitación y Tarifas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Habitación y Tarifas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tipo de Habitación</Label>
                    <Select value={reservationData.roomType} onValueChange={handleRoomTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((room) => (
                          <SelectItem key={room.value} value={room.value}>
                            {room.label} - ${room.price}/noche
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roomNumber">Número de Habitación</Label>
                    <Input
                      id="roomNumber"
                      value={reservationData.roomNumber}
                      onChange={(e) => setReservationData(prev => ({ ...prev, roomNumber: e.target.value }))}
                      placeholder="Ej: 101, 205"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerNight">Precio por Noche ($)</Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      value={reservationData.pricePerNight}
                      onChange={(e) => setReservationData(prev => ({ ...prev, pricePerNight: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Plan Contratado</Label>
                    <Select value={reservationData.plan} onValueChange={(value) => setReservationData(prev => ({ ...prev, plan: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Forma de Pago</Label>
                    <Select value={reservationData.paymentMethod} onValueChange={(value) => setReservationData(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estado de la Reserva</Label>
                    <Select value={reservationData.status} onValueChange={(value) => setReservationData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <span className={status.color}>{status.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Guardar Reserva</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterReservation;